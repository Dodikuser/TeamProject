import BaseService from './BaseService';

class UserService extends BaseService {
    /**
     * @param {import('../Models/User').UserLoginRequest} loginData
     * @returns {Promise<import('../Models/User').UserResponse>}
     */
    async login(loginData) {
        try {
            const data = await this.makeRequest('/User/login', {
                method: 'POST',
                body: JSON.stringify(loginData)
            }, false);

            if (data.token) {
                localStorage.setItem('authToken', data.token);
            }
            return data;
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
            }, false);
        } catch (error) {
            console.error('Error during registration:', error);
            throw error;
        }
    }

    /**
     * @returns {Promise<import('../Models/User').UserProfile>}
     */
    async getUserProfile() {
        try {
            return await this.makeRequest('/User/profile');
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
        try {
            return await this.makeRequest(`/User/${userId}/avatar`, {
                method: 'PUT',
                body: JSON.stringify(avatarData)
            });
        } catch (error) {
            console.error('Error updating avatar:', error);
            throw error;
        }
    }

    /**
     * @param {string} userId
     * @returns {Promise<void>}
     */
    async deleteAvatar(userId) {
        try {
            await this.makeRequest(`/User/${userId}/avatar`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Error deleting avatar:', error);
            throw error;
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async logout() {
        try {
            await this.makeRequest('/User/logout', {
                method: 'POST'
            });
            localStorage.removeItem('authToken');
        } catch (error) {
            console.error('Error during logout:', error);
            throw error;
        }
    }

    /**
     * @returns {Promise<import('../Models/User').UserProfile>}
     */
    async getUserData() {
        try {
            return await this.makeRequest('/User/get', {
                method: 'POST'
            });
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    }
}

export default new UserService(); 