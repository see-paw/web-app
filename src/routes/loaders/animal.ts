import {type LoaderFunctionArgs, redirect} from "react-router-dom";
import axios from "axios";
import {queryClient} from "@/lib/queryClient";
import {animalsApi} from "@/api/animals";

/**
 * React Router loader for the animals page
 * Fetches paginated animal data and ensures page query param exists
 * 
 * @param {LoaderFunctionArgs} args - Loader arguments from React Router
 * @param {Request} args.request - The incoming request object
 * @returns {Promise<PagedList<Animal>>} Paginated list of animals
 * @throws {Response} When page param is missing (redirects to page 1)
 * @throws {Response} When API request fails with error status and message
 */
export async function animalsLoader({ request }: LoaderFunctionArgs)  {
    const url = new URL(request.url);
    const page = url.searchParams.get("page");

    if (!page) {
        url.searchParams.set("page", "1");
        throw redirect(url.pathname + "?" + url.searchParams.toString());
    }

    try {
        return await queryClient.fetchQuery({
            queryKey: ["animals", page],
            queryFn: ({signal}) => animalsApi.getAnimals({pageNumber: page, signal})
        })
    } catch (err) {
        const status = axios.isAxiosError(err) ? err.response?.status ?? 500 : 500;

        throw new Response(JSON.stringify({ message: "Não foi possível carregar os animais." }), {
            status: status,
            statusText: "Loader Error",
            headers: { "Content-Type": "application/json" },
        });
    }
}
