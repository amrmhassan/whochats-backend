import './events/messageEvents.js';
import io from '../startup/io.js';
import messageEvents from './events/messageEvents.js';
import roomEvents from './events/roomEvents.js';

export default {
  connectSockets: () => {
    io.on('connect', (socket) => {
      messageEvents(socket);
      roomEvents(socket);
    });
  },
};
