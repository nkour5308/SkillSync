const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    match: { type: mongoose.Schema.Types.ObjectId, ref: "Match", required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],

    skill: { type: String, required: true },
    scheduledAt: { type: Date, required: true },
    durationMinutes: { type: Number, default: 60 },

    meetingLink: { type: String, default: "" }, // Zoom/Meet placeholder link

    status: {
      type: String,
      enum: ["Upcoming", "Completed", "Cancelled"],
      default: "Upcoming",
    },

    notes: { type: String, default: "" },
    resources: [{ type: String }], // links or file references

    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
