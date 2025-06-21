import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        message: "Authentication failed: No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Authentication failed: No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to request
    req.user = { id: decoded.id };

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success: false,
      message: "Authentication failed: Invalid token",
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    // Make sure req.user.id exists
    if (!req.user || !req.user.id) {
      return res.status(401).send({
        success: false,
        message: "Authentication failed: User ID not found",
      });
    }

    const user = await User.findById(req.user.id);

    // Check if user exists
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Authentication failed: User not found",
      });
    }

    // Check if user is admin
    if (!user.isAdmin) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access: Admin privileges required",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success: false,
      message: "Error in Admin middleware",
      error: error.message,
    });
  }
};
