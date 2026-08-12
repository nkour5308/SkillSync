const Message = require("../models/Message");
const Match = require("../models/Match");

// @route GET /api/messages/:matchId
const getMessages = async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId);
    if (!match) return res.status(404).json({ message: "Match not found" });
    if (match.status !== "Accepted" && match.status !== "Completed") {
      return res.status(403).json({ message: "Chat opens only after match is accepted" });
    }

    const messages = await Message.find({ match: req.params.matchId })
      .populate("sender", "name avatarUrl")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages", error: err.message });
  }
};

// @route POST /api/messages/:matchId
const sendMessage = async (req, res) => {
  try {
    const { text, fileUrl, fileType } = req.body;

    const match = await Match.findById(req.params.matchId);
    if (!match) return res.status(404).json({ message: "Match not found" });
    if (match.status !== "Accepted" && match.status !== "Completed") {
      return res.status(403).json({ message: "Chat opens only after match is accepted" });
    }

    const message = await Message.create({
      match: req.params.matchId,
      sender: req.user._id,
      text: text || "",
      fileUrl: fileUrl || "",
      fileType: fileType || "",
      readBy: [req.user._id],
    });

    const populated = await message.populate("sender", "name avatarUrl");

    // If socket.io instance is attached to app, emit to the match room
    const io = req.app.get("io");
    if (io) io.to(`match:${req.params.matchId}`).emit("newMessage", populated);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Failed to send message", error: err.message });
  }
};

module.exports = { getMessages, sendMessage };
