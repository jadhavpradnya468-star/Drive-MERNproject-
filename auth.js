// middleware/auth.js
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "secretKey123";

module.exports = function (req, res, next) {
  // Accept "Authorization: Bearer <token>" or raw token
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ msg: "No token, authorization denied" });

  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, secret);
    // our payload was { user: { id: ... } }
    req.user = decoded.user || decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token invalid" });
  }
};
