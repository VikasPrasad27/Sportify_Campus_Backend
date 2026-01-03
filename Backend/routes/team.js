const express = require("express")
const { auth } = require("../middlewares/auth")
const {
  createTeamAndRegister,
  registerIndividual,
  getTeamsByTournament,
  getCaptainTeams,
  updateTeam,
  deleteTeam,
} = require("../controllers/teamController")

const router = express.Router()

// @route   POST /api/teams/register-team
// @desc    Create team and register for tournament
// @access  Private
router.post("/register-team", auth, createTeamAndRegister)

// @route   POST /api/teams/register-individual
// @desc    Register individual for tournament
// @access  Private
router.post("/register-individual", auth, registerIndividual)

// @route   GET /api/teams/tournament/:tournamentId
// @desc    Get teams by tournament
// @access  Public
router.get("/tournament/:tournamentId", getTeamsByTournament)

// @route   GET /api/teams/captain
// @desc    Get captain's teams
// @access  Private
router.get("/captain", auth, getCaptainTeams)

// @route   PUT /api/teams/:teamId
// @desc    Update team members
// @access  Private (Captain only)
router.put("/:teamId", auth, updateTeam)

// @route   DELETE /api/teams/:teamId
// @desc    Delete team
// @access  Private (Captain only)
router.delete("/:teamId", auth, deleteTeam)

module.exports = router
