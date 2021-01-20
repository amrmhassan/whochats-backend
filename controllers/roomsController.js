import catchAsync from '../utils/catchAsync.js';
import Room from '../models/rooms.js';
import AppError from '../utils/AppError.js';
import User from '../models/users.js';
import io from '../startup/io.js';
import Block from '../models/blocks.js';

const appError = new AppError();

//? getting my rooms
export const getMyRooms = catchAsync(async (req, res, next) => {
  // 1] get user from req.user
  const user = req.user;

  // 2] get rooms that have this user as creator or as otherUser
  let rooms = await Room.find({
    $or: [{ creator: user._id }, { otherUser: user._id }],
  }).sort('-updatedAt');

  //! populating the other person not (otherPerson) => i will do it manually just for now
  //! the person who didn't make the request

  const arrayOfPromises = rooms.map(async (room) => {
    let roomClone = { ...room }._doc;
    const userIdToShowInRoom =
      String(user._id) === String(room.creator)
        ? String(room.otherUser)
        : String(room.creator);
    const userToShowOnRoom = await User.findById(userIdToShowInRoom).select(
      'firstName  photo email onlineId lastSeenAt'
    );
    const myBlock = await Block.findOne({ room: room._id, creator: user._id });
    const otherUserBlock = await Block.findOne({
      room: room._id,
      otherUser: user._id,
    });
    roomClone.userToShowOnRoom = userToShowOnRoom;
    roomClone.myBlock = myBlock;
    roomClone.otherUserBlock = otherUserBlock;
    return roomClone;
  });

  const roomsToSendBack = await Promise.all(arrayOfPromises);
  //! end of that test => might have errors
  // 3] send it back as res
  res.status(200).json({
    status: 'success',
    results: roomsToSendBack.length,
    data: roomsToSendBack,
  });
});

//? for creating a room
export const createRoom = catchAsync(async (req, res, next) => {
  // 1] get needed data (other user) from req.body
  const { otherUserEmail } = req.body;
  if (!otherUserEmail) {
    return next(appError.addError(`please provide the otherUserEmail`, 404));
  }
  // 2] get the creator user from req.body
  const creator = req.user;
  // 2-a] check if the creator user is the other user
  if (creator.email === otherUserEmail) {
    return next(appError.addError(`you can't create chat with your self`, 400));
  }
  // 3] check if the otherUser exist
  const otherUserFromDB = await User.findOne({ email: otherUserEmail });
  if (!otherUserFromDB) {
    return next(appError.addError(`other user doesn't exist!`, 404));
  }
  // 3-a] check if there is creator user is blocked from the otherUser
  const block = await Block.findOne({
    creator: otherUserFromDB,
    otherUser: creator,
  });

  if (block) {
    return next(
      appError.addError(`you are blocked from ${otherUserEmail}`, 401)
    );
  }

  // 4] check that their is no rooms between the creator user and other user
  const existingRooms = await Room.findOne({
    $or: [
      { $and: [{ creator: creator._id }, { otherUser: otherUserFromDB._id }] },
      { $and: [{ otherUser: creator._id }, { creator: otherUserFromDB._id }] },
    ],
  });
  if (existingRooms) {
    return next(
      appError.addError(
        `You can't create two rooms for the same two persons`,
        400
      )
    );
  }
  // 5] create the room
  const room = await Room.create({
    creator: creator._id,
    otherUser: otherUserFromDB._id,
  });

  const user = await User.findById(String(room.creator));
  const roomToSendToUser = { ...room }._doc;
  roomToSendToUser.userToShowOnRoom = user;

  //! emitting the event of creating new room here
  const otherUserOnlineId = otherUserFromDB.onlineId;
  const roomForOtherUser = roomToSendToUser;
  if (otherUserOnlineId) {
    io.to(otherUserOnlineId).emit(
      'server--user-added-new-room',
      roomForOtherUser
    );
  }

  //! emitting for the creator
  const creatorOnlineId = creator.onlineId;
  let roomForCreator = { ...roomToSendToUser };
  roomForCreator.userToShowOnRoom = otherUserFromDB;
  io.to(creatorOnlineId).emit('server--user-added-new-room', roomForCreator);

  res.status(200).json({
    status: 'success',
    data: roomToSendToUser,
  });
});

