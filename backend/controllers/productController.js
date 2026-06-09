const productService = require('../services/productService');

class ProductController {
    async getAllProducts(req, res) {
        try {
            const result = await productService.getAllProducts(req.query);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getProductById(req, res) {
        try {
            const product = await productService.getProductById(req.params.id);
            res.json(product);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async createProduct(req, res) {
        try {
            const productData = {
                ...req.body,
                image: req.file ? req.file.filename : req.body.image
            };
            const id = await productService.createProduct(productData);
            res.status(201).json({ message: 'Product created successfully', id });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const productData = {
                ...req.body,
                image: req.file ? req.file.filename : req.body.image
            };
            await productService.updateProduct(req.params.id, productData);
            res.json({ message: 'Product updated successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            await productService.deleteProduct(req.params.id);
            res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new ProductController();
