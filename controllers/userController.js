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

//? search users
export const searchUsers = catchAsync(async (req, res, next) => {
  // 1] get searchQuery from req.params.q and get the current user
  const searchQuery = req.params.q;
  const user = req.user;
  // 2] recognize if it is a name or email by containing @ sign
  const isEmail = searchQuery.indexOf('@') !== -1;

  // 3] then search this query from database
  let users;
  if (isEmail) {
    users = await User.find({
      email: {
        $regex: new RegExp(`.*${searchQuery}.*`, 'gi'),
        $ne: user.email,
      },
    });
  } else {
    users = await User.find({
      firstName: {
        $regex: new RegExp(`.*${searchQuery}.*`, 'gi'),
      },
      email: {
        $ne: user.email,
      },
    });
  }
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: users,
  });
});
