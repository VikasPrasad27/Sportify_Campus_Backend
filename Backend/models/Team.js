const mongoose = require("mongoose")

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        rollNumber: {
          type: String,
          required: true,
          trim: true,
        },
        department: {
          type: String,
          required: true,
          trim: true,
        },
        year: {
          type: Number,
          required: true,
          min: 1,
          max: 4,
        },
        phone: {
          type: String,
          required: true,
        },
        position: {
          type: String,
          default: "Player",
        },
        isCaptain: {
          type: Boolean,
          default: false,
        },
      },
    ],
    sport: {
      type: String,
      required: true,
    },
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    maxMembers: {
      type: Number,
      required: true,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Validate team size
teamSchema.pre("save", function (next) {
  if (this.members.length > this.maxMembers) {
    return next(new Error("Team exceeds maximum member limit"))
  }
  this.isComplete = this.members.length === this.maxMembers
  next()
})

module.exports = mongoose.model("Team", teamSchema)
