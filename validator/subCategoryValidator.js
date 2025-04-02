const { body } = require('express-validator');

// Define your validators
const subCategoryValidator = [
    body('sub_category')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 3 }).withMessage('Category name must be at least 3 characters long')
        .isString().withMessage('Category name must be a string'),
]

module.exports = { subCategoryValidator };