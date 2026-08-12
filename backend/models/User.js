const mongoose = require("mongoose");

const skillSubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    proofUrl: { type: String, default: "" }, // optional certificate/portfolio link
  },
  { _id: false }
);

const availabilitySchema = new mongoose.Schema(
  {
    day: { type: String }, // e.g. "Monday"
    from: { type: String }, // e.g. "18:00"
    to: { type: String }, // e.g. "20:00"
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    avatarUrl: { type: String, default: "" },
    bio: { type: String, default: "" },
    city: { type: String, default: "" },
    timezone: { type: String, default: "" },

    skillsToTeach: [skillSubSchema],
    skillsToLearn: [skillSubSchema],
    availability: [availabilitySchema],

    role: { type: String, enum: ["user", "admin"], default: "user" },

    badges: {
      verifiedTeacher: { type: Boolean, default: false },
      peerRated: { type: Boolean, default: false },
    },

    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    sessionsCompleted: { type: Number, default: 0 },

    isBlocked: { type: Boolean, default: false },
    reportCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
