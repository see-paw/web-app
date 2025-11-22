import axios from "axios";
import {useAuthStore} from "@/stores/auth.store";

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

api.interceptors.request.use((config) => {
    const accessToken = useAuthStore.getState().tokens?.accessToken;

    if (accessToken) {
        if (config.headers?.set) {
            config.headers.set("Authorization", `Bearer ${accessToken}`);
        } else {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
    }

    return config;
});

/**
 * Validates that the API base URL is configured
 * 
 * @throws {Error} When VITE_API_URL environment variable is not defined
 */
export function assertApiConfig() {
    if (!baseURL) {
        throw new Error("VITE_API_URL não está definido. Verifica o teu .env");
    }
}
