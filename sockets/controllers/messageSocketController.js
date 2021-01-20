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
