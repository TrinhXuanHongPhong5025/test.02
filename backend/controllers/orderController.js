const orderService = require('../services/orderService');

class OrderController {
    async createOrder(req, res) {
        try {
            const id = await orderService.createOrder(req.user.id, req.body);
            res.status(201).json({ message: 'Order created successfully', id });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getOrderById(req, res) {
        try {
            const order = await orderService.getOrderById(req.params.id);
            res.json(order);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async getUserOrders(req, res) {
        try {
            const orders = await orderService.getUserOrders(req.user.id);
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getAllOrders(req, res) {
        try {
            const orders = await orderService.getAllOrders();
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateOrderStatus(req, res) {
        try {
            const { status } = req.body;
            await orderService.updateOrderStatus(req.params.id, status);
            res.json({ message: 'Order status updated successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async cancelOrder(req, res) {
        try {
            await orderService.cancelOrder(req.params.id);
            res.json({ message: 'Order cancelled successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getStats(req, res) {
        try {
            const stats = await orderService.getDashboardStats();
            res.json(stats);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new OrderController();
