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
            return await this.makeRequest(`/Reviews/${placeId}?skip=${skip}&take=${take}`);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            throw error;
        }
    }

    /**
     * @param {string} placeId
     * @param {import('../Models/Review').NewReviewRequest} reviewData
     * @returns {Promise<import('../Models/Review').Review>}
     */
    async createReview(placeId, reviewData) {
        try {
            return await this.makeRequest(`/Reviews/${placeId}/create`, {
                method: 'POST',
                body: JSON.stringify(reviewData)
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
            return await this.makeRequest(`/Reviews/${reviewId}/update`, {
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
            await this.makeRequest(`/Reviews/${reviewId}/delete`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
        }
    }
}

export default new ReviewService(); 