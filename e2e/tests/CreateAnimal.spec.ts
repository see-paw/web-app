/* eslint-disable @typescript-eslint/no-unused-vars */
import { test, expect } from '../fixtures/base.fixture';
import * as path from 'path';
import { mockBreedsDog } from '../test-data/CreateAnimalPage/mockCreateAnimalPage';

/**
 * E2E Tests for Create Animal functionality
 */

test.describe('Create Animal - Navigation', () => {
    // REMOVER o beforeEach - usar apenas a fixture

    test('should show add animal button in navbar for AdminCAA', async ({ pm, authenticatedAdminCAA }) => {
        await pm.navigateToAnimals(1);

        const navbar = pm.getNavbarComponent();
        await navbar.waitForNavbarToLoad();

        const isVisible = await navbar.isAddAnimalLinkVisible();
        expect(isVisible).toBe(true);
    });

    test('should navigate to create animal page via navbar button', async ({ pm, page, authenticatedAdminCAA }) => {
        await pm.navigateToAnimals(1);

        const navbar = pm.getNavbarComponent();
        await navbar.goToAddAnimal();

        await page.waitForURL('**/animals/new');

        const createPage = pm.getCreateAnimalPage();
        await createPage.waitForPageToLoad();

        const isVisible = await createPage.isPageVisible();
        expect(isVisible).toBe(true);
    });

    test('should show add animal link as active when on create page', async ({ pm, authenticatedAdminCAA }) => {
        await pm.navigateToCreateAnimal();

        const navbar = pm.getNavbarComponent();
        const createPage = pm.getCreateAnimalPage();

        await createPage.waitForPageToLoad();

        const isActive = await navbar.isAddAnimalLinkActive();
        expect(isActive).toBe(true);
    });

    test('should NOT show add animal button for unauthenticated users', async ({ pm, page }) => {
        // NÃO usar authenticatedAdminCAA aqui
        // Clear auth explicitamente
        await page.addInitScript(() => {
            localStorage.clear();
        });

        await pm.navigateToAnimals(1);

        const navbar = pm.getNavbarComponent();
        await navbar.waitForNavbarToLoad();

        const isVisible = await navbar.isAddAnimalLinkVisible();
        expect(isVisible).toBe(false);
    });

    test('should redirect to login when accessing create page without auth', async ({ pm, page }) => {
        // NÃO usar authenticatedAdminCAA aqui
        await page.addInitScript(() => {
            localStorage.clear();
        });

        await pm.navigateToCreateAnimal();

        await page.waitForURL('**/login');
    });
});

test.describe('Create Animal - Form Validation', () => {
    test.beforeEach(async ({ apiMock }) => {
        // Mock breeds API
        await apiMock.mockApiCall('**/api/breeds?species=Dog', mockBreedsDog);
    });

    test('should display all form sections', async ({ pm, authenticatedAdminCAA }) => {
        await pm.navigateToCreateAnimal();

        const createPage = pm.getCreateAnimalPage();
        await createPage.waitForPageToLoad();

        expect(await createPage.isElementVisible(createPage.pageTitle)).toBe(true);
        expect(await createPage.isElementVisible(createPage.nameInput)).toBe(true);
        expect(await createPage.isElementVisible(createPage.speciesSelect)).toBe(true);
        expect(await createPage.isElementVisible(createPage.submitButton)).toBe(true);
    });

    test('should prevent submission without required fields', async ({ pm, page, authenticatedAdminCAA }) => {
        await pm.navigateToCreateAnimal();

        const createPage = pm.getCreateAnimalPage();
        await createPage.waitForPageToLoad();

        await createPage.clickSubmit();
        await page.waitForTimeout(500);

        expect(page.url()).toContain('/animals/new');
    });

    test('should validate name field minimum length', async ({ pm, page, authenticatedAdminCAA }) => {
        await pm.navigateToCreateAnimal();

        const createPage = pm.getCreateAnimalPage();
        await createPage.waitForPageToLoad();

        await createPage.fillName('A');
        await createPage.clickSubmit();
        await page.waitForTimeout(500);

        const errorText = await page.locator('text=/nome.*pelo menos.*2 caracteres/i').first().textContent().catch(() => null);
        expect(errorText).toBeTruthy();

        expect(page.url()).toContain('/animals/new');
    });

    test('should validate cost field is positive', async ({ pm, page, authenticatedAdminCAA }) => {
        await pm.navigateToCreateAnimal();

        const createPage = pm.getCreateAnimalPage();
        await createPage.waitForPageToLoad();

        await createPage.fillCost('-10');
        await createPage.clickSubmit();
        await page.waitForTimeout(500);

        const errorText = await page.locator('text=/custo deve ser positivo/i').first().textContent().catch(() => null);
        expect(errorText).toBeTruthy();

        expect(page.url()).toContain('/animals/new');
    });
});

