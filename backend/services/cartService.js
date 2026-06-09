const cartRepository = require('../repositories/cartRepository');

class CartService {
    async getCart(userId) {
        const cart = await cartRepository.findByUserId(userId);
        const items = await cartRepository.getItems(cart.id);
        return { ...cart, items };
    }

    async addToCart(userId, productId, quantity) {
        const cart = await cartRepository.findByUserId(userId);
        return await cartRepository.addItem(cart.id, productId, quantity);
    }

    async updateCartItem(userId, productId, quantity) {
        const cart = await cartRepository.findByUserId(userId);
        return await cartRepository.updateItem(cart.id, productId, quantity);
    }

    async removeFromCart(userId, productId) {
        const cart = await cartRepository.findByUserId(userId);
        return await cartRepository.removeItem(cart.id, productId);
    }
}

module.exports = new CartService();
