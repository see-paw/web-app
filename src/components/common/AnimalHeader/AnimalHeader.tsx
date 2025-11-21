import styles from "./AnimalHeader.module.css";
/**
 * Props for the AnimalHeader component.
 *
 * @interface AnimalHeaderProps
 * @property {string} name - The name of the animal to be displayed
 * @property {string} sex - The animal's biological sex ("male" or "female")
 */
interface AnimalHeaderProps {
    name: string;
    sex: string
}

/**
 * AnimalHeader component that displays a personalized greeting
 * for an animal using the correct Portuguese article and styling.
 *
 * @component
 * @param {AnimalHeaderProps} props - The component props
 * @param {string} props.name - The animal's name
 * @param {string} props.sex - The animal's sex ("male" or "female")
 * @returns {JSX.Element} A header element introducing the animal
 *
 * @description
 * This component renders:
 * - A greeting sentence: "Olá, eu sou o/a ..."
 * - Automatically selects the correct article in Portuguese
 *   based on the `sex` prop.
 * - Highlights the animal's name with custom CSS styling.
 * - Includes a friendly heart emoji at the end for UI appeal.
 *
 * Features:
 * - Semantic and accessible HTML
 * - CSS modules for style encapsulation
 * - Deterministic article logic ("female" → "a", otherwise "o")
 * - Fully testable via data-testid attributes
 *
 * @example
 * <AnimalHeader name="Luna" sex="female" />
 *
 * @example
 * <AnimalHeader name="Max" sex="male" />
 */
export default function AnimalHeader({ name, sex }: AnimalHeaderProps) {

    /**
     * Determines the correct Portuguese article based on sex.
     * "female" → "a"
     * any other value → "o"
     */
    const article = sex.toLowerCase() === "female" ? "a" : "o";

    return (
        <div className={styles.header}>
            <h1 data-testid="animal-header-title">
                Olá, eu sou {article}{" "}
                <span className={styles.name} data-testid="animal-name">{name}</span>! ❤️
            </h1>
        </div>
    );
}