import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {animalFormSchema, type AnimalFormData} from "@/schemas/createAnimalSchema";
import ImageUploadField from "@/components/features/ImageUploadField/ImageUploadField";
import styles from "./AnimalForm.module.css";
import {useQuery} from "@tanstack/react-query";
import {breedsApi} from "@/api/breeds";


/**
 * Props for the AnimalForm component
 */
interface AnimalFormProps {
    /**
     * Form mode: create or edit
     */
    mode: "create" | "edit";

    /**
     * Default values for the form (used in edit mode)
     */
    defaultValues?: Partial<AnimalFormData>;

    /**
     * Form submission handler
     */
    onSubmit: (data: AnimalFormData) => Promise<void>;

    /**
     * Loading state during submission
     */
    isSubmitting: boolean;

    /**
     * API error message to display
     */
    apiError: string | null;

    /**
     * Cancel button handler
     */
    onCancel: () => void;
}

/**
 * AnimalForm component - Reusable form for creating and editing animals.
 *
 * @component
 * @param {AnimalFormProps} props - Component props.
 * @returns {JSX.Element} A complete animal data form.
 *
 * @description
 * This component manages and validates animal data using:
 * - React Hook Form
 * - Zod validation schema
 * - TanStack Query for fetching breeds
 *
 * The form includes:
 * - Basic information (name, species, breed, size, colour, birth date)
 * - Sex selection
 * - Health and cost information
 * - Optional fields (features, description)
 * - Image upload with preview
 *
 * It is fully reusable for **create** and **edit** operations based on props.
 *
 * @example
 * // Create mode
 * <AnimalForm
 *   mode="create"
 *   onSubmit={handleCreate}
 *   isSubmitting={isCreating}
 *   apiError={createError}
 *   onCancel={() => navigate(-1)}
 * />
 *
 * @example
 * // Edit mode
 * <AnimalForm
 *   mode="edit"
 *   defaultValues={animal}
 *   onSubmit={handleUpdate}
 *   isSubmitting={isUpdating}
 *   apiError={updateError}
 *   onCancel={() => navigate(-1)}
 * />
 */
