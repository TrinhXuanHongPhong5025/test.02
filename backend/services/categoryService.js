const categoryRepository = require('../repositories/categoryRepository');

class CategoryService {
    async getAllCategories() {
        return await categoryRepository.findAll();
    }

    async getCategoryById(id) {
        const category = await categoryRepository.findById(id);
        if (!category) throw new Error('Category not found');
        return category;
    }

    async createCategory(categoryData) {
        return await categoryRepository.create(categoryData);
    }

    async updateCategory(id, categoryData) {
        return await categoryRepository.update(id, categoryData);
    }

    async deleteCategory(id) {
        return await categoryRepository.delete(id);
    }
}

module.exports = new CategoryService();
