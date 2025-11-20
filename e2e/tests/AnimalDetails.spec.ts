import { test, expect } from '../fixtures/base.fixture';
import {
    mockAnimalMaria,
    mockAnimalLeandro,
    mockAnimalJose,
    mockAnimalJessica
} from '../test-data/AnimalDetailsPage/mockAnimalDetails';
test.describe('Animal Details Page', () => {

    // ========================================
    // TESTES DE RENDERIZAÇÃO BÁSICA
    // ========================================

    test.use({ ignoreHTTPSErrors: true });
    test('should render animal details page with all main elements', async ({ page, pm, apiMock }) => {
        // Arrange: Mock da API
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalMaria);

        // Act: Navegar para a página
        await page.goto(`/animals/${mockAnimalMaria.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        // Assert: Verificar elementos principais
        await expect(animalDetailsPage.animalHeader.animalName).toBeVisible();
        await expect(animalDetailsPage.mainImage).toBeVisible();
        await expect(animalDetailsPage.animalDescription).toBeVisible();
        await expect(animalDetailsPage.attributesGrid).toBeVisible();
    });

    test.use({ ignoreHTTPSErrors: true });
    test('should display correct animal name in header', async ({ page, pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalMaria);
        await page.goto(`/animals/${mockAnimalMaria.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        const name = await animalDetailsPage.getAnimalName();
        expect(name).toBe(mockAnimalMaria.name);
    });

    // ========================================
    // TESTES DO HEADER (AnimalHeader Component)
    // ========================================

    test.use({ ignoreHTTPSErrors: true });
    test('should display correct article "o" for male animal', async ({ page, pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalLeandro);
        await page.goto(`/animals/${mockAnimalLeandro.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        const headerText = await animalDetailsPage.getHeaderTitle();
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
    // TESTES DE IMAGENS (AnimalImages)
    // ========================================

    test.use({ ignoreHTTPSErrors: true });
    test('should display main image correctly', async ({ page, pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalMaria);
        await page.goto(`/animals/${mockAnimalMaria.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

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

        const thumbnailCount = await animalDetailsPage.getThumbnailCount();
        // mockAnimalDetails tem 3 imagens total, então 2 thumbnails (3 - 1 principal)
        // Mas só mostra 2 no máximo
        expect(thumbnailCount).toBe(2);
    });


    test.use({ ignoreHTTPSErrors: true });
    test('should display "Ver +X imagens" button when more than 2 thumbnails exist', async ({ page, pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalMaria);
        await page.goto(`/animals/${mockAnimalMaria.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        const isVisible = await animalDetailsPage.isViewMoreButtonVisible();
        expect(isVisible).toBe(true);

        const buttonText = await animalDetailsPage.getViewMoreButtonText();
        // mockAnimalWithManyImages tem 5 imagens, então: 5 - 1 (principal) - 2 (visíveis) = 2
        expect(buttonText).toContain('Ver +2 imagens');
    });

    test.use({ ignoreHTTPSErrors: true });
    test('should not display "Ver +X imagens" button when only 3 images total', async ({ page, pm, apiMock }) => {
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

        // Clicar na primeira thumbnail
        await animalDetailsPage.clickThumbnail(0);

        // Verificar que o modal abriu
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
        // Deve mostrar "1 / 5" (total de 5 imagens)
        expect(counter).toContain('1 / 5');
    });

    test.use({ ignoreHTTPSErrors: true });
    test('should not display navigation buttons in modal when only one image', async ({ page, pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalJessica);
        await page.goto(`/animals/${mockAnimalJessica.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        // Clicar na imagem principal para abrir modal
        await animalDetailsPage.clickMainImage();

        // Verificar que botões de navegação não existem
        const modal = animalDetailsPage.imageGalleryModal;
        const areButtonsHidden = await modal.isNavigationButtonsHidden();
        expect(areButtonsHidden).toBe(true);
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

        const description = await animalDetailsPage.getAnimalDescription();
        expect(description).toContain(mockAnimalJose.description);
    });

    test.use({ ignoreHTTPSErrors: true });
    test('should display all animal attributes', async ({ page, pm, apiMock }) => {
        await apiMock.mockApiCall('**/api/animals/**', mockAnimalJessica);
        await page.goto(`/animals/${mockAnimalJessica.id}`);

        const animalDetailsPage = pm.getAnimalDetailsPage();
        await animalDetailsPage.waitForPageToLoad();

        // Verificar atributos obrigatórios
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

        expect(await animalDetailsPage.isAttributeVisible('features')).toBe(true);

        const featuresValue = await animalDetailsPage.getAttributeValue('features');
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
    // TESTES DE ERROR HANDLING
    // ========================================

    test.use({ ignoreHTTPSErrors: true });
    test('should handle API 404 error gracefully', async ({ page, apiMock }) => {
        // Mock de erro 404
        await apiMock.mockError('**/api/animals/**', 404, 'Animal not found');

        await page.goto(`/animals/HELOHELO`);

        // Verificar que mostra mensagem de erro

        const errorMessage = page.locator('text=Não foi possível carregar o animal');
        await expect(errorMessage).toBeVisible({ timeout: 10000 });
    });

    test.use({ ignoreHTTPSErrors: true });
    test('should handle API 500 error gracefully', async ({ page, apiMock }) => {
        // Mock de erro 500
        await apiMock.mockError('**/api/animals/**', 500, 'Internal Server Error');

        await page.goto(`/animals/${mockAnimalMaria.id}`);

        // Verificar que mostra mensagem de erro
        const errorMessage = page.locator('text=/error|erro/i');
        await expect(errorMessage).toBeVisible({ timeout: 10000 });
    });
});