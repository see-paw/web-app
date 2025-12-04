import styles from "./ProgressBar.module.css";

export function ProgressBar({ current, max }: { current: number; max: number }) {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className={styles.wrapper } data-testid="fostering-progress-bar">
      <div className={styles.bar}>
        <div
          className={styles.fill}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <span className={styles.label} data-testid="fostering-progress-percentage">
        {percentage.toFixed(0)}%
      </span>
    </div>
  );
}
