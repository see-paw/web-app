import {type LoaderFunctionArgs, redirect} from "react-router-dom";
import axios from "axios";
import {queryClient} from "@/lib/queryClient";
import {animalsApi} from "@/api/animals";
import {ensureAuthHydrated} from "@/utils/authHelpers";
import {useAuthStore} from "@/stores/auth.store";
import {UserRole} from "@/types/user";
import type {AnimalFilterValues} from "@/components/features/AnimalFilters/AnimalFilters";
import {parseApiError} from "@/utils/parseApiError";
import type {PagedList} from "@/types/pagedList";
import type {Animal} from "@/types/animal";

/**
 * Factory function to generate the query key for TanStack Query.
 *
 * Produces unique cache keys based on:
 * - Whether the request is shelter-scoped (AdminCAA)
 * - Page number
 * - Active filters (if any)
 *
 * Ensures:
 * - Unique caching for shelter-based lists
 * - Shared caching for general animal lists
 *
 * @param {string | null} shelterId - Shelter ID for AdminCAA users. Null for regular users.
 * @param {string} pageNumber - Current page number.
 * @param {AnimalFilterValues} [filters] - Active filter set.
 *
 * @returns {Array} A query key tuple for TanStack Query caching.
 *
 * @example
 * animalsQueryKey(null, "1")
 * // → ['animals', '1']
 *
 * @example
 * animalsQueryKey("s1", "2", { species: "Dog" })
 * // → ['shelter-animals', 's1', '2', { species: "Dog" }]
 */
export const animalsQueryKey = (
    shelterId: string | null,
    pageNumber: string,
    filters?: AnimalFilterValues
) => {
    const hasFilters = filters && Object.keys(filters).length > 0;

    if (shelterId) {
        // AdminCAA
        if (hasFilters) {
            return ['shelter-animals', shelterId, pageNumber, filters];
        }
        return ['shelter-animals', shelterId, pageNumber];
    } else {
        // Regular User
        if (hasFilters) {
            return ['animals', pageNumber, filters]; // ← SEM shelterId
        }
        return ['animals', pageNumber];
    }
};


/**
 * React Router loader for the `/animals` route.
 *
 * Handles **both regular users** and **AdminCAA** automatically:
 *
 * ---
 * ###  Regular Users
 * - Endpoint: `/animals`
 * - Supports filtering by:
 *   - name, species, age, size, sex, breed, shelterName
 * - Does *not* require authentication
 *
 * ---
 * ###  AdminCAA
 * - Endpoint: `/shelters/:shelterId/animals`
 * - Always scoped to their shelter
 * - Filters are still supported
 * - Requires authenticated AdminCAA user
 *
 * ---
 * ### Pagination
 * - `page` query param is required
 * - Loader automatically redirects to `?page=1` when missing
 *
 * ---
 * ### Errors
 * - 404 → returns empty PagedList (frontend shows empty state)
 * - Other axios errors → parsed with `parseApiError()` and returned as JSON
 *
 * @async
 * @param {LoaderFunctionArgs} args - Router loader arguments.
 * @param {Request} args.request - The incoming HTTP request from React Router.
 *
 * @returns {Promise<PagedList<Animal>>}
 * A paginated list of animals, either from cache or freshly fetched.
 *
 * @throws {Response} Redirect to add missing pagination parameter.
 * @throws {Response} JSON error response for API errors.
 *
 * @example
 * // Route config in React Router
 * {
 *   path: "/animals",
 *   element: <Animals />,
 *   loader: animalsLoader
 * }
 *
 * @example
 * // Regular User URL
 * /animals?page=1&species=Dog
 *
 * @example
 * // AdminCAA URL (shelter filter auto-applied)
 * /animals?page=1
 */
export async function animalsLoader({request}: LoaderFunctionArgs) {
    try {

        const url = new URL(request.url);
        const page = url.searchParams.get("page");

        // Ensure pagination param exists
        if (!page) {
            url.searchParams.set("page", "1");
            throw redirect(url.pathname + "?" + url.searchParams.toString());
        }

        // Wait for Zustand hydration (required for SSR/router loaders)
        await ensureAuthHydrated();

        const {user} = useAuthStore.getState();
        const isAdminCAA = user?.role === UserRole.AdminCAA;
        const shelterId = user?.shelterId || null;

        /**
         * Extract filters from the URL.
         */
        const filters: AnimalFilterValues = {};
        const name = url.searchParams.get('name');
        const species = url.searchParams.get('species');
        const age = url.searchParams.get('age');
        const size = url.searchParams.get('size');
        const sex = url.searchParams.get('sex');
        const breed = url.searchParams.get('breed');
        const shelterNameParam = url.searchParams.get('shelterName');

        if (name) filters.name = name;
        if (species) filters.species = species;
        if (age) filters.age = parseInt(age, 10);
        if (size) filters.size = size;
        if (sex) filters.sex = sex;
        if (breed) filters.breed = breed;
        if (shelterNameParam) filters.shelterName = shelterNameParam;

        const hasActiveFilters = Object.keys(filters).length > 0;

        /**
         * Define how the request should be cached and fetched.
         */
        let queryConfig;

        if (isAdminCAA && shelterId) {
            // AdminCAA - always use getAnimalsByShelter (with or without filters)
            queryConfig = {
                queryKey: animalsQueryKey(shelterId, page, hasActiveFilters ? filters : undefined),
                queryFn: () => animalsApi.getAnimalsByShelter({
                    shelterId,
                    pageNumber: page,
                    filters: hasActiveFilters ? filters : undefined,
                    signal: request.signal
                })
            };
        } else {
            // Regular User - always use getAnimals (with or without filters)
            queryConfig = {
                queryKey: animalsQueryKey(null, page, hasActiveFilters ? filters : undefined),
                queryFn: () => animalsApi.getAnimals({
                    pageNumber: page,
                    filters: hasActiveFilters ? filters : undefined,
                    signal: request.signal
                })
            };
        }

        // Fetch using TanStack Query (cached when possible)
        return await queryClient.fetchQuery(queryConfig);


    } catch (err) {
        // Axios error handling
        if (axios.isAxiosError(err)) {
            // 404 → treat as "no results"
            if (err.response?.status === 404) {
                return {
                    items: [],
                    currentPage: 1,
                    pageSize: 20,
                    totalPages: 1,
                    totalCount: 0
                } as PagedList<Animal>;
            }
            // Re-throw redirects (from missing page param)
            if (err instanceof Response) {
                throw err;
            }

            // Parse error using centralized error handler
            const apiError = parseApiError(err);

            throw new Response(
                JSON.stringify({
                    message: apiError.message,
                    type: apiError.type,
                    details: apiError.details
                }),
                {
                    status: apiError.statusCode ?? 500,
                }
            );
        }
    }
}


