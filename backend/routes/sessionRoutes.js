const express = require("express");
const router = express.Router();
const { createSession, getMySessions, updateSession } = require("../controllers/sessionController");
const { protect } = require("../middleware/auth");

router.post("/", protect, createSession);
router.get("/mine", protect, getMySessions);
router.patch("/:id", protect, updateSession);

module.exports = router;
