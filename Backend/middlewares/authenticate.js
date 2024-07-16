const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const pool = require('../config/database'); // Adjust path accordingly

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  try {
      const token = req.cookies.token;
      if (!token) {
          return next(new ErrorHandler("Login First to Access", 401));
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Check if the decoded token contains the user's ID
      if (!decoded.id) {
          return next(new ErrorHandler("Invalid Token", 401));
      }

      // Assuming you have a SQL query function to fetch user details based on the ID
      const user = await fetchUserById(decoded.id);

      if (!user) {
          return next(new ErrorHandler("User not found", 401));
      }

      req.user = user;

      next();
  } catch (error) {
      return next(new ErrorHandler("Unauthorized Access", 401));
  }
});

// Function to fetch user details from SQL database
async function fetchUserById(userId) {
    // Example SQL query to fetch user details based on the ID
    const sqlQuery = `SELECT * FROM users WHERE id = ?`;
    const [userResult] = await pool.query(sqlQuery, [userId]);
    return userResult[0]; // Assuming the query returns a single user
}

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // console.log("User Role:", req.user.role);
    // console.log("Allowed Roles:", roles);
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler(`Role ${req.user.role} is not allowed`, 403));
    }
    next();
  };
};
