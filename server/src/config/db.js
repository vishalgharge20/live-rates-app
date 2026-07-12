import mongoose from "mongoose";

/**
 * connectDB
 * ------------------------------------------------------
 * Opens the single Mongoose connection used by the whole
 * app. Called once from server.js on boot.
 * ------------------------------------------------------
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not set. Copy .env.example to .env and configure it.");
  }

  mongoose.connection.on("connected", () => {
    console.log("[db] MongoDB connected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("[db] MongoDB connection error:", err.message);
  });

  await mongoose.connect(uri);
}
