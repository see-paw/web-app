import type { Animal } from "./animal";
import type { Image } from "./image";

/**
 * Request payload for creating a new animal
 * Derived from Animal interface but excludes auto-generated fields
 */
export type CreateAnimalRequest = Pick<
    Animal,
    | "name"
    | "species"
    | "size"
    | "sex"
    | "colour"
    | "birthDate"
    | "sterilized"
    | "cost"
> & {
    /**
     * The unique identifier of the animal's breed
     */
    breedId: string;
    /**
    * Additional physical or behavioral features (optional)
    */
    features?: string;

    /**
     * A textual description or summary (optional)
     */
    description?: string;
};

/**
 * Image metadata for upload
 * Derived from Image interface but only includes editable fields
 */
export type ImageUploadData = Pick<Image, "description" | "isPrincipal">;

/**
 * Response from creating a new animal
 * Returns the unique identifier of the created animal
 */
export type CreateAnimalResponse = string;

