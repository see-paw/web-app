import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

export const api = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})

export function assertApiConfig() {
    if (!baseURL) {
        throw new Error("VITE_API_URL não está definido. Verifica o teu .env");
    }
}