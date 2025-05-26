import BaseService from './BaseService';

const API_BASE_URL = 'https://localhost:7103/api';

class FavoriteService extends BaseService {
    /**
     * Преобразует данные API в формат для компонентов
     * @param {Object} apiData - Данные с API
     * @returns {Array} Трансформированные данные
     */
    transformFavoriteData(apiData) {
        return apiData.favorites.$values.map(favorite => ({
            id: favorite.placeDTO.gmapsPlaceId,
            image: favorite.placeDTO.photo?.path || 'https://via.placeholder.com/300x180?text=No+Image',
            title: favorite.placeDTO.name,
            locationText: favorite.placeDTO.address || 'Адреса не вказана',
            rating: favorite.placeDTO.stars || 0,
            distance: this.calculateDistance(favorite.placeDTO.latitude, favorite.placeDTO.longitude),
            favoritedAt: favorite.favoritedAt,
            placeDTO: favorite.placeDTO
        }));
    }

    /**
     * Вычисляет расстояние до места
     * @param {number} lat - Широта
     * @param {number} lng - Долгота
     * @returns {string} Расстояние в км
     */
    calculateDistance(lat, lng) {
        // TODO: Реализовать реальный расчет расстояния
        return `${(Math.random() * 10).toFixed(1)} км`;
    }

    /**
     * @param {Object} params
     * @param {number} [params.skip]
     * @param {number} [params.take]
     * @returns {Promise<Array>}
     */
    async getFavorites({ skip = 0, take = 10 } = {}) {
        try {
            const data = await this.makeRequest(`/Favorites/get?skip=${skip}&take=${take}`, {
                method: 'GET'
            });
            return this.transformFavoriteData(data);
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