import { useState } from "react";
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

    const currentImage = images[currentIndex];

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Botão Fechar */}
                <button className={styles.closeButton} onClick={onClose}>
                    ✕
                </button>

                {/* Imagem Atual */}
                <div className={styles.imageWrapper}>
                    <img
                        src={currentImage.url}
                        alt={currentImage.description || `Imagem ${currentIndex + 1}`}
                        className={styles.image}
                    />
                </div>

                {/* Contador de imagens */}
                <div className={styles.counter}>
                    {currentIndex + 1} / {images.length}
                </div>

                {/* Botões de Navegação */}
                {images.length > 1 && (
                    <>
                        <button className={styles.navButton} style={{ left: 'var(--spacing-4)' }} onClick={goToPrevious}>
                            ‹
                        </button>
                        <button className={styles.navButton} style={{ right: 'var(--spacing-4)' }} onClick={goToNext}>
                            ›
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}