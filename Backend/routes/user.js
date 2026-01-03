const express = require('express');
const { auth } = require('../middlewares/auth');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('registeredSports.tournament', 'name sport startDate endDate');
    
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, department, year } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, department, year },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/users/search
// @desc    Search users for team formation
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    const { query, sport } = req.query;
    
    const searchFilter = {
      $and: [
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { rollNumber: { $regex: query, $options: 'i' } }
          ]
        },
        { _id: { $ne: req.user.id } } // Exclude current user
      ]
    };

    // If sport is specified, exclude users already registered for that sport
    if (sport) {
      searchFilter.$and.push({
        'registeredSports.sport': { $ne: sport }
      });
    }

    const users = await User.find(searchFilter)
      .select('name rollNumber department year')
      .limit(10);

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
