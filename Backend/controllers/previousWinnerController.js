const PreviousWinner = require("../models/PreviousWinner")
const { uploadOnCloudinary, deleteFromCloudinary } = require("../utils/cloudinary")

// POST /api/previous-winners
// Admin: Add a previous winner with photos
const createPreviousWinner = async (req, res) => {
  try {
    const { sport, year, teamName, description, tournament } = req.body

    if (!sport || !year || !teamName) {
      return res.status(400).json({ message: "sport, year, and teamName are required" })
    }

    // Upload photos to Cloudinary
    const files = req.files || []
    const uploaded = []
    for (const f of files) {
      const result = await uploadOnCloudinary(f.path, "sportifycampus/winners")
      if (result) {
        uploaded.push({ url: result.secure_url, public_id: result.public_id })
      }
    }

    const doc = await PreviousWinner.create({
      sport,
      year: Number(year),
      teamName,
      description: description || "",
      tournament: tournament || undefined,
      photos: uploaded,
      addedBy: req.user.id,
    })

    const populated = await PreviousWinner.findById(doc._id)
      .populate("tournament", "name sport")
      .populate("addedBy", "name email")

    res.status(201).json({ message: "Previous winner added", winner: populated })
  } catch (error) {
    console.error("createPreviousWinner error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// GET /api/previous-winners
// Public: List previous winners with optional filters
const listPreviousWinners = async (req, res) => {
  try {
    const { year, sport, q, page = 1, limit = 20 } = req.query
    const filter = {}
    if (year) filter.year = Number(year)
    if (sport) filter.sport = sport

    if (q) {
      filter.$or = [{ teamName: { $regex: q, $options: "i" } }, { description: { $regex: q, $options: "i" } }]
    }

    const docs = await PreviousWinner.find(filter)
      .populate("tournament", "name sport")
      .sort({ year: -1, createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))

    const total = await PreviousWinner.countDocuments(filter)
    res.json({
      winners: docs,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// PUT /api/previous-winners/:id
// Admin: Update text fields and optionally add/remove photos
// Send new photos as multipart files (photos[]), and optionally "removePublicIds" as JSON array of public_ids to delete
const updatePreviousWinner = async (req, res) => {
  try {
    const { id } = req.params
    const { sport, year, teamName, description, tournament, removePublicIds } = req.body

    const winner = await PreviousWinner.findById(id)
    if (!winner) return res.status(404).json({ message: "Previous winner not found" })

    if (sport !== undefined) winner.sport = sport
    if (year !== undefined) winner.year = Number(year)
    if (teamName !== undefined) winner.teamName = teamName
    if (description !== undefined) winner.description = description
    if (tournament !== undefined) winner.tournament = tournament || undefined

    // Remove selected photos
    let removeList = []
    try {
      if (removePublicIds) {
        removeList = Array.isArray(removePublicIds) ? removePublicIds : JSON.parse(removePublicIds)
      }
    } catch (_) {
      // ignore parse errors
    }

    if (removeList.length) {
      for (const pid of removeList) {
        await deleteFromCloudinary(pid)
      }
      winner.photos = winner.photos.filter((p) => !removeList.includes(p.public_id))
    }

    // Add new uploaded photos
    const files = req.files || []
    for (const f of files) {
      const result = await uploadOnCloudinary(f.path, "sportifycampus/winners")
      if (result) {
        winner.photos.push({ url: result.secure_url, public_id: result.public_id })
      }
    }

    await winner.save()

    const populated = await PreviousWinner.findById(winner._id)
      .populate("tournament", "name sport")
      .populate("addedBy", "name email")

    res.json({ message: "Previous winner updated", winner: populated })
  } catch (error) {
    console.error("updatePreviousWinner error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// DELETE /api/previous-winners/:id
// Admin: Delete previous winner and all photos from Cloudinary
const deletePreviousWinner = async (req, res) => {
  try {
    const { id } = req.params
    const winner = await PreviousWinner.findById(id)
    if (!winner) return res.status(404).json({ message: "Previous winner not found" })

    // Delete photos from Cloudinary
    for (const p of winner.photos) {
      await deleteFromCloudinary(p.public_id)
    }

    await PreviousWinner.findByIdAndDelete(id)
    res.json({ message: "Previous winner deleted" })
  } catch (error) {
    console.error("deletePreviousWinner error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = {
  createPreviousWinner,
  listPreviousWinners,
  updatePreviousWinner,
  deletePreviousWinner,
}
