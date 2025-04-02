const express = require('express');
const router = express.Router();
 
const notificationController = require('../controller/notificationController');
 
router.post('/notification/add', notificationController.addNotification);
router.get('/notification/all', notificationController.getNotifications);
router.get('/notification/:id', notificationController.getNotificationById);
router.put('/notification/update/:id', notificationController.editNotification);
router.delete('/notification/delete/:id', notificationController.deleteNotification);
router.put('/notification/mark-read', notificationController.changeMarkAsRead);

module.exports = router;