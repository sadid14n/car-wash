import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "../models/User.js";

export const RegisterController = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please fill all fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, phone, password: hashedPassword });
    await user.save();

    res.status(201).send({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

export const LoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please fill all fields",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).send({
      success: true,
      message: "Login successful",
      token,
      admin: user.isAdmin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// Admin Controller
export const GetAllUsersController = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).send({
      success: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// export const UpdateUserController = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { account_info } = req.body;

//     const user = await User.findByIdAndUpdate(
//       id,
//       { account_info },
//       { new: true }
//     ).select("-password");

//     if (!user) {
//       return res.status(404).send({
//         success: false,
//         message: "User not found",
//       });
//     }

//     res.status(200).send({
//       success: true,
//       message: "User updated successfully",
//       user,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export const GetUserProfileController = async (req, res) => {
  try {
    // req.user.id will be available from auth middleware
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "User profile fetched successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// Get total User
export const totalUserCount = async (req, res) => {
  try {
    const totalUser = await User.countDocuments();
    res.status(200).send({
      success: true,
      message: "Total user fetched successfully",
      totalUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// added vehical in user profile
export const addVehicalController = async (req, res) => {
  try {
    const { id } = req.body;
    const { vehicle } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { $push: { vehicle } },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Vehical added successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// edit vehicle
export const editVehicleController = async (req, res) => {
  try {
    const { userId, index, updatedVehicle } = req.body;

    // Validate index
    if (typeof index !== "number" || index < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle index",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.vehicle || user.vehicle.length <= index) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found at specified index",
      });
    }

    // Update the specific vehicle
    user.vehicle[index] = {
      ...user.vehicle[index],
      ...updatedVehicle,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      user: user.toObject({ getters: true, versionKey: false }),
    });
  } catch (error) {
    console.error("Edit Vehicle Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update user details controller
export const updateUserInfoController = async (req, res) => {
  try {
    const { userId, name, phone, address } = req.body;

    // Check if user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update the fields
    if (name) user.name = name.toLowerCase();
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: {
        name: user.name,
        phone: user.phone,
        address: user.address,
        email: user.email,
        _id: user._id,
      },
    });
  } catch (error) {
    console.error("User update error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
