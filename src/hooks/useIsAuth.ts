import {useAuthStore} from "@/stores/auth.store";

/**
 * Custom hook to check if user is authenticated
 * 
 * @returns {boolean} True if user has valid authentication tokens
 */
export function useIsAuth() {
    return useAuthStore((authStore) => !!authStore.tokens );
}
