import type { Animal } from "@/types/animal";
import AnimalCard from "@/components/features/AnimalCard/AnimalCard";
import styles from "./AnimalList.module.css";

/**
 * Props for the AnimalList component.
 * 
 * @interface AnimalListProps
 * @property {Animal[]} [animals] - Optional array of animal objects to display
 */
interface AnimalListProps {
    animals?: Animal[];
}

/**
 * AnimalList component that displays a grid of animal cards.
 * 
 * @component
 * @param {AnimalListProps} props - The component props
 * @param {Animal[]} [props.animals] - Optional array of animal objects to display
 * @returns {JSX.Element} A section with grid of animal cards or empty state message
 * 
 * @description
 * This component:
 * - Displays animals in a responsive grid layout
 * - Shows an empty state message when no animals are available
 * - Renders individual AnimalCard components for each animal
 * - Provides semantic HTML structure with section and ARIA labels
 * 
 * Features:
 * - Empty state handling with user-friendly message
 * - Grid layout for responsive animal card display
 * - Accessibility support with semantic HTML
 * - Test-friendly with data-testid attributes
 * 
 * @example
 * // With animals
 * <AnimalList animals={[
 *   { id: "1", name: "Luna", age: 2, ... },
 *   { id: "2", name: "Max", age: 3, ... }
 * ]} />
 * 
 * @example
 * // Empty state
 * <AnimalList animals={[]} />
 * 
 * @example
 * // With undefined animals (also shows empty state)
 * <AnimalList />
 */
function AnimalList({ animals }: AnimalListProps) {
    if (!animals || animals.length === 0) {
        return (
            <section aria-labelledby="animals-title" data-testid="animal-list-empty">
                <p className={styles.empty} data-testid="no-results-message">
                    Nenhum animal encontrado
                </p>
            </section>
        );
    }

    return (
        <section aria-labelledby="animals-title" data-testid="animal-list">
            <div className={styles.grid} data-testid="animals-grid">
                {animals.map(animal => (
                    <AnimalCard key={animal.id} animal={animal} />
                ))}
            </div>
        </section>
    );
}

export default AnimalList;
