import BaseService from './BaseService';

class UserService extends BaseService {
    /**
     * @param {import('../Models/User').UserLoginRequest} loginData
     * @returns {Promise<import('../Models/User').UserResponse>}
     */
    async login(loginData) {
        try {
            return await this.makeRequest('/User/login', {
                method: 'POST',
                body: JSON.stringify(loginData)
            });
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }

    /**
     * @param {import('../Models/User').UserRegisterRequest} registerData
     * @returns {Promise<import('../Models/User').UserResponse>}
     */
    async register(registerData) {
        try {
            return await this.makeRequest('/User/register', {
                method: 'POST',
                body: JSON.stringify(registerData)
            });
        } catch (error) {
            console.error('Error during registration:', error);
            throw error;
        }
    }

    /**
     * @param {string} token
     * @returns {Promise<import('../Models/User').UserProfile>}
     */
    async getUserProfile(token) {
        try {
            return await this.makeRequest('/User/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    }

    /**
     * @param {Partial<import('../Models/User').UserProfile>} updateData
     * @returns {Promise<import('../Models/User').UserProfile>}
     */
    async updateProfile(updateData) {
        try {
            return await this.makeRequest('/User/profile/update', {
                method: 'PUT',
                body: JSON.stringify(updateData)
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }

    /**
     * @param {string} userId
     * @param {import('../Models/User').UpdateAvatarRequest} avatarData
     * @returns {Promise<{ avatarUrl: string, thumbnailUrl: string }>}
     */
    async updateAvatar(userId, avatarData) {
        // TODO: Реализовать реальный API запрос
        return {
            avatarUrl: 'https://example.com/avatars/fake-avatar.jpg',
            thumbnailUrl: 'https://example.com/avatars/fake-avatar-thumb.jpg'
        };
    }

    /**
     * @param {string} userId
     * @returns {Promise<void>}
     */
    async deleteAvatar(userId) {
        // TODO: Реализовать реальный API запрос
        return Promise.resolve();
    }

    /**
     * @returns {Promise<void>}
     */
    async logout() {
        // TODO: Реализовать реальный API запрос
        localStorage.removeItem('authToken');
        return Promise.resolve();
    }
}

export default new UserService(); 