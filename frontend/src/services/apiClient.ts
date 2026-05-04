import { API_ENDPOINTS } from '@shared/constants';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    token?: string
  ): Promise<T> {
    const headers: HeadersInit = {};

    if (!(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      body: data instanceof FormData
        ? data
        : data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type') ?? '';

      if (contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      // Server returned HTML (Express error page, bad route, wrong BASE_URL, etc.)
      const text = await response.text();
      console.error(`[ApiClient] Non-JSON error response from ${method} ${endpoint}:`, text.slice(0, 300));
      throw new Error(`HTTP ${response.status} — unexpected response from server (check API_BASE_URL and route)`);
    }

    return response.json();
  }

  get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, token);
  }

  post<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
    return this.request<T>('POST', endpoint, data, token);
  }

  put<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
    return this.request<T>('PUT', endpoint, data, token);
  }

  patch<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
    return this.request<T>('PATCH', endpoint, data, token);
  }

  delete<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, token);
  }
}

export const apiClient = new ApiClient();