const db = require('../config/db');

class UserRepository {
    async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    async findById(id) {
        const [rows] = await db.execute('SELECT id, fullname, email, role, created_at FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    async create(userData) {
        const { fullname, email, password, role } = userData;
        const [result] = await db.execute(
            'INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, ?)',
            [fullname, email, password, role || 'user']
        );
        return result.insertId;
    }

    async updateProfile(id, fullname) {
        await db.execute('UPDATE users SET fullname = ? WHERE id = ?', [fullname, id]);
    }

    async updatePassword(id, hashedPassword) {
        await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
    }

    async countUsers() {
        const [rows] = await db.execute('SELECT COUNT(*) as total FROM users');
        return rows[0].total;
    }
}

module.exports = new UserRepository();
