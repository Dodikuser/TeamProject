/**
 * @typedef {Object} Review
 * @property {string} id
 * @property {string} placeId
 * @property {string} userId
 * @property {string} userName
 * @property {number} rating
 * @property {string} text
 * @property {string} date
 * @property {'positive' | 'negative' | 'neutral'} [sentiment]
 * @property {string[]} [images]
 */

/**
 * @typedef {Object} NewReviewRequest
 * @property {string} placeId
 * @property {number} rating
 * @property {string} text
 * @property {string[]} [images]
 */

/**
 * @typedef {Object} RatingDistribution
 * @property {number} [key: number]
 */

/**
 * @typedef {Object} ReviewsResponse
 * @property {Review[]} items
 * @property {number} totalCount
 * @property {number} averageRating
 * @property {RatingDistribution} ratingDistribution
 */ 