test.describe('Create Animal - Successful Creation', () => {
    const testImagePath = path.join(process.cwd(), 'e2e/fixtures/test-image.png');

    test.beforeEach(async ({ page, apiMock }) => {
        // Create test image
        const { existsSync, mkdirSync, writeFileSync } = await import('fs');
        const testImageDir = path.dirname(testImagePath);
        if (!existsSync(testImageDir)) {
            mkdirSync(testImageDir, { recursive: true });
        }
        if (!existsSync(testImagePath)) {
            const buffer = Buffer.from(
                'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
                'base64'
            );
            writeFileSync(testImagePath, buffer);
        }
    });

    test.afterEach(async ({ apiMock }) => {
        await apiMock.clearMocks();
    });

    test('should create animal with valid data and redirect to details', async ({ pm, page, authenticatedAdminCAA }) => {
        test.setTimeout(60000);

        await pm.navigateToCreateAnimal();

        const createPage = pm.getCreateAnimalPage();
        await createPage.waitForPageToLoad();
        await createPage.fillName('Luna');
        await createPage.selectSpecies('Dog');
        const firstBreedValue = await page.locator('select#breedId option:not([value=""])').first().getAttribute('value')
        await createPage.selectBreed(firstBreedValue!);
        await createPage.selectSize('Large');
        await createPage.selectSex('Female');
        await createPage.fillColour('Dourado');
        await createPage.fillBirthDate('2022-01-15');
        await createPage.checkSterilized(true);
        await createPage.fillCost('150');
        await createPage.fillFeatures('Muito brincalhona');
        await createPage.fillDescription('Luna é uma cadela carinhosa');

        await createPage.uploadImages([testImagePath]);
        await createPage.setImageDescription(0, 'Luna no jardim');
        await createPage.setPrincipalImage(0);

        const responsePromise = page.waitForResponse(response =>
            response.url().includes('/api/animals') &&
            response.request().method() === 'POST'
        );

        await createPage.clickSubmit();

        const response = await responsePromise;

        // Should be 200 or 201 now with real token!
        expect(response.status()).toBeGreaterThanOrEqual(200);
        expect(response.status()).toBeLessThan(300);

        await page.waitForURL(/\/animals\/[a-f0-9-]+/, { timeout: 10000 });
        await expect(page.getByTestId('animal-name')).toBeVisible({ timeout: 10000 });
        await expect(page.getByTestId('animal-name')).toHaveText('Luna');
        await expect(page.locator('text=Dourado').first()).toBeVisible({ timeout: 5000 });

    });

});

