import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import type { Animal } from "@/types/animal";
import styles from "./FosterForm.module.css";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { fosteringFormSchema, type FosteringFormData } from "@/schemas/fosteringFormSchema";
import { useMutation } from "@tanstack/react-query";
import { fosteringsApi } from "@/api/fosteringsApi";
import { queryClient } from "@/lib/queryClient";
import { parseApiError } from "@/utils/parseApiError";

/**
 * FosterForm page
 *
 * @description
 * Second step of the fostering flow. The authenticated user must
 * fill in the invoice details (name, NIF, IBAN, CVV).
 *
 * The monthly fostering value is received through the query parameter `value`.
 * After submitting the form, the fostering is created in the backend and the
 * UI redirects to the confirmation page with the fostering and form data.
 */
export default function FosterForm() {
  const animal = useLoaderData() as Animal;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const monthValue = Number(searchParams.get("value"));

  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<FosteringFormData>({
    resolver: zodResolver(fosteringFormSchema),
    defaultValues: {
      fullName: "",
      nif: "",
      iban: "",
      cvv: "",
    },
  });

  /**
   * Mutation: creates the fostering (POST) and returns ActiveFostering.
   */
  const mutation = useMutation({
    mutationFn: () =>
      fosteringsApi.createFostering(animal.id, { monthValue }),

    onSuccess: (fostering) => {
      // Invalidate queries with fostering-related data (optional)
      queryClient.invalidateQueries({ queryKey: ["animals", animal.id] });

      // Redirect to confirmation page with form + fostering
      navigate(`/animals/${animal.id}/foster/confirmation`, {
        state: {
          fostering,
          formData: form.getValues(),
          monthValue,
          animal
        },
      });
    },

    onError: (error: unknown) => {
      const parsed = parseApiError(error);
      setApiError(parsed.message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  });

  const onSubmit = (data: FosteringFormData) => {
    setApiError(null);
    mutation.mutate(); // no params needed (monthValue é fixo)
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Confirm fostering of {animal.name}</h1>

      {apiError && <p className={styles.apiError}>{apiError}</p>}

      <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
        {/* Full Name */}
        <div className={styles.field}>
          <label>Full Name</label>
          <input
            type="text"
            {...form.register("fullName")}
            className={styles.input}
          />
          {form.formState.errors.fullName && (
            <p className={styles.error}>
              {form.formState.errors.fullName.message}
            </p>
          )}
        </div>

        {/* NIF */}
        <div className={styles.field}>
          <label>NIF</label>
          <input
            type="text"
            {...form.register("nif")}
            className={styles.input}
          />
          {form.formState.errors.nif && (
            <p className={styles.error}>
              {form.formState.errors.nif.message}
            </p>
          )}
        </div>

        {/* IBAN */}
        <div className={styles.field}>
          <label>IBAN</label>
          <input
            type="text"
            {...form.register("iban")}
            className={styles.input}
          />
          {form.formState.errors.iban && (
            <p className={styles.error}>
              {form.formState.errors.iban.message}
            </p>
          )}
        </div>

        {/* CVV */}
        <div className={styles.field}>
          <label>CVV</label>
          <input
            type="password"
            maxLength={3}
            {...form.register("cvv")}
            className={styles.input}
          />
          {form.formState.errors.cvv && (
            <p className={styles.error}>
              {form.formState.errors.cvv.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Submitting..." : "Confirm"}
        </button>
      </form>
    </div>
  );
}
