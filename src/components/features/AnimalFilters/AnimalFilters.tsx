import { useState, type FormEvent } from "react";
import styles from "./AnimalFilters.module.css";

/**
 * Interface for animal filter values
 */
export interface AnimalFilterValues {
    name?: string;
    species?: string;
    age?: number;
    size?: string;
    sex?: string;
    breed?: string;
    shelterName?: string;
}

/**
 * Props for the AnimalFilters component
 */
interface AnimalFiltersProps {
    onApplyFilters: (filters: AnimalFilterValues) => void;
    onClearFilters: () => void;
    initialFilters?: AnimalFilterValues;
}

/**
 * AnimalFilters component that provides a form to filter animals.
 *
 * @component
 * @param {AnimalFiltersProps} props - The component props
 * @param {Function} props.onApplyFilters - Callback when filters are applied
 * @param {Function} props.onClearFilters - Callback when filters are cleared
 * @param {AnimalFilterValues} [props.initialFilters] - Initial filter values
 * @returns {JSX.Element} A filter form with various input fields
 *
 * @description
 * This component provides:
 * - Text input for animal name search
 * - Select dropdown for species (Dog, Cat, Other)
 * - Number input for age
 * - Select dropdown for size (Small, Medium, Large)
 * - Select dropdown for sex (Male, Female)
 * - Text input for breed
 * - Apply and Clear buttons
 *
 * Features:
 * - Controlled form inputs with local state
 * - Validation and empty value handling
 * - Responsive design
 * - Accessibility with labels and ARIA attributes
 *
 * @example
 * <AnimalFilters
 *   onApplyFilters={(filters) => console.log(filters)}
 *   onClearFilters={() => console.log('cleared')}
 * />
 */
function AnimalFilters({
                           onApplyFilters,
                           onClearFilters,
                           initialFilters = {}
                       }: AnimalFiltersProps) {
    const [name, setName] = useState(initialFilters.name ?? "");
    const [species, setSpecies] = useState(initialFilters.species ?? "");
    const [age, setAge] = useState(initialFilters.age?.toString() ?? "");
    const [size, setSize] = useState(initialFilters.size ?? "");
    const [sex, setSex] = useState(initialFilters.sex ?? "");
    const [breed, setBreed] = useState(initialFilters.breed ?? "");

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Build filters object, only including non-empty values
        const filters: AnimalFilterValues = {};

        if (name.trim()) filters.name = name.trim();
        if (species) filters.species = species;
        if (age) filters.age = parseInt(age, 10);
        if (size) filters.size = size;
        if (sex) filters.sex = sex;
        if (breed.trim()) filters.breed = breed.trim();

        onApplyFilters(filters);
    };

    const handleClear = () => {
        setName("");
        setSpecies("");
        setAge("");
        setSize("");
        setSex("");
        setBreed("");
        onClearFilters();
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.filtersGrid}>
                    {/* Name Filter */}
                    <div className={styles.filterGroup}>
                        <label htmlFor="filter-name" className={styles.label}>
                            Nome
                        </label>
                        <input
                            id="filter-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Procurar por nome..."
                            className={styles.input}
                            data-testid="filter-name"
                        />
                    </div>

                    {/* Species Filter */}
                    <div className={styles.filterGroup}>
                        <label htmlFor="filter-species" className={styles.label}>
                            Espécie
                        </label>
                        <select
                            id="filter-species"
                            value={species}
                            onChange={(e) => setSpecies(e.target.value)}
                            className={styles.select}
                            data-testid="filter-species"
                        >
                            <option value="">Todas</option>
                            <option value="Dog">Cão</option>
                            <option value="Cat">Gato</option>
                            <option value="Other">Outro</option>
                        </select>
                    </div>

                    {/* Age Filter */}
                    <div className={styles.filterGroup}>
                        <label htmlFor="filter-age" className={styles.label}>
                            Idade
                        </label>
                        <input
                            id="filter-age"
                            type="number"
                            min="0"
                            max="30"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="Idade..."
                            className={styles.input}
                            data-testid="filter-age"
                        />
                    </div>

                    {/* Size Filter */}
                    <div className={styles.filterGroup}>
                        <label htmlFor="filter-size" className={styles.label}>
                            Porte
                        </label>
                        <select
                            id="filter-size"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            className={styles.select}
                            data-testid="filter-size"
                        >
                            <option value="">Todos</option>
                            <option value="Small">Pequeno</option>
                            <option value="Medium">Médio</option>
                            <option value="Large">Grande</option>
                        </select>
                    </div>

                    {/* Sex Filter */}
                    <div className={styles.filterGroup}>
                        <label htmlFor="filter-sex" className={styles.label}>
                            Sexo
                        </label>
                        <select
                            id="filter-sex"
                            value={sex}
                            onChange={(e) => setSex(e.target.value)}
                            className={styles.select}
                            data-testid="filter-sex"
                        >
                            <option value="">Todos</option>
                            <option value="Male">Macho</option>
                            <option value="Female">Fêmea</option>
                        </select>
                    </div>

                    {/* Breed Filter */}
                    <div className={styles.filterGroup}>
                        <label htmlFor="filter-breed" className={styles.label}>
                            Raça
                        </label>
                        <input
                            id="filter-breed"
                            type="text"
                            value={breed}
                            onChange={(e) => setBreed(e.target.value)}
                            placeholder="Procurar por raça..."
                            className={styles.input}
                            data-testid="filter-breed"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className={styles.actions}>
                    <button
                        type="button"
                        onClick={handleClear}
                        className={styles.clearButton}
                        data-testid="clear-filters-button"
                    >
                        Limpar Filtros
                    </button>
                    <button
                        type="submit"
                        className={styles.applyButton}
                        data-testid="apply-filters-button"
                    >
                        Aplicar Filtros
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AnimalFilters;