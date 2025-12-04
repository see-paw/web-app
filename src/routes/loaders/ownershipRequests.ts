import { redirect } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { ensureAuthHydrated } from "@/utils/authHelpers";

/**
 * Loader for the Ownership Requests page (AdminCAA only)
 *
 * @description
 * Ensures the user is authenticated and has AdminCAA role.
 * If not authenticated, redirects to login.
 * If authenticated but not AdminCAA, redirects to animals page.
 *
 * @returns {Promise<null>} Returns null (no data to load)
 * @throws {Response} Redirects to /login if not authenticated or /animals if not AdminCAA
 *
 * @example
 * {
 *   path: "admin/ownership-requests",
 *   element: <OwnershipRequests />,
 *   loader: ownershipRequestsLoader
 * }
 */
export async function ownershipRequestsLoader() {
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
        // Redirect to animals page (403 equivalent)
        throw redirect("/animals");
    }

    // User is AdminCAA, allow access
    return null;
}