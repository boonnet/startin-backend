const express = require('express');
const router = express.Router();
 
const ratingController = require('../controller/ratingController');
 
router.post('/rating/add', ratingController.addRating);
router.get('/rating/all', ratingController.getRatings);
router.get('/rating/:id', ratingController.getRatingById);
router.put('/rating/update/:id', ratingController.editRating);
router.delete('/rating/delete/:id', ratingController.deleteRating);
module.exports = router;