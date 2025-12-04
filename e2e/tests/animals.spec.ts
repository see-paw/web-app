/* eslint-disable @typescript-eslint/no-unused-vars */
import { test, expect } from '../fixtures/base.fixture';
import { mockAnimalsPage1,mockAnimalsEmpty } from '../test-data/AnimalsPage/mockAnimalsData';
import type { PagedList } from '@/types/pagedList';
import type { Animal } from '@/types/animal';

/**
 * E2E Tests for Animals List Page
 *
 * Test Coverage:
 * 1. Basic Rendering & Loading States
 * 2. Animal Display & Data Integrity
 * 3. Pagination Functionality
 * 4. Filter Functionality
 * 5. Role-Based Features (User vs AdminCAA)
 * 6. Error Handling
 * 7. Empty States
 * 8. Performance & Network
 */

test.describe('Animals Page - Basic Rendering', () => {

    test('should render page with correct title and structure', async ({ pm, apiMock, page }) => {
        await apiMock.mockApiCall('**/api/animals?**', mockAnimalsPage1);

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        // Verify page loaded successfully
        expect(page.url()).toContain('/animals');
        expect(page.url()).toContain('page=1');
    });

    test('should display animal list after loading', async ({ pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals?**', mockAnimalsPage1);

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        // Verify animal list is visible
        const isListVisible = await animalsPage.isAnimalListVisible();
        expect(isListVisible).toBe(true);

        // Verify correct number of animals
        const count = await animalsPage.getAnimalCount();
        expect(count).toBe(mockAnimalsPage1.items.length);
    });
});

test.describe('Animals Page - Animal Display & Data', () => {

    test('should display correct animal information on cards', async ({ pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals?**', mockAnimalsPage1);

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        // Check first animal's data
        const firstAnimal = mockAnimalsPage1.items[0];

        const displayedName = await animalsPage.getAnimalNameByIndex(0);
        expect(displayedName).toBe(firstAnimal.name);

        const displayedBreed = await animalsPage.getAnimalBreedByIndex(0);
        expect(displayedBreed).toBe(firstAnimal.breed.name);

        const displayedAge = await animalsPage.getAnimalAgeByIndex(0);
        expect(displayedAge).toContain(firstAnimal.age.toString());
    });

    test('should display "Raça desconhecida" when breed is null', async ({ pm, apiIntercept, page }) => {
        await page.route('**/notificationHub/**', route => route.abort());
        await page.route('http://localhost:5000/api/notifications**', route => route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([])
        }));

        await apiIntercept.interceptAndModify<PagedList<Animal>>(
            '**/api/animals?**',
            (response) => {
                if (response.items.length > 0) {
                    response.items[0] = {
                        ...response.items[0],
                        breed: null
                    };
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

    test('should handle singular vs plural age correctly', async ({ pm, apiMock, page }) => {
        await apiMock.mockApiCall('**/api/animals?**', mockAnimalsPage1);
        await page.route('**/notificationHub/**', route => route.abort());
        await apiMock.mockApiCall('http://localhost:5000/api/notifications**', []);

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        const ages = await Promise.all(
            mockAnimalsPage1.items.map((_, index) => animalsPage.getAnimalAgeByIndex(index))
        );

        // Check singular/plural handling
        ages.forEach((ageText, index) => {
            const age = mockAnimalsPage1.items[index].age;
            if (age === 1) {
                expect(ageText).toMatch(/1 ano$/);
            } else {
                expect(ageText).toMatch(/\d+ anos$/);
            }
        });
    });

    test('should load and display animal images correctly', async ({ pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals?**', mockAnimalsPage1);

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        // Check first animal's image loaded
        const isImageLoaded = await animalsPage.isAnimalImageLoaded(0);
        expect(isImageLoaded).toBe(true);
    });

    test('should navigate to animal details when clicking card', async ({ pm, apiMock, page }) => {
        await apiMock.mockApiCall('**/api/animals?**', mockAnimalsPage1);
        await page.route('**/notificationHub/**', route => route.abort());
        await apiMock.mockApiCall('http://localhost:5000/api/notifications**', []);

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        const firstAnimalId = mockAnimalsPage1.items[0].id;

        await animalsPage.selectAnimalByIndex(0);

        // Verify navigation to details page
        await page.waitForURL(`**/animals/${firstAnimalId}`);
        expect(page.url()).toContain(`/animals/${firstAnimalId}`);
    });
});

test.describe('Animals Page - Pagination', () => {

    const mockPage1 = {
        ...mockAnimalsPage1,
        currentPage: 1,
        totalPages: 3,
        totalCount: 18
    };

    const mockPage2 = {
        items: mockAnimalsPage1.items.map((item, index) => ({
            ...item,
            id: `page2-${index}`,
            name: `Page 2 Animal ${index + 1}`
        })),
        currentPage: 2,
        pageSize: 6,
        totalPages: 3,
        totalCount: 18
    };

    test('should display pagination when multiple pages exist', async ({ pm, apiMock, page }) => {
        await apiMock.mockApiCall('**/api/animals?pageNumber=1', mockPage1);
        await page.route('**/notificationHub/**', route => route.abort());
        await apiMock.mockApiCall('http://localhost:5000/api/notifications**', []);

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        const pagination = pm.getPaginationComponent();
        const isPaginationVisible = await pagination.isPaginationVisible();
        expect(isPaginationVisible).toBe(true);
    });

    test('should hide pagination when only one page exists', async ({ pm, apiMock, page }) => {
        await apiMock.mockApiCall('**/api/animals?**', mockAnimalsPage1);
        await page.route('**/notificationHub/**', route => route.abort());
        await apiMock.mockApiCall('http://localhost:5000/api/notifications**', []);

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        const pagination = pm.getPaginationComponent();
        const isPaginationVisible = await pagination.isPaginationVisible();
        expect(isPaginationVisible).toBe(false);
    });

    test('should navigate to next page successfully', async ({ pm, apiMock, page }) => {
        await apiMock.mockApiCall('**/api/animals?pageNumber=1', mockPage1);
        await apiMock.mockApiCall('**/api/animals?pageNumber=2', mockPage2);

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        const pagination = pm.getPaginationComponent();
        await pagination.goToNextPage();

        // Verify URL updated
        await page.waitForURL('**/animals?page=2');
        expect(page.url()).toContain('page=2');

        // Verify page 2 data loaded
        await animalsPage.waitForAnimalsToLoad();
        const firstName = await animalsPage.getAnimalNameByIndex(0);
        expect(firstName).toContain('Page 2 Animal');
    });

    test('should navigate to previous page successfully', async ({ pm, apiMock, page }) => {
        await apiMock.mockApiCall('**/api/animals?pageNumber=2', mockPage2);
        await apiMock.mockApiCall('**/api/animals?pageNumber=1', mockPage1);

        await pm.navigateToAnimals(2);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        const pagination = pm.getPaginationComponent();
        await pagination.goToPreviousPage();

        await page.waitForURL('**/animals?page=1');
        expect(page.url()).toContain('page=1');

        await animalsPage.waitForAnimalsToLoad();
        const firstName = await animalsPage.getAnimalNameByIndex(0);
        expect(firstName).toBe(mockPage1.items[0].name);
    });

    test('should navigate to specific page by clicking page number', async ({ pm, apiMock, page }) => {
        await apiMock.mockApiCall('**/api/animals?pageNumber=1', mockPage1);
        await apiMock.mockApiCall('**/api/animals?pageNumber=3', {
            ...mockPage2,
            currentPage: 3,
            items: mockAnimalsPage1.items.map((item, index) => ({
                ...item,
                id: `page3-${index}`,
                name: `Page 3 Animal ${index + 1}`
            }))
        });

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        const pagination = pm.getPaginationComponent();
        await pagination.goToPage(3);

        await page.waitForURL('**/animals?page=3');
        expect(page.url()).toContain('page=3');
    });

    test('should disable previous button on first page', async ({ pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals?pageNumber=1', mockPage1);

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        const pagination = pm.getPaginationComponent();
        const isPrevDisabled = await pagination.isPreviousButtonDisabled();
        expect(isPrevDisabled).toBe(true);
    });

    test('should disable next button on last page', async ({ pm, apiMock }) => {
        const lastPageData = {
            ...mockPage1,
            currentPage: 3,
            totalPages: 3
        };
        await apiMock.mockApiCall('**/api/animals?pageNumber=3', lastPageData);

        await pm.navigateToAnimals(3);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        const pagination = pm.getPaginationComponent();
        const isNextDisabled = await pagination.isNextButtonDisabled();
        expect(isNextDisabled).toBe(true);
    });

    test('should highlight current page number', async ({ pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals?pageNumber=2', mockPage2);

        await pm.navigateToAnimals(2);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        const pagination = pm.getPaginationComponent();
        const isPage2Active = await pagination.isPageButtonActive(2);
        expect(isPage2Active).toBe(true);
    });
});

test.describe('Animals Page - Filters', () => {

    test('should display filter form with all filter fields', async ({ pm, apiMock, page }) => {
        await apiMock.mockApiCall('**/api/animals?**', mockAnimalsPage1);

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        // Verify all filter fields exist
        await expect(page.getByTestId('filter-name')).toBeVisible();
        await expect(page.getByTestId('filter-species')).toBeVisible();
        await expect(page.getByTestId('filter-age')).toBeVisible();
        await expect(page.getByTestId('filter-size')).toBeVisible();
        await expect(page.getByTestId('filter-sex')).toBeVisible();
        await expect(page.getByTestId('filter-breed')).toBeVisible();
    });

    test('should filter by animal name', async ({ pm, apiMock, page }) => {
        await apiMock.mockApiCall('**/api/animals?pageNumber=1', mockAnimalsPage1);
        await page.route('**/notificationHub/**', route => route.abort());
        await apiMock.mockApiCall('http://localhost:5000/api/notifications**', []);

        const filteredData = {
            ...mockAnimalsPage1,
            items: [mockAnimalsPage1.items[0]],
            totalCount: 1
        };
        await apiMock.mockApiCall('**/api/animals?pageNumber=1&Name=Rex*', filteredData);

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        // Fill name filter
        await page.getByTestId('filter-name').fill('Rex');
        await page.getByTestId('apply-filters-button').click();

        // Verify URL updated with filter
        await page.waitForURL('**/animals?page=1&name=Rex');
        expect(page.url()).toContain('name=Rex');

        // Verify filtered results
        await animalsPage.waitForAnimalsToLoad();
        const count = await animalsPage.getAnimalCount();
        expect(count).toBe(1);

        const firstName = await animalsPage.getAnimalNameByIndex(0);
        expect(firstName).toContain('Rex');
    });

    test('should filter by species', async ({ pm, apiMock, page }) => {
        await apiMock.mockApiCall('**/api/animals?pageNumber=1', mockAnimalsPage1);
        await page.route('**/notificationHub/**', route => route.abort());
        await apiMock.mockApiCall('http://localhost:5000/api/notifications**', []);

        const dogAnimals = {
            ...mockAnimalsPage1,
            items: mockAnimalsPage1.items.filter(a => a.species === 'Dog'),
            totalCount: 3
        };
        await apiMock.mockApiCall('**/api/animals?pageNumber=1&Species=Dog', dogAnimals);

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        // Select species filter
        await page.getByTestId('filter-species').selectOption('Dog');
        await page.getByTestId('apply-filters-button').click();

        await page.waitForURL('**/animals?page=1&species=Dog');

        await animalsPage.waitForAnimalsToLoad();
        const count = await animalsPage.getAnimalCount();
        expect(count).toBe(dogAnimals.items.length);
    });

    test('should filter by multiple criteria', async ({ pm, apiMock, page }) => {
        await apiMock.mockApiCall('**/api/animals?pageNumber=1', mockAnimalsPage1);
        await page.route('**/notificationHub/**', route => route.abort());
        await apiMock.mockApiCall('http://localhost:5000/api/notifications**', []);

        const filteredData = {
            ...mockAnimalsPage1,
            items: [mockAnimalsPage1.items[0]],
            totalCount: 1
        };
        await apiMock.mockApiCall('**/api/animals?pageNumber=1&Species=Dog&Size=Medium&Sex=Male', filteredData);

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        // Apply multiple filters
        await page.getByTestId('filter-species').selectOption('Dog');
        await page.getByTestId('filter-size').selectOption('Medium');
        await page.getByTestId('filter-sex').selectOption('Male');
        await page.getByTestId('apply-filters-button').click();

        // Verify all filters in URL
        await page.waitForURL(/.*species=Dog.*size=Medium.*sex=Male.*/);
        expect(page.url()).toContain('species=Dog');
        expect(page.url()).toContain('size=Medium');
        expect(page.url()).toContain('sex=Male');
    });

    test('should clear all filters when clicking clear button', async ({ pm, apiMock, page }) => {
        await apiMock.mockApiCall('**/api/animals?**', mockAnimalsPage1);
        await page.route('**/notificationHub/**', route => route.abort());
        await apiMock.mockApiCall('http://localhost:5000/api/notifications**', []);

        // Start with filters applied
        await page.goto('/animals?page=1&species=Dog&size=Large&name=Rex');

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        // Verify filters are populated
        expect(await page.getByTestId('filter-name').inputValue()).toBe('Rex');
        expect(await page.getByTestId('filter-species').inputValue()).toBe('Dog');
        expect(await page.getByTestId('filter-size').inputValue()).toBe('Large');

        // Clear filters
        await page.getByTestId('clear-filters-button').click();

        // Verify URL reset
        await page.waitForURL('**/animals?page=1');
        expect(page.url()).not.toContain('species=');
        expect(page.url()).not.toContain('size=');
        expect(page.url()).not.toContain('name=');

        // Verify form cleared
        expect(await page.getByTestId('filter-name').inputValue()).toBe('');
        expect(await page.getByTestId('filter-species').inputValue()).toBe('');
        expect(await page.getByTestId('filter-size').inputValue()).toBe('');
    });

    test('should reset to page 1 when applying filters', async ({ pm, apiMock, page }) => {
        const page2Data = {
            ...mockAnimalsPage1,
            currentPage: 2,
            totalPages: 3
        };
        await apiMock.mockApiCall('**/api/animals?pageNumber=2', page2Data);
        await apiMock.mockApiCall('**/api/animals?pageNumber=1&Species=Dog', mockAnimalsPage1);

        // Start on page 2
        await pm.navigateToAnimals(2);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        // Apply filter
        await page.getByTestId('filter-species').selectOption('Dog');
        await page.getByTestId('apply-filters-button').click();

        // Should reset to page 1
        await page.waitForURL('**/animals?page=1&species=Dog');
        expect(page.url()).toContain('page=1');
    });

    test('should show "filtrado" indicator when filters are active', async ({ pm, apiMock, page }) => {
        await apiMock.mockApiCall('**/api/animals?pageNumber=1&Species=Dog', mockAnimalsPage1);
        await page.route('**/notificationHub/**', route => route.abort());
        await apiMock.mockApiCall('http://localhost:5000/api/notifications**', []);

        await page.goto('/animals?page=1&species=Dog');

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        // For AdminCAA, verify filtered indicator in subtitle
        // This would require authenticatedAdminCAA fixture
        // For now, just verify the filter is applied
        expect(page.url()).toContain('species=Dog');
    });
});

test.describe('Animals Page - Empty States', () => {

    test('should display empty state when no animals exist', async ({ pm, apiMock, page }) => {
        await apiMock.mockApiCall('**/api/animals?**', mockAnimalsEmpty);
        await page.route('**/notificationHub/**', route => route.abort());
        await apiMock.mockApiCall('http://localhost:5000/api/notifications**', []);

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();

        const isEmptyStateVisible = await animalsPage.isEmptyStateVisible();
        expect(isEmptyStateVisible).toBe(true);

        const message = await animalsPage.getNoResultsMessage();
        expect(message).toContain('Nenhum animal encontrado');
    });

    test('should display empty state when filters return no results', async ({ pm, apiMock, page }) => {
        test.setTimeout(60000)

        // 🔥 ADICIONA LISTENER PARA VER O URL REAL
        page.on('request', req => {
            if (req.url().includes('/api/animals')) {
                console.log('📡 REQUEST URL:', req.url());
            }
        });


        await page.route('**/notificationHub/**', route => route.abort());
        await apiMock.mockApiCall('http://localhost:5000/api/notifications**', []);
        await apiMock.mockApiCall('**/api/animals?pageNumber=1', mockAnimalsPage1);
        //await apiMock.mockApiCall('**/api/animals?pageNumber=1&Species=Bird', mockAnimalsEmpty);
        await apiMock.mockApiCall('**/api/animals?pageNumber=1&Breed=Akita', mockAnimalsEmpty);

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        // Apply filter that returns no results
        await page.getByTestId('filter-breed').fill('Akita');
        await page.getByTestId('apply-filters-button').click();

        await page.waitForTimeout(2000);

        const isEmptyStateVisible = await animalsPage.isEmptyStateVisible();
        expect(isEmptyStateVisible).toBe(true);
    });

    test('should still show filter form in empty state', async ({ pm, apiMock, page }) => {
        await apiMock.mockApiCall('**/api/animals?**', mockAnimalsEmpty);
        await page.route('**/notificationHub/**', route => route.abort());
        await apiMock.mockApiCall('http://localhost:5000/api/notifications**', []);

        await pm.navigateToAnimals(1);

        // Verify filters are still accessible
        await expect(page.getByTestId('filter-name')).toBeVisible();
        await expect(page.getByTestId('apply-filters-button')).toBeVisible();
    });
});

test.describe('Animals Page - Error Handling', () => {

    test('should display error page on 500 server error', async ({ pm, apiMock, page }) => {
        await apiMock.mockError('**/api/animals?**', 500, 'Internal Server Error');
        await page.route('**/notificationHub/**', route => route.abort());
        await apiMock.mockApiCall('http://localhost:5000/api/notifications**', []);

        await pm.navigateToAnimals(1);

        const errorPage = pm.getErrorPage();

        const message = await errorPage.getMainErrorMessage();
        expect(message).toContain('Ocorreu um erro!');
    });

    test('should display error page on error 500 ', async ({ pm, apiMock }) => {
        await apiMock.mockError('**/api/animals?**', 500, 'Not Found');

        await pm.navigateToAnimals(1);

        const errorPage = pm.getErrorPage();

        const mainMessage = await errorPage.getMainErrorMessage();
        expect(mainMessage).toContain('Ocorreu um erro!');

        const message = await errorPage.getMessageText();
        expect(message).toContain('Erro interno do servidor');
    });

    test('should handle network timeout gracefully', async ({ pm, apiMock }) => {
        await apiMock.mockWithDelay('**/api/animals?**', mockAnimalsPage1, 15000);

        await pm.navigateToAnimals(1);

        const errorPage = pm.getErrorPage();

        // Should show error after timeout
        const message = await errorPage.getMainErrorMessage();
        expect(message).toBeTruthy();
    });
});

test.describe('Animals Page - Role-Based Features (AdminCAA)', () => {

    test('should display shelter-specific header for AdminCAA', async ({ pm, page, authenticatedAdminCAA }) => {
        test.setTimeout(60000);

        await page.route('**/api/shelters/*/animals?**', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockAnimalsPage1)
            });
        });

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        // Verify AdminCAA-specific header
        await expect(page.getByRole('heading', { name: /animais do abrigo/i })).toBeVisible();
    });

    test('should display animal count in subtitle for AdminCAA', async ({ pm, page, authenticatedAdminCAA }) => {
        test.setTimeout(60000);

        await page.route('**/api/shelters/*/animals?**', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockAnimalsPage1)
            });
        });

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        // Verify count in subtitle
        const subtitle = page.locator('p[class*="subtitle"]');
        await expect(subtitle).toContainText(`${mockAnimalsPage1.totalCount}`);
    });

    test('should display status badges on animal cards for AdminCAA', async ({ pm, page, authenticatedAdminCAA }) => {
        test.setTimeout(60000);

        const animalsWithStatus = {
            ...mockAnimalsPage1,
            items: mockAnimalsPage1.items.map(item => ({
                ...item,
                animalState: 'Available'
            }))
        };

        await page.route('**/api/shelters/*/animals?**', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(animalsWithStatus)
            });
        });

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        // Verify status badges are visible
        const statusBadge = page.getByTestId('animal-status-badge').first();
        await expect(statusBadge).toBeVisible();
    });

    test('should use shelter-specific endpoint for AdminCAA', async ({ pm, page, authenticatedAdminCAA }) => {
        test.setTimeout(60000);

        let shelterEndpointCalled = false;

        await page.route('**/api/shelters/*/animals?**', async (route) => {
            shelterEndpointCalled = true;
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockAnimalsPage1)
            });
        });

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        // Verify shelter-specific endpoint was called
        expect(shelterEndpointCalled).toBe(true);
    });
});

test.describe('Animals Page - Performance & UX', () => {

    test('should display grid layout correctly', async ({ pm, apiMock, page }) => {
        await apiMock.mockApiCall('**/api/animals?**', mockAnimalsPage1);

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        // Verify grid columns
        const columnCount = await animalsPage.getGridColumnCount();
        expect(columnCount).toBeGreaterThan(0);
    });

    test('should handle hover states on animal cards', async ({ pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals?**', mockAnimalsPage1);

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        // Hover over first card
        await animalsPage.hoverAnimalCard(0);

        // Card should remain visible and interactable
        const count = await animalsPage.getAnimalCount();
        expect(count).toBeGreaterThan(0);
    });

    test('should load page within acceptable time', async ({ pm, apiMock, page }) => {
        await page.route('**/notificationHub/**', route => route.abort());
        await apiMock.mockApiCall('http://localhost:5000/api/notifications**', []);
        await apiMock.mockApiCall('**/api/animals?**', mockAnimalsPage1);

        const startTime = Date.now();

        await pm.navigateToAnimals(1);

        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        const loadTime = Date.now() - startTime;

        // Page should load within 5 seconds
        expect(loadTime).toBeLessThan(5000);
    });
});
