/**
 * Formatting utilities
 */
export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
};
export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};
export const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};
/**
 * Validation utilities
 */
export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};
export const isValidPhone = (phone) => {
    const re = /^\d{10,}$/;
    return re.test(phone.replace(/\D/g, ''));
};
export const hasMinLength = (str, min) => {
    return str.length >= min;
};
export const hasMinNumber = (num, min) => {
    return num >= min;
};
/**
 * Array utilities
 */
export const groupBy = (arr, key) => {
    return arr.reduce((result, item) => {
        const k = key(item);
        if (!result[k])
            result[k] = [];
        result[k].push(item);
        return result;
    }, {});
};
//# sourceMappingURL=index.js.map