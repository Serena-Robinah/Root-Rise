import { apiClient } from './apiClient';
import type { AuthResponse, User } from '@shared/types';
import { API_ENDPOINTS, JWT_TOKEN_KEY, USER_KEY } from '@shared/constants';

export class AuthServiceClient {
  signup(name: string, email: string, password: string): Promise<AuthResponse> {
    return apiClient.post(API_ENDPOINTS.SIGNUP, { name, email, password });
  }

  login(email: string, password: string): Promise<AuthResponse> {
    return apiClient.post(API_ENDPOINTS.LOGIN, { email, password });
  }

  googleLogin(credential: string): Promise<AuthResponse> {
    return apiClient.post('/api/auth/google', { credential });
  }

  forgotPassword(email: string, baseUrl?: string): Promise<void> {
    return apiClient.post(API_ENDPOINTS.FORGOT_PASSWORD, { email, baseUrl });
  }

  resetPassword(token: string, password: string): Promise<void> {
    return apiClient.post(API_ENDPOINTS.RESET_PASSWORD, { token, password });
  }

  async me(): Promise<User> {
    const data: { user: User } = await apiClient.get(API_ENDPOINTS.ME);
    return data.user;
  }

  updateProfile(updates: Partial<User & { password?: string }>): Promise<User> {
    return apiClient.put<{ user: User }>(API_ENDPOINTS.PROFILE, updates)
      .then(data => data.user);
  }

  resendVerification(email: string): Promise<{ message: string }> {
    return apiClient.post('/api/auth/resend-verification', { email });
  }

  saveToken(token: string): void {
    localStorage.setItem(JWT_TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(JWT_TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(JWT_TOKEN_KEY);
  }

  saveUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser(): User | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  removeUser(): void {
    localStorage.removeItem(USER_KEY);
  }

  logout(): void {
    this.removeToken();
    this.removeUser();
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  }
}

export const authService = new AuthServiceClient();
