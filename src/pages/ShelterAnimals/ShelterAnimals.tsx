import type { Animal } from "@/types/animal";
import AnimalList from "@/components/features/AnimalList/AnimalList";
import AnimalFilters, { type AnimalFilterValues } from "@/components/features/AnimalFilters/AnimalFilters";
import { useQuery } from "@tanstack/react-query";
import { animalsApi } from "@/api/animals";
import type { PagedList } from "@/types/pagedList";
import Pagination from "@/components/common/Pagination/Pagination";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { shelterAnimalsQueryKey } from "@/routes/loaders/shelterAnimals";
import styles from "./ShelterAnimals.module.css";

/**
 * ShelterAnimals page component for Admin CAA.
 * Displays a paginated and filterable list of animals belonging to the authenticated shelter.
 *
 * @component
 * @returns {JSX.Element|null} The rendered shelter animals page with filters and pagination
 *
 * @description
 * This component:
 * - Uses TanStack Query + React Router Loader pattern for data fetching
 * - Displays filter form with 6 filter options (name, species, age, size, sex, breed)
 * - Automatically switches between endpoints based on active filters:
 *   - No filters: GET /shelters/{id}/animals (optimized)
 *   - With filters: GET /animals?shelterName=X&... (general endpoint)
 * - Syncs filters with URL search parameters for bookmarkability
 * - Shows status badges on animal cards
 * - Provides pagination controls
 * - Handles loading and error states
 *
 * @example
 * // Route definition with loader
 * {
 *   path: '/admin/animals',
 *   element: <ShelterAnimals />,
 *   loader: shelterAnimalsLoader(queryClient)
 * }
 *
 * @example
 * // URL examples
 * // /admin/animals - No filters
 * // /admin/animals?page=2 - Second page, no filters
 * // /admin/animals?species=Dog&size=Medium - With filters
 *
 * @todo
 * - Integrate with auth store to get shelterId and shelterName dynamically
 * - Add loading skeleton component
 * - Implement error boundary for better error handling
 */
function ShelterAnimals() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") ?? "1";

    // TODO: Get shelterId and shelterName from auth store/context
    // const { user } = useAuthStore();
    // const shelterId = user?.shelterId;
    // const shelterName = user?.shelterName;

    // Temporary hardcoded for development
    const shelterId = "shelter-id-placeholder";
    const shelterName = "Shelter Name Placeholder";

    // Parse filters from URL
    const activeFilters = useMemo((): AnimalFilterValues => {
        const filters: AnimalFilterValues = {};

        const name = searchParams.get("name");
        const species = searchParams.get("species");
        const age = searchParams.get("age");
        const size = searchParams.get("size");
        const sex = searchParams.get("sex");
        const breed = searchParams.get("breed");

        if (name) filters.name = name;
        if (species) filters.species = species;
        if (age) filters.age = parseInt(age, 10);
        if (size) filters.size = size;
        if (sex) filters.sex = sex;
        if (breed) filters.breed = breed;

        return filters;
    }, [searchParams]);

    // Check if any filters are active
    const hasActiveFilters = Object.keys(activeFilters).length > 0;

    // Use TanStack Query with same query key as loader
    const {
        data: pagedAnimals,
        isLoading,
        isError,
        error
    } = useQuery<PagedList<Animal>>({
        queryKey: shelterAnimalsQueryKey(shelterId, page, hasActiveFilters ? activeFilters : undefined),
        queryFn: ({ signal }) => {
            if (hasActiveFilters) {
                // Use general endpoint with filters + shelterName
                return animalsApi.getAnimalsWithFilters({
                    pageNumber: page,
                    filters: { ...activeFilters, shelterName },
                    signal
                });
            } else {
                // Use shelter-specific endpoint (no filters)
                return animalsApi.getAnimalsByShelter({
                    shelterId,
                    pageNumber: page,
                    signal
                });
            }
        },
        staleTime: 5000,
        enabled: !!shelterId
    });

    // Handle filter application
    const handleApplyFilters = (filters: AnimalFilterValues) => {
        const newParams: Record<string, string> = { page: "1" }; // Reset to page 1

        if (filters.name) newParams.name = filters.name;
        if (filters.species) newParams.species = filters.species;
        if (filters.age) newParams.age = filters.age.toString();
        if (filters.size) newParams.size = filters.size;
        if (filters.sex) newParams.sex = filters.sex;
        if (filters.breed) newParams.breed = filters.breed;

        setSearchParams(newParams);
    };

    // Handle filter clearing
    const handleClearFilters = () => {
        setSearchParams({ page: "1" }); // Keep only page param
    };

    // Loading state
    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <p className={styles.loading}>A carregar animais...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.error}>
                        <h2>Erro ao carregar animais</h2>
                        <p>{error.message}</p>
                    </div>
                </div>
            </div>
        );
    }

    // No data state
    if (!pagedAnimals) {
        return null;
    }

    // Empty state
    if (!pagedAnimals.items || pagedAnimals.items.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Animais do Abrigo</h1>
                </div>

                <AnimalFilters
                    onApplyFilters={handleApplyFilters}
                    onClearFilters={handleClearFilters}
                    initialFilters={activeFilters}
                />

                <div className={styles.content}>
                    <section aria-labelledby="animals-title" data-testid="animal-list-empty">
                        <p className={styles.emptyState} data-testid="no-results-message">
                            Nenhum animal encontrado
                        </p>
                    </section>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Animais do Abrigo</h1>
                <p className={styles.subtitle}>
                    {pagedAnimals.totalCount} {pagedAnimals.totalCount === 1 ? "animal" : "animais"} no total
                    {hasActiveFilters && " (filtrado)"}
                </p>
            </div>

            <AnimalFilters
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                initialFilters={activeFilters}
            />

            <div className={styles.content}>
                <AnimalList animals={pagedAnimals.items} showStatus={true} />
            </div>

            {pagedAnimals.totalPages > 1 && (
                <Pagination
                    currentPage={pagedAnimals.currentPage}
                    totalPages={pagedAnimals.totalPages}
                />
            )}
        </div>
    );
}

export default ShelterAnimals;