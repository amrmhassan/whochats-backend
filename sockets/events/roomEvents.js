import * as roomSocketController from '../controllers/roomSocketController.js';

const events = (socket) => {
  socket.on('user-join-his-rooms', (data) =>
    roomSocketController.joinMyRooms(socket, data)
  );
  socket.on('user-added-new-room', (data) =>
    roomSocketController.userAddedNewRoom(socket, data)
  );
};

export default events;
