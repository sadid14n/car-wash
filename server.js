import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Routes
import userRoutes from "./Route/UserRoutes.js";

const app = express();
const port = 3000;
dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
  autoIndex: true,
});

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Routes
app.use("/api/v1/user", userRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
