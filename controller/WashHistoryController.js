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
      status: "Completed",
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

// Today current wash which is active
export const todayCurrentWash = async (req, res) => {
  try {
    const todayCurrentWash = await WashHistory.find({
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate())),
        $lt: new Date(),
      },
      status: "Active",
    }).populate("user", "name email");

    const totalWash = todayCurrentWash.length;

    res.status(200).send({
      success: true,
      message: "Current wash fetched successfully",
      totalWash,
      todayCurrentWash,
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
export const todayCompletedWash = async (req, res) => {
  try {
    const todayCompletedWash = await WashHistory.find({
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate())),
        $lt: new Date(),
      },
      status: "Done",
    }).populate("user", "name email");

    const totalWash = todayCompletedWash.length;

    res.status(200).send({
      success: true,
      message: "Current wash fetched successfully",
      totalWash,
      todayCompletedWash,
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
        $gte: new Date(new Date().setDate(new Date().getDate())),
        $lt: new Date(),
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
