import * as roomSocketController from '../controllers/roomSocketController.js';

const events = (socket) => {
  socket.on('user-join-his-rooms', (data) =>
    roomSocketController.joinMyRooms(socket, data)
  );
};

export default events;
