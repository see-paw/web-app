import { Locator, Page } from "@playwright/test";
import { BasePage } from "../core/base.page";

export class OwnershipRequestsPage extends BasePage {
    readonly pageTitle: Locator;
    readonly subtitle: Locator;
    readonly loadingMessage: Locator;
    readonly errorMessage: Locator;
    readonly emptyState: Locator;
    readonly table: Locator;

    constructor(page: Page) {
        super(page);
        
        this.pageTitle = page.getByRole('heading', { name: /pedidos de adoção/i });
        this.subtitle = page.locator('p').filter({ hasText: /pedidos? no total/i });
        this.loadingMessage = page.getByText(/a carregar pedidos/i);
        this.errorMessage = page.getByText(/erro ao carregar pedidos/i);
        this.emptyState = page.getByText(/nenhum pedido de adoção encontrado/i);
        this.table = page.locator('table');
    }

    async waitForPageToLoad() {
        await this.waitForElementToBeVisible(this.pageTitle);
    }

    async isTableVisible(): Promise<boolean> {
        return await this.isElementVisible(this.table);
    }

    async isEmptyStateVisible(): Promise<boolean> {
        return await this.isElementVisible(this.emptyState);
    }

    async isLoadingVisible(): Promise<boolean> {
        return await this.isElementVisible(this.loadingMessage);
    }

    async getTotalCount(): Promise<number> {
        const text = await this.subtitle.textContent();
        const match = text?.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
    }
}