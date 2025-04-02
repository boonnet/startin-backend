const express = require('express');
const router = express.Router();
 
const categoryController = require('../controller/categoryController');
const { categoryValidator } = require('../validator/categoriesValidator');
 
router.post('/category/add', categoryValidator, categoryController.createCategory);
router.get('/category/all', categoryValidator, categoryController.getAllCategories);
router.get('/category/:id', categoryValidator, categoryController.getCategoryById);
router.put('/category/update/:id', categoryValidator, categoryController.updateCategory);
router.delete('/category/delete/:id', categoryValidator, categoryController.deleteCategory);
module.exports = router;