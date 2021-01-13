//! npm install body-parser
import { env } from './env.js';
import app from './app.js';
import db from './db.js';
import './middleWares/middleWares.js';
import http from 'http';
import { Server } from 'socket.io';

const server = http.Server(app);
const io = new Server(server, {
  cors: {
    origin: `*`,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.on('set-me-online', (user) => {
    console.log('Setting user online', user);
  });

  socket.on('disconnect', () => {});
});

env();
db.connectDB();

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
