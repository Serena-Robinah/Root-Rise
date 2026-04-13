import type { AuthResponse, User } from '@shared/types';
export declare class AuthServiceClient {
    signup(name: string, email: string, password: string): Promise<AuthResponse>;
    login(email: string, password: string): Promise<AuthResponse>;
    saveToken(token: string): void;
    getToken(): string | null;
    removeToken(): void;
    saveUser(user: User): void;
    getUser(): User | null;
    removeUser(): void;
    logout(): void;
    isLoggedIn(): boolean;
    isAdmin(): boolean;
}
export declare const authService: AuthServiceClient;
//# sourceMappingURL=auth.d.ts.map