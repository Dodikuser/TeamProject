const API_BASE_URL = 'https://localhost:7103/api';

class BaseService {
    getAuthToken() {
        return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    }

    async makeRequest(endpoint, options = {}) {
        try {
            const token = this.getAuthToken();
            if (!token) {
                throw new Error('Токен авторизації не знайдено');
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    if (typeof window !== 'undefined' && typeof window.forceLogout === 'function') {
                        window.forceLogout();
                    }
                    throw new Error('Необхідна авторизація');
                }
                const errorText = await response.text();
                throw new Error(`Помилка сервера: ${response.status} - ${errorText}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const text = await response.text();
                if (!text) {
                    return null;
                }
                return JSON.parse(text);
            }
            
            return null;
        } catch (error) {
            throw error;
        }
    }
}

export default BaseService; 