import { test, expect } from '../fixtures/base.fixture';
import type { Page } from '@playwright/test';
import type { ApiMockHelper } from '../core/ApiMockHelper'; 
import {
    mockLoginResponse,
    mockUserDataRegular,
    mockUserDataAdminCAA,
    validCredentials
} from '../test-data/LoginPage/mockLoginData';
import {mockAnimalsPage1} from "../test-data/AnimalsPage/animals-page1";

async function setupAuthMocks(apiMock: ApiMockHelper, page: Page, userRole: 'User' | 'AdminCAA' = 'User') {
    // Block SignalR
    await page.route('**/notificationHub/**', route => route.abort());
    
    // Mock auth endpoints
    await apiMock.mockApiCall('**api/login', mockLoginResponse);
    await apiMock.mockApiCall('**api/users/me', userRole === 'User' ? mockUserDataRegular : mockUserDataAdminCAA);
    await apiMock.mockApiCall('**/api/animals?**', mockAnimalsPage1);
    await apiMock.mockApiCall('http://localhost:5000/api/notifications**', []);
}

test.describe('Logout Flow', () => {

    test.describe('Logout Button Visibility', () => {

        test('should not show logout button when not authenticated', async ({ pm }) => {
            await pm.navigateToHome();

            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();

            expect(await navbar.isLogoutButtonVisible()).toBe(false);
        });

        test('should show login link when not authenticated', async ({ pm }) => {
            await pm.navigateToHome();

            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();

            expect(await navbar.isLoginLinkVisible()).toBe(true);
        });

        test('should show logout button when authenticated', async ({ pm, apiMock, page }) => {
            await setupAuthMocks(apiMock, page);

            await pm.navigateToHome();
            const loginPage = pm.getLoginPage();
            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();
            await navbar.goToLogin()
            await loginPage.fillAndSubmitLogin(validCredentials.email, validCredentials.password);

            await page.waitForURL('**/animals**');
            await apiMock.clearMocks();

            await navbar.waitForNavbarToLoad();

            expect(await navbar.isLogoutButtonVisible()).toBe(true);
        });

        test('should not show login link when authenticated', async ({ pm, apiMock, page }) => {
            await setupAuthMocks(apiMock, page);

            await pm.navigateToHome();
            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();
            await navbar.goToLogin();

            const loginPage = pm.getLoginPage();
            await loginPage.fillAndSubmitLogin(validCredentials.email, validCredentials.password);

            await page.waitForURL('**/animals**');
            await apiMock.clearMocks();

            await navbar.waitForNavbarToLoad();

            expect(await navbar.isLoginLinkVisible()).toBe(false);
        });
    });

    test.describe('Logout Functionality', () => {

        test('should logout and redirect to home page', async ({ pm, apiMock, page }) => {
            await setupAuthMocks(apiMock, page);

            await pm.navigateToHome();
            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();
            await navbar.goToLogin();
            const loginPage = pm.getLoginPage();
            await loginPage.fillAndSubmitLogin(validCredentials.email, validCredentials.password);

            await page.waitForURL('**/animals**');
            await apiMock.clearMocks();

            await navbar.clickLogout();

            await page.waitForURL('**/');
            expect(page.url()).toMatch(/\/$|\/$/);
        });

        test('should clear authentication state after logout', async ({ pm, apiMock, page }) => {
            await setupAuthMocks(apiMock, page);

            await pm.navigateToHome();
            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();
            await navbar.goToLogin();
            const loginPage = pm.getLoginPage();
            await loginPage.fillAndSubmitLogin(validCredentials.email, validCredentials.password);

            await page.waitForURL('**/animals**');
            await apiMock.clearMocks();

            expect(await navbar.isLogoutButtonVisible()).toBe(true);

            await navbar.clickLogout();
            await page.waitForURL('**/');

            await navbar.waitForNavbarToLoad();
            expect(await navbar.isLogoutButtonVisible()).toBe(false);
            expect(await navbar.isLoginLinkVisible()).toBe(true);
        });

        test('should hide authenticated-only links after logout', async ({ pm, apiMock, page }) => {
            await setupAuthMocks(apiMock, page);

            await pm.navigateToHome();
            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();
            await navbar.goToLogin();
            const loginPage = pm.getLoginPage();
            await loginPage.fillAndSubmitLogin(validCredentials.email, validCredentials.password);

            await page.waitForURL('**/animals**');
            await apiMock.clearMocks();

            expect(await navbar.isFavoritesLinkVisible()).toBe(true);
            expect(await navbar.isProfileLinkVisible()).toBe(true);

            await navbar.clickLogout();
            await page.waitForURL('**/');

            await navbar.waitForNavbarToLoad();
            expect(await navbar.isFavoritesLinkVisible()).toBe(false);
            expect(await navbar.isNotificationsLinkVisible()).toBe(false);
            expect(await navbar.isProfileLinkVisible()).toBe(false);
        });

        test('should persist logout state after page reload', async ({ pm, apiMock, page }) => {
            await setupAuthMocks(apiMock, page);

            await pm.navigateToHome();
            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();
            await navbar.goToLogin();
            const loginPage = pm.getLoginPage();
            await loginPage.fillAndSubmitLogin(validCredentials.email, validCredentials.password);

            await page.waitForURL('**/animals**');
            await apiMock.clearMocks();

            await navbar.clickLogout();
            await page.waitForURL('**/');

            await page.reload();
            await navbar.waitForNavbarToLoad();

            expect(await navbar.isLogoutButtonVisible()).toBe(false);
            expect(await navbar.isLoginLinkVisible()).toBe(true);
        });
    });

    test.describe('Logout from Different Pages', () => {

        test('should logout from animals page and redirect to home', async ({ pm, apiMock, page }) => {
            await setupAuthMocks(apiMock, page);

            await pm.navigateToHome();
            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();
            await navbar.goToLogin();
            const loginPage = pm.getLoginPage();
            await loginPage.fillAndSubmitLogin(validCredentials.email, validCredentials.password);

            await page.waitForURL('**/animals**');
            await apiMock.clearMocks();

            await navbar.clickLogout();

            await page.waitForURL('**/');
            expect(page.url()).toMatch(/\/$|\/$/);
        });

        test('should logout from home page', async ({ pm, apiMock, page }) => {
            await setupAuthMocks(apiMock, page);

            await pm.navigateToHome();
            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();
            await navbar.goToLogin();
            const loginPage = pm.getLoginPage();
            await loginPage.fillAndSubmitLogin(validCredentials.email, validCredentials.password);

            await page.waitForURL('**/animals**');
            //await apiMock.clearMocks();

            await pm.navigateToHome();
            await page.waitForURL('**/');

            await navbar.clickLogout();

            await page.waitForURL('**/');
            expect(await navbar.isLogoutButtonVisible()).toBe(false);
        });
    });

    test.describe('Logout with Different Roles', () => {

        test('should logout successfully with regular User role', async ({ pm, apiMock, page }) => {
            await setupAuthMocks(apiMock, page);

            await pm.navigateToHome();
            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();
            await navbar.goToLogin();
            const loginPage = pm.getLoginPage();
            await loginPage.fillAndSubmitLogin(validCredentials.email, validCredentials.password);

            await page.waitForURL('**/animals**');
            await apiMock.clearMocks();

            await navbar.clickLogout();

            await page.waitForURL('**/');
            expect(await navbar.isLoginLinkVisible()).toBe(true);
        });

        test('should logout successfully with AdminCAA role', async ({ pm, apiMock, page }) => {
            await setupAuthMocks(apiMock, page, 'AdminCAA');
            await apiMock.mockApiCall('**/api/ownershiprequests?**', {
                items: [],
                currentPage: 1,
                totalPages: 1,
                totalCount: 0
            });

            await pm.navigateToHome();
            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();
            await navbar.goToLogin();
            const loginPage = pm.getLoginPage();
            await loginPage.fillAndSubmitLogin(validCredentials.email, validCredentials.password);

            await page.waitForURL('**/admin**');

            await navbar.clickLogout();

            await page.waitForURL('**/');
            expect(await navbar.isLoginLinkVisible()).toBe(true);
        });
    });

    test.describe('Post-Logout Behavior', () => {

        test('should be able to login again after logout', async ({ pm, apiMock, page }) => {
            await setupAuthMocks(apiMock, page);

            await pm.navigateToHome();
            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();
            await navbar.goToLogin();
            let loginPage = pm.getLoginPage();
            await loginPage.fillAndSubmitLogin(validCredentials.email, validCredentials.password);

            await page.waitForURL('**/animals**');
            //await apiMock.clearMocks();

            await navbar.clickLogout();
            await page.waitForURL('**/');

            await apiMock.mockApiCall('**/login', mockLoginResponse);
            await apiMock.mockApiCall('**/users/me', mockUserDataRegular);
            await apiMock.mockApiCall('**/api/animals?**', mockAnimalsPage1);

            await navbar.goToLogin();
            await page.waitForURL('**/login');

            loginPage = pm.getLoginPage();
            await loginPage.waitForPageToLoad();
            await loginPage.fillAndSubmitLogin(validCredentials.email, validCredentials.password);

            await page.waitForURL('**/animals**');

            expect(await navbar.isLogoutButtonVisible()).toBe(true);
        });

    });

    test.describe('UI State After Logout', () => {

        test('should show correct navigation items after logout', async ({ pm, apiMock, page }) => {
            await setupAuthMocks(apiMock, page);

            await pm.navigateToHome();
            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();
            await navbar.goToLogin();
            const loginPage = pm.getLoginPage();
            await loginPage.fillAndSubmitLogin(validCredentials.email, validCredentials.password);

            await page.waitForURL('**/animals**');
            await apiMock.clearMocks();

            await navbar.clickLogout();
            await page.waitForURL('**/');

            const visibleLinks = await navbar.getAllVisibleLinks();
            
            expect(visibleLinks).toContain('/animals');
            expect(visibleLinks).toContain('/login');
            expect(visibleLinks).not.toContain('/favorites');
            expect(visibleLinks).not.toContain('/notifications');
            expect(visibleLinks).not.toContain('/user/profile');
        });

        test('should maintain animals link visibility after logout', async ({ pm, apiMock, page }) => {
            await setupAuthMocks(apiMock, page);

            await pm.navigateToHome();
            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();
            await navbar.goToLogin();
            const loginPage = pm.getLoginPage();
            await loginPage.fillAndSubmitLogin(validCredentials.email, validCredentials.password);

            await page.waitForURL('**/animals**');
            await apiMock.clearMocks();

            expect(await navbar.isAnimalsLinkVisible()).toBe(true);

            await navbar.clickLogout();
            await page.waitForURL('**/');

            expect(await navbar.isAnimalsLinkVisible()).toBe(true);
        });
    });
});
