const Categories = require('../model/categories');

// Create Category
const createCategory = async (req, res) => {
    try {
        const { category_name } = req.body;
        const newCategory = await Categories.create({ category_name });
        res.status(201).json({ message: 'Category created successfully', data: newCategory });
    } catch (error) {
        res.status(500).json({ message: 'Error creating category', error: error.message });
    }
};

// Get All Categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Categories.findAll();
        res.status(200).json({ data: categories });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
};

// Get Category by ID
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Categories.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ data: category });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category', error: error.message });
    }
};

// Update Category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { category_name } = req.body;
        const category = await Categories.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await category.update({ category_name });
        res.status(200).json({ message: 'Category updated successfully', data: category });
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error: error.message });
    }
};

// Delete Category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Categories.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await category.destroy();
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
