// routes/fileRoutes.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");            // <-- only declare path once here
const File = require("../models/file.model");
const auth = require("../middleware/auth");

const router = express.Router();

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, UPLOAD_DIR); },
  filename: (req, file, cb) => { cb(null, Date.now() + "-" + file.originalname); }
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } }); // 20MB

// Protected API upload (requires token)
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    const file = new File({
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimeType: req.file.mimetype,
      owner: req.user && req.user.id ? req.user.id : null,
    });
    await file.save();
    res.json(file);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Form upload (no auth) — matches <form action="/upload-file" ...>
router.post("/upload-file", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded.");
    const file = new File({
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimeType: req.file.mimetype,
    });
    await file.save();
    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

// Protected download by DB id
router.get("/download/:id", auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ msg: "File not found" });

    if (file.owner && file.owner.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    const fullPath = path.resolve(file.path);
    return res.download(fullPath, file.originalName, (err) => {
      if (err) {
        console.error("Download error:", err);
        if (!res.headersSent) res.status(500).send("Error downloading file");
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Public listing page (renders views/download.ejs)
router.get("/download", async (req, res) => {
  try {
    const files = await File.find().sort({ createdAt: -1 });
    return res.render("download", { files });
  } catch (err) {
    console.error("Error loading download page:", err);
    return res.status(500).send("Server error");
  }
});

// Public download by filename (no auth)
router.get("/public/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    const fullPath = path.join(UPLOAD_DIR, filename);
    return res.download(fullPath, filename, (err) => {
      if (err) {
        console.error("Public download error:", err);
        if (!res.headersSent) return res.status(404).send("File not found");
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
