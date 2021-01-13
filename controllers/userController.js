import catchAsync from '../utils/catchAsync.js';
import User from '../models/users.js';
import * as factory from '../utils/handlerFactory.js';

//? this is for admins
export const getAllUsers = factory.getAll(User);
export const addNewUser = factory.createOne(User, [
  'name',
  'email',
  'password',
  'passwordConfirm',
  'photo',
  'phone',
]);

export const updateUser = factory.updateOne(User);
