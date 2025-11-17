import { test, expect } from '../fixtures/base.fixture';
import {mockAnimalsPage1} from '../test-data/AnimalsPage/animals-page1';
import {mockAnimalsEmpty} from "../test-data/AnimalsPage/mockAnimalsPage1";
import {PagedList} from "../../src/types/pagedList";
import {Animal} from "../../src/types/animal";

test.describe('Animals List - With API Mocking', () => {

    test('should load page instantly with mocked data', async ({ pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals?**', mockAnimalsPage1);

        const startTime = Date.now();

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        const loadTime = Date.now() - startTime;

        expect(loadTime).toBeLessThan(2000);

        const count = await animalsPage.getAnimalCount();
        expect(count).toBe(mockAnimalsPage1.items.length);
    });

    test('should display mocked animal data correctly', async ({ pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals*', mockAnimalsPage1);

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        const firstAnimalName = await animalsPage.getAnimalNameByIndex(0);
        expect(firstAnimalName).toBe(mockAnimalsPage1.items[0].name);

        const firstAnimalBreed = await animalsPage.getAnimalBreedByIndex(0);
        expect(firstAnimalBreed).toBe(mockAnimalsPage1.items[0].breed.name);
    });

    test('should handle empty state with mocked empty data', async ({ pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals*', mockAnimalsEmpty);

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();

        const isEmptyStateVisible = await animalsPage.isEmptyStateVisible();
        expect(isEmptyStateVisible).toBe(true);

        const message = await animalsPage.getNoResultsMessage();
        expect(message).toContain('Nenhum animal encontrado');
    });

    test('should simulate loading state with delayed mock', async ({ pm, apiMock }) => {
        await apiMock.mockWithDelay('**/api/animals*', mockAnimalsPage1, 1000);

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();

        await animalsPage.waitForAnimalsToLoad();

        const count = await animalsPage.getAnimalCount();
        expect(count).toBe(mockAnimalsPage1.items.length);
    });

    test('should test error handling with mocked 500 error', async ({ pm, apiMock, page }) => {
        await apiMock.mockError('**/api/animals*', 500, 'Internal Server Error');

        await pm.navigateToAnimals(1);

        await page.waitForLoadState('networkidle');

        const currentUrl = page.url();
        expect(currentUrl).toContain('/animals');
    });

    test('should test error handling with mocked 404 error', async ({ pm, apiMock, page }) => {
        await apiMock.mockError('**/api/animals*', 404, 'Not Found');

        await pm.navigateToAnimals(1);

        await page.waitForLoadState('networkidle');

        const currentUrl = page.url();
        expect(currentUrl).toContain('/animals');
    });
});

test.describe('Animals List - With API Interception', () => {

    test('should modify first animal in response', async ({ pm, apiIntercept }) => {

        await apiIntercept.interceptAndModify<PagedList<Animal>>(
            '**/api/animals',
            (response) => {
                if (response.items.length > 0) {
                    response.items[0] = {
                        ...response.items[0],
                        name: 'Modified Animal Name',
                        breed: {
                            ...response.items[0].breed,
                            name: 'Modified Breed'
                        }
                    };
                }
                return response;
            }
        );

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        const firstName = await animalsPage.getAnimalNameByIndex(0);
        expect(firstName).toBe('Modified Animal Name');

        const firstBreed = await animalsPage.getAnimalBreedByIndex(0);
        expect(firstBreed).toBe('Modified Breed');
    });

    test('should test edge case with modified empty description', async ({ pm, apiIntercept }) => {
        await apiIntercept.interceptAndModify<PagedList<Animal>>(
            '**/api/animals',
            (response) => {
                if (response.items.length > 0) {
                    response.items[0].breed = null;
                }
                return response;
            }
        );

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        const firstBreed = await animalsPage.getAnimalBreedByIndex(0);
        expect(firstBreed).toContain('Raça desconhecida');
    });

    test('should verify API call was made', async ({ pm, apiIntercept }) => {
        const responseReceived = apiIntercept.waitForResponseWithStatus('**/api/animals', 200);

        await pm.navigateToAnimals(1);

        const wasReceived = await responseReceived;
        expect(wasReceived).toBe(true);
    });

    test('should test pagination with intercepted different page data', async ({ pm, apiIntercept, page }) => {

        await apiIntercept.interceptAndModify<PagedList<Animal>>(
            '**/api/animals?pageNumber=2',
            (response) => {
                response.items = response.items.map((item, index) => ({
                    ...item,
                    name: `Page 2 Animal ${index + 1}`
                }));
                return response;
            }
        );

        await pm.navigateToAnimals(1);

        const paginationComponent = pm.getPaginationComponent();
        const animalsPage = pm.getAnimalsPage();

        await paginationComponent.waitForPaginationToLoad();

        const totalPages = await paginationComponent.getTotalVisiblePages();

        if (totalPages >= 2) {
            await paginationComponent.goToPage(2);
            await page.waitForURL('**/animals?page=2');
            await animalsPage.waitForAnimalsToLoad();

            const firstName = await animalsPage.getAnimalNameByIndex(0);
            expect(firstName).toContain('Page 2 Animal');
        }
    });
});

test.describe('Animals List - Performance Testing', () => {

    test('should handle large dataset efficiently', async ({ pm, apiMock }) => {
        const largeDataset = {
            items: Array(20).fill(null).map((_, i) => ({
                id: `animal-${i}`,
                name: `Animal ${i}`,
                age: Math.floor(Math.random() * 10) + 1,
                breed: { id: `breed-${i}`, name: `Breed ${i}` },
                images: []
            })),
            pageNumber: 1,
            totalPages: 10,
            totalCount: 200,
            pageSize: 20,
            hasPreviousPage: false,
            hasNextPage: true
        };

        await apiMock.mockApiCall('**/api/animals*', largeDataset);

        const startTime = Date.now();

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        const loadTime = Date.now() - startTime;

        expect(loadTime).toBeLessThan(3000);

        const count = await animalsPage.getAnimalCount();
        expect(count).toBe(20);
    });

    test('should render all cards without visual regressions', async ({ pm, apiMock, page }) => {
        await apiMock.mockApiCall('**/api/animals*', mockAnimalsPage1);

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        const count = await animalsPage.getAnimalCount();

        for (let i = 0; i < count; i++) {
            const cardLocator = page.locator('[data-testid="animal-card"]').nth(i);
            await expect(cardLocator).toBeVisible();
        }
    });
});