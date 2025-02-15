const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate and authorize users based on JWT tokens.
 * @param {Object} req - The request object from Express.js.
 * @param {Object} res - The response object from Express.js.
 * @param {Function} next - The next middleware function in the stack.
 */
const authMiddleware = (req, res, next) => {
  // Retrieve the authorization header from the request
  const authHeader = req.headers["authorization"];

  // Check if the authorization header is missing or doesn't start with 'Bearer '
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization header missing or malformed" });
  }

  // Extract the token from the authorization header
  const token = authHeader.split(" ")[1];

  // Verify the token using the secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // If token verification fails, send a 403 Forbidden response
      return res.status(403).json({ message: "Token invalid" });
    }

    // Attach the user's ID from the token to the request object
    req.userId = decoded.userId;

    // Proceed to the next middleware function
    next();
  });
};

module.exports = authMiddleware;
