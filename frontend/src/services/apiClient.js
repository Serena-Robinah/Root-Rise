import { API_BASE_URL } from '@shared/constants';
class ApiClient {
    constructor(baseUrl = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }
    async request(method, endpoint, data, token) {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method,
            headers,
            body: data ? JSON.stringify(data) : undefined,
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || `HTTP Error: ${response.status}`);
        }
        return response.json();
    }
    get(endpoint, token) {
        return this.request('GET', endpoint, undefined, token);
    }
    post(endpoint, data, token) {
        return this.request('POST', endpoint, data, token);
    }
    put(endpoint, data, token) {
        return this.request('PUT', endpoint, data, token);
    }
    patch(endpoint, data, token) {
        return this.request('PATCH', endpoint, data, token);
    }
    delete(endpoint, token) {
        return this.request('DELETE', endpoint, undefined, token);
    }
}
export const apiClient = new ApiClient();
//# sourceMappingURL=apiClient.js.map