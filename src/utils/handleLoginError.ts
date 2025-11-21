import {type ApiError, ApiErrorType} from "@/types/apierrors";

export function handleLoginError(error: ApiError): string {
    switch (error.type) {
        case ApiErrorType.UNAUTHORIZED:
            return "Email ou password incorretos";
        case ApiErrorType.VALIDATION:
            return error.details
                ? Object.values(error.details).flat().join(", ")
                : "Dados inválidos";
        case ApiErrorType.NETWORK_ERROR:
            return "Sem ligação. Verifica a Internet.";
        case ApiErrorType.TIMEOUT:
            return "Pedido demorou muito. Tenta novamente.";
        case ApiErrorType.SERVER_ERROR:
            return "Erro no servidor. Tenta mais tarde.";
        default:
            return error.message;
    }
}