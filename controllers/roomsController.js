import catchAsync from '../utils/catchAsync.js';
import Room from '../models/rooms.js';
import AppError from '../utils/AppError.js';
import User from '../models/users.js';

const appError = new AppError();

export const getMyRooms = catchAsync(async (req, res, next) => {
  // 1] get user from req.user
  const user = req.user;

  // 2] get rooms that have this user as creator or as otherUser
  let rooms = await Room.find({
    $or: [{ creator: user._id }, { otherUser: user._id }],
  }).sort('-createdAt');

  //! populating the other person not (otherPerson) => i will do it manually just for now
  //! the person who didn't make the request

  const arrayOfPromises = rooms.map(async (room) => {
    let roomClone = { ...room }._doc;
    const userIdToShowInRoom =
      String(user._id) === String(room.creator)
        ? String(room.otherUser)
        : String(room.creator);
    const userToShowOnRoom = await User.findById(userIdToShowInRoom).select(
      'firstName lastName photo email'
    );
    roomClone.userToShowOnRoom = userToShowOnRoom;
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

  res.status(200).json({
    status: 'success',
    data: room,
  });
});
