import BaseService from './BaseService';
import PlaceService from './PlaceService';

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
            
            // Форматируем каждый отзыв
            const formattedReviews = reviews.map(review => ({
                id: review.id,
                text: review.text || '',
                stars: review.stars || 0,
                reviewDateTime: review.reviewDateTime,
                gmapId: review.gmapId,
                placeId: review.placeId,
                userId: review.userId,
                userName: review.userName,
                placeName: review.placeName,
                placeAddress: review.placeAddress,
                photo: review.photo
            }));

            const averageRating = formattedReviews.length > 0 
                ? formattedReviews.reduce((acc, r) => acc + r.stars, 0) / formattedReviews.length 
                : 0;
            
            return {
                reviews: formattedReviews,
                averageRating
            };
        } catch (error) {
            console.error('Error fetching reviews:', error);
            throw error;
        }
    }

    /**
     * Get reviews for the current user with place details
     * @param {Object} params
     * @param {number} [params.skip]
     * @param {number} [params.take]
     * @returns {Promise<Array>}
     */
    async getUserReviews({ skip = 0, take = 10 } = {}) {
        try {
            const response = await this.makeRequest(`/Review/get-by-user?skip=${skip}&take=${take}`);
            const reviews = response.$values || [];

            // Получаем детали места для каждого отзыва
            const reviewsWithPlaces = await Promise.all(reviews.map(async review => {
                try {
                    const placeDetails = await PlaceService.getPlaceById(review.gmapId);
                    return {
                        id: review.id,
                        text: review.text || '',
                        price: review.price || 0,
                        quality: review.quality || 0,
                        congestion: review.congestion || 0,
                        location: review.location || 0,
                        infrastructure: review.infrastructure || 0,
                        stars: review.stars || 0,
                        reviewDateTime: review.reviewDateTime,
                        gmapId: review.gmapId,
                        placeId: review.placeId,
                        userId: review.userId,
                        userName: review.userName,
                        photo: review.photo,
                        // Добавляем информацию о месте из placeDetails
                        placeName: placeDetails.title || placeDetails.name,
                        placeAddress: placeDetails.location || placeDetails.address,
                        placePhoto: placeDetails.photos?.[0]?.path || placeDetails.photo?.path,
                        placeRating: placeDetails.rating
                    };
                } catch (error) {
                    console.error(`Error fetching place details for review ${review.id}:`, error);
                    // Возвращаем отзыв без деталей места в случае ошибки
                    return {
                        ...review,
                        placeName: 'Место недоступно',
                        placeAddress: 'Адрес недоступен'
                    };
                }
            }));

            return reviewsWithPlaces;
        } catch (error) {
            console.error('Error fetching user reviews:', error);
            throw error;
        }
    }

    /**
     * @param {string} placeId
     * @param {Object} reviewData
     * @returns {Promise<Object>}
     */
    async createReview(placeId, reviewData) {
        try {
            const formattedReview = {
                text: reviewData.text || '',
                stars: reviewData.stars || 5,
                price: reviewData.price || 5,
                quality: reviewData.quality || 5,
                congestion: reviewData.congestion || 5,
                location: reviewData.location || 5,
                infrastructure: reviewData.infrastructure || 5,
                reviewDateTime: new Date().toISOString(),
                gmapId: placeId,
                userId: reviewData.userId
            };

            const response = await this.makeRequest(`/Review/add`, {
                method: 'POST',
                body: JSON.stringify(formattedReview)
            });

            return response;
        } catch (error) {
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
            const response = await this.makeRequest(`/Review/${reviewId}/update`, {
                method: 'PUT',
                body: JSON.stringify(updateData)
            });

            return response;
        } catch (error) {
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
            throw error;
        }
    }
}

export default new ReviewService();