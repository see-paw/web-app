import { test, expect } from '../fixtures/base.fixture';
import {
    mockAnimalMaria,
    mockAnimalLeandro,
    mockAnimalJose,
    mockAnimalJessica
} from '../test-data/AnimalDetailsPage/mockAnimalDetails';

// ======================================================================
//  Test Suite: Animal Details Page
//  Purpose: Validate UI rendering, component behaviour, image gallery
//  logic, attribute formatting, and error handling for the Animal Details
// ======================================================================
test.describe('Animal Details Page', () => {
    test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        // Zustand persist format
        window.localStorage.setItem(
            "seepaw-auth",
            JSON.stringify({
                state: {
                    user: {
                        id: "test-user",
                        email: "test@example.com",
                        role: "User",
                    },
                    tokens: {
                        accessToken: "dummy-access",
                        refreshToken: "dummy-refresh"
                    }
                }
            })
        );
    });
});



    // ========================================
    // BASIC RENDERING TESTS
    // ========================================

    // Ignore HTTPS certificate errors (local dev certificates)
    test.use({ ignoreHTTPSErrors: true });
    test('should render animal details page with all main elements', async ({ page, pm, apiMock }) => {
        // Arrange: mock backend API response for this test
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalMaria);

        // Act: navigate to page
        await page.goto(`/animals/${mockAnimalMaria.id}`);

        // Page Model instance
        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        // Assert: verify that all major elements are visible
        await expect(animalDetailsPage.animalHeader.animalName).toBeVisible();
        await expect(animalDetailsPage.mainImage).toBeVisible();
        await expect(animalDetailsPage.animalDescription).toBeVisible();
        await expect(animalDetailsPage.attributesGrid).toBeVisible();
    });

    test.use({ ignoreHTTPSErrors: true });
    test('should display correct animal name in header', async ({ page, pm, apiMock }) => {
        // Mock API data
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalMaria);

        // Navigate to page
        await page.goto(`/animals/${mockAnimalMaria.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        // Extract name from header using helper
        const name = await animalDetailsPage.getAnimalName();
        expect(name).toBe(mockAnimalMaria.name);
    });

    // ========================================
    //HEADER TESTS (AnimalHeader Component)
    // ========================================

    test.use({ ignoreHTTPSErrors: true });
    test('should display correct article "o" for male animal', async ({ page, pm, apiMock }) => {
        // Mock a male animal
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalLeandro);
        await page.goto(`/animals/${mockAnimalLeandro.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        const headerText = await animalDetailsPage.getHeaderTitle();

        // Expect Portuguese male article "o"
        expect(headerText).toContain('Olá, eu sou o');
        expect(headerText).toContain(mockAnimalLeandro.name);
    });

    test.use({ ignoreHTTPSErrors: true });
    test('should display correct article "a" for female animal', async ({ page, pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalJessica);
        await page.goto(`/animals/${mockAnimalJessica.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        const headerText = await animalDetailsPage.getHeaderTitle();
        // Expect Portuguese female article "a"
        expect(headerText).toContain('Olá, eu sou a');
        expect(headerText).toContain(mockAnimalJessica.name);
    });

    test.use({ ignoreHTTPSErrors: true });
    test('should validate header format using component method', async ({ page, pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalMaria);
        await page.goto(`/animals/${mockAnimalMaria.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        // Usar método do AnimalHeaderComponent
        const header = animalDetailsPage.animalHeader;
        const hasCorrectFormat = await header.hasCorrectFormat(
            mockAnimalMaria.name,
            mockAnimalMaria.sex
        );

        expect(hasCorrectFormat).toBe(true);
    });

    // ========================================
    // IMAGE TESTS (AnimalImages Component)
    // ========================================

    test.use({ ignoreHTTPSErrors: true });
    test('should display main image correctly', async ({ page, pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalMaria);
        await page.goto(`/animals/${mockAnimalMaria.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        // The image marked as principal should appear as main image
        const mainImageSrc = await animalDetailsPage.getMainImageSrc();
        const principalImage = mockAnimalMaria.images.find(img => img.isPrincipal);

        expect(mainImageSrc).toBe(principalImage?.url);
    });

    test.use({ ignoreHTTPSErrors: true });
    test('should display thumbnails when animal has multiple images', async ({ page, pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalLeandro);
        await page.goto(`/animals/${mockAnimalLeandro.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        // Only up to 2 thumbnails should be displayed
        const thumbnailCount = await animalDetailsPage.getThumbnailCount();
        expect(thumbnailCount).toBe(2);
    });


    test.use({ ignoreHTTPSErrors: true });
    test('should display "Ver +X imagens" button when more than 2 thumbnails exist', async ({ page, pm, apiMock }) => {
        // mockAnimalMaria has 5 total images
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalMaria);
        await page.goto(`/animals/${mockAnimalMaria.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        const isVisible = await animalDetailsPage.isViewMoreButtonVisible();
        expect(isVisible).toBe(true);

        const buttonText = await animalDetailsPage.getViewMoreButtonText();

        // For 5 images → (5 - 1 main - 2 thumbnails) = 2 hidden images
        expect(buttonText).toContain('Ver +2 imagens');
    });

    test.use({ ignoreHTTPSErrors: true });
    test('should not display "Ver +X imagens" button when only 3 images total', async ({ page, pm, apiMock }) => {
        // Only 3 images → no need for "View more"
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalLeandro);
        await page.goto(`/animals/${mockAnimalLeandro.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        const isVisible = await animalDetailsPage.isViewMoreButtonVisible();
        expect(isVisible).toBe(false);
    });

    // ========================================
    // TESTES DO MODAL (ImageGalleryModal Component)
    // ========================================

    test.use({ ignoreHTTPSErrors: true });
    test('should open modal when clicking on thumbnail', async ({ page, pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalMaria);
        await page.goto(`/animals/${mockAnimalMaria.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        // Click first thumbnail → modal should open
        await animalDetailsPage.clickThumbnail(0);
        const isModalOpen = await animalDetailsPage.isModalOpen();
        expect(isModalOpen).toBe(true);
    });

    test.use({ ignoreHTTPSErrors: true });
    test('should open modal when clicking "Ver +X imagens" button', async ({ page, pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalMaria);
        await page.goto(`/animals/${mockAnimalMaria.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        await animalDetailsPage.clickViewMoreButton();

        const isModalOpen = await animalDetailsPage.isModalOpen();
        expect(isModalOpen).toBe(true);
    });

    test.use({ ignoreHTTPSErrors: true });
    test('should display correct image counter in modal', async ({ page, pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalMaria);
        await page.goto(`/animals/${mockAnimalMaria.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        await animalDetailsPage.clickViewMoreButton();

        const counter = await animalDetailsPage.getModalCounter();
        // Modal should show "1 / 5" initially
        expect(counter).toContain('1 / 5');
    });

    test.use({ ignoreHTTPSErrors: true });
    test('should not display navigation buttons in modal when only one image', async ({ page, pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalJessica);
        await page.goto(`/animals/${mockAnimalJessica.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        // Open modal via main image
        await animalDetailsPage.clickMainImage();

        // Only 1 image → no next/previous buttons
        const modal = animalDetailsPage.imageGalleryModal;
        const areButtonsHidden = await modal.isNavigationButtonsHidden();
        expect(areButtonsHidden).toBe(true);
    });

    test('should navigate to previous image in modal with circular behavior', async ({ page, pm, apiMock }) => {
        // Circular behaviour: previous from index 1 jumps to last index
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalMaria);
        await page.goto(`/animals/${mockAnimalMaria.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        await animalDetailsPage.clickMainImage();

        const modal = animalDetailsPage.imageGalleryModal;
        const totalImages = await modal.getTotalImages();

        // Click previous button
        await animalDetailsPage.clickModalPrevButton();

        // Expect current index to wrap to the last image
        const currentIndex = await modal.getCurrentImageIndex();
        // Deve mostrar a última imagem
        expect(currentIndex).toBe(totalImages);
    });

    test('should close modal when clicking close button', async ({ page, pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalMaria);
        await page.goto(`/animals/${mockAnimalMaria.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        // Open modal
        await animalDetailsPage.clickThumbnail(0);


        expect(await animalDetailsPage.isModalOpen()).toBe(true);

        // Close modal
        await animalDetailsPage.closeModal();
        await animalDetailsPage.waitForModalToClose();

        expect(await animalDetailsPage.isModalOpen()).toBe(false);
    });

    test('should close modal when clicking outside (overlay)', async ({ page, pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalMaria);
        await page.goto(`/animals/$mockAnimalMaria.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        await animalDetailsPage.clickThumbnail(0);

        // Clicar no overlay para fechar
        await animalDetailsPage.closeModalByClickingOverlay();
        await animalDetailsPage.waitForModalToClose();

        expect(await animalDetailsPage.isModalOpen()).toBe(false);
    });

    test('should navigate to next image in modal', async ({ page, pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalMaria);
        await page.goto(`/animals/${mockAnimalMaria.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        await animalDetailsPage.clickThumbnail(0);

        // Obter índice inicial usando o component
        const modal = animalDetailsPage.imageGalleryModal;
        const initialIndex = await modal.getCurrentImageIndex();

        // Click "next"
        await animalDetailsPage.clickModalNextButton();

        // Next index should be initial + 1
        const newIndex = await modal.getCurrentImageIndex();
        expect(newIndex).toBe(initialIndex + 1);
    });


    // ========================================
    // TESTES DE INFORMAÇÕES (AnimalInfo)
    // ========================================

    test.use({ ignoreHTTPSErrors: true });
    test('should display animal description correctly', async ({ page, pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalJose);
        await page.goto(`/animals/${mockAnimalJose.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        // Check textual description
        const description = await animalDetailsPage.getAnimalDescription();
        expect(description).toContain(mockAnimalJose.description);
    });

    test.use({ ignoreHTTPSErrors: true });
    test('should display all animal attributes', async ({ page, pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalJessica);
        await page.goto(`/animals/${mockAnimalJessica.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        // All core attributes should be visible
        expect(await animalDetailsPage.isAttributeVisible('species')).toBe(true);
        expect(await animalDetailsPage.isAttributeVisible('breed')).toBe(true);
        expect(await animalDetailsPage.isAttributeVisible('sex')).toBe(true);
        expect(await animalDetailsPage.isAttributeVisible('size')).toBe(true);
        expect(await animalDetailsPage.isAttributeVisible('colour')).toBe(true);
        expect(await animalDetailsPage.isAttributeVisible('age')).toBe(true);
        expect(await animalDetailsPage.isAttributeVisible('sterilized')).toBe(true);
    });

    test.use({ ignoreHTTPSErrors: true });
    test('should display correct attribute values', async ({ page, pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalMaria);
        await page.goto(`/animals/${ mockAnimalMaria.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        const breedValue = await animalDetailsPage.getAttributeValue('breed');
        expect(breedValue).toBe( mockAnimalMaria.breed.name);

        const colourValue = await animalDetailsPage.getAttributeValue('colour');
        expect(colourValue).toBe( mockAnimalMaria.colour);
    });

    test.use({ ignoreHTTPSErrors: true });
    test('should display "Sim" when animal is sterilized', async ({ page, pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals/**',  mockAnimalMaria);
        await page.goto(`/animals/${ mockAnimalMaria.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        const sterilizedValue = await animalDetailsPage.getAttributeValue('sterilized');
        expect(sterilizedValue).toBe('Sim');
    });

    test.use({ ignoreHTTPSErrors: true });
    test('should display "Não" when animal is not sterilized', async ({ page, pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalJose);
        await page.goto(`/animals/${mockAnimalJose.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        const sterilizedValue = await animalDetailsPage.getAttributeValue('sterilized');
        expect(sterilizedValue).toBe('Não');
    });

    test.use({ ignoreHTTPSErrors: true });
    test('should display age in years when animal is older than 1 year', async ({ page, pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalMaria);
        await page.goto(`/animals/${mockAnimalMaria.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        // Age formatting should include "anos"
        const ageValue = await animalDetailsPage.getAttributeValue('age');
        expect(ageValue).toContain('anos');
    });

    test.use({ ignoreHTTPSErrors: true });
    test('should display age in months when animal is younger than 1 year', async ({ page, pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalJose);
        await page.goto(`/animals/${mockAnimalJose.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        const ageValue = await animalDetailsPage.getAttributeValue('age');
        expect(ageValue).toContain('meses');
    });

    test.use({ ignoreHTTPSErrors: true });
    test('should display features attribute when present', async ({ page, pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalMaria);
        await page.goto(`/animals/${mockAnimalMaria.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        // Features is optional → when present it must appear
        expect(await animalDetailsPage.isAttributeVisible('features')).toBe(true);

        const featuresValue = await animalDetailsPage.getAttributeValue('features');
        // Features is null in this mock
        expect(featuresValue).toBe(mockAnimalMaria.features);
    });

    test.use({ ignoreHTTPSErrors: true });
    test('should not display features attribute when null', async ({ page, pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalJessica);
        await page.goto(`/animals/${mockAnimalJessica.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        expect(await animalDetailsPage.isAttributeVisible('features')).toBe(false);
    });

    // ========================================
    //  ERROR HANDLING TESTS
    // ========================================

    test.use({ ignoreHTTPSErrors: true });
    test('should handle API 404 error gracefully', async ({ page, apiMock }) => {
        // Simulate API returning "not found"
        await apiMock.mockError('**/api/animals/**', 404, 'Animal not found');

        await page.goto(`/animals/HELOHELO`);

        // UI should display error message

        const errorMessage = page.locator('text=Não foi possível carregar o animal');
        await expect(errorMessage).toBeVisible({ timeout: 10000 });
    });

    test.use({ ignoreHTTPSErrors: true });
    test('should handle API 500 error gracefully', async ({ page, apiMock }) => {
        // Simulate internal server error
        await apiMock.mockError('**/api/animals/**', 500, 'Internal Server Error');

        await page.goto(`/animals/${mockAnimalMaria.id}`);

        // Page should still show a generic error
        const errorMessage = page.locator('text=/error|erro/i');
        await expect(errorMessage).toBeVisible({ timeout: 10000 });
    });

    // ========================================
    // FOSTERING PROGRESS BAR TESTS
    // ========================================

    test.use({ ignoreHTTPSErrors: true });
    test('should display fostering progress bar when animal has cost and currentSupportValue', async ({ page, pm, apiMock }) => {

        const updated = { ...mockAnimalMaria, currentSupportValue: 10 };
        await apiMock.mockApiCall('**/api/animals/**', updated);

        await page.goto(`/animals/${mockAnimalMaria.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        expect(await animalDetailsPage.isFosteringProgressBarVisible()).toBe(true);
    });

    test.use({ ignoreHTTPSErrors: true });
    test('should display correct fostering percentage', async ({ page, pm, apiMock }) => {

        const updated = { ...mockAnimalMaria, currentSupportValue: 6 }; // 6 / 30 = 20%
        await apiMock.mockApiCall('**/api/animals/**', updated);

        await page.goto(`/animals/${mockAnimalMaria.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        const percentage = await animalDetailsPage.getFosteringProgressPercentage();
        expect(percentage).toBe("20%"); // exact formatting
    });

    test.use({ ignoreHTTPSErrors: true });
    test('should display fostering progress message', async ({ page, pm, apiMock }) => {

        const updated = { ...mockAnimalMaria, currentSupportValue: 10 }; // missing = 20€
        await apiMock.mockApiCall('**/api/animals/**', updated);

        await page.goto(`/animals/${mockAnimalMaria.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        const msg = await animalDetailsPage.getFosteringProgressMessage();
        expect(msg).toContain("Só faltam 20€");
    });

    // ========================================
    // FOSTER BUTTON TESTS
    // ========================================

    test.use({ ignoreHTTPSErrors: true });
    test('should display foster button when user is authenticated', async ({ page, pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalMaria);

        await page.goto(`/animals/${mockAnimalMaria.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        expect(await animalDetailsPage.isFosteringButtonEnabled()).toBe(true);
    });

    test.use({ ignoreHTTPSErrors: true });
    test('should navigate to fostering flow when clicking the foster button', async ({ page, pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalMaria);

        await page.goto(`/animals/${mockAnimalMaria.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        await animalDetailsPage.clickFosteringButton();
        await expect(page).toHaveURL(`/animals/${mockAnimalMaria.id}/foster`);
    });
});