import BaseService from './BaseService';

class RecommendationService extends BaseService {
    /**
     * Get AI place recommendations based on hashtag, location and radius
     * @param {Object} params
     * @param {number} params.hashTagId - ID of the hashtag to filter by
     * @param {number} params.radius - Search radius in meters
     * @param {number} params.latitude - Latitude of the center point
     * @param {number} params.longitude - Longitude of the center point
     * @param {string} params.tag - Category tag for filtering
     * @returns {Promise<Array<import('../Models/Place').PlaceDTODefaultCard>>}
     */
    async getRecommendations({ 
        hashTagId = 1, 
        radius = 1000, 
        latitude = 47.81052, 
        longitude = 35.18286,
        tag = 'Туризм'
    } = {}) {
        // Построение URL с параметрами
        const url = `/AI/recommend?hashTagId=${hashTagId}&radius=${radius}&latitude=${latitude}&longitude=${longitude}&tag=${encodeURIComponent(tag)}`;
        console.log('Making request to:', url);
        
        try {
            const response = await this.makeRequest(url, {
                method: 'GET'
            });
            
            console.log('Raw response:', response);
            
            // Handle different response formats
            if (!response) {
                console.warn('Empty response received');
                return [];
            }
            
            // Обработка .NET JsonSerializer формата
            if (response.$values && Array.isArray(response.$values)) {
                console.log('Response has $values, length:', response.$values.length);
                console.log('First item structure:', JSON.stringify(response.$values[0], null, 2));
                // Очищаем данные от .NET serialization artifacts
                return response.$values.map(item => {
                    // Удаляем служебные поля .NET
                    const cleaned = { ...item };
                    delete cleaned.$id;
                    return cleaned;
                });
            }
            
            if (Array.isArray(response)) {
                console.log('Response is array, length:', response.length);
                return response;
            }
            
            if (response.data && Array.isArray(response.data)) {
                console.log('Response has data array, length:', response.data.length);
                return response.data;
            }
            
            // Если response - объект с другой структурой
            if (typeof response === 'object') {
                console.log('Response is object with keys:', Object.keys(response));
                // Попробуем найти массив в других возможных полях
                const possibleArrayFields = ['items', 'results', 'recommendations', 'places'];
                for (const field of possibleArrayFields) {
                    if (response[field] && Array.isArray(response[field])) {
                        console.log(`Found array in ${field}, length:`, response[field].length);
                        return response[field];
                    }
                }
            }
            
            console.error('Unexpected response format:', response);
            return [];
            
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            
            // Более детальная информация об ошибке
            if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
            
            throw error;
        }
    }

    /**
     * Альтернативный метод для тестирования с mock данными
     */
    async getRecommendationsMock() {
        // Для тестирования можно использовать mock данные
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: 1,
                        title: 'Test Place 1',
                        description: 'Test description 1',
                        imageUrl: 'https://via.placeholder.com/300x200'
                    },
                    {
                        id: 2,
                        title: 'Test Place 2',
                        description: 'Test description 2',
                        imageUrl: 'https://via.placeholder.com/300x200'
                    }
                ]);
            }, 1000);
        });
    }
}

export default new RecommendationService();