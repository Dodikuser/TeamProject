export const API_BASE_URL = 'https://localhost:7103/api';

class BaseService {
    getAuthToken() {
        return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    }

    async makeRequest(endpoint, options = {}) {
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
                throw new Error('Необхідна авторизація');
            }
            throw new Error(`Помилка сервера: ${response.status}`);
        }

        return response.json();
    }
}

export default BaseService; 