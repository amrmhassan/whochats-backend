import AppError from './AppError.js';

const appError = new AppError();

const catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      return next(appError.addError(err.message, 500));
    }
  };
};
export default catchAsync;
