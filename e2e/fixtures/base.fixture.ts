import { test as base } from '@playwright/test';
import {PageManager} from "../page.manager";
import {ApiMockHelper} from "../core/ApiMockHelper";
import {ApiInterceptHelper} from "../core/ApiInterceptHelper";
import { TEST_ADMIN_CAA} from "../test-data/Auth/mockAuthData";
import {performRealLogin, setAuthInLocalStorage} from "../core/AuthHelper";

type CustomFixtures = {
    pm: PageManager;
    apiMock: ApiMockHelper;
    apiIntercept: ApiInterceptHelper;
    authenticatedAdminCAA: void;
};

export const test = base.extend<CustomFixtures>({
    pm: async ({ page }, provide) => {
        const pageManager = new PageManager(page);
        await provide(pageManager);
    },

    apiMock: async ({ page }, provide) => {
        const apiMockHelper = new ApiMockHelper(page);
        await provide(apiMockHelper);
    },

    apiIntercept: async ({ page }, provide) => {
        const apiInterceptHelper = new ApiInterceptHelper(page);
        await provide(apiInterceptHelper);
    },

    authenticatedAdminCAA: async ({ page }, provide) => {
        // Perform REAL login and get valid JWT tokens
        const authData = await performRealLogin(page, TEST_ADMIN_CAA);

        console.log('✅ Real login successful');
        console.log('Access Token (first 30 chars):', authData.tokens.accessToken.substring(0, 30) + '...');
        console.log('User:', authData.user.name, `(${authData.user.role})`);
        console.log('Shelter:', authData.user.shelterName);

        // Set auth data in localStorage for all pages
        await setAuthInLocalStorage(page, authData);

        // Navigate to a page to ensure localStorage is set
        await page.goto('/');

        // Verify localStorage was set correctly
        const storedAuth = await page.evaluate(() => {
            return localStorage.getItem('seepaw-auth');
        });

        if (!storedAuth) {
            throw new Error('Failed to set auth in localStorage');
        }

        const parsed = JSON.parse(storedAuth);
        if (!parsed.state?.tokens?.accessToken) {
            throw new Error('Auth in localStorage is missing tokens');
        }

        console.log('✅ Auth stored in localStorage');

        await provide();

        // Cleanup: logout after test (optional)
        await page.evaluate(() => {
            localStorage.removeItem('seepaw-auth');
        });
    }
});

