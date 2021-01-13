export const sendMessage = (socket, message) => {
  socket.to(message.room).broadcast.emit('server--user-send-message', message);
};
