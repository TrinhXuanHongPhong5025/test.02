const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');

class UserService {
    async getProfile(id) {
        return await userRepository.findById(id);
    }

    async updateProfile(id, fullname) {
        return await userRepository.updateProfile(id, fullname);
    }

    async changePassword(id, oldPassword, newPassword) {
        const user = await userRepository.findById(id);
        const dbUser = await userRepository.findByEmail(user.email); // Need full user with password
        
        const isMatch = await bcrypt.compare(oldPassword, dbUser.password);
        if (!isMatch) throw new Error('Incorrect old password');

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        return await userRepository.updatePassword(id, hashedPassword);
    }
}

module.exports = new UserService();
