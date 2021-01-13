import * as messageSController from '../controllers/messageSocketController.js';

const events = (socket) => {
  socket.on('user-send-message', (data) =>
    messageSController.sendMessage(socket, data)
  );
};

export default events;
