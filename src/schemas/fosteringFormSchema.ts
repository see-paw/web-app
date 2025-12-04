import { z } from "zod";

/**
 * Zod schema for validating the fostering form.
 *
 * Includes:
 * - Full name
 * - Portuguese NIF (tax number)
 * - Portuguese IBAN
 * - CVV (3 digits)
 *
 * All validation messages are written in English.
 */
export const fosteringFormSchema = z.object({
  fullName: z.string()
    .min(2, "O nome completo deve ter no mínimo 2 caracteres"),

  nif: z.string()
    .regex(/^\d{9}$/, "O NIF deve conter 9 dígitos"),

  iban: z.string()
    .regex(/^PT50\d{21}$/, "O IBAN deve seguir o formato PT50 seguido de 21 dígitos"),

  cvv: z.string()
    .regex(/^\d{3}$/, "O CVV deve conter 3 dígitos")
});

/**
 * TypeScript type automatically inferred from the schema.
 * Use with React Hook Form for strongly typed form handling.
 */
export type FosteringFormData = z.infer<typeof fosteringFormSchema>;
