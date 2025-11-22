import {useAuthStore} from "@/stores/auth.store";

/**
 * Custom hook to check if current user has a specific role
 * 
 * @param {string} role - Role to check against user's role
 * @returns {boolean} True if user has the specified role
 */
export function useHasRole(role: string) {
    const { role: userRole } = useAuthStore((s) => s.user) ?? {}
    return userRole === role
}
