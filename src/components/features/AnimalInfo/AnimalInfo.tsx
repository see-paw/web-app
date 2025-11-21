import type {Animal} from "@/types/animal";
import styles from "./AnimalInfo.module.css";
import {useTranslation} from 'react-i18next';

/**
 * Computes a human-friendly age label for an animal.
 *
 * - If age ≥ 1 year → returns "X ano(s)"
 * - Otherwise → calculates age in months
 * - If less than 1 month → returns "Recém-nascido"
 *
 * @function getAgeDisplay
 * @param {string} birthDate - ISO birth date string of the animal
 * @param {number} age - Age in years (if available from backend)
 * @returns {string} A formatted age label
 *
 * @example
 * getAgeDisplay("2024-01-12", 2) → "2 anos"
 *
 * @example
 * getAgeDisplay("2024-09-01", 0) → "3 meses"
 */
function getAgeDisplay(birthDate: string, age: number): string {
    if (age > 0) {
        return `${age} ${age === 1 ? 'ano' : 'anos'}`;
    }

    // Calculate months based on date difference
    const birth = new Date(birthDate);
    const today = new Date();

    const months = (today.getFullYear() - birth.getFullYear()) * 12
        + today.getMonth() - birth.getMonth();

    if (months <= 0) {
        return "Recém-nascido";
    }

    return `${months} ${months === 1 ? 'mês' : 'meses'}`;
}


/**
 * Props for the AnimalInfo component.
 *
 * @interface AnimalInfoProps
 * @property {Animal} animal - The full Animal object containing all descriptive attributes
 */
interface AnimalInfoProps {
    animal: Animal;
}


/**
 * AnimalInfo component that displays all descriptive and categorical
 * information about an animal, including:
 * - Description
 * - Species, breed, sex, size, colour
 * - Age (auto-formatted into years or months)
 * - Sterilization status
 * - Optional extra features
 *
 * @component
 * @param {AnimalInfoProps} props - Component props
 * @returns {JSX.Element} A panel with the formatted animal information
 *
 * @description
 * This component is used in the Animal Details Page, providing a complete
 * overview of an animal's characteristics. It includes translation support
 * via `react-i18next`, allowing dynamic localization of:
 * - Species
 * - Sex
 * - Size
 *
 * Features:
 * - Age calculation in years or months
 * - Conditional rendering for optional features
 * - Semantic structure using a labelled attribute grid
 * - Fully testable using data-testid attributes for every attribute
 *
 * @example
 * ```tsx
 * <AnimalInfo animal={selectedAnimal} />
 * ```
 */
export default function AnimalInfo({animal}: AnimalInfoProps) {
    const {t} = useTranslation();

    return (
        <div className={styles.container}>

            {/* Description Section  */}
            <div className={styles.description} data-testid="animal-description">
                <p>{animal.description}</p>
            </div>

            {/* Attribute Grid */}
            <div className={styles.attributesGrid} data-testid="attributes-grid">

                <div className={styles.attribute} data-testid="attribute-species">
                    <span className={styles.label}>Espécie</span>
                    <span className={styles.value} data-testid="attribute-value">{t(animal.species)}</span>
                </div>

                <div className={styles.attribute} data-testid="attribute-breed">
                    <span className={styles.label}>Raça</span>
                    <span className={styles.value} data-testid="attribute-value">{animal.breed.name}</span>
                </div>

                <div className={styles.attribute} data-testid="attribute-sex">
                    <span className={styles.label}>Sexo</span>
                    <span className={styles.value} data-testid="attribute-value">{t(animal.sex)}</span>
                </div>

                <div className={styles.attribute} data-testid="attribute-size">
                    <span className={styles.label}>Tamanho</span>
                    <span className={styles.value} data-testid="attribute-value">{t(animal.size)}</span>
                </div>

                <div className={styles.attribute} data-testid="attribute-colour">
                    <span className={styles.label}>Cor</span>
                    <span className={styles.value} data-testid="attribute-value">{animal.colour}</span>
                </div>

                <div className={styles.attribute} data-testid="attribute-age">
                    <span className={styles.label}>Idade</span>
                    <span className={styles.value} data-testid="attribute-value">
                        {getAgeDisplay(animal.birthDate, animal.age)}
                    </span>
                </div>

                <div className={styles.attribute} data-testid="attribute-sterilized">
                    <span className={styles.label}>Esterilizado</span>
                    <span className={styles.value} data-testid="attribute-value">
                        {animal.sterilized ? "Sim" : "Não"}
                    </span>
                </div>

                {animal.features && (
                    <div className={styles.attribute} data-testid="attribute-features">
                        <span className={styles.label}>Características</span>
                        <span className={styles.value} data-testid="attribute-value">{animal.features}</span>
                    </div>
                )}
            </div>

        </div>
    );

}