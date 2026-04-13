import { apiClient } from './apiClient';
import { API_ENDPOINTS, JWT_TOKEN_KEY, USER_KEY } from '@shared/constants';
export class AuthServiceClient {
    signup(name, email, password) {
        return apiClient.post(API_ENDPOINTS.SIGNUP, { name, email, password });
    }
    login(email, password) {
        return apiClient.post(API_ENDPOINTS.LOGIN, { email, password });
    }
    saveToken(token) {
        localStorage.setItem(JWT_TOKEN_KEY, token);
    }
    getToken() {
        return localStorage.getItem(JWT_TOKEN_KEY);
    }
    removeToken() {
        localStorage.removeItem(JWT_TOKEN_KEY);
    }
    saveUser(user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    getUser() {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    }
    removeUser() {
        localStorage.removeItem(USER_KEY);
    }
    logout() {
        this.removeToken();
        this.removeUser();
    }
    isLoggedIn() {
        return !!this.getToken();
    }
    isAdmin() {
        const user = this.getUser();
        return user?.role === 'admin';
    }
}
export const authService = new AuthServiceClient();
//# sourceMappingURL=auth.js.map