const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');

// @desc    Get categories
// @route   GET /api/categories
// @access  Private
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({ user: req.user.id });
    res.status(200).json(categories);
});

// @desc    Add category
// @route   POST /api/categories
// @access  Private
const addCategory = asyncHandler(async (req, res) => {
    const { name, type, color } = req.body;

    if (!name || !type) {
        res.status(400);
        throw new Error('Please add name and type');
    }

    const category = await Category.create({
        user: req.user.id,
        name,
        type,
        color
    });

    res.status(200).json(category);
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }

    if (category.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await category.deleteOne();

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getCategories,
    addCategory,
    deleteCategory
};
