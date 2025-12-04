import type {Animal} from "@/types/animal";
import type {JSX} from "react";
import {Link} from "react-router-dom";
import {useState} from "react";
import fallback from "@/assets/fallback_image.png"
import styles from "./AnimalCard.module.css";
import AnimalStatusBadge, {type AnimalState} from "@/components/features/AnimalStatusBadge/AnimalStatusBadge";

/**
 * Props for the AnimalCard component.
 *
 * @interface AnimalCardProps
 * @property {Animal} animal - The animal data to display
 */
export interface AnimalCardProps {
    animal: Animal,
    showStatus?: boolean;
}

/**
 * AnimalCard component that displays a summary card for an animal.
 *
 * @component
 * @param {AnimalCardProps} props - The component props
 * @param {Animal} props.animal - The animal object containing all relevant data
 * @returns {JSX.Element} A card element with animal information
 *
 * @description
 * This component displays:
 * - Animal's principal image (or fallback if unavailable/error)
 * - Animal's name (as a clickable link)
 * - Animal's breed name (or "Raça desconhecida" if null)
 * - Animal's age with proper singular/plural handling
 *
 * Features:
 * - Error handling for image loading failures
 * - Lazy loading for images to improve performance
 * - Fallback image when principal image is missing or fails to load
 * - Accessibility with ARIA labels
 * - Link to detailed animal page
 * - Responsive design with CSS modules
 *
 * @example
 * <AnimalCard animal={{
 *   id: "123",
 *   name: "Luna",
 *   age: 2,
 *   breed: { name: "Golden Retriever" },
 *   images: [{ url: "...", description: "...", isPrincipal: true }]
 * }} />
 *
 * @example
 * // In a list context
 * {animals.map(animal => (
 *   <AnimalCard key={animal.id} animal={animal} />
 * ))}
 */
function AnimalCard({animal, showStatus = false}: AnimalCardProps): JSX.Element {
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
                {showStatus && animal.animalState && (
                    <div className={styles.badgeWrapper}>
                        <AnimalStatusBadge
                            status={animal.animalState as AnimalState}
                             size="sm"
                        />
                    </div>
                )}
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
