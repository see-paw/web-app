import { Locator, Page } from "@playwright/test";
import { BasePage } from "../core/base.page";

/**
 * Component Object para o modal de galeria de imagens
 * Reutilizável em qualquer página que precise de uma galeria de imagens
 */
export class ImageGalleryModalComponent extends BasePage {
    // ========================================
    // LOCATORS
    // ========================================
    readonly modalOverlay: Locator;
    readonly modalContent: Locator;
    readonly modalImage: Locator;
    readonly modalCloseButton: Locator;
    readonly modalCounter: Locator;
    readonly modalPrevButton: Locator;
    readonly modalNextButton: Locator;

    constructor(page: Page) {
        super(page);

        this.modalOverlay = page.locator('[data-testid="modal-overlay"]');
        this.modalContent = page.locator('[data-testid="modal-content"]');
        this.modalImage = page.locator('[data-testid="modal-image"]');
        this.modalCloseButton = page.locator('[data-testid="modal-close-button"]');
        this.modalCounter = page.locator('[data-testid="modal-counter"]');
        this.modalPrevButton = page.locator('[data-testid="modal-prev-button"]');
        this.modalNextButton = page.locator('[data-testid="modal-next-button"]');
    }

    // ========================================
    // MÉTODOS DE VALIDAÇÃO
    // ========================================

    async isModalOpen(): Promise<boolean> {
        return await this.isElementVisible(this.modalOverlay);
    }

    async waitForModalToOpen() {
        await this.waitForElementToBeVisible(this.modalOverlay);
    }

    async waitForModalToClose() {
        await this.waitForElementToBeHidden(this.modalOverlay);
    }

    // ========================================
    // MÉTODOS DE INTERAÇÃO
    // ========================================

    async closeModal() {
        await this.modalCloseButton.click();
    }

    async closeModalByClickingOverlay() {
        const box = await this.modalOverlay.boundingBox();
        // Clicar no canto superior esquerdo do overlay (longe do conteúdo)
        await this.modalOverlay.click({ position: { x: 10, y: box!.height - 10} });
    }

    async goToNextImage() {
        await this.modalNextButton.click();
    }

    async goToPreviousImage() {
        await this.modalPrevButton.click();
    }

    // ========================================
    // MÉTODOS DE OBTENÇÃO DE DADOS
    // ========================================

    async getModalImageSrc(): Promise<string> {
        return await this.getElementAttribute(this.modalImage, 'src');
    }

    async getModalImageAlt(): Promise<string> {
        return await this.getElementAttribute(this.modalImage, 'alt');
    }

    async getModalCounter(): Promise<string> {
        return await this.getElementText(this.modalCounter);
    }

    async getCurrentImageIndex(): Promise<number> {
        const counter = await this.getModalCounter();
        // Formato esperado: "1 / 5" ou "2 / 5"
        const match = counter.match(/^(\d+)\s*\/\s*\d+$/);
        return match ? parseInt(match[1], 10) : 1;
    }

    async getTotalImages(): Promise<number> {
        const counter = await this.getModalCounter();
        // Formato esperado: "1 / 5" ou "2 / 5"
        const match = counter.match(/^\d+\s*\/\s*(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
    }

    // ========================================
    // MÉTODOS DE VALIDAÇÃO DE ESTADO
    // ========================================

    async areNavigationButtonsVisible(): Promise<boolean> {
        const prevVisible = await this.isElementVisible(this.modalPrevButton);
        const nextVisible = await this.isElementVisible(this.modalNextButton);
        return prevVisible && nextVisible;
    }

    async isNavigationButtonsHidden(): Promise<boolean> {
        return !(await this.areNavigationButtonsVisible());
    }

    // ========================================
    // MÉTODOS DE NAVEGAÇÃO COMBINADOS
    // ========================================

    async navigateToImageByIndex(targetIndex: number) {
        const currentIndex = await this.getCurrentImageIndex();
        const totalImages = await this.getTotalImages();

        if (targetIndex < 1 || targetIndex > totalImages) {
            throw new Error(`Invalid image index: ${targetIndex}. Must be between 1 and ${totalImages}`);
        }

        const clicks = targetIndex - currentIndex;

        if (clicks > 0) {
            // Avançar
            for (let i = 0; i < clicks; i++) {
                await this.goToNextImage();
                await this.page.waitForTimeout(200); // Pequena pausa para animação
            }
        } else if (clicks < 0) {
            // Retroceder
            for (let i = 0; i < Math.abs(clicks); i++) {
                await this.goToPreviousImage();
                await this.page.waitForTimeout(200);
            }
        }
    }
}