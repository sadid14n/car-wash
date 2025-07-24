import express from "express";
import {
  addVehicalController,
  GetAllUsersController,
  GetUserProfileController,
  LoginController,
  RegisterController,
  totalUserCount,
  UpdateUserController,
} from "../controller/UserController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// protected user route auth
router.get("/user-auth", authMiddleware, (req, res) => {
  res.status(200).send({ ok: true });
});

// protected admin route auth
router.get("/admin-auth", authMiddleware, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

router.post("/register", RegisterController);
router.post("/login", LoginController);
router.get("/profile", authMiddleware, GetUserProfileController);
router.get(
  "/get-all-user-data",
  authMiddleware,
  isAdmin,
  GetAllUsersController
);
router.put("/update-user/:id", authMiddleware, isAdmin, UpdateUserController);

// get total user
router.get("/total-user", authMiddleware, isAdmin, totalUserCount);

// added vehical
router.post("/add-vehical/:id", authMiddleware, isAdmin, addVehicalController);

export default router;
