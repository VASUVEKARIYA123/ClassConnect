const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const faculty = require("../models/Faculty");
const Student = require("../models/Student");

// User Registration
const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!["teacher", "student"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    if (role === "teacher") {
      newUser = new faculty({ username, email, password: hashedPassword, role });
    } else {
      return res.status(400).json({ message: "Students should be registered separately." });
    }

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User Login
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    let user = null;

    if (role === "teacher") {
      user = await faculty.findOne({ email });
    } else {
      // console.log(email);
      // console.log(password);
      const hashedPassword = await bcrypt.hash(password,10);

      // console.log(hashedPassword);
      // const isMatch = await bcrypt.compare(password, hashedPassword);
      // console.log(isMatch+"aaa");
      user = await Student.findOne({ studentId: email }); // Fix: Use studentId
      user.role="student"
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials 111111" });
    }
    
    // console.log(user);
    
    
    // Fix: Ensure correct password comparison for students using birthDate
    const isMatch = await bcrypt.compare(password, user.password); // Password stored as hashed birthDate

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials 22222222" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Store token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Login successful", token, user: { id: user._id, role: user.role, name: (user.firstname+" "+user.lastname) } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User Logout
const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully!" });
};

module.exports = {
  register,
  login,
  logout
};
