import catchAsync from './catchAsync.js';
import AppError from '../utils/AppError.js';

const appError = new AppError();

export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const docs = await Model.find();
    if (docs.length >= 1) {
      return res.status(200).json({
        status: 'success',
        result: docs.length,
        data: docs,
      });
    }
    res.status(200).json({
      status: 'success',
      data: 'No data to show!',
    });
  });

export const createOne = (Model, data = []) =>
  //? "data" is what we are interested in from what user sends
  catchAsync(async (req, res, next) => {
    const dataToSave = {};
    data.forEach((key) => {
      dataToSave[key] = req.body[key];
    });
    const newDoc = await Model.create(dataToSave);
    res.status(200).json({
      status: 'success',
      data: newDoc,
    });
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const doc = await Model.findByIdAndUpdate(id, req.body);
    if (!doc) {
      return next(appError.addError('no data found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });
