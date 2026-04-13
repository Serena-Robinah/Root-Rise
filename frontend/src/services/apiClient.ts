import { API_BASE_URL, API_ENDPOINTS } from '@shared/constants';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    token?: string
  ): Promise<T> {
    const headers: HeadersInit = {
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

  get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, token);
  }

  post<T>(endpoint: string, data: any, token?: string): Promise<T> {
    return this.request<T>('POST', endpoint, data, token);
  }

  put<T>(endpoint: string, data: any, token?: string): Promise<T> {
    return this.request<T>('PUT', endpoint, data, token);
  }

  patch<T>(endpoint: string, data: any, token?: string): Promise<T> {
    return this.request<T>('PATCH', endpoint, data, token);
  }

  delete<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, token);
  }
}

export const apiClient = new ApiClient();
