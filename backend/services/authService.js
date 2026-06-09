const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
    async register(userData) {
        const existingUser = await userRepository.findByEmail(userData.email);
        if (existingUser) throw new Error('Email already exists');

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const userId = await userRepository.create({
            ...userData,
            password: hashedPassword
        });

        return { userId };
    }

    async login(email, password) {
        const user = await userRepository.findByEmail(email);
        if (!user) throw new Error('Invalid credentials');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Invalid credentials');

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return {
            token,
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                role: user.role
            }
        };
    }
}

module.exports = new AuthService();
