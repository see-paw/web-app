/**
 * Represents an image stored in Cloudinary
 * 
 * @interface Image
 * @property {string} id - Unique identifier
 * @property {string} publicId - Cloudinary public ID for the image
 * @property {boolean} isPrincipal - Whether this is the main/featured image
 * @property {string} url - Full URL to access the image
 * @property {string} description - Alt text or description for the image
 */
export interface Image {
    id: string
    publicId: string
    isPrincipal: boolean
    url: string
    description: string
}
