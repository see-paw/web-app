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

  const predefinedValues = [10, 15, 20];
  const MIN_VALUE = 10;

  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [customValue, setCustomValue] = useState("");

  const handleContinue = () => {
    const value = selectedValue ?? Number(customValue);

    if (!value || value <= 0) return; 

    navigate(`/animals/${animal.id}/foster/form?value=${value}`);
  };

   // check if the choosen amount is valid (>= 10€)
  const isValid = () => {
    const value = selectedValue ?? Number(customValue);
    return value >= MIN_VALUE;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Apadrinhar {animal.name}</h1>

      <p className={styles.subtitle}>
        Escolha a contribuição mensal que desejar: 
      </p>

      <div className={styles.options}>
        {predefinedValues.map((amount) => (
          <button
           data-testid={`select-value-${amount}`}
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
        <label className={styles.customLabel}>Outra quantia (acima de 10€):</label>
        <input
          data-testid="custom-value-input"
          type="text"
          placeholder="Defina um valor..."
          className={styles.customInput}
          value={customValue}
          onChange={(e) => {
            let val = e.target.value;

            // Allow only digits , and .
            val = val.replace(/[^\d.,]/g, "");

            // Swap , by . 
            val = val.replace(",", ".");

            // Only one .
            const parts = val.split(".");
            if (parts.length > 2) {
              val = parts.shift() + "." + parts.join("");
            }

            setCustomValue(val);
            setSelectedValue(null);
          }}
        />

      </div>
      <div className={styles.buttonsWrapper}>
          <button
            data-testid="back-button"
              className={styles.primaryButton}
              onClick={() => navigate(-1)}
          >
              Voltar
          </button>

          <button
              data-testid="continue-button"
              className={styles.primaryButton}
              disabled={!isValid()}
              onClick={handleContinue}
          >
              Continuar
          </button>
      </div>
  </div>
  );
}
