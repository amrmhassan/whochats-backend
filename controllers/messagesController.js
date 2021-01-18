import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import Message from '../models/messages.js';
import io from '../startup/io.js';
import User from '../models/users.js';
import Block from '../models/blocks.js';

const appError = new AppError();

export const createMessage = catchAsync(async (req, res, next) => {
  // 1] get( roomId, receiver, message) from req.body
  const { room, receiver, messageTXT } = req.body;
  if (!room || !receiver || !messageTXT) {
    return next(
      appError.addError(`please provide room and receiver and messageTXT`, 400)
    );
  }
  // 1-a-a] check if there is block
  const block = await Block.findOne({ room });
  if (block) {
    return next(appError.addError(`blocked chat`, 401));
  }
  // 1-a] get receiver and check if he is there
  const receiverUser = await User.findById(receiver);
  if (!receiverUser) {
    return next(appError.addError(`receiver not found`, 404));
  }

  // 2] get sender from req.user
  const sender = req.user;

  // 3] create the message
  const message = await Message.create({
    room,
    sender: sender._id,
    receiver,
    messageTXT,
  });
  //! emitting the event of sending messages to receiver
  const receiverOnlineId = receiverUser.onlineId;
  if (receiverOnlineId) {
    io.to(receiverOnlineId).emit('server--user-send-message', message);
  }
  //! emitting the event of sending messages to sender
  const senderOnlineId = sender.onlineId;
  io.to(senderOnlineId).emit('server--user-send-message', message);

  res.status(200).json({
    status: 'success',
    data: message,
  });
});

export const getRoomMessages = catchAsync(async (req, res, next) => {
  // 1] get room from req.body
  const { id } = req.params;
  // 2] get the last 200 room messages
  //! update this to get the other messages when user ask for them
  //! it will be like paging
  //! user will know the number of messages he has the ask for the next 200
  const messages = await Message.find({ room: id });

  //? results will always be 200 if messages are more than 200
  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: messages,
  });
});
