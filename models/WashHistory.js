import mongoose from "mongoose";

const washHistorySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
    },
    vehicleType: {
      type: String,
      enum: ["Car", "SUV", "Truck", "Motorcycle", "Other"],
      default: "Car",
    },
    serviceType: {
      type: String,
      enum: [
        "Basic Wash",
        "Premium Wash",
        "Deluxe Wash",
        "Interior Cleaning",
        "Full Service",
      ],
      default: "Basic Wash",
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Credit Card", "Debit Card", "UPI", "Wallet"],
      default: "Cash",
    },
    amount: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Done"],
      default: "Active",
    },
    isFreeWash: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("WashHistory", washHistorySchema);
