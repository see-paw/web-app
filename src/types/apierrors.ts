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
} as const;

export type ApiErrorType =
    typeof ApiErrorType[keyof typeof ApiErrorType];

export interface ApiError {
    type: ApiErrorType;
    message: string;
    statusCode?: number;
    details?: Record<string, string[]>;
}