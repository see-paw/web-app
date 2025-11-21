import type { Image } from "@/types/image";
import styles from "./AnimalImages.module.css";
import {useState} from "react";
import ImageGalleryModal from "@/components/common/ImageGalleryModal/ImageGalleryModal";
import Portal from "@/components/common/Portal/Portal";

/**
 * Props for the AnimalImages component.
 *
 * @interface AnimalImagesProps
 * @property {Image[]} images - List of images associated with the animal.
 *   The array should contain at least one image.
 *   The principal image is selected via `isPrincipal`, if available.
 */
interface AnimalImagesProps {
    images: Image[];
}

/**
 * AnimalImages component that displays:
 * - The main (principal) animal image
 * - Up to two thumbnails
 * - A "View more images" button when additional images exist
 * - A full-screen modal gallery (via Portal)
 *
 * @component
 * @param {AnimalImagesProps} props - Component props
 * @returns {JSX.Element} The image gallery UI for an animal
 *
 * @description
 * This component provides a complete image-viewing experience for the user.
 * It handles:
 * - Selection of the principal image (via `isPrincipal`, fallback to index 0)
 * - Sorting: principal image first, followed by all remaining images
 * - Thumbnail display (maximum of 2)
 * - A modal image gallery opened via Portal
 * - Calculation of the correct modal index when clicking thumbnails
 *
 * Features:
 * - Click-to-open modal on main image and thumbnails
 * - Circular navigation inside the modal (handled by ImageGalleryModal)
 * - Dynamic “View +X images” button when more than two thumbnails exist
 * - Styled layout using CSS Modules
 * - Fully testable via data-testid attributes
 *
 * @example
 * ```tsx
 * <AnimalImages images={animal.images} />
 * ```
 */
export default function AnimalImages({images}:AnimalImagesProps) {
    /** Tracks whether the modal is currently open */
    const [isModalOpen, setIsModalOpen] = useState(false);

    /** Determines which image index should be shown first when modal opens */
    const [initialImageIndex, setInitialImageIndex] = useState(0);

    /**
     * Select the principal image.
     * Fallback to the first image if none is marked as principal.
     */
    const mainImage = images.find(img=> img.isPrincipal) ?? images[0];

    /** All images except the principal one */
    const otherImages = images.filter(img=> img.id !== mainImage.id);

    /**
     * Ordered list for modal:
     * principal → all remaining images
     */
    const orderedImages = [mainImage, ...otherImages];

    /** Only show at most two thumbnails */
    const visibleThumbs = otherImages.slice(0,2);

    /** How many images remain undisplayed as thumbnails */
    const remainingCount = otherImages.length-2;

    /**
     * Opens the modal at the correct index.
     */
    const openModal = (index: number) => {
        setInitialImageIndex(index);
        setIsModalOpen(true);
    };

    /** Closes the modal */
    const closeModal = () => {
        setIsModalOpen(false);
    };

    /**
     * Converts an image ID into its index inside `orderedImages`.
     */
    const getRealImageIndex = (imageId: string): number => {
        return orderedImages.findIndex(img => img.id === imageId);
    };

    return (
        <div className={styles.container}>
            {/* Main Image */}
            <div className={styles.mainImageWrapper} data-testid="main-image-wrapper" onClick={() => openModal(getRealImageIndex(mainImage.id))}
                 style={{ cursor: 'pointer' }}>
                <img
                    src={mainImage.url}
                    alt={mainImage.description || "imagem principal"}
                    className={styles.mainImage}
                    data-testid="main-image"
                />
            </div>

            {/* Thumbnails */}
            {otherImages.length > 0 && (
                <div className={styles.thumbGrid} data-testid="thumbnail-grid">
                    {visibleThumbs.map((img) => (
                        <div
                            key={img.id}
                            className={styles.thumbnailWrapper}
                            onClick={() => openModal(getRealImageIndex(img.id))}
                            data-testid="thumbnail"
                        >
                            <img src={img.url} alt={img.description || img.id} />
                        </div>
                    ))}

                    {/* "View more images" badge when there are more than 2 thumbnails */}
                    {remainingCount > 0 && (
                        <div
                            className={styles.thumbnailMore}
                            onClick={() => openModal(getRealImageIndex(mainImage.id))}
                            data-testid="view-more-images"
                        >
                            <span className={styles.moreLabel}>
                                Ver +{remainingCount} imagens
                            </span>
                        </div>
                    )}
                </div>
            )}
            {/* Modal Gallery rendered in Portal */}
            {isModalOpen && (
                <Portal>
                    <ImageGalleryModal
                        images={orderedImages}
                        initialIndex={initialImageIndex}
                        onClose={closeModal}
                    />
                </Portal>
            )}
        </div>
    );
}