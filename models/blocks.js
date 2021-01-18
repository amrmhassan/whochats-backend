import mongoose from 'mongoose';

const blockSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Room',
      required: true,
    },
    creator: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    otherUser: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

blockSchema.pre(/^find/, function (next) {
  this.find({ deleted: { $ne: true } });
  next();
});

const Block = mongoose.model('Block', blockSchema);

export default Block;
