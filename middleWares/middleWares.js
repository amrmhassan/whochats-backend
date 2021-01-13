import app from '../startup/app.js';
import cors from 'cors';
import postsRoute from '../routes/postsRoute.js';
import usersRoute from '../routes/usersRoute.js';
import roomsRoute from '../routes/roomsRoutes.js';
import messagesRoutes from '../routes/messagesRoutes.js';
import emailRoutes from '../routes/emailRoutes.js';
import express from 'express';
import globalErrorHandling from '../utils/globalErrorHandling.js';
import AppError from '../utils/AppError.js';
import path from 'path';

const appError = new AppError();
const __dirname = path.resolve();

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
});
app.use('/api/v1/posts', postsRoute);
app.use('/api/v1/users', usersRoute);
app.use('/api/v1/rooms', roomsRoute);
app.use('/api/v1/messages', messagesRoutes);
app.use('/api/v1/emails', emailRoutes);

console.log((process.env.NODE_ENV = 'production'));
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/build')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '/build/index.html'))
  );
}

app.all('*', (req, res, next) => {
  return next(appError.addError(`Can't find this url ${req.originalUrl}`, 404));
});
app.use(globalErrorHandling);
