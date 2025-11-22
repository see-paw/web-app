import {useAuthStore} from "@/stores/auth.store";

export function useIsAuth() {
    return useAuthStore((authStore) => !!authStore.tokens );
}