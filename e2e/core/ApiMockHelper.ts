import { Page, Route } from '@playwright/test';

export class ApiMockHelper {
    constructor(private page: Page) {}

    async mockApiCall<T>(urlPattern: string, mockData: T) {
        await this.page.route(urlPattern, async (route: Route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockData)
            });
        });
    }

    async mockWithDelay<T>(urlPattern: string, mockData: T, delayMs: number) {
        await this.page.route(urlPattern, async (route: Route) => {
            await new Promise(resolve => setTimeout(resolve, delayMs));
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockData)
            });
        });
    }

    async mockError(urlPattern: string, statusCode: number, errorMessage: string) {
        await this.page.route(urlPattern, async (route: Route) => {
            await route.fulfill({
                status: statusCode,
                contentType: 'application/json',
                body: JSON.stringify({ message: errorMessage })
            });
        });
    }

    async mockPaginatedAnimals<T>(pageNumber: number, mockData: T) {
        await this.page.route(`**/api/animals?pageNumber=${pageNumber}`, async (route: Route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockData)
            });
        });
    }
}