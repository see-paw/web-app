import {Page} from "@playwright/test";
import {BasePage} from "../core/base.page";

export class AnimalsPage extends BasePage { // todos os pages devem extender o base page

    constructor(page: Page) {
        super(page);
    }

    async waitForAnimalsToLoad(timeout = 5000) {
        const firstCard = this.page.locator('[data-testid="animal-card"]').first();
        await this.waitForElementToBeVisible(firstCard, timeout);
    }

    async getAnimalCount(): Promise<number> {
        return await this.page.locator('[data-testid="animal-card"]').count();
    }

    async selectAnimalByIndex(index: number) {
        await this.page.locator('[data-testid="animal-card"]').nth(index).click();
    }

    async selectAnimalByName(name: string) {
        await this.page.locator(`[data-testid="animal-name-link"]:has-text("${name}")`).first().click();
    }

    async getNoResultsMessage(): Promise<string> {
        const text = await this.page.locator('[data-testid="no-results-message"]').textContent();
        return text ?? '';
    }

    async getFirstAnimalName(): Promise<string> {
        const text = await this.page.locator('[data-testid="animal-card"]').first()
            .locator('[data-testid="animal-name-link"]').textContent();
        return text ?? '';
    }

    async getAnimalNameByIndex(index: number): Promise<string> {
        const text = await this.page.locator('[data-testid="animal-card"]').nth(index)
            .locator('[data-testid="animal-name-link"]').textContent();
        return text ?? '';
    }

    async getAnimalBreedByIndex(index: number): Promise<string> {
        const text = await this.page.locator('[data-testid="animal-card"]').nth(index)
            .locator('[data-testid="animal-breed"]').textContent();
        return text ?? '';
    }

    async getAnimalAgeByIndex(index: number): Promise<string> {
        const text = await this.page.locator('[data-testid="animal-card"]').nth(index)
            .locator('[data-testid="animal-age"]').textContent();
        return text ?? '';
    }

    async getAllAnimalNames(): Promise<string[]> {
        return await this.page.locator('[data-testid="animal-name-link"]').allTextContents();
    }

    async isEmptyStateVisible(): Promise<boolean> {
        return await this.isElementVisible(this.page.locator('[data-testid="animal-list-empty"]'));
    }

    async isAnimalListVisible(): Promise<boolean> {
        return await this.isElementVisible(this.page.locator('[data-testid="animal-list"]'));
    }

    async isLoadingSpinnerVisible(): Promise<boolean> {
        return await this.isElementVisible(this.page.locator('[data-testid="loading-spinner"]'));
    }

    async isLoadingSpinnerHidden(): Promise<boolean> {
        try {
            await this.page.locator('[data-testid="loading-spinner"]').waitFor({ state: 'hidden', timeout: 1000 });
            return true;
        } catch {
            return false;
        }
    }

    async getErrorMessage(): Promise<string> {
        const text = await this.page.locator('[data-testid="error-message"]').textContent();
        return text ?? '';
    }

    async hoverAnimalCard(index: number) {
        await this.page.locator('[data-testid="animal-card"]').nth(index).hover();
    }

    async isAnimalImageLoaded(index: number): Promise<boolean> {
        const image = this.page.locator('[data-testid="animal-card"]').nth(index)
            .locator('[data-testid="animal-image"]');

        const naturalWidth = await image.evaluate((img: HTMLImageElement) => img.naturalWidth);
        return naturalWidth > 0;
    }

    async clickAnimalImage(index: number) {
        await this.page.locator('[data-testid="animal-card"]').nth(index)
            .locator('[data-testid="animal-image"]').click();
    }

    async getGridColumnCount(): Promise<number> {
        const grid = this.page.locator('[data-testid="animals-grid"]');
        const gridTemplateColumns = await grid.evaluate((el) => {
            return window.getComputedStyle(el).gridTemplateColumns;
        });

        return gridTemplateColumns.split(' ').length;
    }
}