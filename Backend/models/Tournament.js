const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  sport: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['individual', 'team'],
    required: true
  },
  format: {
    type: String,
    enum: ['round-robin', 'knockout'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  rules: [String],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  registrationStartDate: {
    type: Date,
    required: true
  },
  registrationEndDate: {
    type: Date,
    required: true
  },
  maxParticipants: {
    type: Number,
    required: true
  },
  maxTeamSize: {
    type: Number,
    default: 1
  },
  venue: {
    type: String,
    required: true
  },
  prizes: [{
    position: String,
    prize: String
  }],
  status: {
    type: String,
    enum: ['upcoming', 'registration-open', 'registration-closed', 'ongoing', 'completed'],
    default: 'upcoming'
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  runnerUp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  images: [String],
  year: {
    type: Number,
    default: new Date().getFullYear()
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tournament', tournamentSchema);
