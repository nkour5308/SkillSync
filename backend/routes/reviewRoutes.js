const express = require("express");
const router = express.Router();
const { createReview, getReviewsForUser } = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");

router.post("/", protect, createReview);
router.get("/user/:id", getReviewsForUser);

module.exports = router;
