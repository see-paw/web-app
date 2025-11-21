import type {LoaderFunctionArgs} from "react-router-dom";
import {queryClient} from "@/lib/queryClient";
import {animalsApi} from "@/api/animals";
import axios from "axios";



/**
 * Loader responsible for fetching the details of a specific animal.
 *
 * @function animalDetailsLoader
 * @param {LoaderFunctionArgs} args - Loader arguments provided by React Router
 * @param {object} args.params - Route parameters
 * @param {string} args.params.animalId - The ID of the animal from the route
 * @returns {Promise<unknown>} The fetched animal data (automatically returned to the route component)
 *
 * @description
 * This loader integrates **React Router v6.4+ Data APIs** with **React Query**.
 * It ensures that animal details:
 *  - Are preloaded before rendering the route
 *  - Are cached via React Query
 *  - Can be cancelled via AbortSignal
 *
 * Behavior:
 * 1. Validates that `animalId` exists.
 * 2. Fetches data using `queryClient.fetchQuery()` to allow caching and deduplication.
 * 3. Handles Axios-specific errors and throws formatted `Response` objects.
 *    (Loaders must throw Responses for the ErrorBoundary to catch them.)
 *
 * Error Handling:
 * - Missing ID → throws 400 Bad Request
 * - API/network failure → throws Response with appropriate HTTP status
 *
 * This enables consistent server-like error responses for client-side routing.
 *
 * @example
 * ```tsx
 * <Route
 *   path="/animals/:animalId"
 *   loader={animalDetailsLoader}
 *   element={<AnimalDetails />}
 *   errorElement={<ErrorFallback />}
 * />
 * ```
 */
export async function animalDetailsLoader({params }: LoaderFunctionArgs)  {
    const id = params.animalId;

    /** Ensure ID exists in the route */
    if (!id) {
        // Loaders don't "return" errors — they *throw* them for the route's errorElement
        throw new Response("Animal ID não fornecido", { status: 400 });
    }

    try{
        /**
         * Fetch animal details using React Query.
         * - Caches the result under key ["animals", id]
         * - Supports AbortSignal via the loader integration
         */
        return await queryClient.fetchQuery({
            queryKey:["animals", id],
            queryFn:({signal})=>animalsApi.getAnimalDetails({id, signal}),

        })
    }
    catch(error){
        /**
         * If API fails:
         * - Detect Axios errors safely
         * - Extract HTTP status if available
         * - Throw a Response for React Router’s error handling system
         */
        const status = axios.isAxiosError(error) ? error.response?.status ?? 500:500;
        throw new Response(JSON.stringify({ message: "Não foi possível carregar o animal." }), {
            status,
            statusText: "Loader Error",
            headers: { "Content-Type": "application/json" },
        });
    }
}