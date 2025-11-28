import { useLoaderData, useNavigate } from "react-router-dom";
import type { Animal } from "@/types/animal";
import { useState } from "react";
import styles from "./SelectFosterValue.module.css";

/**
 * SelectFosterValue page
 *
 * @description
 * First step of the fostering flow. Allows the authenticated user
 * to choose the monthly fostering amount:
 * - One of the predefined values (5, 10, 15, 20 EUR)
 * - Or a custom amount through an input field
 *
 * User is redirected to the next step (Foster Form) with the selected
 * value passed as a query parameter.
 *
 * Data:
 * - Loaded through newFosteringLoader
 * - Includes full animal details for UI display
 */
export default function SelectFosterValue() {
  const animal = useLoaderData() as Animal;
  const navigate = useNavigate();

  const predefinedValues = [5, 10, 15, 20];

  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [customValue, setCustomValue] = useState("");

  const handleContinue = () => {
    const value = selectedValue ?? Number(customValue);

    if (!value || value <= 0) return; // basic validation

    navigate(`/animals/${animal.id}/foster/form?value=${value}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Foster {animal.name}</h1>

      <p className={styles.subtitle}>
        Choose the monthly amount you wish to contribute
      </p>

      <div className={styles.options}>
        {predefinedValues.map((amount) => (
          <button
            key={amount}
            className={`${styles.amountButton} ${
              selectedValue === amount ? styles.selected : ""
            }`}
            onClick={() => {
              setSelectedValue(amount);
              setCustomValue("");
            }}
          >
            {amount}€
          </button>
        ))}
      </div>

      <div className={styles.customInputWrapper}>
        <label className={styles.customLabel}>Other amount</label>
        <input
          type="number"
          placeholder="Defina um valor..."
          className={styles.customInput}
          value={customValue}
          onChange={(e) => {
            setCustomValue(e.target.value);
            setSelectedValue(null);
          }}
          min={1}
        />
      </div>

      <button
        className={styles.continueButton}
        onClick={handleContinue}
        disabled={!(selectedValue || Number(customValue) > 0)}
      >
        Continue
      </button>
    </div>
  );
}
