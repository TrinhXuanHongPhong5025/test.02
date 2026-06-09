const orderRepository = require('../repositories/orderRepository');
const cartRepository = require('../repositories/cartRepository');

class OrderService {
    async createOrder(userId, orderData) {
        const cart = await cartRepository.findByUserId(userId);
        const cartItems = await cartRepository.getItems(cart.id);
        
        if (cartItems.length === 0) throw new Error('Cart is empty');

        const total_amount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const orderId = await orderRepository.create({
            user_id: userId,
            total_amount,
            items: cartItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price
            }))
        });

        await cartRepository.clearCart(cart.id);
        return orderId;
    }

    async getOrderById(id) {
        const order = await orderRepository.findById(id);
        if (!order) throw new Error('Order not found');
        const items = await orderRepository.getItems(id);
        return { ...order, items };
    }

    async getUserOrders(userId) {
        return await orderRepository.findByUserId(userId);
    }

    async getAllOrders() {
        return await orderRepository.findAll();
    }

    async updateOrderStatus(id, status) {
        return await orderRepository.updateStatus(id, status);
    }

    async cancelOrder(id) {
        return await orderRepository.cancelOrder(id);
    }

    async getDashboardStats() {
        return await orderRepository.getStats();
    }
}

module.exports = new OrderService();
