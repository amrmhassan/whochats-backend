import './events/messageEvents.js';
import io from '../startup/io.js';
import messageEvents from './events/messageEvents.js';
import roomEvents from './events/roomEvents.js';

io.on('connect', (socket) => {
  messageEvents(socket);
  roomEvents(socket);
});
