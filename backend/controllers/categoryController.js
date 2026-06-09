const categoryService = require('../services/categoryService');

class CategoryController {
    async getAllCategories(req, res) {
        try {
            const categories = await categoryService.getAllCategories();
            res.json(categories);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getCategoryById(req, res) {
        try {
            const category = await categoryService.getCategoryById(req.params.id);
            res.json(category);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async createCategory(req, res) {
        try {
            const id = await categoryService.createCategory(req.body);
            res.status(201).json({ message: 'Category created successfully', id });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateCategory(req, res) {
        try {
            await categoryService.updateCategory(req.params.id, req.body);
            res.json({ message: 'Category updated successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteCategory(req, res) {
        try {
            await categoryService.deleteCategory(req.params.id);
            res.json({ message: 'Category deleted successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new CategoryController();
