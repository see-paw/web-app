import { Page, Route } from '@playwright/test';

export class ApiInterceptHelper {
    constructor(private page: Page) {}

    async interceptAndModify<T>(
        urlPattern: string,
        modifier: (response: T) => T
    ): Promise<void> {
        await this.page.route(urlPattern, async (route: Route, request) => {
            
            const rawResponse = await this.page.request.fetch(request.url(), {
                headers: request.headers(),
                method: request.method(),
                data: request.postData()
            });

            const body = await rawResponse.json();
            const modified = modifier(body);

            await route.fulfill({
                status: rawResponse.status(),
                headers: rawResponse.headers(),
                body: JSON.stringify(modified)
            });
        });
    }

    async captureResponse<T>(urlPattern: string): Promise<T> {
        return new Promise((resolve) => {
            this.page.on('response', async (response) => {
                if (response.url().includes(urlPattern)) {
                    const data = await response.json();
                    resolve(data);
                }
            });
        });
    }

    async waitAndCaptureResponse<T>(urlPattern: string): Promise<T> {
        const response = await this.page.waitForResponse(
            (resp) => resp.url().includes(urlPattern) && resp.status() === 200
        );
        return await response.json();
    }

    async waitForResponseWithStatus(urlPattern: string, expectedStatus: number): Promise<boolean> {
        try {
            await this.page.waitForResponse(
                (resp) => resp.url().includes(urlPattern) && resp.status() === expectedStatus,
                { timeout: 5000 }
            );
            return true;
        } catch {
            return false;
        }
    }
}