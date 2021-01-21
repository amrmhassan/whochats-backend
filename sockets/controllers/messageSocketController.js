import Message from '../../models/messages.js';

export const sendMessage = (socket, message) => {
  socket.to(message.room).broadcast.emit('server--user-send-message', message);
};

export const userStartTyping = (socket, data) => {
  if (data.onlineUserId) {
    socket.to(data.onlineUserId).emit('server--user-currently-typing', {
      userId: data.typingUserId,
      typingUserOnlineId: data.typingUserOnlineId,
    });
  }
};
export const userStoppedTyping = (socket, data) => {
  if (data.onlineUserId) {
    socket.to(data.onlineUserId).emit('server--user-stopped-typing', {
      userId: data.typingUserId,
      typingUserOnlineId: data.typingUserOnlineId,
    });
  }
};

export const userReadMessage = async (socket, data) => {
  const { message, senderOnlineId } = data;
  const newMessage = await Message.findById(message._id);
  newMessage.status = 'seen';
  await newMessage.save({ validateBeforeSave: false });

  if (senderOnlineId) {
    socket.to(senderOnlineId).emit('server--user-send-message', newMessage);
    console.log(newMessage);
  }
};
