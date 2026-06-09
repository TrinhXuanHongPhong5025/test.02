const productRepository = require('../repositories/productRepository');

class ProductService {
    async getAllProducts(query) {
        const { page, limit, search, categoryId } = query;
        const products = await productRepository.findAll(page, limit, search, categoryId);
        const total = await productRepository.count(search, categoryId);
        return {
            products,
            pagination: {
                total,
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                totalPages: Math.ceil(total / (limit || 10))
            }
        };
    }

    async getProductById(id) {
        const product = await productRepository.findById(id);
        if (!product) throw new Error('Product not found');
        return product;
    }

    async createProduct(productData) {
        return await productRepository.create(productData);
    }

    async updateProduct(id, productData) {
        return await productRepository.update(id, productData);
    }

    async deleteProduct(id) {
        return await productRepository.delete(id);
    }
}

module.exports = new ProductService();
