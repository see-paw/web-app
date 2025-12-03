import {Locator, Page} from "@playwright/test";
import {BasePage} from "../core/base.page";

export class NavbarComponent extends BasePage {
    readonly navbar: Locator;
    readonly homeLink: Locator;
    readonly animalsLink: Locator;
    readonly addAnimalLink: Locator;
    readonly favoritesLink: Locator;
    readonly notificationsLink: Locator;
    readonly profileLink: Locator;
    readonly loginLink: Locator;
    readonly logoutButton: Locator;

    constructor(page: Page) {
        super(page);
        
        this.navbar = page.locator('nav').first();
        this.homeLink = this.navbar.locator('a[href="/"]');
        this.animalsLink = this.navbar.locator('a[href="/animals"]');
        this.addAnimalLink = this.navbar.locator('a[href="/animals/new"]');
        this.favoritesLink = this.navbar.locator('a[href="/favorites"]');
        this.notificationsLink = this.navbar.locator('a[href="/notifications"]');
        this.profileLink = this.navbar.locator('a[href="/user/profile"]');
        this.loginLink = this.navbar.locator('a[href="/login"]');
        this.logoutButton = this.navbar.locator('button[type="button"]').last();
    }

    async waitForNavbarToLoad() {
        await this.waitForElementToBeVisible(this.navbar);
    }

    async isNavbarVisible(): Promise<boolean> {
        return await this.isElementVisible(this.navbar);
    }

    async goToHome() {
        await this.homeLink.click();
    }

    async goToAnimals() {
        await this.animalsLink.click();
    }

    async goToAddAnimal() {
        await this.addAnimalLink.click();
    }
    async goToFavorites() {
        await this.favoritesLink.click();
    }

    async goToNotifications() {
        await this.notificationsLink.click();
    }

    async goToProfile() {
        await this.profileLink.click();
    }

    async goToLogin() {
        await this.loginLink.click();
    }

    async clickLogout() {
        await this.logoutButton.click();
    }

    async isHomeLinkVisible(): Promise<boolean> {
        return await this.isElementVisible(this.homeLink);
    }

    async isAnimalsLinkVisible(): Promise<boolean> {
        return await this.isElementVisible(this.animalsLink);
    }

    async isAddAnimalLinkVisible(): Promise<boolean> {
        return await this.isElementVisible(this.addAnimalLink);
    }

    async isFavoritesLinkVisible(): Promise<boolean> {
        return await this.isElementVisible(this.favoritesLink);
    }

    async isNotificationsLinkVisible(): Promise<boolean> {
        return await this.isElementVisible(this.notificationsLink);
    }

    async isProfileLinkVisible(): Promise<boolean> {
        return await this.isElementVisible(this.profileLink);
    }

    async isLoginLinkVisible(): Promise<boolean> {
        return await this.isElementVisible(this.loginLink);
    }

    async isLogoutButtonVisible(): Promise<boolean> {
        return await this.isElementVisible(this.logoutButton);
    }

    async getActiveLink(): Promise<Locator> {
        return this.navbar.locator('a[class*="Active"]');
    }

    async isAddAnimalLinkActive(): Promise<boolean> {
        return await this.isLinkActive('/animals/new');
    }

    async isLinkActive(href: string): Promise<boolean> {
        const link = this.navbar.locator(`a[href="${href}"]`);
        const className = await link.getAttribute('class');
        return className?.includes('Active') ?? false;
    }

    async getAllVisibleLinks(): Promise<string[]> {
        const links = await this.navbar.locator('a').all();
        const hrefs: string[] = [];
        
        for (const link of links) {
            const isVisible = await link.isVisible();
            if (isVisible) {
                const href = await link.getAttribute('href');
                if (href) hrefs.push(href);
            }
        }
        
        return hrefs;
    }

    async clickLinkByHref(href: string) {
        await this.navbar.locator(`a[href="${href}"]`).click();
    }

    async waitForNavigationToComplete(expectedUrl: string) {
        await this.page.waitForURL(expectedUrl);
    }

    async waitForToast(message: string, timeout: number = 5000) {
        const toast = this.page.locator(`text="${message}"`);
        await toast.waitFor({ state: 'visible', timeout });
    }
}
