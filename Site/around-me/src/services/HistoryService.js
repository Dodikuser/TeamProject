import BaseService from './BaseService';

class HistoryService extends BaseService {
    /**
     * Получение истории посещений
     * @param {Object} params
     * @param {number} [params.skip=0]
     * @param {number} [params.take=10]
     * @param {boolean} [params.append=false]
     * @returns {Promise<Object>}
     */
    async getVisitHistory(params = {}) {
        const { skip = 0, take = 10 } = params;
        return this.makeRequest(`/history/places/get?skip=${skip}&take=${take}`, {
            method: 'POST'
        });
    }

    /**
     * Получение истории поиска
     * @param {Object} params
     * @param {number} [params.skip=0]
     * @param {number} [params.take=10]
     * @returns {Promise<Object>}
     */
    async getSearchHistory(params = {}) {
        const { skip = 0, take = 10 } = params;
        return this.makeRequest(`/history/requests/get?skip=${skip}&take=${take}`, {
            method: 'POST'
        });
    }

    /**
     * Удаление элемента истории посещений
     * @param {Object} placeHistoryDTO
     * @returns {Promise<void>}
     */
    async deleteVisitHistoryItem(placeHistoryDTO) {
        return this.makeRequest('/history/places/action?historyAction=Remove', {
            method: 'POST',
            body: JSON.stringify(placeHistoryDTO)
        });
    }

    /**
     * Удаление элемента истории поиска
     * @param {Object} searchDTO
     * @returns {Promise<void>}
     */
    async deleteSearchHistoryItem(searchDTO) {
        return this.makeRequest('/history/requests/action?historyAction=Remove', {
            method: 'POST',
            body: JSON.stringify(searchDTO)
        });
    }

    /**
     * Очистка всей истории посещений
     * @returns {Promise<void>}
     */
    async clearVisitHistory() {
        const placeHistoryDTO = {
            gmapsPlaceId: '',
            visitDateTime: new Date().toISOString()
        };
        return this.makeRequest('/history/places/action?historyAction=Clear', {
            method: 'POST',
            body: JSON.stringify(placeHistoryDTO)
        });
    }

    /**
     * Очистка всей истории поиска
     * @returns {Promise<void>}
     */
    async clearSearchHistory() {
        const searchDTO = {
            text: '',
            searchDateTime: new Date().toISOString()
        };
        return this.makeRequest('/history/requests/action?historyAction=Clear', {
            method: 'POST',
            body: JSON.stringify(searchDTO)
        });
    }

    /**
     * @param {Object} params
     * @param {number} [params.skip]
     * @param {number} [params.take]
     * @param {boolean} [params.includeIncognito]
     * @returns {Promise<import('../Models/History').HistoryResponse>}
     */
    async getHistory({ skip = 0, take = 10, includeIncognito = false } = {}) {
        // TODO: Реализовать реальный API запрос
        const mockVisits = Array(Math.floor(take/2)).fill(null).map((_, index) => ({
            id: `visit${index + skip + 1}`,
            userId: 'current-user-id',
            placeId: `place${index + 1}`,
            placeTitle: `Место ${index + 1}`,
            placeImage: 'https://example.com/image.jpg',
            visitDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
            isIncognito: Math.random() > 0.8
        }));

        const mockSearches = Array(Math.floor(take/2)).fill(null).map((_, index) => ({
            id: `search${index + skip + 1}`,
            userId: 'current-user-id',
            searchTerm: `Поисковый запрос ${index + 1}`,
            searchDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
            isIncognito: Math.random() > 0.8,
            results: Array(3).fill(null).map((_, i) => ({
                placeId: `place${i + 1}`,
                placeTitle: `Результат ${i + 1}`
            }))
        }));

        return {
            visits: mockVisits.filter(v => includeIncognito || !v.isIncognito),
            searches: mockSearches.filter(s => includeIncognito || !s.isIncognito),
            totalVisits: 50,
            totalSearches: 50
        };
    }

    /**
     * @param {string} placeId
     * @param {boolean} [isIncognito=false]
     * @returns {Promise<import('../Models/History').VisitHistory>}
     */
    async addVisit(placeId, isIncognito = false) {
        // TODO: Реализовать реальный API запрос
        return {
            id: 'new-visit-id',
            userId: 'current-user-id',
            placeId,
            placeTitle: 'Название места',
            placeImage: 'https://example.com/image.jpg',
            visitDate: new Date().toISOString(),
            isIncognito
        };
    }

    /**
     * @param {string} searchTerm
     * @param {boolean} [isIncognito=false]
     * @returns {Promise<void>}
     */
    async addSearch(searchTerm, isIncognito = false) {
        const body = {
            historyId: 0,
            text: searchTerm,
            searchDateTime: new Date().toISOString(),
            userId: 0,
            isIncognito
        };
        return this.makeRequest('/history/requests/action?historyAction=0', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
    }

    /**
     * @returns {Promise<void>}
     */
    async clearHistory() {
        // TODO: Реализовать реальный API запрос
        return Promise.resolve();
    }

    /**
     * @param {string} historyId
     * @returns {Promise<void>}
     */
    async deleteHistoryItem(historyId) {
        // TODO: Реализовать реальный API запрос
        return Promise.resolve();
    }
}

export default new HistoryService(); 