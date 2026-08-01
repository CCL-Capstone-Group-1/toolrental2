// ------------------------------------------------------------
// errorHandler.js
// Centralized error handler so we don't repeat try/catch logic.
// Any controller can call next(err) and it arrives here.
// ------------------------------------------------------------

export function errorHandler(err, req, res, next) {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}
