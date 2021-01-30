import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import Message from '../models/messages.js';
import io from '../startup/io.js';
import User from '../models/users.js';
import Block from '../models/blocks.js';
import dayInjector from '../utils/dayRecognizer.js';

const appError = new AppError();

//? for creating new message
export const createMessage = catchAsync(async (req, res, next) => {
  // 1] get( roomId, receiver, message) from req.body
  const {
    room,
    receiver,
    messageTXT,
    clientId,
    messageType,
    mediaLink,
  } = req.body;
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
    clientId,
    messageType,
    mediaLink,
  });
  //! emitting the event of sending messages to receiver
  const senderOnlineId = sender.onlineId;
  const receiverOnlineId = receiverUser.onlineId;

  if (receiverOnlineId) {
    message.status = 'delivered';
    await message.save({ validateBeforeSave: false });

    io.to(receiverOnlineId).emit('server--user-send-message', message);
    //! send message delivered to sender if the receiver online
  }
  //! emitting the event of sending messages to sender

  io.to(senderOnlineId).emit('server--user-send-message', message);

  res.status(200).json({
    status: 'success',
    data: message,
  });
});

//? for getting room messages
export const getRoomMessages = catchAsync(async (req, res, next) => {
  // 1] get room from req.body
  const { id } = req.params;
  // 2] get user from req.user
  const user = req.user;
  // 2] get the last 200 room messages
  //! update this to get the other messages when user ask for them
  //! it will be like paging
  //! user will know the number of messages he has the ask for the next 200
  const messages = await Message.find({ room: id });

  //! updating messages to be seen and emitting to users that messages are seen now
  messages.forEach(async (message) => {
    if (
      message.status !== 'seen' &&
      String(message.receiver) === String(user._id)
    ) {
      message.status = 'seen';
      message.save({ validateBeforeSave: false });
      //? emitting to all users that are sender of these messages that messages have been delivered to this user
      const senderUser = await User.findById(message.sender);
      const senderOnlineId = senderUser.onlineId;
      if (senderOnlineId) {
        io.to(senderOnlineId).emit('server--user-send-message', message);
      }
    }
  });

  //! for adding messages days admin messages
  const messagesClone = [];
  let currentDay = '';
  messages.forEach((message) => {
    const currentMessageDay = dayInjector(message.createdAt);
    if (currentMessageDay !== currentDay) {
      currentDay = currentMessageDay;
      const dayMsg = {
        messageType: 'text',
        sender: 'admin',
        messageTXT: currentMessageDay,
        createdAt: message.createdAt,
        //? this prop is only for providing clientId for React key when it is show on the list
        clientId: Math.random().toString(),
      };
      messagesClone.push(dayMsg);
    }
    messagesClone.push(message);

    // looping through all messages and set currentDay to the current message createdAt prop day
    // if the currentDay is different from the current message createdAt prop day
    // then add a new admin message with the current day
  });
  //! end for adding messages days admin messages

  //? results will always be 200 if messages are more than 200
  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: messagesClone,
  });
});