function AnimalForm({
                        mode,
                        defaultValues,
                        onSubmit,
                        isSubmitting,
                        apiError,
                        onCancel
                    }: AnimalFormProps) {
    const methods = useForm<AnimalFormData>({
        resolver: zodResolver(animalFormSchema),
        defaultValues: defaultValues || {
            name: "",
            species: undefined,
            breedId: "",
            size: undefined,
            sex: undefined,
            colour: "",
            birthDate: "",
            sterilized: false,
            cost: 0,
            features: "",
            description: "",
            images: []
        }
    });

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = methods;
    console.log("ALL ERRORS:", errors);
    console.log("Has errors?", Object.keys(errors).length > 0);
    console.log("Form errors:", errors);
    console.log("isSubmitting:", isSubmitting);

    // Fetch breeds from API
    const {data: breeds, isLoading: isBreedsLoading} = useQuery({
        queryKey: ['breeds'],
        queryFn: ({signal}) => breedsApi.getBreeds({signal})
    });


    const submitButtonText = mode === "create"
        ? (isSubmitting ? "A criar..." : "Criar Animal")
        : (isSubmitting ? "A guardar..." : "Guardar Alterações");

    return (
        <FormProvider {...methods}>
            {/* API Error Message */}
            {apiError && (
                <div className={styles.errorAlert}>
                    <p className={styles.errorAlertTitle}>
                        {mode === "create" ? "Erro ao criar animal" : "Erro ao editar animal"}
                    </p>
                    <p className={styles.errorAlertMessage}>{apiError}</p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                {/* Basic Information Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Informação Básica</h2>

                    <div className={styles.formGrid}>
                        {/* Name */}
                        <div className={styles.formGroup}>
                            <label htmlFor="name" className={styles.label}>
                                Nome <span className={styles.required}>*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                {...register("name")}
                                className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                                placeholder="Ex: Rex"
                            />
                            {errors.name && (
                                <span className={styles.error}>{errors.name.message}</span>
                            )}
                        </div>

                        {/* Species */}
                        <div className={styles.formGroup}>
                            <label htmlFor="species" className={styles.label}>
                                Espécie <span className={styles.required}>*</span>
                            </label>
                            <select
                                id="species"
                                {...register("species")}
                                className={`${styles.select} ${errors.species ? styles.inputError : ""}`}
                            >
                                <option value="">Selecione...</option>
                                <option value="Dog">Cão</option>
                                <option value="Cat">Gato</option>
                            </select>
                            {errors.species && (
                                <span className={styles.error}>{errors.species.message}</span>
                            )}
                        </div>

                        {/* Breed  */}
                        <div className={styles.formGroup}>
                            <label htmlFor="breedId" className={styles.label}>
                                Raça <span className={styles.required}>*</span>
                            </label>
                            <select
                                id="breedId"
                                {...register("breedId")}
                                className={`${styles.select} ${errors.breedId ? styles.inputError : ""}`}
                                disabled={isBreedsLoading}
                            >
                                <option value="">
                                    {isBreedsLoading ? "A carregar raças..." : "Selecione..."}
                                </option>
                                {breeds?.map(breed => (
                                    <option key={breed.id} value={breed.id}>
                                        {breed.name}
                                    </option>
                                ))}
                            </select>
                            {errors.breedId && (
                                <span className={styles.error}>{errors.breedId.message}</span>
                            )}
                        </div>

                        {/* Size */}
                        <div className={styles.formGroup}>
                            <label htmlFor="size" className={styles.label}>
                                Porte <span className={styles.required}>*</span>
                            </label>
                            <select
                                id="size"
                                {...register("size")}
                                className={`${styles.select} ${errors.size ? styles.inputError : ""}`}
                            >
                                <option value="">Selecione...</option>
                                <option value="Small">Pequeno</option>
                                <option value="Medium">Médio</option>
                                <option value="Large">Grande</option>
                            </select>
                            {errors.size && (
                                <span className={styles.error}>{errors.size.message}</span>
                            )}
                        </div>

                        {/* Colour */}
                        <div className={styles.formGroup}>
                            <label htmlFor="colour" className={styles.label}>
                                Cor <span className={styles.required}>*</span>
                            </label>
                            <input
                                id="colour"
                                type="text"
                                {...register("colour")}
                                className={`${styles.input} ${errors.colour ? styles.inputError : ""}`}
                                placeholder="Ex: Castanho"
                            />
                            {errors.colour && (
                                <span className={styles.error}>{errors.colour.message}</span>
                            )}
                        </div>

                        {/* Birth Date */}
                        <div className={styles.formGroup}>
                            <label htmlFor="birthDate" className={styles.label}>
                                Data de Nascimento <span className={styles.required}>*</span>
                            </label>
                            <input
                                id="birthDate"
                                type="date"
                                {...register("birthDate")}
                                className={`${styles.input} ${errors.birthDate ? styles.inputError : ""}`}
                            />
                            {errors.birthDate && (
                                <span className={styles.error}>{errors.birthDate.message}</span>
                            )}
                        </div>
                    </div>
                </section>

                {/* Sex Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Sexo <span className={styles.required}>*</span></h2>
                    <div className={styles.radioGroup}>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                value="Male"
                                {...register("sex")}
                                className={styles.radio}
                            />
                            <span>Macho</span>
                        </label>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                value="Female"
                                {...register("sex")}
                                className={styles.radio}
                            />
                            <span>Fêmea</span>
                        </label>
                    </div>
                    {errors.sex && (
                        <span className={styles.error}>{errors.sex.message}</span>
                    )}
                </section>

                {/* Health & Cost Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Saúde e Custo</h2>

                    <div className={styles.formGrid}>
                        {/* Sterilized */}
                        <div className={styles.formGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    {...register("sterilized")}
                                    className={styles.checkbox}
                                />
                                <span>Animal esterilizado</span>
                            </label>
                        </div>

                        {/* Cost */}
                        <div className={styles.formGroup}>
                            <label htmlFor="cost" className={styles.label}>
                                Custo Mensal (€) <span className={styles.required}>*</span>
                            </label>
                            <input
                                id="cost"
                                type="number"
                                step="0.01"
                                {...register("cost", {valueAsNumber: true})}
                                className={`${styles.input} ${errors.cost ? styles.inputError : ""}`}
                                placeholder="Ex: 50.00"
                            />
                            {errors.cost && (
                                <span className={styles.error}>{errors.cost.message}</span>
                            )}
                        </div>
                    </div>
                </section>

                {/* Optional Information Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Informação Adicional (Opcional)</h2>

                    <div className={styles.formGrid}>
                        {/* Features */}
                        <div className={styles.formGroup}>
                            <label htmlFor="features" className={styles.label}>
                                Características
                            </label>
                            <textarea
                                id="features"
                                {...register("features")}
                                className={`${styles.textarea} ${errors.features ? styles.inputError : ""}`}
                                placeholder="Ex: Muito brincalhão, gosta de crianças..."
                                rows={4}
                            />
                            {errors.features && (
                                <span className={styles.error}>{errors.features.message}</span>
                            )}
                        </div>

                        {/* Description */}
                        <div className={styles.formGroup}>
                            <label htmlFor="description" className={styles.label}>
                                Descrição
                            </label>
                            <textarea
                                id="description"
                                {...register("description")}
                                className={`${styles.textarea} ${errors.description ? styles.inputError : ""}`}
                                placeholder="Ex: História do animal, necessidades especiais..."
                                rows={4}
                            />
                            {errors.description && (
                                <span className={styles.error}>{errors.description.message}</span>
                            )}
                        </div>
                    </div>
                </section>

                {/* Images Section */}
                <section className={styles.section}>
                    <ImageUploadField/>
                </section>

                {/* Form Actions */}
                <div className={styles.actions}>
                    <button
                        type="button"
                        onClick={onCancel}
                        className={styles.cancelButton}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting}
                    >
                        {submitButtonText}
                    </button>
                </div>
            </form>
        </FormProvider>
    );
}

export default AnimalForm;