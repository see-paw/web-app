import { test, expect } from '@playwright/test';
import {PageManager} from "../page.manager";
import {NavbarComponent} from "../navbar.component"

test.describe('Animals page – page 1 loads correctly', () => {
    let pm : PageManager;
    let navbar : NavbarComponent;

    test.beforeEach(async ({page}) => {
        pm = new PageManager(page);
        navbar = new NavbarComponent(page);

        await page.goto('');
        await navbar.goToAnimals();
    })

    test('Animals Nav icon is active', async () => {
        const activeLink = await navbar.getActiveLink();
        await expect(activeLink).toHaveAttribute("href", "/animals");
    });

    test('Verify Url ends with ?page=1', async ({page}) => {
        await expect(page).toHaveURL(/\/animals\?paghe=1/);
    });

    test('At least one card is shown', async ({page}) => {
        await page.waitForSelector('article[class*="_card_"]', { state: 'visible', timeout: 10000 });
        const cards = await page.locator('article[class*="_card_"]').all();
        expect(cards.length).toBeGreaterThan(0);
    });

    test('Cards are loaded with an image, name, breed and age', async ({ page }) => {
        const cards = page.locator('article[class*="_card_"]');
        await cards.first().waitFor({ state: 'visible', timeout: 10000 });

        const count = await cards.count();

        for (let i = 0; i < count; i++) {
            const card = cards.nth(i);

            await expect(card).toBeVisible();

            const image = card.locator('img');
            const name = card.locator('[class*="_name_"]');
            const breed = card.locator('[class*="_breed_"]');
            const age = card.locator('[class*="_age_"]');

            await expect(image).toBeVisible();
            await expect(name).toBeVisible();
            await expect(breed).toBeVisible();
            await expect(age).toBeVisible();

            await expect(name).not.toHaveText('');
            await expect(breed).not.toHaveText('');
            await expect(age).not.toHaveText('');
        }
    });
})