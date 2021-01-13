import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import Post from '../models/posts.js';
import * as factory from '../utils/handlerFactory.js';
const appError = new AppError();

export const getPosts = factory.getAll(Post);

export const createPost = factory.createOne(Post, [
  'title',
  'message',
  'creator',
  'tags',
  'selectedFile',
]);
