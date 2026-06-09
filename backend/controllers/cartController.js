const cartService = require('../services/cartService');

class CartController {
    async getCart(req, res) {
        try {
            const cart = await cartService.getCart(req.user.id);
            res.json(cart);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async addToCart(req, res) {
        try {
            const { productId, quantity } = req.body;
            await cartService.addToCart(req.user.id, productId, quantity);
            res.json({ message: 'Added to cart successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateCartItem(req, res) {
        try {
            const { productId, quantity } = req.body;
            await cartService.updateCartItem(req.user.id, productId, quantity);
            res.json({ message: 'Cart updated successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async removeFromCart(req, res) {
        try {
            const { productId } = req.params;
            await cartService.removeFromCart(req.user.id, productId);
            res.json({ message: 'Removed from cart successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new CartController();
