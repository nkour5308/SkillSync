const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // What the requester wants to learn from recipient, and offer to teach in return
    skillRequested: { type: String, required: true }, // recipient teaches this
    skillOffered: { type: String, required: true }, // requester teaches this in return

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Completed"],
      default: "Pending",
    },

    message: { type: String, default: "" },
  },
  { timestamps: true }
);

matchSchema.index({ requester: 1, recipient: 1, skillRequested: 1 });

module.exports = mongoose.model("Match", matchSchema);
