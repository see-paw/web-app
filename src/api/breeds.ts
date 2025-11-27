import { api } from "./api";
import type { Breed } from "@/types/breed";

/**
 * API client for breed-related endpoints
 */
export const breedsApi = {
    /**
     * Fetches all breeds
     * Automatically syncs with external API if database is empty (backend responsibility)
     *
     * @param {AbortSignal} signal - Abort signal for cancelling the request
     * @returns {Promise<Breed[]>} List of all breeds
     *
     * @example
     * const breeds = await breedsApi.getBreeds({ signal });
     *
     * @throws {Error} When the API request fails
     */
    getBreeds: async ({ signal }: { signal?: AbortSignal }): Promise<Breed[]> => {
        const { data } = await api.get<Breed[]>("/animals/breeds", {
            signal
        });

        return data;
    }
};