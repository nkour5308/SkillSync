const express = require("express");
const router = express.Router();
const { getUserProfile, updateProfile, exploreMatches } = require("../controllers/userController");
const { protect } = require("../middleware/auth");

router.get("/explore", protect, exploreMatches);
router.put("/profile", protect, updateProfile);
router.get("/:id", protect, getUserProfile);

module.exports = router;
