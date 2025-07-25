import express from "express";
import {
  createWashHistoryController,
  getAllWashHistoryController,
  getUserWashHistoryController,
  getWashHistoryByIdController,
  getWashHistoryForMonth,
  monthlyTotalSale,
  todayCompletedWash,
  todayCurrentWash,
  todaysTotalSale,
  weeklyTotalSale,
} from "../controller/WashHistoryController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create wash history (admin only)
router.post("/create", authMiddleware, isAdmin, createWashHistoryController);

// Get all wash history (admin only)
router.get("/all", authMiddleware, isAdmin, getAllWashHistoryController);

// Get wash history for a specific user
router.get("/user/:userId", authMiddleware, getUserWashHistoryController);

// Admin Dashboard
// Get wash history for the month
router.get("/get-for-month", authMiddleware, isAdmin, getWashHistoryForMonth);

// Current wash for today which is pending
router.get("/today-current-wash", authMiddleware, isAdmin, todayCurrentWash);

// Today completed wash which is Done
router.get(
  "/today-completed-wash",
  authMiddleware,
  isAdmin,
  todayCompletedWash
);

// ********** Sales ********** //

// Today total sales
router.get("/todays-total-sale", authMiddleware, isAdmin, todaysTotalSale);

// Weekly total sales
router.get("/weekly-total-sale", authMiddleware, isAdmin, weeklyTotalSale);

// ********** Sales ********** //

// Get a single wash history record
router.get("/:id", authMiddleware, getWashHistoryByIdController);

export default router;
