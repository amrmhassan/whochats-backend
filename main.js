//! npm install body-parser
import { env } from './env.js';
import db from './db.js';
import './middleWares/middleWares.js';
import server from './startup/server.js';
import './sockets/index.js';

env();
db.connectDB();

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
