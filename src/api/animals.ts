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
     * @throws {Error} When the API request fails
     */
    getAnimals: async function ({ pageNumber, signal }: {pageNumber?: string, signal: AbortSignal}) : Promise<PagedList<Animal>> {
        const { data } = await api.get<PagedList<Animal>>("/animals", {
            signal: signal,
            params: pageNumber ? { pageNumber: pageNumber } : {},
        })

        return data;
    },

    /**
     * Fetches full details of a single animal by ID.
     *
     * This endpoint is used for the Animal Details Page and includes:
     *  - Images
     *  - Description
     *  - Attributes (size, age, sterilized, etc.)
     *
     *
     * @param {Object} params - Request parameters
     * @param {string} params.id - Animal ID to fetch
     * @param {AbortSignal} params.signal - Abort signal for request cancellation
     * @returns {Promise<Animal>}
     *    A promise resolving to a full Animal object
     * @throws {Error}
     *    When the request fails or the animal is not found
     */
    getAnimalDetails: async function ({ id, signal }: { id: string,  signal: AbortSignal }):Promise<Animal> {
        const { data } = await api.get<Animal>(`/animals/${id}`, {
            signal: signal,
        })
        return data;
    }
    //..... resto dos endpoints
}
