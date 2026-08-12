const express = require("express");
const router = express.Router();
const { getMessages, sendMessage } = require("../controllers/messageController");
const { protect } = require("../middleware/auth");

router.get("/:matchId", protect, getMessages);
router.post("/:matchId", protect, sendMessage);

module.exports = router;
