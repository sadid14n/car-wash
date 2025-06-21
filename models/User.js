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
