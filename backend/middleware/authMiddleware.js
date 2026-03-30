// ============================
// Auth Middleware
// ============================
// Protects routes by verifying JWT token from the Authorization header.
// Usage: Add `protect` to any route that requires authentication.

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user to the request object (without password)
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Continue to the next middleware/route
    } catch (error) {
      console.error("Auth middleware error:", error.message);
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }

  // If no token was found in the header, reject the request
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

module.exports = { protect };