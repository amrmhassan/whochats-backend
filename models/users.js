import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxlength: 50,
      minlength: 3,
    },
    lastName: {
      type: String,
      required: true,
      maxlength: 50,
      minlength: 3,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      maxlength: 100,
      minlength: 5,
      unique: true,
      validate: [validator.isEmail, 'email must be a proper email'],
    },
    password: {
      type: String,
      required: true,
      maxlength: 255,
      minlength: 8,
    },
    passwordConfirm: {
      type: String,
      required: true,
      maxlength: 255,
      minlength: 8,
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: 'password and passwordConfirm must be the same',
      },
    },
    passwordChangedAt: {
      type: Date,
      default: new Date().getTime(),
    },
    //! update roles for your app
    role: {
      type: String,
      default: 'user',
      enum: ['admin', 'user'],
    },
    photo: String,
    phone: String,
    randomToken: String,
    randomTokenExpiresAt: Date,
  },
  { timestamps: true }
);

// Hashing passwords when first created or modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // console.log('Password has been changed');
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now() - 1000;
  this.passwordConfirm = undefined;
  this.randomToken = undefined;
  this.randomTokenExpiresAt = undefined;
  next();
});
// adding correct password method
userSchema.methods.correctPassword = async function (
  providedPassword,
  realPassword
) {
  const correctPassword = await bcrypt.compare(providedPassword, realPassword);
  return correctPassword;
};

// checking if password has been changed after generating jwt
userSchema.methods.passwordChangedAfter = function (
  passwordChangingTime,
  jwtCreatingTime
) {
  return new Date(passwordChangingTime).getTime() / 1000 > jwtCreatingTime;
  //password > jwt
  //200      > 100
  // 200 earlier
  //100 older
  // password changed so return true
};

const User = mongoose.model('User', userSchema);
export default User;
