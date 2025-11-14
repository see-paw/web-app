import {Locator, Page} from "@playwright/test";

export class NavbarComponent  {

    readonly page: Page;
    readonly homeLink : Locator
    readonly animalsLink : Locator
    readonly favoritesLink : Locator
    readonly notificationsLink : Locator
    readonly profileLink : Locator

    constructor(page: Page) {
        this.page = page;
        this.homeLink = page.locator('nav').first().locator('a[href="/"]');
        this.animalsLink = page.locator('nav').first().locator('a[href="/animals"]');
        this.favoritesLink = page.locator('nav').first().locator('a[href="/favorites"]');
        this.notificationsLink = page.locator('nav').first().locator('a[href="/notifications"]');
        this.profileLink = page.locator('nav').first().locator('a[href="/user/profile"]');
    }
    async goToHome() {
        await this.homeLink.click();
    }

    async goToAnimals() {
        await this.animalsLink.click();
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

    async logout() {
        /*empty*/
    }

    async getActiveLink(): Promise<Locator> {
        return this.page.locator('nav').first().locator('a[class*="Active"]');
    }
}