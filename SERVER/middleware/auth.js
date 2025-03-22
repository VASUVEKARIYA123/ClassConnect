const jwt = require("jsonwebtoken");
const student = require("../models/Student");
const faculty = require("../models/Faculty");

exports.auth = async (req, res, next) => {
  try {
    // console.log("in");
    
    const token = req.header("Authorization"); // Fix: Correctly retrieve token
    // console.log(req.header("Authorization"));
    
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }
    
    // console.log(req.header("Authorization"));
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    
    let user;
    if (decoded.role === "teacher" || decoded.role === "admin") {
      user = await faculty.findById(decoded.id).select("-password");
    } else {
      user = await student.findById(decoded.id).select("-password");
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = decoded;
    // console.log(req.user);
    
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
