import BaseService from './BaseService';

class ReviewService extends BaseService {
    /**
     * @param {string} placeId
     * @param {Object} params
     * @param {number} [params.skip]
     * @param {number} [params.take]
     * @returns {Promise<import('../Models/Review').ReviewsResponse>}
     */
    async getReviews(placeId, { skip = 0, take = 10 } = {}) {
        try {
            const response = await this.makeRequest(`/Review/get?placeId=${placeId}&skip=${skip}&take=${take}`);
            const reviews = response.$values || [];
            const averageRating = reviews.length > 0 
                ? reviews.reduce((acc, r) => acc + r.stars, 0) / reviews.length 
                : 0;
            
            return {
                reviews,
                averageRating
            };
        } catch (error) {
            console.error('Error fetching reviews:', error);
            throw error;
        }
    }

    /**
     * @param {string} placeId
     * @param {Object} reviewData
     * @param {string} [reviewData.text] - Текст отзыва (максимум 250 символов)
     * @param {number} [reviewData.stars] - Общая оценка (1-5)
     * @returns {Promise<import('../Models/Review').Review>}
     */
    async createReview(placeId, reviewData) {
        try {
            const currentUserId = 1; // TODO: Получать реальный ID пользователя
            const formattedReview = {
                text: reviewData.text || '',
                price: reviewData.stars || 5,         // Используем общую оценку как значение по умолчанию
                quality: reviewData.stars || 5,       // для всех отдельных критериев
                congestion: reviewData.stars || 5,
                location: reviewData.stars || 5,
                infrastructure: reviewData.stars || 5,
                stars: reviewData.stars || 5,
                reviewDateTime: new Date().toISOString(),
                gmapId: placeId,
                userId: currentUserId
            };

            return await this.makeRequest(`/Review/add`, {
                method: 'POST',
                body: JSON.stringify(formattedReview)
            });
        } catch (error) {
            console.error('Error creating review:', error);
            throw error;
        }
    }

    /**
     * @param {string} reviewId
     * @param {Partial<import('../Models/Review').Review>} updateData
     * @returns {Promise<import('../Models/Review').Review>}
     */
    async updateReview(reviewId, updateData) {
        try {
            return await this.makeRequest(`/Review/${reviewId}/update`, {
                method: 'PUT',
                body: JSON.stringify(updateData)
            });
        } catch (error) {
            console.error('Error updating review:', error);
            throw error;
        }
    }

    /**
     * @param {string} reviewId
     * @returns {Promise<void>}
     */
    async deleteReview(reviewId) {
        try {
            await this.makeRequest(`/Review/${reviewId}/delete`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
        }
    }
}

export default new ReviewService(); 