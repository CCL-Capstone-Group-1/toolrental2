// ------------------------------------------------------------
// response.js
// Helper functions to keep JSON responses consistent.
// ------------------------------------------------------------

export function sendSuccess(res, data, status = 200) {
  return res.status(status).json({
    success: true,
    data
  });
}

export function sendError(res, status, message) {
  return res.status(status).json({
    success: false,
    message
  });
}
