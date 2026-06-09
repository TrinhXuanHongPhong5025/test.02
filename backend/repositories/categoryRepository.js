const db = require('../config/db');

class CategoryRepository {
    async findAll() {
        const [rows] = await db.execute('SELECT * FROM categories');
        return rows;
    }

    async findById(id) {
        const [rows] = await db.execute('SELECT * FROM categories WHERE id = ?', [id]);
        return rows[0];
    }

    async create(categoryData) {
        const { name, description } = categoryData;
        const [result] = await db.execute(
            'INSERT INTO categories (name, description) VALUES (?, ?)',
            [name, description]
        );
        return result.insertId;
    }

    async update(id, categoryData) {
        const { name, description } = categoryData;
        await db.execute(
            'UPDATE categories SET name = ?, description = ? WHERE id = ?',
            [name, description, id]
        );
    }

    async delete(id) {
        await db.execute('DELETE FROM categories WHERE id = ?', [id]);
    }
}

module.exports = new CategoryRepository();
