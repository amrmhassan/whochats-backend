import mongoose from 'mongoose';

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
      },
      createdAt: {
        type: Date,
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
  {
    timestamps: true,
  }
);

const User = mongoose.model('Room', roomSchema);
export default User;
