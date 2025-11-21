import type { Animal } from "@/types/animal";
import AnimalList from "@/components/features/AnimalList/AnimalList";
import { useQuery } from "@tanstack/react-query";
import { animalsApi } from "@/api/animals";
import type { PagedList } from "@/types/pagedList";
import Pagination from "@/components/common/Pagination/Pagination";
import { useSearchParams } from "react-router-dom";
import styles from "./Animals.module.css";

/**
 * Animals page component that displays a paginated list of animals.
 * 
 * @component
 * @returns {JSX.Element|null} The rendered animals page with pagination or null if data is not loaded
 * 
 * @description
 * This component:
 * - Fetches paginated animal data using TanStack Query
 * - Reads the current page from URL search parameters (defaults to "1")
 * - Displays animals in a grid layout using AnimalList component
 * - Provides pagination controls to navigate between pages
 * - Handles error states by displaying error messages
 * 
 * @example
 * // Route definition
 * <Route path="/animals" element={<Animals />} />
 * 
 * @example
 * // URL examples
 * // /animals - Shows first page
 * // /animals?page=2 - Shows second page
 */
function Animals() {
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") ?? "1";

    const { data: pagedAnimals, isError, error } = useQuery<PagedList<Animal>>({
        queryKey: ["animals", page],
        queryFn: ({ signal }) => animalsApi.getAnimals({
            pageNumber: page,
            signal: signal
        }),
        staleTime: 5000
    });

    if (!pagedAnimals) {
        return null;
    }

    if (isError) {
        return <p>{error.message}</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <AnimalList animals={pagedAnimals?.items} />
            </div>
            <Pagination 
                currentPage={pagedAnimals.currentPage}
                totalPages={pagedAnimals.totalPages}
            />
        </div>
    );
}

export default Animals;
