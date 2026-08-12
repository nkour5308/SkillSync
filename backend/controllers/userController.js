const User = require("../models/User");

// @route GET /api/users/:id
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile", error: err.message });
  }
};

// @route PUT /api/users/profile  (update own profile)
const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "bio",
      "city",
      "timezone",
      "avatarUrl",
      "skillsToTeach",
      "skillsToLearn",
      "availability",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
};

// @route GET /api/users/explore
// Mutual-match logic (non-AI): find users where
//  - they can teach something I want to learn, OR
//  - they want to learn something I can teach
const exploreMatches = async (req, res) => {
  try {
    const me = req.user;
    const myTeachNames = me.skillsToTeach.map((s) => s.name.toLowerCase());
    const myLearnNames = me.skillsToLearn.map((s) => s.name.toLowerCase());

    const candidates = await User.find({
      _id: { $ne: me._id },
      isBlocked: false,
    });

    const results = candidates
      .map((candidate) => {
        const theirTeach = candidate.skillsToTeach.map((s) => s.name.toLowerCase());
        const theirLearn = candidate.skillsToLearn.map((s) => s.name.toLowerCase());

        const theyCanTeachMeWhatIWantToLearn = theirTeach.filter((s) =>
          myLearnNames.includes(s)
        );
        const iCanTeachThemWhatTheyWantToLearn = myTeachNames.filter((s) =>
          theirLearn.includes(s)
        );

        const isMutualMatch =
          theyCanTeachMeWhatIWantToLearn.length > 0 &&
          iCanTeachThemWhatTheyWantToLearn.length > 0;

        return {
          user: candidate,
          theyCanTeachMeWhatIWantToLearn,
          iCanTeachThemWhatTheyWantToLearn,
          isMutualMatch,
        };
      })
      // Show partial matches too (one-directional interest), mutual matches first
      .filter(
        (r) =>
          r.theyCanTeachMeWhatIWantToLearn.length > 0 ||
          r.iCanTeachThemWhatTheyWantToLearn.length > 0
      )
      .sort((a, b) => (b.isMutualMatch === a.isMutualMatch ? 0 : b.isMutualMatch ? 1 : -1));

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Failed to explore matches", error: err.message });
  }
};

module.exports = { getUserProfile, updateProfile, exploreMatches };
