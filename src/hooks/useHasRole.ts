import {useAuthStore} from "@/stores/auth.store";

export function useHasRole(role: string) {
    const { role: userRole } = useAuthStore((s) => s.user) ?? {}
    return userRole === role
}