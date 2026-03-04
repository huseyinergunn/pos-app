const User = require("../models/User.js");
const { verifyToken } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();


router.get("/", verifyToken, async (req, res) => {
  const userId = req.user.id; 
  
  try {
    const user = await User.findById(userId).select("-password"); 
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;