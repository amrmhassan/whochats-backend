import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import Message from '../models/messages.js';

const appError = new AppError();

export const createMessage = catchAsync(async (req, res, next) => {
  // 1] get( roomId, receiver, message) from req.body
  const { room, receiver, messageTXT } = req.body;
  if (!room || !receiver || !messageTXT) {
    return next(
      appError.addError(`please provide room and receiver and messageTXT`, 400)
    );
  }
  // 2] get sender from req.user
  const sender = req.user._id;
  // 3] create the message
  const message = await Message.create({
    room,
    sender,
    receiver,
    messageTXT,
  });

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
  const messages = await Message.find({ room: id }).limit(200);

  //? results will always be 200 if messages are more than 200
  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: messages,
  });
});
