import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import Block from '../models/blocks.js';
import User from '../models/users.js';
import io from '../startup/io.js';

const appError = new AppError();

export const createBlock = catchAsync(async (req, res, next) => {
  // 1] get block creator from req.user
  const creator = req.user;
  // 2] get roomId from req.body
  const { room, otherUser } = req.body;
  // 3] check if the creator user is the otherUser
  if (String(creator._id) === String(otherUser)) {
    return next(appError.addError(`you can't block your self`, 400));
  }
  // 4] check there is no blocks with the same two users and the creator is creator cause both can block each other at the sam time
  const existingBlocks = await Block.findOne({ creator, otherUser });
  if (existingBlocks) {
    return next(appError.addError(`you can't block the same user twice`, 400));
  }
  // 5] create the block
  const newBlock = await Block.create({
    room,
    creator,
    otherUser,
  });

  // ! emitting for block creator
  const creatorOnlineId = creator.onlineId;
  io.to(creatorOnlineId).emit('server--user-block-room', newBlock);

  //! emitting  for blockedUser
  const blockedUser = await User.findById(otherUser);
  const blockedUserOnlineId = blockedUser.onlineId;
  if (blockedUserOnlineId) {
    io.to(blockedUserOnlineId).emit('server--user-block-room', newBlock);
  }

  //! end of test
  res.status(200).json({
    status: 'success',
    data: newBlock,
  });
});
export const deleteBlock = catchAsync(async (req, res, next) => {
  // 1] get the current user from req.use
  const creator = req.user;
  // 2] get room and otherUser
  const { room, otherUser } = req.body;
  if (!room || !otherUser) {
    return next(appError.addError(`please provide room and otherUser`, 400));
  }
  //2-a] check if the otherUser and the creator are the same
  if (String(creator._id) === String(otherUser)) {
    return next(appError.addError(`you can't delete a block of yourself`, 400));
  }
  // 3] get one block with the three arguments and the current logged in user is the creator
  const block = await Block.findOne({ creator, otherUser, room });
  // 4] check if there is any blocks that match
  if (!block) {
    return next(
      appError.addError(`other user isn't blocked or you can't unblock`, 400)
    );
  }
  // 5] update the block to be deleted
  block.deleted = true;
  await block.save({ validateBeforeSave: false });

  // 6] emit the events
  const creatorOnlineId = creator.onlineId;
  io.to(creatorOnlineId).emit('server--user-unblock-room', block);

  //! emitting  for blockedUser
  const blockedUser = await User.findById(otherUser);
  const blockedUserOnlineId = blockedUser.onlineId;
  if (blockedUserOnlineId) {
    io.to(blockedUserOnlineId).emit('server--user-unblock-room', block);
  }
  // 7] send the response
  res.status(204).json({
    status: 'success',
    data: block,
  });
});
