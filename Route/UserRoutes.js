import express from "express";
import {
  addVehicalController,
  deleteUserController,
  editVehicleController,
  GetAllUsersController,
  getSingleUser,
  GetUserProfileController,
  LoginController,
  RegisterController,
  totalUserCount,
  updateUserInfoController,
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
// router.put("/update-user/:id", authMiddleware, isAdmin, UpdateUserController);

// get total user
router.get("/total-user-count", authMiddleware, isAdmin, totalUserCount);

// added vehical
router.post("/add-vehicle", authMiddleware, isAdmin, addVehicalController);

// edit vehicle
router.put("/edit-vehicle", authMiddleware, isAdmin, editVehicleController);

router.get("/get-single-user/:id", authMiddleware, isAdmin, getSingleUser);

router.delete(
  "/delete-user/:id",
  authMiddleware,
  isAdmin,
  deleteUserController
);

// update user details controller
router.put(
  "/update-profile",
  authMiddleware,
  isAdmin,
  updateUserInfoController
);

export default router;
