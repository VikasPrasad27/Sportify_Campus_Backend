const Tournament = require('../models/Tournament');
const Registration = require('../models/Registration');

const createTournament = async (req, res) => {
  try {
    const tournamentData = {
      ...req.body,
      organizer: req.user.id
    };

    const tournament = new Tournament(tournamentData);
    await tournament.save();

    res.status(201).json({
      message: 'Tournament created successfully',
      tournament
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllTournaments = async (req, res) => {
  try {
    const { status, sport, type } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (sport) filter.sport = sport;
    if (type) filter.type = type;

    const tournaments = await Tournament.find(filter)
      .populate('organizer', 'name email')
      .populate('participants', 'name rollNumber')
      .populate('teams', 'name')
      .sort({ createdAt: -1 });

    res.json({ tournaments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate('organizer', 'name email')
      .populate('participants', 'name rollNumber department year')
      .populate({
        path: 'teams',
        populate: {
          path: 'members.user captain',
          select: 'name rollNumber department year'
        }
      });

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    res.json({ tournament });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Check if user is organizer or admin
    if (tournament.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this tournament' });
    }

    const updatedTournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Tournament updated successfully',
      tournament: updatedTournament
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUpcomingTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find({
      status: { $in: ['upcoming', 'registration-open'] },
      startDate: { $gte: new Date() }
    })
    .populate('organizer', 'name')
    .sort({ startDate: 1 })
    .limit(10);

    res.json({ tournaments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPreviousWinners = async (req, res) => {
  try {
    const { year, sport } = req.query;
    const filter = { status: 'completed', winner: { $exists: true } };

    if (year) filter.year = parseInt(year);
    if (sport) filter.sport = sport;

    const tournaments = await Tournament.find(filter)
      .populate('winner', 'name rollNumber')
      .populate('runnerUp', 'name rollNumber')
      .select('name sport year winner runnerUp images prizes')
      .sort({ year: -1, createdAt: -1 });

    res.json({ tournaments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createTournament,
  getAllTournaments,
  getTournamentById,
  updateTournament,
  getUpcomingTournaments,
  getPreviousWinners
};
