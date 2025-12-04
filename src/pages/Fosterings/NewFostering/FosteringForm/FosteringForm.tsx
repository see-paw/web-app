import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import type { Animal } from "@/types/animal";
import styles from "./FosteringForm.module.css";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  fosteringFormSchema,
  type FosteringFormData,
} from "@/schemas/fosteringFormSchema";

import { useMutation } from "@tanstack/react-query";
import { fosteringsApi } from "@/api/fosterings";
import { queryClient } from "@/lib/queryClient";
import { parseApiError } from "@/utils/parseApiError";
import { FosteringFormFields } from "@/components/features/FosteringFormFields/FosteringFormFields"


export default function FosterForm() {
  const animal = useLoaderData() as Animal;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const monthValue = Number(searchParams.get("value")); // Only value sent to backend
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<FosteringFormData>({
    resolver: zodResolver(fosteringFormSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      nif: "",
      iban: "PT50",
      cvv: ""
    },
  });

  /**
   * Backend only receives:
   * { monthValue: number }
   */
  const mutation = useMutation({
    mutationFn: () =>
      fosteringsApi.createFostering(animal.id, {
        monthValue: monthValue,
      }),

    onSuccess: (fostering) => {
      queryClient.invalidateQueries({ queryKey: ["animals", animal.id] });

      navigate(`/animals/${animal.id}/foster/confirmation`, {
        state: {
          fostering,
          formData: form.getValues(), 
          monthValue,
          animal,
        },
      });
    },

    onError: (error: unknown) => {
      const parsed = parseApiError(error);
      setApiError(parsed.message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  });

 
  const onSubmit = () => {
    setApiError(null);
    mutation.mutate(); // Only sends monthValue
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Insira os seus dados pessoais</h1>

      {apiError && <p data-testid="api-error" className={styles.apiError}>{apiError}</p>}

      <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
        
         <FosteringFormFields form={form} />

        {/* Buttons */}
        <div className={styles.buttonsWrapper}>
          <button
            data-testid="form-back-button"
            type="button"
            className={styles.primaryButton}
            onClick={() => navigate(-1)}
          >
            Voltar
          </button>

          <button
            data-testid="form-submit-button"
            type="submit"
            className={styles.primaryButton}
            disabled={!form.formState.isValid || mutation.isPending}
          >
            {mutation.isPending ? "A enviar..." : "Submeter"}
          </button>
        </div>
      </form>
    </div>
  );
}
