const Match = require("../models/Match");

// @route POST /api/matches
const createMatchRequest = async (req, res) => {
  try {
    const { recipientId, skillRequested, skillOffered, message } = req.body;

    if (!recipientId || !skillRequested || !skillOffered) {
      return res.status(400).json({ message: "recipientId, skillRequested and skillOffered are required" });
    }

    if (recipientId === String(req.user._id)) {
      return res.status(400).json({ message: "You cannot match with yourself" });
    }

    const match = await Match.create({
      requester: req.user._id,
      recipient: recipientId,
      skillRequested,
      skillOffered,
      message: message || "",
    });

    res.status(201).json(match);
  } catch (err) {
    res.status(500).json({ message: "Failed to create match request", error: err.message });
  }
};

// @route GET /api/matches/mine
const getMyMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [{ requester: req.user._id }, { recipient: req.user._id }],
    })
      .populate("requester", "name avatarUrl ratingAverage")
      .populate("recipient", "name avatarUrl ratingAverage")
      .sort({ createdAt: -1 });

    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch matches", error: err.message });
  }
};

// @route GET /api/matches/:id
const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate("requester", "name avatarUrl ratingAverage bio")
      .populate("recipient", "name avatarUrl ratingAverage bio");

    if (!match) return res.status(404).json({ message: "Match not found" });
    res.json(match);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch match", error: err.message });
  }
};

// @route PATCH /api/matches/:id/status  { status: Accepted | Rejected | Completed }
const updateMatchStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["Accepted", "Rejected", "Completed"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: "Match not found" });

    const isParticipant =
      String(match.requester) === String(req.user._id) ||
      String(match.recipient) === String(req.user._id);
    if (!isParticipant) return res.status(403).json({ message: "Not your match" });

    match.status = status;
    await match.save();

    res.json(match);
  } catch (err) {
    res.status(500).json({ message: "Failed to update match", error: err.message });
  }
};

module.exports = { createMatchRequest, getMyMatches, getMatchById, updateMatchStatus };
