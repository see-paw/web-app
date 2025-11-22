import {ensureAuthHydrated} from "@/utils/authHelpers";
import {useAuthStore} from "@/stores/auth.store";
import {redirect} from "react-router-dom";

export async function loginLoader() {
    await ensureAuthHydrated();

    const { user } = useAuthStore.getState();
    if (user) {
        throw redirect("/animals");
    }

    return null;
}