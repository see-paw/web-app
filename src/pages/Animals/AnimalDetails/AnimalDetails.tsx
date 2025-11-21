import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {animalsApi} from "@/api/animals";

import styles from "./AnimalDetails.module.css";
import AnimalHeader from "@/components/common/AnimalHeader/AnimalHeader";
import AnimalImages from "@/components/features/AnimalImages/AnimalImages";
import AnimalInfo from "@/components/features/AnimalInfo/AnimalInfo";

/**
 * AnimalDetails page component.
 *
 * @component
 * @returns {JSX.Element | null} The full animal details page or fallback UI (loading/error)
 *
 * @description
 * This page displays detailed information about a specific animal, including:
 *  - Header with the animal name and correct article (o/a)
 *  - Image gallery (main image, thumbnails, modal)
 *  - Descriptive attributes (species, breed, sex, size, colour, age, sterilization, features)
 *
 * Data is fetched using **React Query**, providing:
 *  - Request deduplication
 *  - Caching
 *  - Loading & error state management
 *  - AbortSignal support for request cancellation
 *
 * The page:
 *  - Uses `useParams()` to retrieve the dynamic `animalId` from the URL
 *  - Queries `animalsApi.getAnimalDetails()` only when `animalId` exists
 *  - Shows loading and error states with test-friendly `data-testid` markers
 *
 * @example
 * ```tsx
 * // In React Router config:
 * <Route path="/animals/:animalId" element={<AnimalDetails />} />
 * ```
 */
function AnimalDetails() {
    /** Retrieve the animalId from the URL (e.g., /animals/123) */
    const {animalId} = useParams();

    /**
     * Fetch the animal details from the API.
     *
     * - queryKey ensures caching per animalId
     * - queryFn uses AbortSignal to support cancellation
     * - enabled prevents API calls when animalId is undefined
     * - staleTime reduces refetch frequency during short revisits
     */
    const { data: animal, isLoading, isError, error } = useQuery({
        queryKey:["animal", animalId],
        queryFn:({signal}) => animalsApi.getAnimalDetails({
            id:animalId!, // guaranteed non-null because enabled prevents undefined calls
            signal: signal,
        }),
        enabled: !!animalId, // queryFn is called only when exists animalId
        staleTime:5000
    });


    /** Error State */
    if (isError) {
        return <p data-testid="error-message">{error.message}</p>;
    }

    /** Loading State */
    if (isLoading) {
        return <p data-testid="loading-message">A carregar...</p>;
    }

    /** Safety fallback, should not occur because React Query prevents null unless error */
    if (!animal) {
        return null;
    }

    /** Main Page UI */
    return (
        <div className={styles.page}>
            <AnimalHeader name={animal.name} sex={animal.sex} />

            <div className={styles.layout} >
                {<AnimalImages images={animal.images} />}
                <AnimalInfo animal={animal} />
            </div>
        </div>
    );


}

export default AnimalDetails;