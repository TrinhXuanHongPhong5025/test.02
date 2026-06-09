const db = require('../config/db');

class OrderRepository {
    async create(orderData) {
        const { user_id, total_amount, items } = orderData;
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            const [orderResult] = await connection.execute(
                'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
                [user_id, total_amount]
            );
            const orderId = orderResult.insertId;

            for (const item of items) {
                await connection.execute(
                    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderId, item.product_id, item.quantity, item.price]
                );
                // Update stock
                await connection.execute(
                    'UPDATE products SET stock = stock - ? WHERE id = ?',
                    [item.quantity, item.product_id]
                );
            }

            await connection.commit();
            return orderId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async findById(id) {
        const [rows] = await db.execute('SELECT * FROM orders WHERE id = ?', [id]);
        return rows[0];
    }

    async getItems(orderId) {
        const [rows] = await db.execute(
            'SELECT oi.*, p.name, p.image FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
            [orderId]
        );
        return rows;
    }

    async findByUserId(userId) {
        const [rows] = await db.execute('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        return rows;
    }

    async findAll() {
        const [rows] = await db.execute('SELECT o.*, u.fullname FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC');
        return rows;
    }

    async updateStatus(id, status) {
        await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    }

    async cancelOrder(id) {
        const [order] = await db.execute('SELECT * FROM orders WHERE id = ?', [id]);
        if (order[0].status !== 'pending') throw new Error('Cannot cancel order that is not pending');
        
        const [items] = await db.execute('SELECT * FROM order_items WHERE order_id = ?', [id]);
        
        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            await connection.execute('UPDATE orders SET status = "cancelled" WHERE id = ?', [id]);
            for (const item of items) {
                await connection.execute('UPDATE products SET stock = stock + ? WHERE id = ?', [item.quantity, item.product_id]);
            }
            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async getStats() {
        const [users] = await db.execute('SELECT COUNT(*) as total FROM users');
        const [orders] = await db.execute('SELECT COUNT(*) as total FROM orders');
        const [revenue] = await db.execute('SELECT SUM(total_amount) as total FROM orders WHERE status != "cancelled"');
        const [products] = await db.execute('SELECT COUNT(*) as total FROM products');
        
        return {
            totalUsers: users[0].total,
            totalOrders: orders[0].total,
            totalRevenue: revenue[0].total || 0,
            totalProducts: products[0].total
        };
    }
}

module.exports = new OrderRepository();
