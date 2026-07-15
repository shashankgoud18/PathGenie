export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  console.error(`💥 [Error] ${req.method} ${req.path} - Status: ${status} - Message: ${message}`);
  if (status === 500) {
    console.error(err.stack);
  }

  res.status(status).json({
    success: false,
    error: message,
    // Hide details in production (if NODE_ENV is set to production)
    details: process.env.NODE_ENV === 'production' ? undefined : err.details || err.stack
  });
};
