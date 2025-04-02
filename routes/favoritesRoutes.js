const express = require('express');
const router = express.Router();
 
const favoritesController = require('../controller/favoritesController');
 
router.post('/favorites/add', favoritesController.addFavorite);
router.get('/favorites/all', favoritesController.getFavorites);
router.get('/favorites/:id', favoritesController.getFavoriteById);
router.put('/favorites/update/:id', favoritesController.editFavorite);
router.delete('/favorites/delete/:id', favoritesController.deleteFavorite);
router.get('/favorites/check/course', favoritesController.checkCourseFavorite);
router.get('/favorites/check/template', favoritesController.checkTemplateFavorite);

module.exports = router;