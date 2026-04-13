declare class ApiClient {
    private baseUrl;
    constructor(baseUrl?: string);
    private request;
    get<T>(endpoint: string, token?: string): Promise<T>;
    post<T>(endpoint: string, data: any, token?: string): Promise<T>;
    put<T>(endpoint: string, data: any, token?: string): Promise<T>;
    patch<T>(endpoint: string, data: any, token?: string): Promise<T>;
    delete<T>(endpoint: string, token?: string): Promise<T>;
}
export declare const apiClient: ApiClient;
export {};
//# sourceMappingURL=apiClient.d.ts.map