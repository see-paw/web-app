import {api} from "@/api/api";
import type {LoginResponse, UserData, UserProfile} from "@/types/user";
import type {LoginCredentials} from "@/pages/Auth/Login/Login";

/**
 * API client for authentication-related endpoints
 */
const authApi = {
    /**
     * Authenticates a user with email and password
     * 
     * @param {LoginCredentials} loginCredentials - User login credentials
     * @returns {Promise<LoginResponse>} Authentication response with tokens
     * @throws {Error} When authentication fails
     */
    login: async function (loginCredentials: LoginCredentials): Promise<LoginResponse> {
        const { data: authResponse } = await api.post<LoginResponse>("/login", loginCredentials)

        return authResponse;
    },

    /**
     * Retrieves current authenticated user data
     * 
     * @param {AbortSignal} signal - Abort signal for request cancellation
     * @returns {Promise<UserData>} Current user data including profile information
     * @throws {Error} When request fails or user is not authenticated
     */
    getCurrentUserData: async function (signal: AbortSignal): Promise<UserData> {
        const { data: userData } = await api.get<UserData>("/users/me", { signal })

        return userData;
    },

    /**
     * Retrieves current user profile information
     * 
     * @param {AbortSignal} signal - Abort signal for request cancellation
     * @returns {Promise<UserProfile>} User profile data
     * @throws {Error} When request fails or user is not authenticated
     */
    getUserProfile: async function (signal: AbortSignal): Promise<UserProfile> {
        const {data: profile} = await api.get<UserProfile>("/users", { signal })

        return profile;
    }
}

export default authApi
