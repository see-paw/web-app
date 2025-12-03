import { Locator, Page } from "@playwright/test";
import { BasePage } from "../core/base.page";

export class OwnershipRequestsTableComponent extends BasePage {
    readonly table: Locator;

    constructor(page: Page) {
        super(page);
        this.table = page.locator('table');
    }

    /**
     * Get a row by animal name
     */
    getRowByAnimalName(animalName: string): Locator {
        return this.table.locator('tbody tr').filter({ hasText: animalName });
    }

    /**
     * Get status badge for a specific row
     */
    async getStatusByAnimalName(animalName: string): Promise<string> {
        const row = this.getRowByAnimalName(animalName);
        const badge = row.locator('span[class*="statusBadge"]');
        return await badge.textContent() || '';
    }

    /**
     * Click action button on a specific row
     */
    async clickActionButton(animalName: string, action: 'Analisar' | 'Aprovar' | 'Rejeitar' | 'Reabrir para Análise') {
        const row = this.getRowByAnimalName(animalName);
        const button = row.getByRole('button', { name: action });
        await button.click();
    }

    /**
     * Check if action button exists for a row
     */
    async hasActionButton(animalName: string, action: string): Promise<boolean> {
        const row = this.getRowByAnimalName(animalName);
        const button = row.getByRole('button', { name: action });
        return await button.isVisible();
    }

    /**
     * Click on approved row to view receipts
     */
    async clickRowForReceipts(animalName: string) {
        const row = this.getRowByAnimalName(animalName);
        await row.click();
    }
}