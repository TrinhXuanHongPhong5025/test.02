const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', orderController.createOrder);
router.get('/my-orders', orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/cancel', orderController.cancelOrder);

// Admin routes
router.get('/', adminMiddleware, orderController.getAllOrders);
router.put('/:id/status', adminMiddleware, orderController.updateOrderStatus);
router.get('/admin/stats', adminMiddleware, orderController.getStats);

module.exports = router;
