import type {Animal} from "@/types/animal";
import {api} from "./api.ts";
import type {PagedList} from "@/types/pagedList";

/**
 * API client for animal-related endpoints
 * 
 * @namespace animalsApi
 */
export const animalsApi = {
    /**
     * Fetches a paginated list of animals
     * 
     * @param {Object} params - Request parameters
     * @param {string} [params.pageNumber] - Page number to fetch
     * @param {AbortSignal} params.signal - Abort signal for cancelling the request
     * @returns {Promise<PagedList<Animal>>} Paginated list of animals
     */
    getAnimals: async function ({ pageNumber, signal }: {pageNumber?: string, signal: AbortSignal}) : Promise<PagedList<Animal>> {
        const { data } = await api.get<PagedList<Animal>>("/animals", {
            signal: signal,
            params: pageNumber ? { pageNumber: pageNumber } : {},
        })

        return data;
    }
    //..... resto dos endpoints
}
