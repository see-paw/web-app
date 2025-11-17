import type {Animal} from "@/types/animal";
import type {JSX} from "react";
import {Link} from "react-router-dom";
import {useState} from "react";
import fallback from "@/assets/fallback_image.png"
import styles from "./AnimalCard.module.css";

export interface AnimalCardProps {
    animal: Animal,
}

function AnimalCard({ animal }: AnimalCardProps): JSX.Element {
    const mainImage = animal.images.find(image => image.isPrincipal === true);
    const [imageError, setImageError] = useState(false);

    const imageUrl = (!imageError && mainImage?.url) ? mainImage.url : fallback;
    const imageDescription = (!imageError && mainImage?.description) ? mainImage.description : "No image available";

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <article className={styles.card} data-testid="animal-card">
            <div className={styles.imageContainer} data-testid="animal-image-container">
                <Link to={animal.id} aria-label={`Ver detalhes de ${animal.name}`}>
                    <img
                        src={imageUrl}
                        alt={imageDescription}
                        onError={handleImageError}
                        loading="lazy"
                        data-testid="animal-image"
                    />
                </Link>
            </div>
            <div className={styles.content}>
                <Link
                    to={animal.id}
                    className={styles.name}
                    data-testid="animal-name-link"
                >
                    {animal.name}
                </Link>
                <p className={styles.breed} data-testid="animal-breed">
                    {animal.breed?.name ?? "Raça desconhecida"}
                </p>
                <p className={styles.age} data-testid="animal-age">
                    {animal.age} ano{animal.age === 1 ? "" : "s"}
                </p>
            </div>
        </article>
    );
}

export default AnimalCard;