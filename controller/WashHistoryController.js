import WashHistory from "../models/WashHistory.js";
import User from "../models/User.js";

// Create a new wash record
export const createWashHistoryController = async (req, res) => {
  try {
    const {
      userId,
      vehicleNumber,
      vehicleType,
      serviceType,
      paymentMethod,
      amount,
      notes,
      isFreeWash,
    } = req.body;

    console.log("Received request body:", req.body);
    console.log("isFreeWash from request:", isFreeWash);

    if (!userId || !vehicleNumber || !amount) {
      return res.status(400).send({
        success: false,
        message: "User ID, vehicle number, and amount are required",
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    console.log("User perks:", user.account_info.perks);

    // Determine if this is a free wash
    // Use the provided isFreeWash flag or check if perks = 7
    const isFreePerkWash = isFreeWash === true || user.account_info.perks === 7;

    console.log("Final isFreeWash value:", isFreePerkWash);

    // Create wash history record
    const washHistory = new WashHistory({
      user: userId,
      vehicleNumber,
      vehicleType: vehicleType || "Car",
      serviceType: serviceType || "Basic Wash",
      paymentMethod: paymentMethod || "Cash",
      amount,
      notes: notes || "",
      status: "Active",
      isFreeWash: isFreePerkWash,
    });

    const savedWash = await washHistory.save();
    console.log("Saved wash record:", savedWash);

    // Update user's account info (total_wash and perks)
    let updatedPerks = user.account_info.perks + 1;
    let updatedWash = user.account_info.total_wash + 1;

    // Reset perks when it reaches 7
    if (updatedPerks > 7) {
      updatedPerks = 1;
    }

    await User.findByIdAndUpdate(userId, {
      account_info: {
        total_wash: updatedWash,
        perks: updatedPerks,
      },
    });

    res.status(201).send({
      success: true,
      message: "Wash history created successfully",
      washHistory: savedWash,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// Get wash history for a specific user
export const getUserWashHistoryController = async (req, res) => {
  try {
    const { userId } = req.params;

    const washHistory = await WashHistory.find({ user: userId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate("user", "name email");

    res.status(200).send({
      success: true,
      message: "User wash history fetched successfully",
      washHistory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// Get all wash history (for admin)
export const getAllWashHistoryController = async (req, res) => {
  try {
    const washHistory = await WashHistory.find({})
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate("user", "name email");

    res.status(200).send({
      success: true,
      message: "All wash history fetched successfully",
      washHistory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// Get a single wash history record by ID
export const getWashHistoryByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const washHistory = await WashHistory.findById(id).populate(
      "user",
      "name email"
    );

    if (!washHistory) {
      return res.status(404).send({
        success: false,
        message: "Wash history not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Wash history fetched successfully",
      washHistory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// Update wash history record (for admin)
export const updateWashHistoryController = async (req, res) => {
  try {
    const { id, status } = req.body;

    const washHistory = await WashHistory.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
      }
    ).populate("user", "name email");

    if (!washHistory) {
      return res.status(404).send({
        success: false,
        message: "Wash history not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Wash history updated successfully",
      washHistory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to update wash history",
    });
  }
};

// Get Wash History for month which is completed
export const getWashHistoryForMonth = async (req, res) => {
  try {
    const totalWash = await WashHistory.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        $lt: new Date(),
      },
      status: "Done",
    });

    res.status(200).send({
      success: true,
      message: "Wash history for the month fetched successfully",
      totalWash,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const now = new Date();

// Today current wash which is active
export const todaysCurrentWash = async (req, res) => {
  try {
    const todaysCurrentWash = await WashHistory.find({
      createdAt: {
        $gte: startOfToday,
        $lt: now,
      },
      status: "Active",
    }).populate("user", "name email");

    const totalWash = todaysCurrentWash.length;

    res.status(200).send({
      success: true,
      message: "Current wash fetched successfully",
      totalWash,
      todaysCurrentWash,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// Today completed wash which is Done
export const todaysCompletedWash = async (req, res) => {
  try {
    const todaysCompletedWash = await WashHistory.find({
      createdAt: {
        $gt: startOfToday,
        $lt: now,
      },
      status: "Done",
    }).populate("user", "name email");

    const totalWash = todaysCompletedWash.length;

    res.status(200).send({
      success: true,
      message: "Current wash fetched successfully",
      totalWash,
      todaysCompletedWash,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// Todays Total Sale
export const todaysTotalSale = async (req, res) => {
  try {
    const todaysSales = await WashHistory.find({
      createdAt: {
        $gte: startOfToday,
        $lt: now,
      },
      status: "Done",
    });
    const totalSales = todaysSales.length;
    const totalAmount = todaysSales.reduce((acc, sale) => acc + sale.amount, 0);

    res.status(200).send({
      success: true,
      message: "Todays total sale fetched successfully",
      totalSales,
      totalAmount,
      todaysSales,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// Weekly Total Sale
export const weeklyTotalSale = async (req, res) => {
  try {
    const weeklySales = await WashHistory.find({
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        $lt: new Date(),
      },
      status: "Done",
    });
    const totalSales = weeklySales.length;
    const totalAmount = weeklySales.reduce((acc, sale) => acc + sale.amount, 0);

    res.status(200).send({
      success: true,
      message: "Weekly total sale fetched successfully",
      totalSales,
      totalAmount,
      weeklySales,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// Monthly Total Sale
export const monthlyTotalSale = async (req, res) => {
  try {
    const monthlySales = await WashHistory.find({
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        $lt: new Date(),
      },
      status: "Done",
    });

    const totalSales = monthlySales.length;
    const totalAmount = monthlySales.reduce(
      (acc, sale) => acc + sale.amount,
      0
    );

    res.status(200).send({
      success: true,
      message: "Monthly total sale fetched successfully",
      totalSales,
      totalAmount,
      monthlySales,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
