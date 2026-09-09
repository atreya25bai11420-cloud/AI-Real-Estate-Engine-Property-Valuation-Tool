const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 400;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
    details: err.errors || null
  });
};

module.exports = errorHandler;
