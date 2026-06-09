const userService = require('../services/userService');

class UserController {
    async getProfile(req, res) {
        try {
            const user = await userService.getProfile(req.user.id);
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateProfile(req, res) {
        try {
            const { fullname } = req.body;
            await userService.updateProfile(req.user.id, fullname);
            res.json({ message: 'Profile updated successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async changePassword(req, res) {
        try {
            const { oldPassword, newPassword } = req.body;
            await userService.changePassword(req.user.id, oldPassword, newPassword);
            res.json({ message: 'Password changed successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new UserController();
