// app.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./config/db");

connectDB();

const app = express();

// view engine + static
app.set("view engine", "ejs");


app.set("views", path.join(__dirname, "views"));

// render the register page at /user/register
app.get("/user/register", (req, res) => res.render("register"));

// render the login page at /user/login
app.get("/user/login", (req, res) => res.render("logon"));

// show home on both / and /home
app.get("/", (req, res) => res.render("home"));
app.get("/home", (req, res) => res.render("home"));

app.use("/api/files", require("./routes/fileRoutes"));


app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// body parsers (JSON for API, urlencoded for forms)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// simple request logger (helpful while debugging)
app.use((req, res, next) => {
  console.log("▶", req.method, req.originalUrl);
  next();
});

// Routes
// Serve EJS pages (if you want)
app.get("/", (req, res) => res.render("home"));
app.get("/register", (req, res) => res.render("register"));
app.get("/login", (req, res) => res.render("logon"));

// API + Form routes
app.use("/api/users", require("./routes/user.routes")); // API routes (POST /api/users/register, /api/users/login)
app.use("/user", require("./routes/user.routes"));      // form routes (POST /user/register, /user/login) — matches your forms
app.use("/api/files", require("./routes/fileRoutes"));  // protected API file routes
app.use("/", require("./routes/fileRoutes"));           // form upload route (POST /upload-file) — matches your form

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
