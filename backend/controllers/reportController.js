const Report = require("../models/Report");
const User = require("../models/User");

// @route POST /api/reports
const createReport = async (req, res) => {
  try {
    const { reportedUserId, sessionId, reason, details } = req.body;
    if (!reportedUserId || !reason) {
      return res.status(400).json({ message: "reportedUserId and reason are required" });
    }

    const report = await Report.create({
      reporter: req.user._id,
      reportedUser: reportedUserId,
      session: sessionId || undefined,
      reason,
      details: details || "",
    });

    await User.findByIdAndUpdate(reportedUserId, { $inc: { reportCount: 1 } });

    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: "Failed to submit report", error: err.message });
  }
};

module.exports = { createReport };
