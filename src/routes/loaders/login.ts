import {ensureAuthHydrated} from "@/utils/authHelpers";
import {useAuthStore} from "@/stores/auth.store";
import {redirect} from "react-router-dom";

/**
 * Loader function for the login route
 * Redirects authenticated users to the animals page
 * 
 * @returns {Promise<null>} Null if user is not authenticated
 * @throws {Response} Redirect response if user is already authenticated
 */
export async function loginLoader() {
    await ensureAuthHydrated();

    const { user } = useAuthStore.getState();
    if (user) {
           throw redirect("/animals");
   }

    return null;
}
