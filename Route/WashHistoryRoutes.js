import express from "express";
import {
  createWashHistoryController,
  getAllWashHistoryController,
  getUserWashHistoryController,
  getWashHistoryByIdController,
} from "../controller/WashHistoryController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create wash history (admin only)
router.post("/create", authMiddleware, isAdmin, createWashHistoryController);

// Get all wash history (admin only)
router.get("/all", authMiddleware, isAdmin, getAllWashHistoryController);

// Get wash history for a specific user
router.get("/user/:userId", authMiddleware, getUserWashHistoryController);

// Get a single wash history record
router.get("/:id", authMiddleware, getWashHistoryByIdController);

export default router;
