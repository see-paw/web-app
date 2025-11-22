import { redirect } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";

export async function assertAuthenticated() {
    await ensureAuthHydrated();

    const { tokens, user } = useAuthStore.getState();

    if (!tokens?.accessToken || !user) {
        throw redirect("/login?error=unauthenticated");
    }

    return { tokens, user };
}

export async function assertAuthorized(allowedRoles: string[]) {
    const { user } = await assertAuthenticated();

    if (!allowedRoles.includes(user.role)) {
        throw redirect(`/unauthorized?error=forbidden&role=${user.role}`);
    }

    return { user };
}

export async function assertRole(role: string) {
    return await assertAuthorized([role]);
}

export async function ensureAuthHydrated() {
    const store = useAuthStore;

    if (hasPersist(store)) {
        await store.persist.rehydrate();
    }
}

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