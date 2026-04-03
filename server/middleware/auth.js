const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  // ✅ REMOVE "Bearer "
  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    req.user = decoded;
    next();
  } catch (err) {
    console.log("Auth error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};