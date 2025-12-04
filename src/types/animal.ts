import type {Image} from "./image.ts";
import type {Breed} from "./breed.ts";

/**
 * Represents an animal in the shelter system
 * 
 * @interface Animal
 * @property {string} id - Unique identifier
 * @property {string} name - Animal's name
 * @property {string} species - Species type (e.g., "Dog", "Cat")
 * @property {string} size - Size category (e.g., "Small", "Medium", "Large")
 * @property {string} sex - Biological sex (e.g., "Male", "Female")
 * @property {Breed} breed - Breed information
 * @property {string} animalState - Current state (e.g., "Available", "Adopted")
 * @property {string} colour - Primary color
 * @property {string} birthDate - Birth date in ISO format
 * @property {number} age - Age in years
 * @property {string} description - Detailed description
 * @property {boolean} sterilized - Whether the animal is sterilized
 * @property {string} features - Notable features or characteristics
 * @property {number} cost - Monthly cost in currency units
 * @property {string} shelterId - ID of the shelter housing the animal
 * @property {Image[]} images - Array of images
 */
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
    images: Image[],
    currentSupportValue: number;
}
