const authService = require('../services/authService');

class AuthController {
    async register(req, res) {
        try {
            const result = await authService.register(req.body);
            res.status(201).json({ message: 'User registered successfully', ...result });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            res.json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new AuthController();
