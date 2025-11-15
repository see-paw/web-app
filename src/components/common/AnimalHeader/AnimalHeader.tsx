import styles from "./AnimalHeader.module.css";
interface AnimalHeaderProps {
    name: string;
    sex: string
}

export default function AnimalHeader({ name, sex }: AnimalHeaderProps) {

    const article = sex.toLowerCase() === "fêmea" ? "a" : "o";

    return (
        <div className={styles.header}>
            <h1>
                Olá, eu sou {article}{" "}
                <span className={styles.name}>{name}</span>! ❤️
            </h1>
        </div>
    );
}