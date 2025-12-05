import { test, expect } from '../fixtures/base.fixture';

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

        test('should show logout button when authenticated', async ({ pm, page, authenticatedUser }) => {
            await page.goto('/animals');
            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();
            expect(await navbar.isLogoutButtonVisible()).toBe(true);
        });

        test('should not show login link when authenticated', async ({ pm, page, authenticatedUser }) => {
            await page.goto('/animals');
            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();
            expect(await navbar.isLoginLinkVisible()).toBe(false);
        });
    });

    test.describe('Logout Functionality', () => {

        test('should logout and redirect to home page', async ({ pm, page, authenticatedUser }) => {
            await page.goto('/animals');
            const navbar = pm.getNavbarComponent();
            await navbar.clickLogout();
            await page.waitForURL('**/');
            expect(page.url()).toMatch(/\/$|\/$/);
        });

        test('should clear authentication state after logout', async ({ pm, page, authenticatedUser }) => {
            await page.goto('/animals');
            const navbar = pm.getNavbarComponent();
            expect(await navbar.isLogoutButtonVisible()).toBe(true);
            await navbar.clickLogout();
            await page.waitForURL('**/');
            await navbar.waitForNavbarToLoad();
            expect(await navbar.isLogoutButtonVisible()).toBe(false);
            expect(await navbar.isLoginLinkVisible()).toBe(true);
        });

        test('should hide authenticated-only links after logout', async ({ pm, page, authenticatedUser }) => {
            await page.goto('/animals');
            const navbar = pm.getNavbarComponent();
            expect(await navbar.isFavoritesLinkVisible()).toBe(true);
            expect(await navbar.isProfileLinkVisible()).toBe(true);
            await navbar.clickLogout();
            await page.waitForURL('**/');
            await navbar.waitForNavbarToLoad();
            expect(await navbar.isFavoritesLinkVisible()).toBe(false);
            expect(await navbar.isNotificationsLinkVisible()).toBe(false);
            expect(await navbar.isProfileLinkVisible()).toBe(false);
        });
    });

    test.describe('Logout from Different Pages', () => {

        test('should logout from animals page and redirect to home', async ({ pm, page, authenticatedUser }) => {
            await page.goto('/animals');
            const navbar = pm.getNavbarComponent();
            await navbar.clickLogout();
            await page.waitForURL('**/');
            expect(page.url()).toMatch(/\/$|\/$/);
        });

        test('should logout from home page', async ({ pm, page, authenticatedUser }) => {
            await page.goto('/');
            const navbar = pm.getNavbarComponent();
            await navbar.clickLogout();
            await page.waitForURL('**/');
            expect(await navbar.isLogoutButtonVisible()).toBe(false);
        });
    });

    test.describe('Logout with Different Roles', () => {

        test('should logout successfully with regular User role', async ({ pm, page, authenticatedUser }) => {
            await page.goto('/animals');
            const navbar = pm.getNavbarComponent();
            await navbar.clickLogout();
            await page.waitForURL('**/');
            expect(await navbar.isLoginLinkVisible()).toBe(true);
        });
    });


    test.describe('UI State After Logout', () => {

        test('should show correct navigation items after logout', async ({ pm, page, authenticatedUser }) => {
            await page.goto('/animals');
            const navbar = pm.getNavbarComponent();
            await navbar.clickLogout();
            await page.waitForURL('**/');
            const visibleLinks = await navbar.getAllVisibleLinks();
            expect(visibleLinks).toContain('/animals');
            expect(visibleLinks).toContain('/login');
            expect(visibleLinks).not.toContain('/favorites');
            expect(visibleLinks).not.toContain('/notifications');
            expect(visibleLinks).not.toContain('/user/profile');
        });

        test('should maintain animals link visibility after logout', async ({ pm, page, authenticatedUser }) => {
            await page.goto('/animals');
            const navbar = pm.getNavbarComponent();
            expect(await navbar.isAnimalsLinkVisible()).toBe(true);
            await navbar.clickLogout();
            await page.waitForURL('**/');
            expect(await navbar.isAnimalsLinkVisible()).toBe(true);
        });
    });
});