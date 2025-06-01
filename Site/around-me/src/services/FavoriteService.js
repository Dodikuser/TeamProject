import BaseService from './BaseService';
import GeoService from './GeoService';

const API_BASE_URL = 'https://localhost:7103/api';

class FavoriteService extends BaseService {

    transformFavoriteData(apiData) {
        return apiData.favorites.$values.map(favorite => ({
            id: favorite.placeDTO.gmapsPlaceId,
            image: favorite.placeDTO.photo?.path || 'https://via.placeholder.com/300x180?text=No+Image',
            title: favorite.placeDTO.name,
            locationText: favorite.placeDTO.address || 'Адреса не вказана',
            rating: favorite.placeDTO.stars || 5,
            distance: this.calculateDistance(favorite.placeDTO.latitude, favorite.placeDTO.longitude),
            favoritedAt: favorite.favoritedAt,
            placeDTO: favorite.placeDTO
        }));
    }


    async calculateDistance(lat, lng) {
        try {
            const userPos = await GeoService.getCurrentPosition();
            const toRad = (value) => value * Math.PI / 180;
            const R = 6371; // Радиус Земли в км
            const dLat = toRad(lat - userPos.lat);
            const dLng = toRad(lng - userPos.lng);
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(toRad(userPos.lat)) * Math.cos(toRad(lat)) *
                      Math.sin(dLng/2) * Math.sin(dLng/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const distance = R * c;
            return `${distance.toFixed(1)} км`;
        } catch (e) {
            // Если не удалось получить геолокацию — вернуть "N/A"
            return 'N/A';
        }
    }

    async getFavorites({ skip = 0, take = 10 } = {}) {
        try {
            const response = await this.makeRequest(`/Favorites/get?skip=${skip}&take=${take}`);
            
            if (!response) {
                return { favorites: { $values: [] } };
            }

            if (!response.favorites || !response.favorites.$values) {
                return { favorites: { $values: [] } };
            }

            return response;
        } catch (error) {
            throw error;
        }
    }


    async toggleFavorite(placeId, action) {
        try {
            const url = new URL(`${API_BASE_URL}/Favorites/action`);
            url.searchParams.append("gmapsPlaceId", placeId);
            url.searchParams.append("action", action);

            await this.makeRequest(`/Favorites/action?gmapsPlaceId=${placeId}&action=${action}`, {
                method: 'POST'
            });
        } catch (error) {
            throw error;
        }
    }

    async isFavorite(placeId) {
        try {
            const response = await this.makeRequest(`/Favorites/check/${placeId}`, {
                method: 'GET'
            });
            return response.isFavorite;
        } catch (error) {
            throw error;
        }
    }

    async clearFavorites() {
        // TODO: Реализовать реальный API запрос
        return Promise.resolve();
    }
}

export default new FavoriteService(); 