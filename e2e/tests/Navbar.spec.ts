import { test, expect } from '../fixtures/base.fixture';
import {mockAnimalsPage1} from "../test-data/AnimalsPage/animals-page1";

test.describe('Navbar Component', () => {

    test.describe('Basic Rendering', () => {

        test('should render navbar on home page', async ({ pm }) => {
            await pm.navigateToHome();

            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();

            expect(await navbar.isNavbarVisible()).toBe(true);
        });

        test('should render navbar on animals page', async ({ pm, apiMock }) => {
            await apiMock.mockApiCall('**/api/animals?**', mockAnimalsPage1);
            await pm.navigateToAnimals();

            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();

            expect(await navbar.isNavbarVisible()).toBe(true);
        });

        test('should render navbar on login page', async ({ pm }) => {
            await pm.navigateToLogin();

            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();

            expect(await navbar.isNavbarVisible()).toBe(true);
        });
    });

    test.describe('Navigation Links Visibility', () => {

        test('should display home link', async ({ pm }) => {
            await pm.navigateToHome();

            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();

            expect(await navbar.isHomeLinkVisible()).toBe(true);
        });

        test('should display animals link', async ({ pm }) => {
            await pm.navigateToHome();

            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();

            expect(await navbar.isAnimalsLinkVisible()).toBe(true);
        });

        test('should have correct href attributes', async ({ pm }) => {
            await pm.navigateToHome();

            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();

            await expect(navbar.homeLink).toHaveAttribute('href', '/');
            await expect(navbar.animalsLink).toHaveAttribute('href', '/animals');
        });
    });

    test.describe('Navigation Functionality', () => {

        test('should navigate to home when clicking home link', async ({ pm, page }) => {
            await pm.navigateToLogin();

            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();

            await navbar.goToHome();

            await page.waitForURL('**/');
            expect(page.url()).toMatch(/\/$|\/$/);
        });

        test('should navigate to animals when clicking animals link', async ({ pm, page, apiMock }) => {
            await apiMock.mockApiCall('**/api/animals?**', mockAnimalsPage1);
            
            await pm.navigateToHome();

            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();

            await navbar.goToAnimals();

            await page.waitForURL('**/animals**');
            expect(page.url()).toContain('/animals');
        });

        test('should navigate using clickLinkByHref method', async ({ pm, page, apiMock }) => {
            await apiMock.mockApiCall('**/api/animals?**', mockAnimalsPage1);
            
            await pm.navigateToHome();

            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();

            await navbar.clickLinkByHref('/animals');

            await page.waitForURL('**/animals**');
            expect(page.url()).toContain('/animals');
        });
    });

    test.describe('Active Link State', () => {
        test('should mark animals link as active when on animals page', async ({ pm, page, apiMock }) => {
            await apiMock.mockApiCall('**/api/animals?**', mockAnimalsPage1);
            
            await pm.navigateToAnimals();

            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();

            await page.waitForTimeout(500);

            const isActive = await navbar.isLinkActive('/animals');
            expect(isActive).toBe(true);
        });

        test('should update active state when navigating between pages', async ({ pm, page, apiMock }) => {
            await apiMock.mockApiCall('**/api/animals?**', mockAnimalsPage1);
            
            await pm.navigateToLogin()

            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();

            await page.waitForTimeout(500);
            expect(await navbar.isLinkActive('/login')).toBe(true);

            await navbar.goToAnimals();
            await page.waitForURL('**/animals**');
            await page.waitForTimeout(500);

            expect(await navbar.isLinkActive('/animals')).toBe(true);
            expect(await navbar.isLinkActive('/login')).toBe(false);
        });
    });

    test.describe('All Visible Links', () => {

        test('should return list of all visible navigation links', async ({ pm }) => {
            await pm.navigateToHome();

            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();

            const visibleLinks = await navbar.getAllVisibleLinks();

            expect(visibleLinks.length).toBeGreaterThan(0);
            expect(visibleLinks).toContain('/');
            expect(visibleLinks).toContain('/animals');
        });

        test('should have consistent number of links across pages', async ({ pm, apiMock }) => {
            await apiMock.mockApiCall('**/api/animals?**', mockAnimalsPage1);
            
            await pm.navigateToHome();
            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();

            const homeLinks = await navbar.getAllVisibleLinks();

            await pm.navigateToAnimals();
            await navbar.waitForNavbarToLoad();

            const animalsLinks = await navbar.getAllVisibleLinks();

            expect(homeLinks.length).toBe(animalsLinks.length);
        });
    });

    test.describe('Navigation Flow', () => {

        test('should complete full navigation cycle', async ({ pm, page, apiMock }) => {
            await apiMock.mockApiCall('**/api/animals?**', mockAnimalsPage1);
            
            await pm.navigateToHome();

            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();

            await navbar.goToAnimals();
            await page.waitForURL('**/animals**');
            expect(page.url()).toContain('/animals');

            await navbar.goToHome();
            await page.waitForURL('**/');
            expect(page.url()).toMatch(/\/$|\/$/);
        });

        test('should maintain navbar visibility during navigation', async ({ pm, page, apiMock }) => {
            await apiMock.mockApiCall('**/api/animals?**', mockAnimalsPage1);
            
            await pm.navigateToHome();

            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();

            expect(await navbar.isNavbarVisible()).toBe(true);

            await navbar.goToAnimals();
            await page.waitForURL('**/animals**');

            expect(await navbar.isNavbarVisible()).toBe(true);

            await navbar.goToHome();
            await page.waitForURL('**/');

            expect(await navbar.isNavbarVisible()).toBe(true);
        });
    });

    test.describe('Navbar Persistence', () => {

        test('should persist navbar across page reloads', async ({ pm, page }) => {
            await pm.navigateToHome();

            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();

            expect(await navbar.isNavbarVisible()).toBe(true);

            await page.reload();
            await navbar.waitForNavbarToLoad();

            expect(await navbar.isNavbarVisible()).toBe(true);
        });

        test('should persist active link state after page reload', async ({ pm, page, apiMock }) => {
            await apiMock.mockApiCall('**/api/animals?**', mockAnimalsPage1);
            
            await pm.navigateToAnimals();

            const navbar = pm.getNavbarComponent();
            await navbar.waitForNavbarToLoad();

            await page.waitForTimeout(500);
            expect(await navbar.isLinkActive('/animals')).toBe(true);

            await page.reload();
            await navbar.waitForNavbarToLoad();
            await page.waitForTimeout(500);

            expect(await navbar.isLinkActive('/animals')).toBe(true);
        });
    });
});