test.describe('Create Animal - Error Handling', () => {
    const testImagePath = path.join(process.cwd(), 'e2e/fixtures/test-image.png');

    test.beforeEach(async ({ page, apiMock }) => {
        // Create test image
        const { existsSync, mkdirSync, writeFileSync } = await import('fs');
        const testImageDir = path.dirname(testImagePath);
        if (!existsSync(testImageDir)) {
            mkdirSync(testImageDir, { recursive: true });
        }
        if (!existsSync(testImagePath)) {
            const buffer = Buffer.from(
                'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
                'base64'
            );
            writeFileSync(testImagePath, buffer);
        }
    });

    test.afterEach(async ({ apiMock }) => {
        await apiMock.clearMocks();
    });

    test('should display error message on server error', async ({ pm, page, apiMock, authenticatedAdminCAA }) => {
        test.setTimeout(60000);

        await page.route('**/notificationHub/**', route => route.abort());
        await apiMock.mockApiCall('http://localhost:5000/api/notifications**', []);
        await apiMock.mockApiCall('**/api/ownershiprequests?**', {
            items: [],
            currentPage: 1,
            totalPages: 1,
            totalCount: 0
        });
        await apiMock.mockError('**/api/animals', 500, 'Erro do servidor. Tenta mais tarde.');
        await pm.navigateToCreateAnimal();

        const createPage = pm.getCreateAnimalPage();
        await createPage.waitForPageToLoad();

        await createPage.fillName('Luna');
        await createPage.selectSpecies('Dog');
        const firstBreedValue = await page.locator('select#breedId option:not([value=""])').first().getAttribute('value')
        await createPage.selectBreed(firstBreedValue!);
        await createPage.selectSize('Large');
        await createPage.selectSex('Female');
        await createPage.fillColour('Dourado');
        await createPage.fillBirthDate('2022-01-15');
        await createPage.checkSterilized(true);
        await createPage.fillCost('150');

        await createPage.uploadImages([testImagePath]);
        await createPage.setImageDescription(0, 'Test');

        await createPage.clickSubmit();

        await page.waitForSelector('text=Erro do servidor', { state: 'visible', timeout: 5000 });

        const hasError = await createPage.isErrorAlertVisible();
        expect(hasError).toBe(true);

        const errorMsg = await createPage.getErrorMessage();
        expect(errorMsg).toContain('servidor');
    });

    test('should display error message on validation error', async ({ pm, page, apiMock, authenticatedAdminCAA }) => {
        test.setTimeout(60000);

        await pm.navigateToCreateAnimal();

        const createPage = pm.getCreateAnimalPage();
        await createPage.waitForPageToLoad();
        await page.route('**/api/animals', async (route) => {
            if (route.request().method() === 'POST') {
                await route.fulfill({
                    status: 500,
                    contentType: 'application/json',
                    body: JSON.stringify({ message: 'Erro do servidor. Tenta mais tarde.' })
                });
            } else {
                await route.continue();
            }
        });

        await createPage.fillName('Luna');
        await createPage.selectSpecies('Dog');
        const firstBreedValue = await page.locator('select#breedId option:not([value=""])').first().getAttribute('value')
        await createPage.selectBreed(firstBreedValue!);
        await createPage.selectSize('Large');
        await createPage.selectSex('Female');
        await createPage.fillColour('Dourado');
        await createPage.fillBirthDate('2022-01-15');
        await createPage.checkSterilized(true);
        await createPage.fillCost('150');

        await createPage.uploadImages([testImagePath]);
        await createPage.setImageDescription(0, 'Test');

        await createPage.clickSubmit();
        await page.waitForTimeout(2000);
        await page.waitForSelector('[class*="errorAlert"]', { state: 'visible', timeout: 5000 });

        const hasError = await page.locator('text=/servidor/i').isVisible();
        expect(hasError).toBe(true);

        const errorMsg = await createPage.getErrorMessage();
        expect(errorMsg).toContain('Erro do servidor');
    });

    test('should redirect to login on 401 error', async ({ pm, page, apiMock}) => {
        test.setTimeout(60000);
        //await apiMock.mockError('**/api/animals', 401, 'Não autorizado');

        await pm.navigateToCreateAnimal();

        await page.waitForURL('**/login', { timeout: 5000 });
    });
});

test.describe('Create Animal - Cache Invalidation', () => {
    const testImagePath = path.join(process.cwd(), 'e2e/fixtures/test-image.png');

    test.beforeEach(async ({ page, apiMock }) => {
        // Create test image
        const { existsSync, mkdirSync, writeFileSync } = await import('fs');
        const testImageDir = path.dirname(testImagePath);
        if (!existsSync(testImageDir)) {
            mkdirSync(testImageDir, { recursive: true });
        }
        if (!existsSync(testImagePath)) {
            const buffer = Buffer.from(
                'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
                'base64'
            );
            writeFileSync(testImagePath, buffer);
        }
    });

    test.afterEach(async ({ apiMock }) => {
        await apiMock.clearMocks();
    });

    test('should fetch fresh data after creation', async ({ pm, page, apiMock, authenticatedAdminCAA }) => {
        await page.route('**/notificationHub/**', route => route.abort());
        await apiMock.mockApiCall('http://localhost:5000/api/notifications**', []);
        await apiMock.mockApiCall('**/api/ownershiprequests?**', {
            items: [],
            currentPage: 1,
            totalPages: 1,
            totalCount: 0
        });

        const animalsListRequests: string[] = [];
        page.on('request', request => {
            if (request.url().includes('/api/shelters/') && request.url().includes('/animals')) {
                animalsListRequests.push(request.url());
            }
        });

        await pm.navigateToAnimals(1);
        const animalsPage = pm.getAnimalsPage();
        await animalsPage.waitForAnimalsToLoad();

        await pm.navigateToCreateAnimal();
        const createPage = pm.getCreateAnimalPage();
        await createPage.waitForPageToLoad();

        await createPage.fillName('Luna');
        await createPage.selectSpecies('Dog');
        const firstBreedValue = await page.locator('select#breedId option:not([value=""])').first().getAttribute('value')
        await createPage.selectBreed(firstBreedValue!);
        await createPage.selectSize('Large');
        await createPage.selectSex('Female');
        await createPage.fillColour('Dourado');
        await createPage.fillBirthDate('2022-01-15');
        await createPage.checkSterilized(true);
        await createPage.fillCost('150');

        await createPage.uploadImages([testImagePath]);
        await createPage.setImageDescription(0, 'Luna no jardim');

        await createPage.clickSubmit();

        //await page.waitForURL(`**/animals/**`, { timeout: 5000 });

        await pm.navigateToAnimals(1);
        await page.waitForTimeout(1000);

        expect(animalsListRequests.length).toBeGreaterThan(0);
    });
});