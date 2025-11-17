import { test as base } from '@playwright/test';
import {PageManager} from "../page.manager";
import {ApiMockHelper} from "../core/ApiMockHelper";
import {ApiInterceptHelper} from "../core/ApiInterceptHelper";

type CustomFixtures = {
    pm: PageManager;
    apiMock: ApiMockHelper;
    apiIntercept: ApiInterceptHelper;
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
});

export { expect } from '@playwright/test';