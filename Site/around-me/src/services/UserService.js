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
            return await this.makeRequest('/User/get');
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

    /**
     * @param {Object} userData
     * @param {string} userData.name
     * @param {string} [userData.passwordOld]
     * @param {string} [userData.passwordNew]
     * @returns {Promise<void>}
     * @throws {Error} When the old password is incorrect or other errors occur
     */
    async editUser(userData) {
        try {
            await this.makeRequest('/User/edit', {
                method: 'PATCH',
                body: JSON.stringify(userData)
            });
        } catch (error) {
            console.error('Error editing user:', error);
            throw error;
        }
    }

    /**
     * Установить режим инкогнито для пользователя
     * @param {boolean} enabled
     * @returns {Promise<void>}
     */
    async setIncognitoMode(enabled) {
        try {console.error('Error setting incognito mode:', enabled);
            await this.makeRequest('/User/incognito', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(enabled)
            });
        } catch (error) {
            console.error('Ошибка при установке инкогнито:', error);
            throw error;
        }
    }

    /**
     * Получить места пользователя
     * @param {number} [skip=0]
     * @param {number} [take=50]
     * @returns {Promise<Array>}
     */
    async getMyPlaces(skip = 0, take = 50) {
        try {
            return await this.makeRequest(`/Place/my?skip=${skip}&take=${take}`, {
                method: 'GET'
            });
        } catch (error) {
            console.error('Ошибка при получении мест пользователя:', error);
            throw error;
        }
    }
}

export default new UserService(); 