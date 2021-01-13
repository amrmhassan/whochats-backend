import http from 'http';
import app from './app.js';

const server = http.Server(app);

export default server;
