const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');
const { validateUUIDParam } = require('../middlewares/validationMiddleware');

/**
 * @route   GET /api/notifications
 * @desc    Get all notifications for current user
 * @access  Private
 * @query   page, limit, isRead, type, priority
 */
router.get('/', protect, notificationController.getMyNotifications);

/**
 * @route   GET /api/notifications/unread-count
 * @desc    Get unread notification count
 * @access  Private
 */
router.get('/unread-count', protect, notificationController.getUnreadCount);

/**
 * @route   GET /api/notifications/preferences
 * @desc    Get notification preferences
 * @access  Private
 */
router.get('/preferences', protect, notificationController.getPreferences);

/**
 * @route   POST /api/notifications/mark-all-read
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.post('/mark-all-read', protect, notificationController.markAllAsRead);

/**
 * @route   DELETE /api/notifications/delete-all-read
 * @desc    Delete all read notifications
 * @access  Private
 */
router.delete('/delete-all-read', protect, notificationController.deleteAllRead);

/**
 * @route   GET /api/notifications/:id
 * @desc    Get notification by ID
 * @access  Private
 */
router.get('/:id', protect, validateUUIDParam('id'), notificationController.getNotificationById);

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.put('/:id/read', protect, validateUUIDParam('id'), notificationController.markAsRead);

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete notification
 * @access  Private
 */
router.delete('/:id', protect, validateUUIDParam('id'), notificationController.deleteNotification);

module.exports = router;