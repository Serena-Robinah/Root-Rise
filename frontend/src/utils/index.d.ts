/**
 * Formatting utilities
 */
export declare const formatPrice: (price: number) => string;
export declare const formatDate: (dateString: string) => string;
export declare const formatDateTime: (dateString: string) => string;
/**
 * Validation utilities
 */
export declare const isValidEmail: (email: string) => boolean;
export declare const isValidPhone: (phone: string) => boolean;
export declare const hasMinLength: (str: string, min: number) => boolean;
export declare const hasMinNumber: (num: number, min: number) => boolean;
/**
 * Array utilities
 */
export declare const groupBy: <T, K extends PropertyKey>(arr: T[], key: (item: T) => K) => Record<K, T[]>;
//# sourceMappingURL=index.d.ts.map