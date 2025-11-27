import type {Animal} from "@/types/animal";
import {api} from "./api.ts";
import type {PagedList} from "@/types/pagedList";
import type {AnimalFilterValues} from "@/components/features/AnimalFilters/AnimalFilters";
import type { CreateAnimalResponse } from "@/types/createAnimalRequest.ts";

/**
* API client for animal-related endpoints.
*
* Provides functions to retrieve, filter, and create animals.
*
* @namespace animalsApi
*/
export const animalsApi = {
    /**
     * Fetch a paginated list of animals.
     *
     * @function getAnimals
     * @memberof animalsApi
     *
     * @param {Object} params - Request parameters.
     * @param {string} [params.pageNumber] - Page number to fetch.
     * @param {AnimalFilterValues} [params.filters] - Filters to apply (only non-empty values are sent).
     * @param {AbortSignal} params.signal - Abort signal for cancelling the request.
     *
     * @returns {Promise<PagedList<Animal>>} A paginated list of animals.
     *
     * @throws {Error} When the request fails.
     */
    getAnimals: async ({ pageNumber, filters, signal }: {
        pageNumber?: string;
        filters?: AnimalFilterValues;
        signal: AbortSignal
    }): Promise<PagedList<Animal>> => {
        const params: Record<string, string> = {};

        // Add page number
        if (pageNumber) params.pageNumber = pageNumber;

        // Add filters (only non-empty values)
        if (filters) {
            if (filters.name) params.Name = filters.name;
            if (filters.species) params.Species = filters.species;
            if (filters.age !== undefined) params.Age = filters.age.toString();
            if (filters.size) params.Size = filters.size;
            if (filters.sex) params.Sex = filters.sex;
            if (filters.breed) params.Breed = filters.breed;
            if (filters.shelterName) params.ShelterName = filters.shelterName;
        }

        const { data } = await api.get<PagedList<Animal>>('/animals', {
            params,
            signal
        });

        return data;
    },

    /**
     * Fetch full details of a single animal by ID.
     *
     * Used on the Animal Details Page and includes images, attributes, and extended metadata.
     *
     * @function getAnimalDetails
     * @memberof animalsApi
     *
     * @param {Object} params - Request parameters.
     * @param {string} params.id - Animal ID.
     * @param {AbortSignal} params.signal - Abort signal.
     *
     * @returns {Promise<Animal>} The animal details.
     *
     * @throws {Error} If the animal does not exist or the request fails.
     */
    getAnimalDetails: async function ({ id, signal }: { id: string,  signal: AbortSignal }):Promise<Animal> {
        const { data } = await api.get<Animal>(`/animals/${id}`, {
            signal: signal,
        })
        return data;
    },


    /**
     * Fetch a paginated list of animals belonging to a specific shelter.
     *
     * @function getAnimalsByShelter
     * @memberof animalsApi
     *
     * @param {Object} params - Request parameters.
     * @param {string} params.shelterId - ID of the shelter.
     * @param {string} params.pageNumber - Page number to fetch.
     * @param {AnimalFilterValues} [params.filters] - Filters to apply (shelterName is ignored).
     * @param {AbortSignal} [params.signal] - Optional abort signal.
     *
     * @returns {Promise<PagedList<Animal>>} Paginated list of animals for that shelter.
     *
     * @throws {Error} If the request fails.
     */
    getAnimalsByShelter: async ({ shelterId, pageNumber, filters,signal }: {shelterId: string; pageNumber: string; filters?: AnimalFilterValues; signal?: AbortSignal}): Promise<PagedList<Animal>> => {
        // Build query params
        const params: Record<string, string> = {
            pageNumber
        };

        // Add filters to params (only non-empty values)
        // NOTE: shelterName is NOT included because shelterId is already in the path
        if (filters) {
            if (filters.name) params.Name = filters.name;
            if (filters.species) params.Species = filters.species;
            if (filters.age !== undefined) params.Age = filters.age.toString();
            if (filters.size) params.Size = filters.size;
            if (filters.sex) params.Sex = filters.sex;
            if (filters.breed) params.Breed = filters.breed;
            // shelterName is ignored for this endpoint
        }

        const { data } = await api.get<PagedList<Animal>>(
            `/shelters/${shelterId}/animals`,
            {
                params,
                signal
            }
        );

        return data;
    },



    /**
     * Create a new animal with images.
     *
     * Expects a `FormData` object containing:
     * - `animal`: JSON string with the CreateAnimalRequest object.
     * - `images`: JSON string with image metadata (ImageUploadData[]).
     * - `files`: Image files (File[]) appended individually.
     *
     * @function createAnimal
     * @memberof animalsApi
     *
     * @param {FormData} formData - The animal data and image files.
     *
     * @returns {Promise<CreateAnimalResponse>} The created animal ID.
     *
     * @example
     * const formData = new FormData();
     * formData.append("animal", JSON.stringify(animalData));
     * formData.append("images", JSON.stringify(imageMetadata));
     * files.forEach(file => formData.append("files", file));
     *
     * const result = await animalsApi.createAnimal(formData);
     *
     * @throws {Error} When creation fails.
     */
    createAnimal: async (formData: FormData): Promise<CreateAnimalResponse> => {
        const { data } = await api.post<CreateAnimalResponse>('/animals', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return data;
    }






    //..... resto dos endpoints
}
