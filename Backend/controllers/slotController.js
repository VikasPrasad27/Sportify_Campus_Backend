const Slot = require('../models/Slot');
const Tournament = require('../models/Tournament');
const { generateRoundRobinSlots, generateKnockoutSlots } = require('../utils/slotGenerator');

const generateSlots = async (req, res) => {
  try {
    const { tournamentId } = req.params;

    const tournament = await Tournament.findById(tournamentId)
      .populate('participants')
      .populate('teams');

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Check if user is admin or tournament organizer
    if (req.user.role !== 'admin' && tournament.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to generate slots' });
    }

    const participants = tournament.type === 'individual' 
      ? tournament.participants 
      : tournament.teams;

    if (participants.length < 2) {
      return res.status(400).json({ message: 'At least 2 participants required' });
    }

    // Check if slots already exist
    const existingSlot = await Slot.findOne({ tournament: tournamentId });
    if (existingSlot) {
      return res.status(400).json({ message: 'Slots already generated for this tournament' });
    }

    let matches, totalRounds;

    if (tournament.format === 'round-robin') {
      const result = generateRoundRobinSlots(participants);
      matches = result.matches;
      totalRounds = result.totalRounds;
    } else {
      const result = generateKnockoutSlots(participants);
      matches = result.matches;
      totalRounds = result.totalRounds;
    }

    const slot = new Slot({
      tournament: tournamentId,
      format: tournament.format,
      participants: participants.map(p => p._id),
      matches,
      totalRounds,
      createdBy: req.user.id
    });

    await slot.save();

    const populatedSlot = await Slot.findById(slot._id)
      .populate('participants', 'name rollNumber')
      .populate('tournament', 'name sport');

    res.status(201).json({
      message: 'Slots generated successfully',
      slot: populatedSlot
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTournamentSlots = async (req, res) => {
  try {
    const { tournamentId } = req.params;

    const slot = await Slot.findOne({ tournament: tournamentId })
      .populate('participants', 'name rollNumber')
      .populate('tournament', 'name sport')
      .populate('matches.participant1', 'name')
      .populate('matches.participant2', 'name')
      .populate('matches.winner', 'name');

    if (!slot) {
      return res.status(404).json({ message: 'Slots not found for this tournament' });
    }

    res.json({ slot });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateMatchResult = async (req, res) => {
  try {
    const { slotId, matchId } = req.params;
    const { winnerId, participant1Score, participant2Score } = req.body;

    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    const match = slot.matches.id(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Update match result
    match.winner = winnerId;
    match.score = {
      participant1Score,
      participant2Score
    };
    match.status = 'completed';

    await slot.save();

    // If knockout format, generate next round matches
    if (slot.format === 'knockout' && match.round < slot.totalRounds) {
      // Logic to advance winner to next round would go here
    }

    res.json({
      message: 'Match result updated successfully',
      match
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getSlotsByUser = async (req, res) => {
  try {
    const slots = await Slot.find({
      participants: req.user.id
    })
    .populate('tournament', 'name sport startDate')
    .populate('participants', 'name rollNumber')
    .sort({ createdAt: -1 });

    res.json({ slots });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  generateSlots,
  getTournamentSlots,
  updateMatchResult,
  getSlotsByUser
};
