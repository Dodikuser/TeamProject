/**
 * @typedef {Object} VisitHistory
 * @property {string} id
 * @property {string} userId
 * @property {string} placeId
 * @property {string} placeTitle
 * @property {string} [placeImage]
 * @property {string} visitDate
 * @property {boolean} isIncognito
 */

/**
 * @typedef {Object} SearchResult
 * @property {string} placeId
 * @property {string} placeTitle
 */

/**
 * @typedef {Object} SearchHistory
 * @property {string} id
 * @property {string} userId
 * @property {string} searchTerm
 * @property {string} searchDate
 * @property {boolean} isIncognito
 * @property {SearchResult[]} [results]
 */

/**
 * @typedef {Object} HistoryResponse
 * @property {VisitHistory[]} visits
 * @property {SearchHistory[]} searches
 * @property {number} totalVisits
 * @property {number} totalSearches
 */ 