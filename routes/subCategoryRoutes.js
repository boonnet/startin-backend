const express = require('express');
const router = express.Router();
 
const subCategoryController = require('../controller/subCategoryController');
const { subCategoryValidator } = require('../validator/subCategoryValidator');
 
router.post('/sub_category/add', subCategoryValidator, subCategoryController.createSubCategory);
router.get('/sub_category/all', subCategoryValidator, subCategoryController.getAllSubCategories);
router.get('/sub_category/:id', subCategoryValidator, subCategoryController.getSubCategoryById);
router.put('/sub_category/update/:id', subCategoryValidator, subCategoryController.updateSubCategory);
router.delete('/sub_category/delete/:id', subCategoryValidator, subCategoryController.deleteSubCategory);
module.exports = router;