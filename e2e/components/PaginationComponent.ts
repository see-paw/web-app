import { Page } from '@playwright/test';
import {BasePage} from "../core/base.page";

class PaginationComponent extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async isPaginationVisible(): Promise<boolean> {
        return await this.isElementVisible(this.page.locator('[data-testid="pagination"]'));
    }

    async goToNextPage() {
        await this.page.locator('[data-testid="pagination-next"]').click();
    }

    async goToPreviousPage() {
        await this.page.locator('[data-testid="pagination-previous"]').click();
    }

    async goToPage(pageNumber: number) {
        await this.page.locator(`[data-testid="pagination-page-${pageNumber}"]`).click();
    }

    async getCurrentPage(): Promise<number> {
        const activeButton = this.page.locator('[data-testid^="pagination-page-"][data-active="true"]');
        const testId = await activeButton.getAttribute('data-testid');

        if (!testId) return 1;

        const pageNumber = testId.replace('pagination-page-', '');
        return parseInt(pageNumber, 10);
    }

    async isNextButtonDisabled(): Promise<boolean> {
        return await this.page.locator('[data-testid="pagination-next"]').isDisabled();
    }

    async isPreviousButtonDisabled(): Promise<boolean> {
        return await this.page.locator('[data-testid="pagination-previous"]').isDisabled();
    }

    async isPageButtonActive(pageNumber: number): Promise<boolean> {
        const button = this.page.locator(`[data-testid="pagination-page-${pageNumber}"]`);
        const isActive = await button.getAttribute('data-active');
        return isActive === 'true';
    }

    async getVisiblePageNumbers(): Promise<number[]> {
        const buttons = this.page.locator('[data-testid^="pagination-page-"]');
        const count = await buttons.count();

        const pageNumbers: number[] = [];
        for (let i = 0; i < count; i++) {
            const testId = await buttons.nth(i).getAttribute('data-testid');
            if (testId) {
                const pageNumber = testId.replace('pagination-page-', '');
                pageNumbers.push(parseInt(pageNumber, 10));
            }
        }

        return pageNumbers;
    }

    async getTotalVisiblePages(): Promise<number> {
        const pageNumbers = await this.getVisiblePageNumbers();
        return pageNumbers.length;
    }

    async clickPageAndWaitForLoad(pageNumber: number) {
        await this.goToPage(pageNumber);
        await this.page.waitForLoadState('networkidle');
    }

    async verifyUrlContainsPage(expectedPage: number): Promise<boolean> {
        const url = this.page.url();
        return url.includes(`page=${expectedPage}`);
    }

    async waitForPaginationToLoad() {
        await this.waitForElementToBeVisible(this.page.locator('[data-testid="pagination"]'));
    }
}

export default PaginationComponent