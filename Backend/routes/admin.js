const express = require('express');
const { adminAuth } = require('../middlewares/auth');
const Tournament = require('../models/Tournament');
const User = require('../models/User');
const Registration = require('../models/Registration');
const Team = require('../models/Team');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private (Admin only)
/*
{
    "message": "Server error",
    "error": "Cannot populate path `user` because it is not in your schema. Set the `strictPopulate` option to false to override."
}
*/
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalTournaments = await Tournament.countDocuments();
    const activeTournaments = await Tournament.countDocuments({ 
      status: { $in: ['registration-open', 'ongoing'] } 
    });
    const totalRegistrations = await Registration.countDocuments();

    const recentRegistrations = await Registration.find()
      .populate('captain', 'name rollNumber')
      .populate('tournament', 'name sport')
      .populate('team', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      stats: {
        totalUsers,
        totalTournaments,
        activeTournaments,
        totalRegistrations
      },
      recentRegistrations
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const filter = { role: 'student' };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/admin/users/:userId/status
// @desc    Update user status
// @access  Private (Admin only)
router.put('/users/:userId/status', adminAuth, async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/admin/tournaments/:tournamentId/winner
// @desc    Set tournament winner
// @access  Private (Admin only)
router.post('/tournaments/:tournamentId/winner', adminAuth, async (req, res) => {
  try {
    const { winnerId, runnerUpId, images } = req.body;
    
    const tournament = await Tournament.findByIdAndUpdate(
      req.params.tournamentId,
      { 
        winner: winnerId,
        runnerUp: runnerUpId,
        images: images || [],
        status: 'completed'
      },
      { new: true }
    ).populate('winner runnerUp', 'name rollNumber');

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    res.json({
      message: 'Tournament winner set successfully',
      tournament
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
