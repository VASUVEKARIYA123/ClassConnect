const express = require("express");
const { register, login, logout } = require("../controller/authController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.get("/check-auth", (req, res) => {
  if (req.cookies.token) {
    res.status(200).json({ message: "Authenticated" });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
