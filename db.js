import mongoose from 'mongoose';

export default {
  connectDB: () => {
    mongoose
      .connect(
        process.env.db_link.replace('<PASSWORD>', process.env.db_Password),
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
          useCreateIndex: true,
        }
      )
      .then(() => console.log('connected to db'))
      .catch((err) => console.log(err.message));
  },
};
