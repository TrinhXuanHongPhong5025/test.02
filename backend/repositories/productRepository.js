const db = require('../config/db');

class ProductRepository {
    async findAll(page = 1, limit = 10, search = '', categoryId = null) {
        const offset = (page - 1) * limit;
        let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1';
        const params = [];

        if (search) {
            query += ' AND p.name LIKE ?';
            params.push(`%${search}%`);
        }

        if (categoryId) {
            query += ' AND p.category_id = ?';
            params.push(categoryId);
        }

        query += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [rows] = await db.execute(query, params);
        return rows;
    }

    async findById(id) {
        const [rows] = await db.execute('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?', [id]);
        return rows[0];
    }

    async create(productData) {
        const { name, description, price, stock, image, category_id } = productData;
        const [result] = await db.execute(
            'INSERT INTO products (name, description, price, stock, image, category_id) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, price, stock, image, category_id]
        );
        return result.insertId;
    }

    async update(id, productData) {
        const { name, description, price, stock, image, category_id } = productData;
        await db.execute(
            'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, image = ?, category_id = ? WHERE id = ?',
            [name, description, price, stock, image, category_id, id]
        );
    }

    async delete(id) {
        await db.execute('DELETE FROM products WHERE id = ?', [id]);
    }

    async count(search = '', categoryId = null) {
        let query = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
        const params = [];

        if (search) {
            query += ' AND name LIKE ?';
            params.push(`%${search}%`);
        }

        if (categoryId) {
            query += ' AND category_id = ?';
            params.push(categoryId);
        }

        const [rows] = await db.execute(query, params);
        return rows[0].total;
    }
}

module.exports = new ProductRepository();
