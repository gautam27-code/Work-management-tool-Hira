// ============================
// Team Model
// ============================
// A team is a collaborative workspace.
// It has an owner, a list of members, and pending email invites.

const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    // Team name (required)
    name: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
    },

    // The user who created this team
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // All members of the team (includes the owner)
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Emails of users who have been invited but haven't joined yet
    inviteEmails: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
