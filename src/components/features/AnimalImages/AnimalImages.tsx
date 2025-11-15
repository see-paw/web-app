import type { Image } from "@/types/image";
import styles from "./AnimalImages.module.css";

interface AnimalImagesProps {
    images: Image[];
}

export default function AnimalImages({images}:AnimalImagesProps) {
    const mainImage = images.find(img=> img.isPrincipal) ?? images[0];
    const otherImages = images.filter(img=> img.id !== mainImage.id);

    const visibleThumbs = otherImages.slice(0,2);
    const remainingCount = otherImages.length-2;

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
                    {visibleThumbs.map((img) => (
                        <div
                            key={img.id}
                            className={styles.thumbnailWrapper}
                        >
                            <img src={img.url} alt={img.description || img.id} />
                        </div>
                    ))}

                    {/* Se houver mais de 2 miniaturas */}
                    {remainingCount > 0 && (
                        <div className={styles.thumbnailMore}>
                            <span> className={styles.moreLabel} Ver +{remainingCount} imagens </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}