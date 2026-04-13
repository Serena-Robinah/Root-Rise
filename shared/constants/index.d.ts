export declare const AGE_GROUPS: readonly ["0–1", "2–4", "5–7", "8–10", "11–14"];
export declare const GENDERS: readonly ["Boys", "Girls", "Unisex"];
export declare const ORDER_STATUSES: readonly ["Pending", "Confirmed", "Out for Delivery", "Delivered", "Cancelled"];
export declare const CATEGORIES: readonly ["Onesies", "Bottoms", "Dresses", "Tops", "Outerwear"];
export declare const API_BASE_URL: any;
export declare const API_ENDPOINTS: {
    readonly SIGNUP: "/api/auth/signup";
    readonly LOGIN: "/api/auth/login";
    readonly PRODUCTS: "/api/products";
    readonly PRODUCT_DETAIL: (id: number) => string;
    readonly CREATE_ORDER: "/api/orders";
    readonly ADMIN_STATS: "/api/admin/stats";
    readonly ADMIN_ORDERS: "/api/admin/orders";
    readonly ADMIN_ORDER_DETAIL: (id: number) => string;
    readonly ADMIN_ORDER_STATUS: (id: number) => string;
    readonly ADMIN_DELETE_ORDER: (id: number) => string;
    readonly ADMIN_PRODUCTS: "/api/admin/products";
    readonly ADMIN_UPDATE_PRODUCT: (id: number) => string;
    readonly ADMIN_DELETE_PRODUCT: (id: number) => string;
};
export declare const JWT_TOKEN_KEY = "auth_token";
export declare const USER_KEY = "user";
//# sourceMappingURL=index.d.ts.map