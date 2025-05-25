/**
 * @typedef {Object} Favorite
 * @property {string} id
 * @property {string} userId
 * @property {string} placeId
 * @property {string} dateAdded
 */

/**
 * @typedef {Object} FavoritePlace
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
 * @property {Object} [coordinates]
 * @property {number} coordinates.latitude
 * @property {number} coordinates.longitude
 * @property {string} dateAdded
 */

/**
 * @typedef {Object} FavoritesResponse
 * @property {FavoritePlace[]} items
 * @property {number} totalCount
 */

/**
 * @typedef {Object} ToggleFavoriteRequest
 * @property {string} placeId
 * @property {'add' | 'remove'} action
 */ 