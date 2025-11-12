import type {Animal} from "@/types/animal";
import AnimalCard from "@/components/features/AnimalCard";
import styles from "./AnimalList.module.css";

interface AnimalListProps {
    animals: Animal[];
}

function AnimalList({ animals }: AnimalListProps) {
    if (!animals || animals.length === 0) {
        return (
            <section className={styles.container} aria-labelledby="animals-title">
                <p className={styles.empty}>
                    Nenhum animal encontrado
                </p>
            </section>
        );
    }

    return (
        <section className={styles.container} aria-labelledby="animals-title">
            <div className={styles.grid}>
                {animals.map(animal => (
                    <AnimalCard key={animal.id} animal={animal}/>
                ))}
            </div>
        </section>
    );
}

export default AnimalList;
