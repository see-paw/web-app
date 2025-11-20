import {useEffect, useState} from "react";
import type { Image } from "@/types/image";
import styles from "./ImageGalleryModal.module.css";

interface ImageGalleryModalProps {
    images: Image[];
    initialIndex?: number;
    onClose: () => void;
}

export default function ImageGalleryModal({
                                              images,
                                              initialIndex = 0,
                                              onClose
                                          }: ImageGalleryModalProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    // Prevenir scroll do body quando modal está aberto
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    // Fechar com ESC
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);


    const currentImage = images[currentIndex];

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

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
                            style={{ left: 'var(--spacing-4)' }}
                            onClick={goToPrevious}
                            data-testid="modal-prev-button"
                            aria-label="Imagem anterior"
                        >
                            ‹
                        </button>
                        <button
                            className={styles.navButton}
                            style={{ right: 'var(--spacing-4)' }}
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