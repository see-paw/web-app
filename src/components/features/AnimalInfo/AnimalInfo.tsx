import type {Animal} from "@/types/animal";
import styles from "./AnimalInfo.module.css";

interface AnimalInfoProps {
    animal: Animal;
}

export default function AnimalInfo({ animal }: AnimalInfoProps) {
    return (
        <div className={styles.container}>

            {/* Descrição */}
            <div className={styles.description}>
                <p>{animal.description}</p>
            </div>

            {/* Atributos */}
            <div className={styles.attributesGrid}>

                <div className={styles.attribute}>
                    <span className={styles.label}>Espécie</span>
                    <span className={styles.value}>{animal.species}</span>
                </div>

                <div className={styles.attribute}>
                    <span className={styles.label}>Raça</span>
                    <span className={styles.value}>{animal.breed.name}</span>
                </div>

                <div className={styles.attribute}>
                    <span className={styles.label}>Sexo</span>
                    <span className={styles.value}>{animal.sex}</span>
                </div>

                <div className={styles.attribute}>
                    <span className={styles.label}>Tamanho</span>
                    <span className={styles.value}>{animal.size}</span>
                </div>

                <div className={styles.attribute}>
                    <span className={styles.label}>Cor</span>
                    <span className={styles.value}>{animal.colour}</span>
                </div>

                <div className={styles.attribute}>
                    <span className={styles.label}>Idade</span>
                    <span className={styles.value}>{animal.age} anos</span>
                </div>

                <div className={styles.attribute}>
                    <span className={styles.label}>Esterilizado</span>
                    <span className={styles.value}>
                        {animal.sterilized ? "Sim" : "Não"}
                    </span>
                </div>

                {animal.features && (
                    <div className={styles.attribute}>
                        <span className={styles.label}>Características</span>
                        <span className={styles.value}>{animal.features}</span>
                    </div>
                )}
            </div>

        </div>
    );

}