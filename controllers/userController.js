import catchAsync from '../utils/catchAsync.js';
import User from '../models/users.js';
import * as factory from '../utils/handlerFactory.js';
import Room from '../models/rooms.js';
import Message from '../models/messages.js';

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

// export const updateUser = factory.updateOne(User);

export const userGetAnotherUserData = catchAsync(async (req, res, next) => {
  // 1-1]//? the user must pass the room id and then we get the other user that is with him
  // 1-2]//? and pass his data with the number of messages
  // 1] get user id from req.params
  const userId = req.params.id;
  // 2] send that user data
  const user = await User.findById(userId).select(
    'fullName firstName lastName email onlineId lastSeenAt photo about'
  );
  //3] getting users Room

  res.status(200).json({
    status: 'success',
    data: user,
  });
});
