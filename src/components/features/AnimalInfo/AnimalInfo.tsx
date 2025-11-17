import type {Animal} from "@/types/animal";
import styles from "./AnimalInfo.module.css";
import {useTranslation} from 'react-i18next';


function getAgeDisplay(birthDate: string, age: number): string {
    if (age > 0) {
        return `${age} ${age === 1 ? 'ano' : 'anos'}`;
    }

    // Calcular meses
    const birth = new Date(birthDate);
    const today = new Date();

    const months = (today.getFullYear() - birth.getFullYear()) * 12
        + today.getMonth() - birth.getMonth();

    if (months <= 0) {
        return "Recém-nascido";
    }

    return `${months} ${months === 1 ? 'mês' : 'meses'}`;
}


interface AnimalInfoProps {
    animal: Animal;
}

export default function AnimalInfo({animal}: AnimalInfoProps) {
    const {t} = useTranslation();

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
                    <span className={styles.value}>{t(animal.species)}</span>
                </div>

                <div className={styles.attribute}>
                    <span className={styles.label}>Raça</span>
                    <span className={styles.value}>{animal.breed.name}</span>
                </div>

                <div className={styles.attribute}>
                    <span className={styles.label}>Sexo</span>
                    <span className={styles.value}>{t(animal.sex)}</span>
                </div>

                <div className={styles.attribute}>
                    <span className={styles.label}>Tamanho</span>
                    <span className={styles.value}>{t(animal.size)}</span>
                </div>

                <div className={styles.attribute}>
                    <span className={styles.label}>Cor</span>
                    <span className={styles.value}>{animal.colour}</span>
                </div>

                <div className={styles.attribute}>
                    <span className={styles.label}>Idade</span>
                    <span className={styles.value}>
                        {getAgeDisplay(animal.birthDate, animal.age)}
                    </span>
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