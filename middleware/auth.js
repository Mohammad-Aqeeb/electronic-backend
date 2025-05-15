const jwt = require('jsonwebtoken');
const Users = require('../model/Users');
require("dotenv").config();

// Auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from headers

  if (!token) {
    return res.status(401).json({
        success : false,
        message: 'Authorization token is missing'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRETE); // Verify JWT
    const user = await Users.findById(decoded.id); // Find the user by ID in the decoded token

    if (!user) {
      return res.status(401).json({
        success : false,
        message: 'User not found'
      });
    }

    req.user = user; // Attach user to request object
    next(); // Pass control to the next middleware or route handler
  } 
  catch (error){
    return res.status(401).json({
      success : false,
      message: 'Invalid token',
      error : error.message
    });
  }
};

module.exports =  authMiddleware ;
