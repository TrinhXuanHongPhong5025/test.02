const db = require('../config/db');

class CartRepository {
    async findByUserId(userId) {
        let [cart] = await db.execute('SELECT * FROM cart WHERE user_id = ?', [userId]);
        if (!cart[0]) {
            const [result] = await db.execute('INSERT INTO cart (user_id) VALUES (?)', [userId]);
            [cart] = await db.execute('SELECT * FROM cart WHERE id = ?', [result.insertId]);
        }
        return cart[0];
    }

    async getItems(cartId) {
        const [rows] = await db.execute(
            'SELECT ci.*, p.name, p.price, p.image FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.cart_id = ?',
            [cartId]
        );
        return rows;
    }

    async addItem(cartId, productId, quantity) {
        const [existing] = await db.execute(
            'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
            [cartId, productId]
        );

        if (existing[0]) {
            await db.execute(
                'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
                [quantity, existing[0].id]
            );
        } else {
            await db.execute(
                'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
                [cartId, productId, quantity]
            );
        }
    }

    async updateItem(cartId, productId, quantity) {
        await db.execute(
            'UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?',
            [quantity, cartId, productId]
        );
    }

    async removeItem(cartId, productId) {
        await db.execute(
            'DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?',
            [cartId, productId]
        );
    }

    async clearCart(cartId) {
        await db.execute('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
    }
}

module.exports = new CartRepository();
