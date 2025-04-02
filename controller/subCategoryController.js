const SubCategories = require('../model/subCategory');

// Create a new subcategory
exports.createSubCategory = async (req, res) => {
  try {
    const { sub_category } = req.body;
    if (!sub_category) {
      return res.status(400).json({ message: 'Subcategory name is required' });
    }
    const newSubCategory = await SubCategories.create({ sub_category });
    res.status(201).json(newSubCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating subcategory', error });
  }
};

// Get all subcategories
exports.getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategories.findAll();
    res.status(200).json(subCategories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subcategories', error });
  }
};

// Get a subcategory by ID
exports.getSubCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await SubCategories.findByPk(id);
    if (!subCategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    res.status(200).json(subCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subcategory', error });
  }
};

// Update a subcategory
exports.updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { sub_category } = req.body;
    const subCategory = await SubCategories.findByPk(id);
    if (!subCategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    await subCategory.update({ sub_category });
    res.status(200).json({ message: 'Subcategory updated successfully', subCategory });
  } catch (error) {
    res.status(500).json({ message: 'Error updating subcategory', error });
  }
};

// Delete a subcategory
exports.deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await SubCategories.findByPk(id);
    if (!subCategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    await subCategory.destroy();
    res.status(200).json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting subcategory', error });
  }
};
