import BaseService from './BaseService';

class PlaceService extends BaseService {
    /**
     * @param {Object} params
     * @param {string} [params.search]
     * @param {number} [params.skip]
     * @param {number} [params.take]
     * @returns {Promise<{ items: import('../Models/Place').Place[], total: number }>}
     */
    async getPlaces({ search = '', skip = 0, take = 10 } = {}) {
        try {
            return await this.makeRequest(`/Places/search?search=${encodeURIComponent(search)}&skip=${skip}&take=${take}`);
        } catch (error) {
            console.error('Error fetching places:', error);
            throw error;
        }
    }

    /**
     * @param {string} placeId
     * @returns {Promise<import('../Models/Place').Place>}
     */
    async getPlaceById(placeId) {
        try {
            return await this.makeRequest(`/Places/get/${placeId}`);
        } catch (error) {
            console.error('Error fetching place details:', error);
            throw error;
        }
    }

    /**
     * @param {import('../Models/Place').NewPlaceRequest} placeData
     * @returns {Promise<import('../Models/Place').Place>}
     */
    async createPlace(placeData) {
        try {
            return await this.makeRequest('/Places/create', {
                method: 'POST',
                body: JSON.stringify(placeData)
            });
        } catch (error) {
            console.error('Error creating place:', error);
            throw error;
        }
    }

    /**
     * @param {string} placeId
     * @param {Partial<import('../Models/Place').Place>} updateData
     * @returns {Promise<import('../Models/Place').Place>}
     */
    async updatePlace(placeId, updateData) {
        try {
            return await this.makeRequest(`/Places/update/${placeId}`, {
                method: 'PUT',
                body: JSON.stringify(updateData)
            });
        } catch (error) {
            console.error('Error updating place:', error);
            throw error;
        }
    }

    /**
     * @param {string} placeId
     * @returns {Promise<import('../Models/Place').PlaceStatistics>}
     */
    async getPlaceStatistics(placeId) {
        try {
            return await this.makeRequest(`/Places/statistics/${placeId}`);
        } catch (error) {
            console.error('Error fetching place statistics:', error);
            throw error;
        }
    }

    /**
     * @param {string} placeId
     * @returns {Promise<void>}
     */
    async deletePlace(placeId) {
        try {
            await this.makeRequest(`/Places/delete/${placeId}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Error deleting place:', error);
            throw error;
        }
    }
}

export default new PlaceService(); 