/**
 * @typedef {Object} Coordinates
 * @property {number} latitude
 * @property {number} longitude
 */

/**
 * @typedef {Object} Place
 * @property {string} id
 * @property {string} title
 * @property {string} locationText
 * @property {string} [description]
 * @property {number} rating
 * @property {string} [distance]
 * @property {string[]} images
 * @property {string} [email]
 * @property {string} [phone]
 * @property {string} [schedule]
 * @property {Coordinates} [coordinates]
 */

/**
 * @typedef {Object} ReviewStats
 * @property {number} positive
 * @property {number} negative
 */

/**
 * @typedef {Object} PlaceStatistics
 * @property {number} viewCount
 * @property {number} selectCount
 * @property {number} favoriteCount
 * @property {ReviewStats} reviews
 */

/**
 * @typedef {Object} NewPlaceRequest
 * @property {string} title
 * @property {string} locationText
 * @property {string} [description]
 * @property {string[]} [images]
 * @property {string} [email]
 * @property {string} [phone]
 * @property {string} [schedule]
 * @property {Coordinates} [coordinates]
 */ 