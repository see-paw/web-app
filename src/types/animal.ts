import type {Image} from "./image.ts";
import type {Breed} from "./breed.ts";

export interface Animal {
    id: string
    name: string
    species: string
    size: string
    sex: string
    breed: Breed
    animalState: string
    colour: string
    birthDate: string
    age: number
    description: string
    sterilized: boolean
    features: string
    cost: number
    shelterId: string
    images: Image[]
}

