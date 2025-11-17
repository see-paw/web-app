import type { Image } from "@/types/image";
import styles from "./AnimalImages.module.css";
import {useState} from "react";
import ImageGalleryModal from "@/components/common/ImageGalleryModal/ImageGalleryModal";

interface AnimalImagesProps {
    images: Image[];
}

export default function AnimalImages({images}:AnimalImagesProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialImageIndex, setInitialImageIndex] = useState(0);

    const mainImage = images.find(img=> img.isPrincipal) ?? images[0];
    const otherImages = images.filter(img=> img.id !== mainImage.id);

    const visibleThumbs = otherImages.slice(0,2);
    const remainingCount = otherImages.length-2;

    const openModal = (index: number) => {
        setInitialImageIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={styles.container}>
            {/* Imagem Principal */}
            <div className={styles.mainImageWrapper}>
                <img
                    src={mainImage.url}
                    alt={mainImage.description || "imagem principal"}
                    className={styles.mainImage}
                />
            </div>

            {/* Thumbnails */}
            {otherImages.length > 0 && (
                <div className={styles.thumbGrid}>
                    {visibleThumbs.map((img, index) => (
                        <div
                            key={img.id}
                            className={styles.thumbnailWrapper}
                            onClick={() => openModal(index + 1)}
                        >
                            <img src={img.url} alt={img.description || img.id} />
                        </div>
                    ))}

                    {/* Se houver mais de 2 miniaturas */}
                    {remainingCount > 0 && (
                        <div
                            className={styles.thumbnailMore}
                            onClick={() => openModal(0)}
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
                <ImageGalleryModal
                    images={images}
                    initialIndex={initialImageIndex}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}