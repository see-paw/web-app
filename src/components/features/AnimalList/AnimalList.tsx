import type { Animal } from "@/types/animal";
import AnimalCard from "@/components/features/AnimalCard/AnimalCard";
import styles from "./AnimalList.module.css";

interface AnimalListProps {
    animals?: Animal[];
}

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
