import { Server } from 'socket.io';
import server from './server.js';
import User from '../models/users.js';

const io = new Server(server, {
  cors: {
    origin: `*`,
    methods: ['GET', 'POST'],
  },
});

io.use(async (socket, next) => {
  try {
    const handshakeData = socket.request;
    const userId = handshakeData._query.id;
    const socketId = socket.id;

    const onlineUser = await User.findById(userId);
    //! emit to all users that one user is online now
    //? on client side => loop on the rooms with room.userToShowOnRoom._id === userId
    //? and if it the currently opened room => update it also
    io.emit('server--user-online', {
      userId: onlineUser._id,
      onlineId: socket.id,
    });
    onlineUser.onlineId = socketId;
    onlineUser.lastSeenAt = undefined;
    await onlineUser.save({ validateBeforeSave: false });
  } catch (err) {
    console.log(err.message);
  }

  next();
});

io.on('connection', async (socket) => {
  socket.on('disconnect', async () => {
    try {
      const user = await User.findOne({ onlineId: socket.id });
      user.onlineId = undefined;
      user.lastSeenAt = new Date();
      if (user) {
        await user.save({ validateBeforeSave: false });
        //! emit to all users that one user is off line now
        io.emit('server--user-offline', {
          userId: user._id,
          lastSeenAt: user.lastSeenAt,
        });
      }
    } catch (err) {
      console.log(err.message);
    }
  });
});

export default io;

//   socket.on('set-me-online', (data) => {
//     console.log(data);
//   });
// const id = socket.id;
// users.push(id);
// if (users.length > 1) {
//   console.log(users);
//   console.log('New connection', id);
//   socket.to(users[0]).emit('test-from-server', 'message from server');
// }
