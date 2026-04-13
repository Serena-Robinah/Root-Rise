/**
 * Formatting utilities
 */

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
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

export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const re = /^\d{10,}$/;
  return re.test(phone.replace(/\D/g, ''));
};

export const hasMinLength = (str: string, min: number): boolean => {
  return str.length >= min;
};

export const hasMinNumber = (num: number, min: number): boolean => {
  return num >= min;
};

/**
 * Array utilities
 */

export const groupBy = <T, K extends PropertyKey>(
  arr: T[],
  key: (item: T) => K
): Record<K, T[]> => {
  return arr.reduce(
    (result, item) => {
      const k = key(item);
      if (!result[k]) result[k] = [];
      result[k].push(item);
      return result;
    },
    {} as Record<K, T[]>
  );
};
