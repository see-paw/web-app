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
    .min(2, "Full name must contain at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),

  nif: z.string()
    .regex(/^\d{9}$/, "NIF must contain exactly 9 digits"),

  iban: z.string()
    .regex(/^PT50\d{21}$/, "IBAN must follow the format PT50 followed by 21 digits"),

  cvv: z.string()
    .regex(/^\d{3}$/, "CVV must contain exactly 3 digits"),
});

/**
 * TypeScript type automatically inferred from the schema.
 * Use with React Hook Form for strongly typed form handling.
 */
export type FosteringFormData = z.infer<typeof fosteringFormSchema>;
