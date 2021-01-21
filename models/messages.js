import mongoose from 'mongoose';
import Room from './rooms.js';

const messageSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Room',
      required: true,
    },
    sender: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    messageTXT: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'seen'],
      required: 'true',
      default: 'sent',
    },
    deleted: {
      type: Boolean,
      default: false,
      required: true,
    },
    clientId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//? for setting last message in room
messageSchema.statics.setLastMessage = async function (
  roomId,
  messageTXT,
  createdAt
) {
  await Room.findByIdAndUpdate(
    roomId,
    {
      lastMessage: {
        messageTXT,
        createdAt,
      },
      new: false,
    },
    {
      useFindAndModify: false,
    }
  );
};

messageSchema.post('save', async function (doc, next) {
  this.constructor.setLastMessage(
    String(doc.room),
    doc.messageTXT,
    doc.createdAt
  );
  next();
});

//? end setting last message
const Message = mongoose.model('Message', messageSchema);

export default Message;
