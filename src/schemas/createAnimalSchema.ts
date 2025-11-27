import { z } from "zod";

/**
 * Zod schema for individual image validation
 *
 * Validates:
 * - File type (must be File instance)
 * - File size (max 5MB)
 * - File format (JPG, PNG, WEBP only)
 * - Description (min 3 characters)
 * - isPrincipal flag (boolean)
 */
export const imageSchema = z.object({
    file: z.instanceof(File, { message: "Ficheiro inválido" })
        .refine(
            (file) => file.size <= 5000000,
            "A imagem não pode exceder 5MB"
        )
        .refine(
            (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
            "Apenas ficheiros JPG, PNG ou WEBP são permitidos"
        ),
    description: z.string()
        .min(3, "A descrição deve ter pelo menos 3 caracteres")
        .max(255, "A descrição não pode exceder 255 caracteres"),
    isPrincipal: z.boolean()
});

/**
 * Complete Zod schema for animal creation form
 *
 * Includes all required fields from ReqCreateAnimalDto and image upload validation.
 * Provides type-safe validation with Portuguese error messages.
 *
 * @example
 * const form = useForm<AnimalFormData>({
 *   resolver: zodResolver(animalFormSchema)
 * });
 */
export const animalFormSchema = z.object({
    // Basic Information
    name: z.string()
        .min(2, "O nome deve ter pelo menos 2 caracteres")
        .max(100, "O nome não pode exceder 100 caracteres"),

    species: z.enum(["Dog", "Cat", "Other"], {
        message: "Selecione uma espécie válida"
    }),

    breedId: z.string()
        .uuid("Selecione uma raça válida")
        .min(1, "A raça é obrigatória"),

    size: z.enum(["Small", "Medium", "Large"], {
        message: "Selecione um porte válido"
    }),

    sex: z.enum(["Male", "Female"], {
        message: "Selecione o sexo do animal"
    }),

    colour: z.string()
        .min(1, "A cor é obrigatória")
        .max(50, "A cor não pode exceder 50 caracteres"),

    birthDate: z.string()
        .min(1, "A data de nascimento é obrigatória")
        .refine((date) => {
            const parsedDate = new Date(date);
            return !isNaN(parsedDate.getTime());
        }, "Data inválida")
        .refine((date) => {
            const parsedDate = new Date(date);
            return parsedDate <= new Date();
        }, "A data de nascimento não pode ser no futuro"),

    sterilized: z.boolean(),

    cost: z.number({
        message: "O custo deve ser um número"
    })
        .positive("O custo deve ser positivo")
        .max(10000, "O custo não pode exceder 10000€"),

    // Optional Fields
    features: z.string()
        .max(500, "As características não podem exceder 500 caracteres")
        .optional()
        .or(z.literal("")),

    description: z.string()
        .max(1000, "A descrição não pode exceder 1000 caracteres")
        .optional()
        .or(z.literal("")),

    // Images Array
    images: z.array(imageSchema)
        .min(1, "Adicione pelo menos 1 imagem do animal")
        .max(10, "Não pode adicionar mais de 10 imagens")
        .refine(
            (images) => {
                const principalCount = images.filter(img => img.isPrincipal).length;
                return principalCount === 1;
            },
            "Exatamente 1 imagem deve ser marcada como principal"
        )
});

/**
 * TypeScript type inferred from the Zod schema
 * Use this type with React Hook Form for type-safe form handling
 *
 * @example
 * const form = useForm<AnimalFormData>({
 *   resolver: zodResolver(animalFormSchema)
 * });
 */
export type AnimalFormData = z.infer<typeof animalFormSchema>;

/**
 * Type for individual image in the form
 */
export type ImageFormData = z.infer<typeof imageSchema>;