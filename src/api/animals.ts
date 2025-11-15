import type {Animal} from "@/types/animal";
import {api} from "./api.ts";
import type {PagedList} from "@/types/pagedList";

export const animalsApi = {
    getAnimals: async function ({ pageNumber, signal }: {pageNumber?: string, signal: AbortSignal}) : Promise<PagedList<Animal>> {
        const { data } = await api.get<PagedList<Animal>>("/animals", {
            signal: signal,
            params: pageNumber ? { pageNumber: pageNumber } : {},
        })

        return data;
    },

    getAnimalDetails: async function ({ id, signal }: { id: string,  signal: AbortSignal }):Promise<Animal> {
        const { data } = await api.get<Animal>(`/animals/${id}`, {
            signal: signal,
        })
        return data;
    }
    //..... resto dos endpoints
}
