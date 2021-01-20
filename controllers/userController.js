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

export const userGetAnotherUserData = catchAsync(async (req, res, next) => {
  // 1] get user id from req.params
  const userId = req.params.id;
  // 2] send that user data
  const user = await User.findById(userId).select(
    'fullName firstName lastName email onlineId lastSeenAt photo'
  );

  res.status(200).json({
    status: 'success',
    data: user,
  });
});
