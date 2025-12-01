// models/file.model.js
const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  filename: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true },
  mimeType: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional for form uploads without auth
}, { timestamps: true });

module.exports = mongoose.model("File", fileSchema);
