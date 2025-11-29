import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { animalsApi } from "@/api/animals";
import { useIsAuth } from "@/hooks/useIsAuth";

import styles from "./AnimalDetails.module.css";
import AnimalHeader from "@/components/common/AnimalHeader/AnimalHeader";
import AnimalImages from "@/components/features/AnimalImages/AnimalImages";
import AnimalInfo from "@/components/features/AnimalInfo/AnimalInfo";

/**
 * AnimalDetails page component.
 *
 * @component
 *
 * @description
 * Displays full information about a specific animal, including:
 * - Header with the correct article (o/a)
 * - Photo gallery
 * - Biological and descriptive attributes
 *
 * Fetches data using **React Query**, providing:
 * - Caching and deduplication
 * - Abortable requests using `signal`
 * - Built-in loading and error handling
 *
 * Includes the **Foster** button, which only appears when:
 * - The user is authenticated (`useIsAuth()`)
 * - The backend will later validate role = "User"
 *
 * @returns {JSX.Element | null}
 */
function AnimalDetails() {
    /** Read the dynamic :animalId from the route (e.g., /animals/123) */
    const { animalId } = useParams();

    /** Check if a user is authenticated so we can conditionally show the Foster button */
    const isAuth = useIsAuth();

    /** Used to navigate to the fostering flow */
    const navigate = useNavigate();

    /**
     * Fetch detailed animal information from the API.
     *
     * React Query:
     * - caches the result under ["animal", animalId]
     * - prevents the query if animalId is undefined
     * - uses abortable fetch via request signal
     */
    const {
        data: animal,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["animal", animalId],
        queryFn: ({ signal }) =>
            animalsApi.getAnimalDetails({
                id: animalId!,
                signal,
            }),
        enabled: !!animalId, // prevents accidental undefined calls
        staleTime: 5000,
    });

    /** Error state */
    if (isError) {
        return <p data-testid="error-message">{error.message}</p>;
    }

    /** Loading state */
    if (isLoading) {
        return <p data-testid="loading-message">Loading...</p>;
    }

    /** Safety fallback — should never occur because of React Query */
    if (!animal) {
        return null;
    }

    /**
     * Main Page UI
     */
    return (
        <div className={styles.page}>
            <AnimalHeader name={animal.name} sex={animal.sex} />


          <div className={styles.layout}>
            <AnimalImages images={animal.images} />
            <div>
                <AnimalInfo animal={animal} />

                <div className={styles.actionButtons}>
                    <button
                        className={styles.primaryButton}
                        onClick={() => navigate("/animals")}
                    >
                        Voltar ao catálogo
                    </button>
                     {/* Foster button — only visible if the user is authenticated */}
                    {isAuth && (
                        <button
                            className={styles.primaryButton}
                            onClick={() => navigate(`/animals/${animal.id}/foster`)}
                        >
                            Apadrinhar
                        </button>
                    )}
                </div>
            </div>
        </div>

    </div>
        
    );
}

export default AnimalDetails;
