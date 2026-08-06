// ------------------------------------------------------------
// validate.js
// Reusable validation middleware for incoming requests.
// ------------------------------------------------------------

export function validate(requiredFields = []) {
  return (req, res, next) => {
    const errors = [];

    // Check required fields
    requiredFields.forEach((field) => {
      if (!req.body[field] && req.body[field] !== 0) {
        errors.push({ field, error: `${field} is required` });
      }
    });

    // If errors exist, send them to the global error handler
    if (errors.length > 0) {
      const err = new Error("Validation failed");
      err.status = 400;
      err.errors = errors;
      return next(err);
    }

    next();
  };
}

// ------------------------------------------------------------
// validate.js ensures incoming data is correct
//  before it reaches our controllers.
//  It prevents bad input, protects our database,
//  and keeps our controllers clean
// 
// ------------------------------------------------------------