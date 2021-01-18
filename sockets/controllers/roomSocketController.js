import io from '../../startup/io.js';

export const joinMyRooms = (socket, data) => {
  const { rooms, user } = data;
  rooms.forEach((room) => {
    socket.join(room);
    socket.to(room).broadcast.emit('server--user-joined-room', user);
  });
};
export const userAddedNewRoom = (socket, data) => {
  socket.broadcast.emit('server--user-added-new-room', data);
};

//? this code is for getting all rooms with users in it
// io.on('connection', (socket) => {
//   console.log('New connection');
//   setTimeout(() => {
//     const clients = io.sockets.adapter.rooms;
//     console.log(clients);
//   }, 2000);
// });
