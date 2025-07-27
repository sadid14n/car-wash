import express from "express";
import {
  createWashHistoryController,
  getAllWashHistoryController,
  getUserWashHistoryController,
  getWashHistoryByIdController,
  getWashHistoryForMonth,
  monthlyTotalSale,
  todaysCompletedWash,
  todaysCurrentWash,
  todaysTotalSale,
  updateWashHistoryController,
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
router.get(
  "/monthly-total-wash",
  authMiddleware,
  isAdmin,
  getWashHistoryForMonth
);

// Current wash for today which is pending
router.get("/todays-current-wash", authMiddleware, isAdmin, todaysCurrentWash);

// Today completed wash which is Done
router.get(
  "/todays-completed-wash",
  authMiddleware,
  isAdmin,
  todaysCompletedWash
);

router.put(
  "/update-wash",
  authMiddleware,
  isAdmin,
  updateWashHistoryController
);

// ********** Sales ********** //

// Today total sales
router.get("/todays-total-sale", authMiddleware, isAdmin, todaysTotalSale);

// Weekly total sales
router.get("/weekly-total-sale", authMiddleware, isAdmin, weeklyTotalSale);

// Monthly total sales
router.get("/monthly-total-sale", authMiddleware, isAdmin, monthlyTotalSale);

// ********** Sales ********** //

// Get a single wash history record
router.get("/:id", authMiddleware, getWashHistoryByIdController);

export default router;
