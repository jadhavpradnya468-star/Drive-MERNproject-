// routes/user.routes.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "secretKey123";

// Register (works for both /user/register (form) and /api/users/register (json))
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      // if form, redirect back with message; but here return JSON
      return res.status(400).json({ msg: "Missing fields" });
    }

    let existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({ username, email, password: hashed });
    await user.save();

    // if form submission (from browser), you might want to redirect instead
    if (req.originalUrl.startsWith("/user")) {
      return res.redirect("/login");
    }

    const token = jwt.sign({ user: { id: user._id } }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Login (accept username OR email)
router.post("/login", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if ((!email && !username) || !password) return res.status(400).json({ msg: "Missing credentials" });

    const user = await User.findOne(email ? { email } : { username });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ user: { id: user._id } }, JWT_SECRET, { expiresIn: "7d" });

    // if POST from your logon form that expects redirect, redirect to home with token in cookie (optional)
    if (req.originalUrl.startsWith("/user")) {
      // set token as httpOnly cookie and redirect
      res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
      return res.redirect("/");
    }

    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
