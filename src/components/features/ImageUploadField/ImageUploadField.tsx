import { useFieldArray, useFormContext } from "react-hook-form";
import type { AnimalFormData } from "@/schemas/createAnimalSchema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faImage } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import styles from "./ImageUploadField.module.css";

/**
 * ImageUploadField component for managing animal image uploads
 *
 * @component
 * @returns {JSX.Element} Image upload field with preview and management
 *
 * @description
 * This component provides:
 * - Multiple image file selection
 * - Image preview with thumbnails
 * - Description input per image
 * - Principal image selection (radio buttons)
 * - Image removal
 * - Validation feedback from Zod schema
 *
 * Uses React Hook Form's useFieldArray for dynamic array management
 *
 * @example
 * // Inside a form with FormProvider
 * <ImageUploadField />
 */
function ImageUploadField() {
    const {
        control,
        register,
        formState: { errors },
        setValue,
        watch
    } = useFormContext<AnimalFormData>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "images"
    });

    const [previews, setPreviews] = useState<string[]>([]);

    /**
     * Handles file selection from input
     * Creates preview URLs and appends to form array
     */
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        files.forEach((file, index) => {
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setPreviews(prev => [...prev, previewUrl]);

            // Append to form array
            append({
                file: file,
                description: "",
                isPrincipal: fields.length === 0 && index === 0 // First image is principal by default
            });
        });

        // Reset input
        e.target.value = "";
    };

    /**
     * Removes an image from the array
     * Also revokes the preview URL to free memory
     */
    const handleRemove = (index: number) => {
        // Revoke preview URL
        if (previews[index]) {
            URL.revokeObjectURL(previews[index]);
        }

        // Remove from previews array
        setPreviews(prev => prev.filter((_, i) => i !== index));

        // Remove from form array
        remove(index);

        // If removed image was principal and there are still images, make first one principal
        const images = watch("images");
        if (images.length > 0) {
            const hasPrincipal = images.some(img => img.isPrincipal);
            if (!hasPrincipal) {
                setValue("images.0.isPrincipal", true);
            }
        }
    };

    /**
     * Sets an image as principal
     * Unsets all others
     */
    const handleSetPrincipal = (index: number) => {
        fields.forEach((_, i) => {
            setValue(`images.${i}.isPrincipal`, i === index);
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>
                    Imagens <span className={styles.required}>*</span>
                </h3>
                <p className={styles.subtitle}>
                    Adicione pelo menos 1 imagem (máximo 10). Marque uma como principal.
                </p>
            </div>

            {/* Upload Button */}
            <div className={styles.uploadSection}>
                <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={handleFileSelect}
                    className={styles.fileInput}
                    id="image-upload"
                    disabled={fields.length >= 10}
                />
                <label
                    htmlFor="image-upload"
                    className={`${styles.uploadButton} ${fields.length >= 10 ? styles.uploadButtonDisabled : ""}`}
                >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Selecionar Imagens</span>
                </label>
                <span className={styles.uploadHint}>
                    JPG, PNG ou WEBP (máx. 5MB por imagem)
                </span>
            </div>

            {/* Images Grid */}
            {fields.length > 0 && (
                <div className={styles.imagesGrid}>
                    {fields.map((field, index) => (
                        <div key={field.id} className={styles.imageCard}>
                            {/* Preview */}
                            <div className={styles.imagePreview}>
                                {previews[index] ? (
                                    <img
                                        src={previews[index]}
                                        alt={`Preview ${index + 1}`}
                                        className={styles.previewImage}
                                    />
                                ) : (
                                    <div className={styles.previewPlaceholder}>
                                        <FontAwesomeIcon icon={faImage} size="3x" />
                                    </div>
                                )}

                                {/* Remove Button */}
                                <button
                                    type="button"
                                    onClick={() => handleRemove(index)}
                                    className={styles.removeButton}
                                    aria-label="Remover imagem"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>

                            {/* Description Input */}
                            <div className={styles.imageInfo}>
                                <label
                                    htmlFor={`image-description-${index}`}
                                    className={styles.descriptionLabel}
                                >
                                    Descrição
                                </label>
                                <input
                                    id={`image-description-${index}`}
                                    type="text"
                                    {...register(`images.${index}.description`)}
                                    placeholder="Descreva a imagem..."
                                    className={`${styles.descriptionInput} ${
                                        errors.images?.[index]?.description ? styles.inputError : ""
                                    }`}
                                />
                                {errors.images?.[index]?.description && (
                                    <span className={styles.error}>
                                        {errors.images[index]?.description?.message}
                                    </span>
                                )}

                                {/* Principal Radio */}
                                <label className={styles.principalLabel}>
                                    <input
                                        type="radio"
                                        name="principalImage"
                                        checked={watch(`images.${index}.isPrincipal`)}
                                        onChange={() => handleSetPrincipal(index)}
                                        className={styles.principalRadio}
                                    />
                                    <span>Imagem Principal</span>
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {fields.length === 0 && (
                <div className={styles.emptyState}>
                    <FontAwesomeIcon icon={faImage} size="3x" className={styles.emptyIcon} />
                    <p className={styles.emptyText}>Nenhuma imagem adicionada</p>
                    <p className={styles.emptyHint}>Clique em "Selecionar Imagens" para começar</p>
                </div>
            )}

            {/* Global Images Error */}
            {errors.images && typeof errors.images.message === 'string' && (
                <span className={styles.error}>{errors.images.message}</span>
            )}
        </div>
    );
}

export default ImageUploadField;