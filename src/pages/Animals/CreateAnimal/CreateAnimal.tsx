import {useState} from "react";
import {useNavigate} from "react-router-dom";
import type {AnimalFormData} from "@/schemas/createAnimalSchema";
import {useMutation} from "@tanstack/react-query";
import {queryClient} from "@/lib/queryClient";
import {animalsApi} from "@/api/animals";
import AnimalForm from "@/components/features/AnimalForm/AnimalForm";
import styles from "./CreateAnimal.module.css";
import {useAuthStore} from "@/stores/auth.store";
import {parseApiError} from "@/utils/parseApiError";


/**
 * CreateAnimal page component used by AdminCAA to create new animals.
 *
 * @component
 *
 * @description
 * This page:
 * - Renders the `AnimalForm` component
 * - Converts form data to `FormData` suitable for the backend
 * - Handles API communication via `useMutation`
 * - Displays backend errors using a centralized parser
 * - Invalidates cache and redirects to the animal details page on success
 *
 * @returns {JSX.Element} The rendered Create Animal page.
 *
 * @example
 * <Route path="/animals/create" element={<CreateAnimal />} />
 */
function CreateAnimal() {
    const navigate = useNavigate();
    const [apiError, setApiError] = useState<string | null>(null);

    /**
     * Mutation for creating a new animal via API.
     *
     * - Sends FormData to backend
     * - Invalidates animal-related caches
     * - Redirects to the new animal details page
     * - Captures and formats API errors
     *
     * @type {import("@tanstack/react-query").UseMutationResult}
     */
    const mutation = useMutation({
        mutationFn: (formData: FormData) => animalsApi.createAnimal(formData),
        onSuccess: (animalId) => {
            // Invalidate ALL animal caches (Option C)
            queryClient.invalidateQueries({queryKey: ['shelter-animals']});
            queryClient.invalidateQueries({queryKey: ['animals']});

            // Redirect to the created animal's details page
            navigate(`/animals/${animalId}`);
        },
        onError: (error: unknown) => {
            // Use centralized error parser
            const apiError = parseApiError(error);
            setApiError(apiError.message);

            // Scroll to top to show error
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    });

    /**
     * Handles form submission:
     * - Converts structured form data into FormData format
     * - Appends images (file + metadata)
     * - Triggers the mutation that performs the API call
     *
     * @async
     * @param {AnimalFormData} data - Validated form data.
     * @returns {Promise<void>}
     */
    const handleSubmit = async (data: AnimalFormData) => {


        setApiError(null);

        // Create FormData
        const formData = new FormData();
        formData.append('Name', data.name);
        formData.append('Species', data.species);
        formData.append('BreedId', data.breedId);
        formData.append('Size', data.size);
        formData.append('Sex', data.sex);
        formData.append('Colour', data.colour);
        formData.append('BirthDate', data.birthDate);
        formData.append('Sterilized', data.sterilized.toString());
        formData.append('Cost', data.cost.toString());

        if (data.features && data.features.trim() !== "") {
            formData.append('Features', data.features);
        }

        if (data.description && data.description.trim() !== "") {
            formData.append('Description', data.description);
        }

        const user = useAuthStore.getState().user;
        if (user?.shelterId) {
            formData.append('ShelterId', user.shelterId);
        }

        // Add images with proper structure
        data.images.forEach((img, index) => {
            formData.append(`Images[${index}].File`, img.file);
            formData.append(`Images[${index}].Description`, img.description);
            formData.append(`Images[${index}].IsPrincipal`, img.isPrincipal.toString());
        });

        // Trigger mutation (useMutation handles loading/error/success)
        mutation.mutate(formData);


    };

    /**
     * Navigates back to the previous page.
     */
    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Adicionar Novo Animal</h1>
                <p className={styles.subtitle}>Preencha os dados do animal para adicionar ao abrigo</p>
            </div>

            <div className={styles.formWrapper}>
                <AnimalForm
                    mode="create"
                    onSubmit={handleSubmit}
                    isSubmitting={mutation.isPending}
                    apiError={apiError}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}

export default CreateAnimal;