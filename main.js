import { env } from './env.js';
import db from './db.js';
import middleWares from './middleWares/middleWares.js';
import server from './startup/server.js';
import sockets from './sockets/index.js';

env(); //? adding env variables
middleWares.addMiddleWares(); //? applying middlewares
db.connectDB(); //? connecting to database
sockets.connectSockets(); //? connecting sockets

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
