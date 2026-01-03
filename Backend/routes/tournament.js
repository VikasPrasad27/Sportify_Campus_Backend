const express = require('express');
const { auth, adminAuth } = require('../middlewares/auth');
const { validateTournament } = require('../middlewares/validation');
const {
  createTournament,
  getAllTournaments,
  getTournamentById,
  updateTournament,
  getUpcomingTournaments,
  getPreviousWinners
} = require('../controllers/tournamentController');

const router = express.Router();

// @route   POST /api/tournaments
// @desc    Create a new tournament
// @access  Private (Admin only)
router.post('/', adminAuth, validateTournament, createTournament);

// @route   GET /api/tournaments
// @desc    Get all tournaments
// @access  Public
router.get('/', getAllTournaments);

// @route   GET /api/tournaments/upcoming
// @desc    Get upcoming tournaments
// @access  Public
router.get('/upcoming', getUpcomingTournaments);

// @route   GET /api/tournaments/winners
// @desc    Get previous winners
// @access  Public
router.get('/winners', getPreviousWinners);

// @route   GET /api/tournaments/:id
// @desc    Get tournament by ID
// @access  Public
router.get('/:id', getTournamentById);

// @route   PUT /api/tournaments/:id
// @desc    Update tournament
// @access  Private (Admin or Organizer)
router.put('/:id', auth, updateTournament);

module.exports = router;
