const globalErrorHandling = (err, req, res, next) => {
  const statusCode = err.statusCode || 500,
    status = err.status || 'error',
    { message, stack } = err;
  res.status(statusCode).json({ status, message, stack });
};

export default globalErrorHandling;
