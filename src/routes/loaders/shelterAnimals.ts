import type {LoaderFunctionArgs} from 'react-router-dom';
import { queryClient } from '@/lib/queryClient';
import { animalsApi } from '@/api/animals';
import type { AnimalFilterValues } from '@/components/features/AnimalFilters/AnimalFilters';

/**
 * Query key factory for shelter animals
 * Generates consistent query keys for caching
 */
export const shelterAnimalsQueryKey = (
    shelterId: string,
    pageNumber: string,
    filters?: AnimalFilterValues
) => {
    if (filters && Object.keys(filters).length > 0) {
        return ['animals-filtered', shelterId, pageNumber, filters];
    }
    return ['shelter-animals', shelterId, pageNumber];
};

/**
 * Loader for ShelterAnimals page
 *
 * @description
 * This loader:
 * - Extracts page number and filters from URL search params
 * - Gets shelterId from auth context (TODO: implement)
 * - Decides which endpoint to use based on active filters
 * - Prefetches data using TanStack Query
 * - Returns cached data if available, otherwise fetches fresh data
 *
 * URL Params:
 * - page: Page number (default: 1)
 * - name: Filter by animal name
 * - species: Filter by species (Dog, Cat, Other)
 * - age: Filter by age
 * - size: Filter by size (Small, Medium, Large)
 * - sex: Filter by sex (Male, Female)
 * - breed: Filter by breed
 *
 * @example
 * // Without filters
 * /admin/animals?page=1
 *
 * @example
 * // With filters
 * /admin/animals?page=1&species=Dog&size=Medium
 */
export async function shelterAnimalsLoader({ request }: LoaderFunctionArgs) {
    try {
        const url = new URL(request.url);
        const pageNumber = url.searchParams.get('page') || '1';

        // TODO: Get shelterId and shelterName from auth store/context
        // For now, using placeholder values
        // const { user } = useAuthStore.getState();
        // const shelterId = user?.shelterId;
        // const shelterName = user?.shelterName;
        const shelterId =  "11111111-1111-1111-1111-111111111111";
        const shelterName = "Test Shelter";

        // Parse filters from URL
        const filters: AnimalFilterValues = {};

        const name = url.searchParams.get('name');
        const species = url.searchParams.get('species');
        const age = url.searchParams.get('age');
        const size = url.searchParams.get('size');
        const sex = url.searchParams.get('sex');
        const breed = url.searchParams.get('breed');

        if (name) filters.name = name;
        if (species) filters.species = species;
        if (age) filters.age = parseInt(age, 10);
        if (size) filters.size = size;
        if (sex) filters.sex = sex;
        if (breed) filters.breed = breed;

        // Check if any filters are active
        const hasActiveFilters = Object.keys(filters).length > 0;

        // Build query based on whether filters are active
        const query = hasActiveFilters
            ? {
                queryKey: shelterAnimalsQueryKey(shelterId, pageNumber, filters),
                queryFn: () => animalsApi.getAnimalsWithFilters({
                    pageNumber,
                    filters: { ...filters, shelterName },
                    signal: request.signal
                }),
            }
            : {
                queryKey: shelterAnimalsQueryKey(shelterId, pageNumber),
                queryFn: () => animalsApi.getAnimalsByShelter({
                    shelterId,
                    pageNumber,
                    signal: request.signal
                }),
            };

        // Return cached data if available, otherwise fetch
        return (
            queryClient.getQueryData(query.queryKey) ??
            await queryClient.fetchQuery(query)
        );
    } catch (error) {
        console.error('Error loading shelter animals:', error);
        throw new Response('Erro ao carregar animais', { status: 500 });
    }
}