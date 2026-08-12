const express = require("express");
const router = express.Router();
const {
  createMatchRequest,
  getMyMatches,
  getMatchById,
  updateMatchStatus,
} = require("../controllers/matchController");
const { protect } = require("../middleware/auth");

router.post("/", protect, createMatchRequest);
router.get("/mine", protect, getMyMatches);
router.get("/:id", protect, getMatchById);
router.patch("/:id/status", protect, updateMatchStatus);

module.exports = router;
