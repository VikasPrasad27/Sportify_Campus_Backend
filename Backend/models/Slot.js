const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  participant1: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'tournament.type'
  },
  participant2: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'tournament.type'
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'tournament.type'
  },
  score: {
    participant1Score: Number,
    participant2Score: Number
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  scheduledTime: Date,
  venue: String,
  round: Number,
  matchNumber: Number
});

const slotSchema = new mongoose.Schema({
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true
  },
  format: {
    type: String,
    enum: ['round-robin', 'knockout'],
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'tournament.type'
  }],
  matches: [matchSchema],
  currentRound: {
    type: Number,
    default: 1
  },
  totalRounds: Number,
  status: {
    type: String,
    enum: ['draft', 'active', 'completed'],
    default: 'draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Slot', slotSchema);
