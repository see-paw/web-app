import { redirect } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";

export function assertAuthenticated() {
    const { tokens, user } = useAuthStore.getState();

    if (!tokens?.accessToken || !user) {
        throw redirect("/login?error=unauthenticated");
    }

    return { tokens, user };
}

export function assertAuthorized(allowedRoles: string[]) {
    const { user } = assertAuthenticated();

    if (!allowedRoles.includes(user.role)) {
        throw redirect(`/unauthorized?error=forbidden&role=${user.role}`);
    }

    return { user };
}

export function assertRole(role: string) {
    return assertAuthorized([role]);
}
