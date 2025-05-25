import BaseService from './BaseService';

const API_BASE_URL = 'https://localhost:7103/api';

class FavoriteService extends BaseService {
    /**
     * @param {Object} params
     * @param {number} [params.skip]
     * @param {number} [params.take]
     * @returns {Promise<import('../Models/Favorite').FavoritesResponse>}
     */
    async getFavorites({ skip = 0, take = 10 } = {}) {
        try {
            return await this.makeRequest(`/Favorites/get?skip=${skip}&take=${take}`, {
                method: 'GET'
            });
        } catch (error) {
            console.error('Error fetching favorites:', error);
            throw error;
        }
    }

    /**
     * @param {string} placeId
     * @param {string} action - 'Add' или 'Remove'
     * @returns {Promise<void>}
     */
    async toggleFavorite(placeId, action) {
        try {
            const url = new URL(`${API_BASE_URL}/Favorites/action`);
            url.searchParams.append("gmapsPlaceId", placeId);
            url.searchParams.append("action", action);

            await this.makeRequest(`/Favorites/action?gmapsPlaceId=${placeId}&action=${action}`, {
                method: 'POST'
            });
        } catch (error) {
            console.error('Error toggling favorite:', error);
            throw error;
        }
    }

    /**
     * @param {string} placeId
     * @returns {Promise<boolean>}
     */
    async isFavorite(placeId) {
        try {
            const response = await this.makeRequest(`/Favorites/check/${placeId}`, {
                method: 'GET'
            });
            return response.isFavorite;
        } catch (error) {
            console.error('Error checking favorite status:', error);
            throw error;
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async clearFavorites() {
        // TODO: Реализовать реальный API запрос
        return Promise.resolve();
    }
}

export default new FavoriteService(); 