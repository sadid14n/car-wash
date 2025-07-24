import mongoose, { Schema } from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      lowercase: true,
      required: true,
      minlength: [3, "fullname must be 3 letters long"],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: String,
    isAdmin: {
      type: Boolean,
      default: false,
    },

    vehicals: [
      {
        vehicle_type: {
          type: String,
          required: true,
        },
        vehicle_name: {
          type: String,
          required: true,
        },
        vehicle_number: {
          type: String,
          required: true,
          // match: /^[A-Z]{2}-\d{2}-[A-Z]{1,2}-\d{4}$/, // Validates like AS-25-F-7867
        },
      },
    ],

    account_info: {
      total_wash: {
        type: Number,
        default: 0,
      },
      perks: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: {
      createdAt: "joinedAt",
    },
  }
);

export default mongoose.model("User", userSchema);
