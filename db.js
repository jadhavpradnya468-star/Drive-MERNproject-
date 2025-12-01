// db.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/Backend-Drive";

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
    console.error(err);
    // do NOT process.exit(1) while debugging with nodemon unless you want crash loops
  }
}

module.exports = connectDB;
