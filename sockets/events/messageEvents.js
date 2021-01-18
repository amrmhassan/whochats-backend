import * as messageSController from '../controllers/messageSocketController.js';

const events = (socket) => {
  socket.on('user-send-message', (data) =>
    messageSController.sendMessage(socket, data)
  );
  socket.on('user-currently-typing', (data) =>
    messageSController.userStartTyping(socket, data)
  );
  socket.on('user-stopped-typing', (data) =>
    messageSController.userStoppedTyping(socket, data)
  );
};

export default events;
