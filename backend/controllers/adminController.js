const User = require("../models/User");
const Match = require("../models/Match");
const Session = require("../models/Session");
const Report = require("../models/Report");

// @route GET /api/admin/overview
const getOverview = async (req, res) => {
  try {
    const [totalUsers, activeSessions, totalMatches, pendingReports] = await Promise.all([
      User.countDocuments(),
      Session.countDocuments({ status: "Upcoming" }),
      Match.countDocuments(),
      Report.countDocuments({ status: "Pending" }),
    ]);

    // Top skills by frequency across skillsToTeach
    const topSkillsAgg = await User.aggregate([
      { $unwind: "$skillsToTeach" },
      { $group: { _id: "$skillsToTeach.name", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      totalUsers,
      activeSessions,
      totalMatches,
      pendingReports,
      topSkills: topSkillsAgg.map((s) => ({ skill: s._id, count: s.count })),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load overview", error: err.message });
  }
};

// @route GET /api/admin/users
const listUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

// @route PATCH /api/admin/users/:id/block
const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to update user", error: err.message });
  }
};

// @route PATCH /api/admin/users/:id/verify
const verifyTeacher = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { "badges.verifiedTeacher": true },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to verify user", error: err.message });
  }
};

// @route GET /api/admin/reports
const listReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reporter", "name email")
      .populate("reportedUser", "name email")
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reports", error: err.message });
  }
};

// @route PATCH /api/admin/reports/:id
const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: "Failed to update report", error: err.message });
  }
};

module.exports = {
  getOverview,
  listUsers,
  toggleBlockUser,
  verifyTeacher,
  listReports,
  updateReportStatus,
};
