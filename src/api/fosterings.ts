import { api } from "./api";
import type { AddFostering } from "@/types/addFostering";
import type { ActiveFostering } from "@/types/activeFostering";

/**
 * API client for fostering-related actions.
 *
 * Provides functions to create and (in the future) retrieve fosterings.
 *
 * @namespace fosteringsApi
 */
export const fosteringsApi = {
    /**
     * Create a new fostering for an animal.
     *
     * @function createFostering
     * @memberof fosteringsApi
     *
     * @param {string} animalId - The ID of the animal to foster.
     * @param {AddFosteringRequest} payload - Contains the monthly fostering value.
     *
     * @returns {Promise<ActiveFostering>} The full fostering record returned by the backend.
     *
     * @throws {Error} When the request fails.
     */
    createFostering: async (
        animalId: string,
        payload: AddFostering
    ): Promise<ActiveFostering> => {
        const { data } = await api.post<ActiveFostering>(
            `/fosterings/${animalId}/fosterings`,
            payload
        );

        return data;
    },
};
