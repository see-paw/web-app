import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../core/base.page';

/**
 * Page Object for Main Navigation
 * Handles interactions with the navbar including AdminCAA-specific actions
 */
export class MainNavigationPage extends BasePage {
    // Logo
    readonly logo: Locator;

    // Navigation items
    readonly notificationsLink: Locator;
    readonly animalsLink: Locator;
    readonly addAnimalButton: Locator;
    readonly profileLink: Locator;
    readonly logoutButton: Locator;
    readonly loginLink: Locator;

    // User-specific items
    readonly favoritesLink: Locator;

    constructor(page: Page) {
        super(page);

        // Logo
        this.logo = page.locator('img[alt="SeePaw logo"]');

        // Navigation links
        this.notificationsLink = page.getByRole('link', { name: /notificações|notifications/i });
        this.animalsLink = page.getByRole('link').filter({ has: page.locator('[data-icon="paw"]') });
        this.addAnimalButton = page.getByRole('link').filter({ has: page.locator('img[alt="Adicionar Animal"]') });
        this.profileLink = page.getByRole('link').filter({ has: page.locator('[data-icon="user"]') });
        this.loginLink = page.getByRole('link', { name: /login|entrar/i });

        // Logout is a button, not a link
        this.logoutButton = page.getByRole('button').filter({ has: page.locator('[data-icon="arrow-right-from-bracket"]') });

        // User-specific
        this.favoritesLink = page.getByRole('link').filter({ has: page.locator('[data-icon="heart"]') });
    }

    /**
     * Click on logo to go home
     */
    async clickLogo() {
        await this.logo.click();
        await this.page.waitForURL('/');
    }

    /**
     * Navigate to animals page
     */
    async goToAnimals() {
        await this.animalsLink.click();
        await this.page.waitForURL('**/animals?**');
    }

    /**
     * Navigate to add animal page (AdminCAA only)
     */
    async goToAddAnimal() {
        await this.addAnimalButton.click();
        await this.page.waitForURL('**/animals/new');
    }

    /**
     * Navigate to profile page
     */
    async goToProfile() {
        await this.profileLink.click();
        await this.page.waitForURL('**/user/profile');
    }

    /**
     * Navigate to notifications page
     */
    async goToNotifications() {
        await this.notificationsLink.click();
        await this.page.waitForURL('**/notifications');
    }

    /**
     * Navigate to favorites page (regular user only)
     */
    async goToFavorites() {
        await this.favoritesLink.click();
        await this.page.waitForURL('**/favorites');
    }

    /**
     * Perform logout
     */
    async logout() {
        await this.logoutButton.click();
        await this.page.waitForURL('/');
    }

    /**
     * Navigate to login page
     */
    async goToLogin() {
        await this.loginLink.click();
        await this.page.waitForURL('**/login');
    }

    /**
     * Check if add animal button is visible (AdminCAA only)
     */
    async isAddAnimalButtonVisible(): Promise<boolean> {
        try {
            await expect(this.addAnimalButton).toBeVisible({ timeout: 2000 });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Check if favorites link is visible (regular user only)
     */
    async isFavoritesLinkVisible(): Promise<boolean> {
        try {
            await expect(this.favoritesLink).toBeVisible({ timeout: 2000 });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Check if login link is visible (not authenticated)
     */
    async isLoginLinkVisible(): Promise<boolean> {
        try {
            await expect(this.loginLink).toBeVisible({ timeout: 2000 });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Verify navigation items for AdminCAA user
     */
    async verifyAdminCAANavigation() {
        await expect(this.notificationsLink).toBeVisible();
        await expect(this.animalsLink).toBeVisible();
        await expect(this.addAnimalButton).toBeVisible();
        await expect(this.profileLink).toBeVisible();
        await expect(this.logoutButton).toBeVisible();

        // Should NOT have favorites
        await expect(this.favoritesLink).not.toBeVisible();
        await expect(this.loginLink).not.toBeVisible();
    }

    /**
     * Verify navigation items for regular user
     */
    async verifyRegularUserNavigation() {
        await expect(this.favoritesLink).toBeVisible();
        await expect(this.notificationsLink).toBeVisible();
        await expect(this.animalsLink).toBeVisible();
        await expect(this.profileLink).toBeVisible();
        await expect(this.logoutButton).toBeVisible();

        // Should NOT have add animal button
        await expect(this.addAnimalButton).not.toBeVisible();
        await expect(this.loginLink).not.toBeVisible();
    }

    /**
     * Verify navigation items for unauthenticated user
     */
    async verifyUnauthenticatedNavigation() {
        await expect(this.animalsLink).toBeVisible();
        await expect(this.loginLink).toBeVisible();

        // Should NOT have authenticated items
        await expect(this.notificationsLink).not.toBeVisible();
        await expect(this.profileLink).not.toBeVisible();
        await expect(this.logoutButton).not.toBeVisible();
        await expect(this.addAnimalButton).not.toBeVisible();
        await expect(this.favoritesLink).not.toBeVisible();
    }

    /**
     * Check if animals link is active
     */
    async isAnimalsLinkActive(): Promise<boolean> {
        const classAttr = await this.animalsLink.getAttribute('class');
        return classAttr?.includes('Active') || false;
    }

    /**
     * Check if add animal button is active
     */
    async isAddAnimalButtonActive(): Promise<boolean> {
        const classAttr = await this.addAnimalButton.getAttribute('class');
        return classAttr?.includes('Active') || false;
    }
}