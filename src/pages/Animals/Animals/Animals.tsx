import type {Animal} from "@/types/animal";
import AnimalList from "@/components/features/AnimalList/AnimalList";
import {useQuery} from "@tanstack/react-query";
import {animalsApi} from "@/api/animals";
import type {PagedList} from "@/types/pagedList";
import Pagination from "@/components/common/Pagination/Pagination";
import {useSearchParams} from "react-router-dom";
import styles from "./Animals.module.css";
import {UserRole} from "@/types/user";
import {useAuthStore} from "@/stores/auth.store";
import {useMemo} from "react";
import AnimalFilters, {type AnimalFilterValues} from "@/components/features/AnimalFilters/AnimalFilters";
import {animalsQueryKey} from "@/routes/loaders/animal";

/**
 * Animals page component that displays a paginated and filterable list of animals.
 *
 * @component
 *
 * @description
 * This component handles:
 * - Fetching animals (all or by shelter) using TanStack Query
 * - Reading and updating pagination through URL search params
 * - Reading active filters from URL and applying them to queries
 * - Rendering the results using `AnimalList`
 * - Providing filter controls through `AnimalFilters`
 * - Handling empty, loading and error states gracefully
 * - Displaying shelter-specific data for AdminCAA users
 *
 * AdminCAA behaviour:
 * - If user.role === AdminCAA → only fetches animals from that admin's shelter
 * - Otherwise → fetches all animals normally
 *
 * URL behaviour:
 * - ?page=1
 * - ?name=Rex&species=Dog&page=1
 *
 * @returns {JSX.Element} The animals page.
 *
 * @example
 * <Route path="/animals" element={<Animals />} />
 */
function Animals() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") ?? "1";

    const user = useAuthStore(s => s.user);
    const isAdminCAA = user?.role === UserRole.AdminCAA;
    const shelterId = user?.shelterId || null;

    /**
     * Extracts filter values from the current URL search parameters.
     *
     * @type {AnimalFilterValues}
     */
    const activeFilters = useMemo((): AnimalFilterValues => {
        const filters: AnimalFilterValues = {};

        const name = searchParams.get("name");
        const species = searchParams.get("species");
        const age = searchParams.get("age");
        const size = searchParams.get("size");
        const sex = searchParams.get("sex");
        const breed = searchParams.get("breed");
        const shelterNameParam = searchParams.get("shelterName");

        if (name) filters.name = name;
        if (species) filters.species = species;
        if (age) filters.age = parseInt(age, 10);
        if (size) filters.size = size;
        if (sex) filters.sex = sex;
        if (breed) filters.breed = breed;
        if (shelterNameParam) filters.shelterName = shelterNameParam;

        return filters;
    }, [searchParams]);


    const hasActiveFilters = Object.keys(activeFilters).length > 0;

    /**
     * Fetches animals based on:
     *  - admin role (shelter-specific)
     *  - active filters
     *  - pagination
     */
    const {
        data: pagedAnimals,
        isLoading,
        isError,
        error
    } = useQuery<PagedList<Animal>>({
        queryKey: animalsQueryKey(
            isAdminCAA ? shelterId : null,
            page,
            hasActiveFilters ? activeFilters : undefined
        ),
        queryFn: ({signal}) => {
            if (isAdminCAA && shelterId) {
                // AdminCAA - always use getAnimalsByShelter (with or without filters)
                return animalsApi.getAnimalsByShelter({
                    shelterId,
                    pageNumber: page,
                    filters: hasActiveFilters ? activeFilters : undefined,
                    signal
                });
            }

            // Regular User - always use getAnimals (with or without filters)
            return animalsApi.getAnimals({
                pageNumber: page,
                filters: hasActiveFilters ? activeFilters : undefined,
                signal
            });
        }
    });

    /**
     * Updates URL search params when the user applies filters.
     *
     * @param {AnimalFilterValues} filters
     */
    const handleApplyFilters = (filters: AnimalFilterValues) => {
        const newParams: Record<string, string> = {page: "1"}; // Reset to page 1

        if (filters.name) newParams.name = filters.name;
        if (filters.species) newParams.species = filters.species;
        if (filters.age) newParams.age = filters.age.toString();
        if (filters.size) newParams.size = filters.size;
        if (filters.sex) newParams.sex = filters.sex;
        if (filters.breed) newParams.breed = filters.breed;
        if (filters.shelterName) newParams.shelterName = filters.shelterName;

        setSearchParams(newParams);
    };

    /**
     * Clears all filters, keeping only the page=1 param.
     */
    const handleClearFilters = () => {
        setSearchParams({page: "1"}); // Keep only page param
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

    // Error state (404 handled as "empty list")
    if (isError) {
        if (error instanceof Error && error.message.includes('404')) {
            // Continuar para o estado vazio abaixo
        } else {
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
    }


    const isEmpty = !pagedAnimals?.items || pagedAnimals.items.length === 0;


    return (
        <div className={styles.container}>
            {isAdminCAA && (
                <div className={styles.header}>
                    <h1 className={styles.title}>Animais do Abrigo</h1>
                    {pagedAnimals && (
                        <p className={styles.subtitle}>
                            {pagedAnimals.totalCount} {pagedAnimals.totalCount === 1 ? "animal" : "animais"} no total
                            {hasActiveFilters && " (filtrado)"}
                        </p>
                    )}
                </div>
            )}

            <AnimalFilters
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                initialFilters={activeFilters}
            />

            <div className={styles.content}>
                {isEmpty ? (
                    <section aria-labelledby="animals-title" data-testid="animal-list-empty">
                        <p className={styles.emptyState} data-testid="no-results-message">
                            Nenhum animal encontrado
                        </p>
                    </section>
                ) : (
                    <AnimalList
                        animals={pagedAnimals.items}
                        showStatus={isAdminCAA}
                    />
                )}
            </div>

            {pagedAnimals && pagedAnimals.totalPages > 1 && (
                <Pagination
                    currentPage={pagedAnimals.currentPage}
                    totalPages={pagedAnimals.totalPages}
                />
            )}
        </div>
    );
}

export default Animals;
