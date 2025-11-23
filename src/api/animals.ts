import type {Animal} from "@/types/animal";
import {api} from "./api.ts";
import type {PagedList} from "@/types/pagedList";
import type {AnimalFilterValues} from "@/components/features/AnimalFilters/AnimalFilters";

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
    },


    /**
     * Fetches paginated list of animals belonging to a specific shelter
     *
     * @param {string} params.shelterId - The ID of the shelter
     * @param {string} params.pageNumber - The page number to fetch (1-indexed)
     * @param {AbortSignal} [params.signal] - Optional abort signal for request cancellation
     * @returns {Promise<PagedList<Animal>>} Paginated list of animals
     *
     * @example
     * const animals = await sheltersApi.getAnimalsByShelter({
     *   shelterId: "123",
     *   pageNumber: "1"
     * });
     *
     * @throws {Error} If the API request fails
     */
    getAnimalsByShelter: async ({ shelterId, pageNumber, signal }: {shelterId: string; pageNumber: string; signal?: AbortSignal}): Promise<PagedList<Animal>> => {
        const {data} = await api.get<PagedList<Animal>>( `/${shelterId}/animals`,{
            params: pageNumber ? { pageNumber: pageNumber } : {},
            signal
            }
        );

        return data;
    },

    getAnimalsWithFilters: async ({
                                      pageNumber,
                                      filters,
                                      signal
                                  }: {pageNumber: string; filters: AnimalFilterValues; signal?: AbortSignal}): Promise<PagedList<Animal>> => {
        const params: Record<string, string> = {
            pageNumber
        };

        // Add filters to params (only non-empty values)
        if (filters.name) params.Name = filters.name;
        if (filters.species) params.Species = filters.species;
        if (filters.age !== undefined) params.Age = filters.age.toString();
        if (filters.size) params.Size = filters.size;
        if (filters.sex) params.Sex = filters.sex;
        if (filters.breed) params.Breed = filters.breed;
        if (filters.shelterName) params.ShelterName = filters.shelterName;

        const response = await api.get<PagedList<Animal>>(
            '/animals',
            {
                params,
                signal
            }
        );
        return response.data;
    }






    //..... resto dos endpoints
}
