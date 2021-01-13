import { Server } from 'socket.io';
import server from './server.js';

const io = new Server(server, {
  cors: {
    origin: `*`,
    methods: ['GET', 'POST'],
  },
});

// io.on('connection', (socket) => {
//   console.log('New connection', socket.id);

//   socket.on('disconnect', () => {
//     console.log('user disconnected', socket.id);
//   });
// });

export default io;
