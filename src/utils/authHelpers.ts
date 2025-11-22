import { redirect } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";

/**
 * Ensures user is authenticated and throws redirect if not
 * 
 * @returns {Promise<Object>} Object containing tokens and user
 * @throws {Response} Redirect to login page if not authenticated
 */
export async function assertAuthenticated() {
    await ensureAuthHydrated();

    const { tokens, user } = useAuthStore.getState();

    if (!tokens?.accessToken || !user) {
        throw redirect("/login?error=unauthenticated");
    }

    return { tokens, user };
}

/**
 * Ensures user has one of the allowed roles
 * 
 * @param {string[]} allowedRoles - Array of roles that are permitted
 * @returns {Promise<Object>} Object containing the user
 * @throws {Response} Redirect to unauthorized page if user lacks required role
 */
export async function assertAuthorized(allowedRoles: string[]) {
    const { user } = await assertAuthenticated();

    if (!allowedRoles.includes(user.role)) {
        throw redirect(`/unauthorized?error=forbidden&role=${user.role}`);
    }

    return { user };
}

/**
 * Ensures user has a specific role
 * 
 * @param {string} role - Required role
 * @returns {Promise<Object>} Object containing the user
 * @throws {Response} Redirect if user doesn't have the required role
 */
export async function assertRole(role: string) {
    return await assertAuthorized([role]);
}

/**
 * Ensures Zustand store is hydrated from localStorage before accessing state
 * 
 * @returns {Promise<void>}
 */
export async function ensureAuthHydrated() {
    const store = useAuthStore;

    if (hasPersist(store)) {
        await store.persist.rehydrate();
    }
}

/**
 * Type guard to check if store has persist middleware
 * 
 * @param {unknown} store - Store to check
 * @returns {boolean} True if store has persist.rehydrate method
 */
function hasPersist(
    store: unknown
): store is {
    persist: {
        rehydrate: () => Promise<void> | void;
    };
} {
    return (
        typeof store === "function" &&
        typeof Object(store).persist === "object" &&
        typeof Object(store).persist?.rehydrate === "function"
    );
}
