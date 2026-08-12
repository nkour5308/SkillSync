const Review = require("../models/Review");
const User = require("../models/User");
const Session = require("../models/Session");

// @route POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { sessionId, revieweeId, rating, comment } = req.body;

    if (!sessionId || !revieweeId || !rating) {
      return res.status(400).json({ message: "sessionId, revieweeId and rating are required" });
    }

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    const review = await Review.create({
      session: sessionId,
      reviewer: req.user._id,
      reviewee: revieweeId,
      rating,
      comment: comment || "",
    });

    // Recalculate reviewee's average rating
    const revieweeReviews = await Review.find({ reviewee: revieweeId });
    const avg =
      revieweeReviews.reduce((sum, r) => sum + r.rating, 0) / revieweeReviews.length;

    const updates = {
      ratingAverage: avg,
      ratingCount: revieweeReviews.length,
    };
    if (revieweeReviews.length >= 3 && avg >= 4) {
      updates["badges.peerRated"] = true;
    }

    await User.findByIdAndUpdate(revieweeId, updates);

    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "You already reviewed this session" });
    }
    res.status(500).json({ message: "Failed to submit review", error: err.message });
  }
};

// @route GET /api/reviews/user/:id
const getReviewsForUser = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.id })
      .populate("reviewer", "name avatarUrl")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews", error: err.message });
  }
};

module.exports = { createReview, getReviewsForUser };
