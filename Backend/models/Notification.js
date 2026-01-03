const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  type: {
    type: String,
    enum: ['tournament-reminder-10days', 'tournament-reminder-1day'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ tournament: 1, type: 1 });

module.exports = mongoose.model('Notification', notificationSchema);

