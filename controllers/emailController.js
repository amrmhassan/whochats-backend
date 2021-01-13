import catchAsync from '../utils/catchAsync.js';
import Email from '../models/email.js';
export const sendEmail = catchAsync(async (options) => {
  await Email.create({
    receiver: options.receiver,
    subject: options.subject,
    message: options.message,
  });
});
export const getEmails = catchAsync(async (req, res, next) => {
  const emails = await Email.find();
  res.send({
    status: 'success',
    emails,
  });
});
export const getEmailsForUser = catchAsync(async (req, res, next) => {
  const email = req.params.email;
  const emails = await Email.find({ receiver: email });
  res.send({
    status: 'success',
    emails,
  });
});
