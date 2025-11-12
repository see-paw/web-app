import type {Animal} from "../types/animal.ts";
import {api} from "./api.ts";

export const animalsApi = {
    getAnimals: async function (pageNumber?: string) : Promise<Animal[]> {
        const { data } = await api.get<Animal[]>("/animals", {
            params: pageNumber ? { pageNumber: pageNumber } : {},
        })

        return data;
    }
    //..... resto dos endpoints
}
