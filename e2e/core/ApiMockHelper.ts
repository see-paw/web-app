import { Page, Route } from '@playwright/test';

export class ApiMockHelper {
    private mockedRoutes: Set<string> = new Set();

    constructor(private page: Page) {}

    async mockApiCall<T>(urlPattern: string, mockData: T) {
        this.mockedRoutes.add(urlPattern);
        await this.page.route(urlPattern, async (route: Route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockData)
            });
        });
    }

    async mockWithDelay<T>(urlPattern: string, mockData: T, delayMs: number) {
        this.mockedRoutes.add(urlPattern);
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
        this.mockedRoutes.add(urlPattern);
        await this.page.route(urlPattern, async (route: Route) => {
            await route.fulfill({
                status: statusCode,
                contentType: 'application/json',
                body: JSON.stringify({ message: errorMessage })
            });
        });
    }

    async mockPaginatedAnimals<T>(pageNumber: number, mockData: T) {
        const urlPattern = `**/api/animals?pageNumber=${pageNumber}`;
        this.mockedRoutes.add(urlPattern);
        await this.page.route(urlPattern, async (route: Route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockData)
            });
        });
    }

    async mockAllApiRequests() {
        const urlPattern = '**/api/**';
        this.mockedRoutes.add(urlPattern);
        await this.page.route(urlPattern, async route => {
            console.log('[MOCK API]', route.request().url());
            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({})
            });
        });
    }

    async clearMocks() {
        for (const pattern of this.mockedRoutes) {
            await this.page.unroute(pattern);
        }
        this.mockedRoutes.clear();
    }

    async clearAllMocks() {
        await this.page.unrouteAll({ behavior: 'ignoreErrors' });
        this.mockedRoutes.clear();
    }

}
