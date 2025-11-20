import styles from "./AnimalHeader.module.css";
interface AnimalHeaderProps {
    name: string;
    sex: string
}

export default function AnimalHeader({ name, sex }: AnimalHeaderProps) {

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