import axios from "axios";
import {type ApiError, ApiErrorType} from "@/types/apierrors";

export function parseApiError(error: unknown): ApiError {
    if (axios.isCancel(error)) {
        return {
            type: ApiErrorType.CANCELLED,
            message: "Operação cancelada"
        };
    }

    if (!axios.isAxiosError(error)) {
        return {
            type: ApiErrorType.UNKNOWN,
            message: "Erro inesperado"
        };
    }

    const status = error.response?.status;
    const data = error.response?.data;

    if (error.code === 'ECONNABORTED') {
        return {
            type: ApiErrorType.TIMEOUT,
            message: "Pedido expirou. Tenta novamente."
        };
    }

    if (error.message === 'Network Error') {
        return {
            type: ApiErrorType.NETWORK_ERROR,
            message: "Sem ligação à Internet"
        };
    }

    switch (status) {
        case 400:
        case 422:
            return {
                type: ApiErrorType.VALIDATION,
                message: data?.message || "Dados inválidos",
                statusCode: status,
                details: data?.errors
            };
        case 401:
            return {
                type: ApiErrorType.UNAUTHORIZED,
                message: data?.message || "Credenciais inválidas",
                statusCode: 401
            };
        case 403:
            return {
                type: ApiErrorType.FORBIDDEN,
                message: "Sem permissão",
                statusCode: 403
            };
        case 404:
            return {
                type: ApiErrorType.NOT_FOUND,
                message: data?.message || "Recurso não encontrado",
                statusCode: 404
            };
        case 500:
        case 502:
        case 503:
            return {
                type: ApiErrorType.SERVER_ERROR,
                message: "Erro do servidor. Tenta mais tarde.",
                statusCode: status
            };
        default:
            return {
                type: ApiErrorType.UNKNOWN,
                message: data?.message || "Erro desconhecido",
                statusCode: status
            };
    }
}