// ------------------------------------------------------------
// errorHandler.js (Upgraded Global Error Handler)
// Centralized error handling for the entire Express API.
// This replaces controller-level sendError() calls.
// ------------------------------------------------------------

export function errorHandler(err, req, res, next) {
  // ------------------------------------------------------------
  // 1. Log the full error stack for debugging (server-side only)
  // ------------------------------------------------------------
  console.error("🔥 Global Error Handler:", err.stack);

  // ------------------------------------------------------------
  // 2. Determine the correct HTTP status code
  //    - Custom errors can set err.status
  //    - Otherwise default to 500 (Internal Server Error)
  // ------------------------------------------------------------
  const status = err.status || 500;

  // ------------------------------------------------------------
  // 3. Build a safe, consistent JSON response
  //    - Never leak internal Prisma or SQL details
  //    - Never expose stack traces to the client
  // ------------------------------------------------------------
  const response = {
    success: false,
    message: err.message || "Internal Server Error",
  };

  // ------------------------------------------------------------
  // 4. Optional: Attach validation errors if present
  //    Example: err.errors = [{ field: "email", message: "Required" }]
  // ------------------------------------------------------------
  if (err.errors) {
    response.errors = err.errors;
  }

  // ------------------------------------------------------------
  // 5. Send the final JSON response
  // ------------------------------------------------------------
  res.status(status).json(response);
}
