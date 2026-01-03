const express = require('express');
const { auth } = require('../middlewares/auth');
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notificationController');

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get all notifications for authenticated user
// @access  Private
router.get('/', auth, getNotifications);

// @route   GET /api/notifications/unread-count
// @desc    Get unread notification count
// @access  Private
router.get('/unread-count', auth, getUnreadCount);

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', auth, markAsRead);

// @route   PUT /api/notifications/mark-all-read
// @desc    Mark all notifications as read
// @access  Private
router.put('/mark-all-read', auth, markAllAsRead);

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', auth, deleteNotification);

module.exports = router;

