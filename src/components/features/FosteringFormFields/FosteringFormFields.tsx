import styles from "./FosteringFormFields.module.css";
import type { FosteringFormData } from "@/schemas/fosteringFormSchema";
import type { UseFormReturn } from "react-hook-form";

/**
 * FosteringFormFields Component
 *
 * Renders all input fields required for the fostering personal information form:
 * - Full name
 * - NIF
 * - IBAN (forced PT50 prefix)
 * - CVV
 *
 * This component receives the react-hook-form instance and uses it to bind
 * validation, error messages, masking logic and input normalization.
 */

interface Props {
  /** React Hook Form instance controlling the fostering form */
  form: UseFormReturn<FosteringFormData>;
}

export function FosteringFormFields({ form }: Props) {
  return (
    <>
      {/* Full Name */}
      <div className={styles.field}>
        <label>Nome Completo</label>
        <input
          data-testid="fullName-input"
          type="text"
          {...form.register("fullName")}
          className={styles.input}
        />
        {form.formState.errors.fullName && (
          <p data-testid="error-fullName" className={styles.error}>
            {form.formState.errors.fullName.message}
          </p>
        )}
      </div>

      {/* NIF */}
      <div className={styles.field}>
        <label>NIF</label>
        <input
          data-testid="nif-input"
          type="text"
          maxLength={9}
          {...form.register("nif")}
          className={styles.input}
          onInput={(e) => {
            e.currentTarget.value = e.currentTarget.value
              .replace(/\D/g, "")    // only digits
              .slice(0, 9);           // max length 9
          }}
        />
        {form.formState.errors.nif && (
          <p data-testid="error-nif" className={styles.error}>{form.formState.errors.nif.message}</p>
        )}
      </div>

      {/* IBAN */}
      <div className={styles.field}>
        <label>IBAN</label>
        <input
          data-testid="iban-input"
          type="text"
          maxLength={25}
          {...form.register("iban")}
          className={styles.input}
          onInput={(e) => {
            let value = e.currentTarget.value.toUpperCase();

            // Force PT50 prefix
            if (!value.startsWith("PT50")) {
              value = "PT50" + value.replace(/[^0-9]/g, "");
            }

            const digits = value.slice(4).replace(/\D/g, "").slice(0, 21);
            e.currentTarget.value = "PT50" + digits;
          }}
        />
        {form.formState.errors.iban && (
          <p data-testid="error-iban" className={styles.error}>{form.formState.errors.iban.message}</p>
        )}
      </div>

      {/* CVV */}
      <div className={styles.field}>
        <label>CVV</label>
        <input
           data-testid="cvv-input"
          type="text"
          maxLength={3}
          {...form.register("cvv")}
          className={styles.input}
          onInput={(e) => {
            e.currentTarget.value = e.currentTarget.value
              .replace(/\D/g, "")
              .slice(0, 3);
          }}
        />
        {form.formState.errors.cvv && (
          <p data-testid="error-cvv" className={styles.error}>{form.formState.errors.cvv.message}</p>
        )}
      </div>
    </>
  );
}
