import axios from "axios";
import {useAuthStore} from "@/stores/auth.store";
import {queryClient} from "@/lib/queryClient"
const baseURL = import.meta.env.VITE_API_URL;

/**
 * Pre-configured axios instance for API requests
 * 
 * @constant
 * @type {import('axios').AxiosInstance}
 */
export const api = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})

/**
 * Request interceptor
 *
 * Responsibilities:
 *  - Attach Authorization Bearer token to every request (if available)
 *  - Automatically remove `Content-Type` when sending FormData
 *
 * @private
 */
api.interceptors.request.use((config) => {
    const accessToken = useAuthStore.getState().tokens?.accessToken;

    if (accessToken) {
        if (config.headers?.set) {
            config.headers.set("Authorization", `Bearer ${accessToken}`);
        } else {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
    }

    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    return config;
});

/**
 * Response interceptor
 *
 * Handles:
 *  - 401 Unauthorized: Token expired or invalid
 *      → automatic logout
 *      → clearing TanStack Query cache
 *      → redirect to /login
 *
 * @private
 */
api.interceptors.response.use(
    (response) => {
        // If response is successful, pass it through
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized errors (expired/invalid token)
        if (error.response?.status === 401) {
            // Get logout function from auth store
            const { logout } = useAuthStore.getState();

            // Clear authentication state
            logout();

            // Clear TanStack Query cache
            queryClient.clear();

            // Redirect to login page
            window.location.href = "/login";
        }

        // Re-throw error for local handling if needed
        return Promise.reject(error);
    }
);


/**
 * Ensures that the API base URL is correctly configured.
 *
 * This function should be called during app startup to validate
 * environment variables.
 *
 * @throws {Error} If VITE_API_URL is missing from environment variables.
 */
export function assertApiConfig() {
    if (!baseURL) {
        throw new Error("VITE_API_URL não está definido. Verifica o teu .env");
    }
}