//? for accepting a room
export const acceptRoom = catchAsync(async (req, res, next) => {
  // 1] get room id from req.body
  const { room } = req.body;
  if (!room) {
    return next(appError.addError(`please provide the (room) id`, 400));
  }
  // 2] get currently logged in user
  const user = req.user;

  // 3] get room with that id and the otherUser is the currently logged in user
  const updatedRoom = await Room.findOne({
    _id: room,
    otherUser: String(user._id),
  });
  // 3-a] check if the room already accepted
  if (updatedRoom.accepted) {
    return next(appError.addError(`room is already accepted`, 400));
  }
  updatedRoom.accepted = true;
  await updatedRoom.save({ validateBeforeSave: false });

  if (!updatedRoom) {
    return next(appError.addError(`no room or user can't accept it`, 400));
  }
  // 3-b] get creator user cause we will need him down
  const creatorUser = await User.findById(updatedRoom.creator).select(
    'firstName  photo email onlineId lastSeenAt'
  );

  //! adding userToShowOnRoom
  //! emitting for other user
  const otherUserOnlineId = user.onlineId;
  const roomForOtherUser = { ...updatedRoom }._doc;
  roomForOtherUser.userToShowOnRoom = creatorUser;
  io.to(otherUserOnlineId).emit(
    'server--user-accept-new-room',
    roomForOtherUser
  );

  //! emitting  for creator
  const creatorOnlineId = creatorUser.onlineId;
  const roomForCreator = { ...updatedRoom }._doc;
  roomForCreator.userToShowOnRoom = await User.findById(
    updatedRoom.otherUser
  ).select('firstName  photo email onlineId lastSeenAt');
  if (creatorOnlineId) {
    io.to(creatorOnlineId).emit('server--user-accept-new-room', updatedRoom);
  }

  res.status(200).json({
    status: 'success',
    data: updatedRoom,
  });
});

// export const blockRoom = catchAsync(async (req, res, next) => {
//   // 1] get room id from req.body
//   const { room } = req.body;
//   if (!room) {
//     return next(appError.addError(`please provide the (room) id`, 400));
//   }
//   // 2] get currently logged in user
//   const user = req.user;
//   // 3] get room with that id and the otherUser is the currently logged in user
//   const updatedRoom = await Room.findOneAndUpdate(
//     { _id: room, otherUser: String(user._id) },
//     { blocked: true },
//     { new: true }
//   );

//   if (!updatedRoom) {
//     return next(appError.addError(`no room or user can't block it`, 400));
//   }

//   //! emit to blocking user
//   const blockingUserOnlineId = user.onlineId;
//   io.to(blockingUserOnlineId).emit('server--user-blocked-room', updatedRoom);

//   //! emit to blocked user
//   const blockedUserId =
//     updatedRoom.creator === String(user._id)
//       ? updatedRoom.otherUser
//       : updatedRoom.creator;

//   const blockedUser = await User.findById(blockedUserId);
//   const blockedUserOnlineId = blockedUser.onlineId;
//   io.to(blockedUserOnlineId).emit('server--user-blocked-room', updatedRoom);

//   res.status(200).json({
//     status: 'success',
//     data: updatedRoom,
//   });
// });

//? for getting a room with its id
export const getOneRoom = catchAsync(async (req, res, next) => {
  // 1] getting room from req.params
  const roomId = req.params.id;
  // 2] check if logged in user is the otherUser or the creator
  const userId = req.user._id;
  const room = await Room.findOne({
    _id: roomId,
    $or: [{ otherUser: userId }, { creator: userId }],
  });
  if (!room) {
    return next(
      appError.addError(`access denied you aren't part of this chat`, 401)
    );
  }
  //! add blocks

  const myBlock = await Block.findOne({ room: room._id, creator: userId });
  const otherUserBlock = await Block.findOne({
    room: room._id,
    otherUser: userId,
  });

  //! add userIdToShowInRoom
  let roomClone = { ...room }._doc;
  const userIdToShowInRoom =
    String(userId) === String(room.creator)
      ? String(room.otherUser)
      : String(room.creator);
  const userToShowOnRoom = await User.findById(userIdToShowInRoom).select(
    'firstName  photo email onlineId lastSeenAt'
  );
  roomClone.userToShowOnRoom = userToShowOnRoom;
  roomClone.myBlock = myBlock;
  roomClone.otherUserBlock = otherUserBlock;

  // 3] send the room
  res.status(200).json({
    status: 'success',
    data: roomClone,
  });
});

//? for deleting a room
export const deleteChat = catchAsync(async (req, res, next) => {
  // 1] get room id from  req.params
  const { id } = req.params;
  // 1-a] get the current logged in user user
  const user = req.user;
  // 2] get the room with this id
  const roomDoc = await Room.findOne({
    _id: id,
    $or: [{ creator: user._id }, { otherUser: user._id }],
  });
  if (!roomDoc) {
    return next(appError.addError(`you can't delete this chat`, 401));
  }
  // 4] make room.deleted to true
  roomDoc.deleted = true;
  // 5] save
  await roomDoc.save({ validateBeforeSave: false });

  //! emitting for deleting user
  const deletingUserOnlineId = user.onlineId;
  io.to(deletingUserOnlineId).emit('server--user-delete-chat', roomDoc._id);

  //! emitting for otherPerson
  const otherPersonId =
    String(user._id) === String(roomDoc.creator)
      ? String(roomDoc.otherUser)
      : String(roomDoc.creator);
  const otherPersonOnlineId = (await User.findById(otherPersonId)).onlineId;
  io.to(otherPersonOnlineId).emit('server--user-delete-chat', roomDoc._id);

  // 6] res
  res.status(204).json({
    status: 'success',
    data: roomDoc,
  });
});
