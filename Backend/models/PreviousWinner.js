const mongoose = require("mongoose")

const previousWinnerSchema = new mongoose.Schema(
  {
    sport: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    tournament: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament" }, // optional link
    teamName: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    photos: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
)

// For browsing, often queried by year/sport
previousWinnerSchema.index({ year: -1, sport: 1 })

module.exports = mongoose.model("PreviousWinner", previousWinnerSchema)
