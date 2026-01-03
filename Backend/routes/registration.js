const express = require("express")
const { auth, adminAuth } = require("../middlewares/auth")
const {
  getCaptainRegistrations,
  getTournamentRegistrations,
  updateRegistrationStatus,
  getRegistrationStats,
} = require("../controllers/registrationController")

const router = express.Router()

// @route   GET /api/registrations/captain
// @desc    Get captain's registrations
// @access  Private
router.get("/captain", auth, getCaptainRegistrations)

// @route   GET /api/registrations/tournament/:tournamentId
// @desc    Get tournament registrations
// @access  Private (Admin)
router.get("/tournament/:tournamentId", adminAuth, getTournamentRegistrations)

// @route   GET /api/registrations/tournament/:tournamentId/stats
// @desc    Get tournament registration statistics
// @access  Private (Admin)
router.get("/tournament/:tournamentId/stats", adminAuth, getRegistrationStats)

// @route   PUT /api/registrations/:registrationId/status
// @desc    Update registration status
// @access  Private (Admin)
router.put("/:registrationId/status", adminAuth, updateRegistrationStatus)

module.exports = router
