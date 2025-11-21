import {useEffect, useState} from "react";
import type {Image} from "@/types/image";
import styles from "./ImageGalleryModal.module.css";

/**
 * Props for the ImageGalleryModal component.
 *
 * @interface ImageGalleryModalProps
 * @property {Image[]} images - Array of images to display inside the modal
 * @property {number} [initialIndex=0] - Image index to display first (0-based)
 * @property {() => void} onClose - Callback triggered when the modal should close
 */
interface ImageGalleryModalProps {
    images: Image[];
    initialIndex?: number;
    onClose: () => void;
}

/**
 * ImageGalleryModal component that displays a full-screen modal
 * with a navigable image gallery.
 *
 * @component
 * @param {ImageGalleryModalProps} props - Component props
 * @returns {JSX.Element} A modal overlay containing an interactive image gallery
 *
 * @description
 * This modal provides:
 * - Full-screen overlay for user focus and immersion
 * - Body scroll lock while open (prevents background scroll)
 * - ESC key handling for accessibility and usability
 * - Circular navigation between images (previous/next buttons)
 * - Click-outside-to-close behavior via overlay click
 * - ARIA roles for accessibility support (dialog, aria-modal)
 *
 * Features:
 * - Displays image description as alt text when available
 * - Navigation buttons only appear when there is more than one image
 * - Counter indicating current position ("1 / 5")
 * - Prevents propagation from modal content so overlay click works correctly
 *
 * @example
 * ```tsx
 * <ImageGalleryModal
 *   images={animal.images}
 *   initialIndex={0}
 *   onClose={() => setOpen(false)}
 * />
 * ```
 */
export default function ImageGalleryModal({
    images,
    initialIndex = 0,
    onClose
    }: ImageGalleryModalProps) {

    /** Tracks which image is currently displayed */
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    /**
     * Disable body scroll when modal is open.
     * On cleanup, restore original overflow setting.
     */
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    /**
     * Close modal when user presses ESC.
     * Added on mount, removed on unmount.
     */
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    /** The currently displayed image object */
    const currentImage = images[currentIndex];

    /** Goes to previous image (circular navigation) */
    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    /** Goes to next image (circular navigation) */
    const goToNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className={styles.overlay} onClick={onClose} data-testid="modal-overlay">
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
                data-testid="modal-content"
                role="dialog"
                aria-modal="true"
                aria-label="Galeria de imagens"
            >
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                    data-testid="modal-close-button"
                    aria-label="Fechar galeria"
                >
                    ✕
                </button>

                <div className={styles.imageWrapper}>
                    <img
                        src={currentImage.url}
                        alt={currentImage.description || `Imagem ${currentIndex + 1}`}
                        className={styles.image}
                        data-testid="modal-image"
                    />
                </div>

                <div className={styles.counter} data-testid="modal-counter">
                    {currentIndex + 1} / {images.length}
                </div>

                {images.length > 1 && (
                    <>
                        <button
                            className={styles.navButton}
                            style={{left: 'var(--spacing-4)'}}
                            onClick={goToPrevious}
                            data-testid="modal-prev-button"
                            aria-label="Imagem anterior"
                        >
                            ‹
                        </button>
                        <button
                            className={styles.navButton}
                            style={{right: 'var(--spacing-4)'}}
                            onClick={goToNext}
                            data-testid="modal-next-button"
                            aria-label="Próxima imagem"
                        >
                            ›
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}