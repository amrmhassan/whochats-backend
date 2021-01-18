import mongoose from 'mongoose';

export default {
  connectDB: () => {
    const db_link =
      process.env.NODE_ENV === 'production'
        ? process.env.db_link_prod.replace(
            '<PASSWORD>',
            process.env.db_Password
          )
        : process.env.db_link_dev;
    mongoose
      .connect(db_link, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      })
      .then(() => console.log('connected to db'))
      .catch((err) => console.log(err.message));
  },
};
