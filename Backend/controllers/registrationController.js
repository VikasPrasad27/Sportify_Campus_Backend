const Registration = require("../models/Registration")
const Tournament = require("../models/Tournament")
const Team = require("../models/Team")
const mongoose = require("mongoose")

const getCaptainRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ captain: req.user.id })
      .populate("tournament", "name sport startDate endDate status")
      .populate("team", "name members")
      .sort({ createdAt: -1 })

    res.json({ registrations })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const getTournamentRegistrations = async (req, res) => {
  try {
    const { tournamentId } = req.params

    const registrations = await Registration.find({ tournament: tournamentId })
      .populate("captain", "name rollNumber department year phone email")
      .populate({
        path: "team",
        select: "name members sport",
      })
      .sort({ createdAt: -1 })

    res.json({ registrations })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const updateRegistrationStatus = async (req, res) => {
  try {
    const { registrationId } = req.params
    const { status } = req.body

    const registration = await Registration.findByIdAndUpdate(registrationId, { status }, { new: true })
      .populate("captain", "name email")
      .populate("tournament", "name sport")
      .populate("team", "name")

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" })
    }

    res.json({
      message: "Registration status updated successfully",
      registration,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const getRegistrationStats = async (req, res) => {
  try {
    const { tournamentId } = req.params

    const stats = await Registration.aggregate([
      { $match: { tournament: mongoose.Types.ObjectId(tournamentId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    const totalRegistrations = await Registration.countDocuments({ tournament: tournamentId })

    res.json({
      totalRegistrations,
      statusBreakdown: stats,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = {
  getCaptainRegistrations,
  getTournamentRegistrations,
  updateRegistrationStatus,
  getRegistrationStats,
}
