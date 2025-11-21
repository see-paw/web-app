import {useAuthStore} from "@/stores/auth.store";
import authApi, {type LoginCredentials} from "@/api/auth";
import type {User} from "@/types/user";
import axios from "axios";
import {ApiErrorType} from "@/types/apierrors";
import {parseApiError} from "@/utils/parseApiError";
import {handleLoginError} from "@/utils/handleLoginError";

export interface LoginResult {
    success: boolean;
    error: string | null;
    errorType: ApiErrorType | null;
    details?: Record<string, string[]>;
}

export function useAuth() {
    const setUser = useAuthStore((s) => s.setUser);
    const setTokens = useAuthStore((s) => s.setTokens);
    const logout = useAuthStore((s) => s.logout);

    const login = async (loginCredentials: LoginCredentials, signal: AbortSignal): Promise<LoginResult> => {
        try {
            const authResponse = await authApi.login(loginCredentials, signal);
            setTokens(authResponse);

            const internalController = new AbortController();

            const userId = await authApi.getUserId(internalController.signal);
            const role = await authApi.getUserRole(internalController.signal);
            const profile = await authApi.getUserProfile(internalController.signal);

            const user: User = { userId, role, profile };
            setUser(user);

            return {
                success: true,
                error: null,
                errorType: null,
                details: undefined
            };
        } catch (err) {
            logout();

            if (axios.isCancel(err)) {
                return {
                    success: false,
                    error: "Login cancelado",
                    errorType: ApiErrorType.CANCELLED,
                    details: undefined
                };
            }

            const apiError = parseApiError(err);
            const userMessage = handleLoginError(apiError);

            return {
                success: false,
                error: userMessage,
                errorType: apiError.type,
                details: apiError.details
            };
        }
    };

    return { login };
}