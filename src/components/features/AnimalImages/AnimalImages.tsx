import type { Image } from "@/types/image";
import styles from "./AnimalImages.module.css";
import {useState} from "react";
import ImageGalleryModal from "@/components/common/ImageGalleryModal/ImageGalleryModal";
import Portal from "@/components/common/Portal/Portal";

interface AnimalImagesProps {
    images: Image[];
}

export default function AnimalImages({images}:AnimalImagesProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialImageIndex, setInitialImageIndex] = useState(0);

    const mainImage = images.find(img=> img.isPrincipal) ?? images[0];
    const otherImages = images.filter(img=> img.id !== mainImage.id);

    const orderedImages = [mainImage, ...otherImages];

    const visibleThumbs = otherImages.slice(0,2);
    const remainingCount = otherImages.length-2;

    const openModal = (index: number) => {
        setInitialImageIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const getRealImageIndex = (imageId: string): number => {
        return orderedImages.findIndex(img => img.id === imageId);
    };

    return (
        <div className={styles.container}>
            {/* Imagem Principal */}
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

                    {/* Se houver mais de 2 miniaturas */}
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
            {/* Modal de Galeria */}
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