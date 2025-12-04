import { redirect } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import {ensureAuthHydrated} from "@/utils/authHelpers";

/**
 * Loader for the Create Animal page
 *
 * @description
 * Ensures the user is authenticated and has AdminCAA role.
 * If not authenticated or not AdminCAA, redirects to login.
 *
 * @returns {Promise<null>} Returns null (no data to load)
 * @throws {Response} Redirects to /login if not authenticated or not AdminCAA
 *
 * @example
 * {
 *   path: "animals/new",
 *   element: <CreateAnimal />,
 *   loader: createAnimalLoader
 * }
 */
export async function createAnimalLoader() {
    // Ensure auth state is hydrated from localStorage
    await ensureAuthHydrated();

    const { user } = useAuthStore.getState();

    // Check if user is authenticated
    if (!user) {
        throw redirect("/login");
    }

    // Check if user has AdminCAA role
    if (user.role !== "AdminCAA") {
        // User is authenticated but not AdminCAA
        // Redirect to animals page (or could show 403 error)
        throw redirect("/animals");
    }

    // User is AdminCAA, allow access
    return null;
}