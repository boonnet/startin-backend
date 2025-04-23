const express = require('express');
const router = express.Router();
 
const subscriptionController = require('../controller/subscriptionController');
 
router.post('/subscription/add', subscriptionController.addSubscription);
router.get('/subscription/all', subscriptionController.getSubscriptions);
router.get('/subscription/:id', subscriptionController.getSubscriptionById);
router.put('/subscription/update/:id', subscriptionController.editSubscription);
router.delete('/subscription/delete/:id', subscriptionController.deleteSubscription);

module.exports = router;