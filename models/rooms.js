import mongoose from 'mongoose';
import Block from './blocks.js';

const roomSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    otherUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    lastMessage: {
      messageTXT: {
        type: String,
        required: true,
        default: 'New',
      },
      createdAt: {
        type: Date,
        required: true,
        default: new Date(),
      },
    },
    //? new means that it has no messages yet
    new: {
      type: Boolean,
      required: true,
      default: true,
    },
    //? accepted means that other person accepted it
    accepted: {
      type: Boolean,
      default: false,
    },

    //? deleted means one of the two users deleted it
    deleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    nOfUnreadMsg: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//? adding blocks to the rooms
//! when you add virtuals here it won't be shown because you are
//! cloning rooms after querying them
//! using {...room}._doc in roomController
// roomSchema.virtual('TESTvIRTUALPROERETY').get(function () {
//   return Math.random();
// });

//? filtering deleted chats
roomSchema.pre(/^find/, function (next) {
  this.find({ deleted: { $ne: true } });
  next();
});

const Room = mongoose.model('Room', roomSchema);
export default Room;
