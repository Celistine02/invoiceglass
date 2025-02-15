/**
 * Error Handling Middleware
 * This middleware function provides a centralized error handling mechanism.
 * It captures all errors thrown in the application and sends a formatted response.
 *
 * @param {Object} err - The error object that may contain various properties.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the stack.
 */
const errorHandler = (err, req, res, next) => {
  // Log the error for debugging and auditing purposes
  console.error(`[Error]: ${err.message}`, {
    method: req.method,
    path: req.path,
    error: err,
  });

  // Determine the status code: if the error has a defined status code, use it; otherwise, use 500
  const statusCode = err.statusCode || 500;

  // Send the error response
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message: err.message || "An unexpected error occurred",
  });
};

module.exports = errorHandler;
