const Session = require("../models/Session");
const Match = require("../models/Match");
const User = require("../models/User");

// @route POST /api/sessions
const createSession = async (req, res) => {
  try {
    const { matchId, skill, scheduledAt, durationMinutes, meetingLink } = req.body;

    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: "Match not found" });
    if (match.status !== "Accepted") {
      return res.status(400).json({ message: "Match must be accepted before scheduling a session" });
    }

    const session = await Session.create({
      match: matchId,
      participants: [match.requester, match.recipient],
      skill,
      scheduledAt,
      durationMinutes: durationMinutes || 60,
      meetingLink: meetingLink || "https://meet.google.com/placeholder-link",
    });

    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: "Failed to create session", error: err.message });
  }
};

// @route GET /api/sessions/mine
const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({ participants: req.user._id })
      .populate("participants", "name avatarUrl")
      .populate("match")
      .sort({ scheduledAt: 1 });

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sessions", error: err.message });
  }
};

// @route PATCH /api/sessions/:id
const updateSession = async (req, res) => {
  try {
    const { status, notes, resources } = req.body;
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    const isParticipant = session.participants.some(
      (p) => String(p) === String(req.user._id)
    );
    if (!isParticipant) return res.status(403).json({ message: "Not your session" });

    if (status) session.status = status;
    if (notes !== undefined) session.notes = notes;
    if (resources !== undefined) session.resources = resources;

    await session.save();

    // Bump sessionsCompleted counters when marked Completed
    if (status === "Completed") {
      await User.updateMany(
        { _id: { $in: session.participants } },
        { $inc: { sessionsCompleted: 1 } }
      );
    }

    res.json(session);
  } catch (err) {
    res.status(500).json({ message: "Failed to update session", error: err.message });
  }
};

module.exports = { createSession, getMySessions, updateSession };
