/**
 * API error type constants
 */
export const ApiErrorType = {
    VALIDATION: "VALIDATION",
    UNAUTHORIZED: "UNAUTHORIZED",
    FORBIDDEN: "FORBIDDEN",
    NOT_FOUND: "NOT_FOUND",
    SERVER_ERROR: "SERVER_ERROR",
    NETWORK_ERROR: "NETWORK_ERROR",
    TIMEOUT: "TIMEOUT",
    CANCELLED: "CANCELLED",
    UNKNOWN: "UNKNOWN",
    CONFLICT: "CONFLICT",
} as const;

/**
 * API error type union
 */
export type ApiErrorType =
    typeof ApiErrorType[keyof typeof ApiErrorType];

/**
 * Standardized API error structure
 * 
 * @typedef {Object} ApiError
 * @property {ApiErrorType} type - Error type classification
 * @property {string} message - User-friendly error message
 * @property {number} [statusCode] - HTTP status code if applicable
 * @property {Record<string, string[]>} [details] - Validation error details by field
 */
export interface ApiError {
    type: ApiErrorType;
    message: string;
    statusCode?: number;
    details?: Record<string, string[]>;
}
