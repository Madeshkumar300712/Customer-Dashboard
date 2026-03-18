const express = require("express");
const router = express.Router();
const { login, me } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/register", async (req, res) => {
  try {
    res.json({ message: "Register working ✅" });
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});
router.post("/login", login);
router.get("/me", protect, me);

router.get("/test", (req, res) => {
  res.send("Auth route working 🚀");
});

module.exports = router;