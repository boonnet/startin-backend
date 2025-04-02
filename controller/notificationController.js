const Notification = require('../model/notification.js');
const User = require('../model/user.js');

// Create a new notification
const addNotification = async (req, res) => {
    try {
        const { title, message } = req.body;

        if (!title || !message) {
            return res.status(400).json({
                status: 'error',
                message: 'Title and message are required'
            });
        }

        // Fetch all users
        const users = await User.findAll({ attributes: ['uid'] });

        // Create notifications for each user
        const notifications = users.map(user => ({
            user_id: user.uid, 
            title,
            message
        }));

        // Bulk insert notifications
        await Notification.bulkCreate(notifications);

        res.status(201).json({
            status: 'success',
            message: 'Notifications sent to all users'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

module.exports = { addNotification };


// Get all notifications (with optional user filter)
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            include: [{
                model: User,
                as: 'user',
                attributes: ['username', 'email']
            }],
            where: req.query.user_id ? { user_id: req.query.user_id } : {},
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({
            status: 'success',
            data: notifications
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get notification by ID
const getNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findByPk(req.params.id, {
            include: [{
                model: User,
                as: 'user',
                attributes: ['username', 'email']
            }]
        });
        
        if (!notification) {
            return res.status(404).json({
                status: 'error',
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: notification
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Update notification
const editNotification = async (req, res) => {
    try {
        const notification = await Notification.findByPk(req.params.id);
        
        if (!notification) {
            return res.status(404).json({
                status: 'error',
                message: 'Notification not found'
            });
        }

        await notification.update(req.body);
        
        res.status(200).json({
            status: 'success',
            data: notification
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Delete notification
const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByPk(req.params.id);
        
        if (!notification) {
            return res.status(404).json({
                status: 'error',
                message: 'Notification not found'
            });
        }

        await notification.destroy();
        
        res.status(200).json({
            status: 'success',
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

const changeMarkAsRead = async (req, res) => {
    const user_id = req.body.user_id;
    try {
        const notifications = await Notification.findAll({
            where: {
                user_id: user_id,
                is_read: false
            }
        });

        if (!notifications || notifications.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Notifications not found'
            });
        }

        // Update all unread notifications for the user
        await Notification.update(
            { is_read: true },
            { where: { user_id: user_id, is_read: false } }
        );

        res.status(200).json({
            status: 'success',
            message: 'Notifications marked as read'
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};


module.exports = {
    addNotification,
    getNotifications,
    getNotificationById,
    editNotification,
    deleteNotification,
    changeMarkAsRead
};