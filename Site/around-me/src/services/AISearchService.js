import BaseService from './BaseService';

class AISearchService extends BaseService {
    /**
     * Search places using AI
     * @param {Object} params
     * @param {string} params.text - Search text
     * @param {number[]} [params.hashTagIds] - Optional hashtag IDs
     * @param {number} params.radius - Search radius in meters
     * @param {number} params.latitude - Latitude of the center point
     * @param {number} params.longitude - Longitude of the center point
     * @returns {Promise<Array>}
     */
    async searchPlaces({ 
        text,
        hashTagIds = [],
        radius = 10000,
        latitude = 47.81052,
        longitude = 35.18286
    } = {}) {
        const hashTagsParam = hashTagIds.length > 0 ? `&hashTagIds=${hashTagIds.join('&hashTagIds=')}` : '';
        const url = `/AI/search?text=${encodeURIComponent(text)}&radius=${radius}&latitude=${latitude}&longitude=${longitude}${hashTagsParam}`;
        
        try {
            const response = await this.makeRequest(url, {
                method: 'GET'
            });
            
            if (!response) {
                return [];
            }
            
            // Handle .NET JsonSerializer format
            if (response.$values && Array.isArray(response.$values)) {
                return response.$values.map(item => {
                    const cleaned = { ...item };
                    delete cleaned.$id;
                    return cleaned;
                });
            }
            
            if (Array.isArray(response)) {
                return response;
            }
            
            if (response.data && Array.isArray(response.data)) {
                return response.data;
            }
            
            console.error('Unexpected response format:', response);
            return [];
            
        } catch (error) {
            console.error('Error searching places:', error);
            throw error;
        }
    }
}

export default new AISearchService(); 