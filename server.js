import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Routes
import userRoutes from "./Route/userRoutes.js";
import washHistoryRoutes from "./Route/WashHistoryRoutes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URL, {
  autoIndex: true,
});

// Middleware
app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://car-wash-dusky.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/wash-history", washHistoryRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
