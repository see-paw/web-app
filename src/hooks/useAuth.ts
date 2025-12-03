import {useAuthStore} from "@/stores/auth.store";
import authApi from "@/api/auth";
import type {User} from "@/types/user";
import axios from "axios";
import {type ApiError, ApiErrorType} from "@/types/apierrors";
import {parseApiError} from "@/utils/parseApiError";
import {handleLoginError} from "@/utils/handleLoginError";
import type {LoginCredentials} from "@/pages/Auth/Login/Login";

/**
 * Login operation result
 * 
 * @typedef {Object} LoginResult
 * @property {boolean} success - Whether the login was successful
 * @property {ApiError | null} error - Error details if login failed
 */
export interface LoginResult {
    success: boolean;
    error: ApiError | null;
}

/**
 * Custom hook for authentication operations
 * 
 * @returns {Object} Object containing login function
 */
export function useAuth() {
    const setUser = useAuthStore((s) => s.setUser);
    const setTokens = useAuthStore((s) => s.setTokens);
    const logout = useAuthStore((s) => s.logout);

    /**
     * Authenticates a user and stores their data
     * 
     * @param {LoginCredentials} loginCredentials - User credentials
     * @returns {Promise<LoginResult>} Result containing success status and potential errors
     */
    const login = async (loginCredentials: LoginCredentials): Promise<LoginResult> => {
        try {
            const authResponse = await authApi.login(loginCredentials);
            setTokens(authResponse);

            const internalController = new AbortController();

            const userData = await authApi.getCurrentUserData(internalController.signal);

            const isStillAuthenticated = useAuthStore.getState().tokens !== null;

            if (!isStillAuthenticated) {
                return {
                    success: false,
                    error: {
                        message: "Login cancelado",
                        type: ApiErrorType.CANCELLED,
                        details: undefined
                    }
                };
            }

            const user: User = {
                userId: userData.userId,
                role: userData.role,
                email: userData.email,
                shelterId: userData.shelterId,
                shelterName: userData.shelterName,
                profile: {
                    name: userData.name,
                    birthDate: userData.birthDate,
                    street: userData.street,
                    city: userData.city,
                    postalCode: userData.postalCode,
                    phoneNumber: userData.phoneNumber,
                }
            };

            setUser(user);

            return {
                success: true,
                error: null,
            };
        } catch (err) {
            logout();

            if (axios.isCancel(err)) {
                return {
                    success: false,
                    error: {
                        message: "Login Cancelado",
                        type: ApiErrorType.CANCELLED,
                        details: undefined
                    }
                };
            }

            const apiError = parseApiError(err);
            apiError.message = handleLoginError(apiError);

            return {
                success: false,
                error: apiError,
            };
        }
    };

    return { login };
}
