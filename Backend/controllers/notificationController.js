const Notification = require('../models/Notification');
const Tournament = require('../models/Tournament');
const Team = require('../models/Team');

// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { isRead, limit = 50 } = req.query;

    const query = { user: userId };
    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    const notifications = await Notification.find(query)
      .populate('tournament', 'name sport startDate venue')
      .populate('team', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await Notification.countDocuments({ 
      user: userId, 
      isRead: false 
    });

    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({ 
      _id: id, 
      user: userId 
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    res.json({ 
      message: 'Notification marked as read', 
      notification 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      { user: userId, isRead: false },
      { 
        $set: { 
          isRead: true, 
          readAt: new Date() 
        } 
      }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndDelete({ 
      _id: id, 
      user: userId 
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
};

