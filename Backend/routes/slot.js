const express = require('express');
const { auth, adminAuth } = require('../middlewares/auth');
const {
  generateSlots,
  getTournamentSlots,
  updateMatchResult,
  getSlotsByUser
} = require('../controllers/slotController');

const router = express.Router();

// @route   POST /api/slots/generate/:tournamentId
// @desc    Generate slots for tournament
// @access  Private (Admin or Organizer)
router.post('/generate/:tournamentId', auth, generateSlots);

// @route   GET /api/slots/tournament/:tournamentId
// @desc    Get tournament slots
// @access  Public
router.get('/tournament/:tournamentId', getTournamentSlots);

// @route   PUT /api/slots/:slotId/matches/:matchId
// @desc    Update match result
// @access  Private (Admin)
router.put('/:slotId/matches/:matchId', adminAuth, updateMatchResult);

// @route   GET /api/slots/user
// @desc    Get user's slots
// @access  Private
router.get('/user', auth, getSlotsByUser);

module.exports = router;
