import { Locator, Page } from "@playwright/test";
import { BasePage } from "../core/base.page";

/**
 * Component Object representing the Animal Header section.
 *
 * This component is responsible for:
 *  - Displaying the correct greeting format
 *  - Showing the animal's name
 *  - Showing the correct Portuguese article ("o" / "a")
 *    based on the animal's sex
 *
 * It is reusable across multiple pages where the animal's header
 * is rendered (e.g., details page, adoption page, etc.).
 */
export class AnimalHeaderComponent extends BasePage {
    // ================================================================
    // LOCATORS
    // These reference the header container, title, and name elements.
    // ================================================================
    readonly headerContainer: Locator;
    readonly headerTitle: Locator;
    readonly animalName: Locator;

    /**
     * Initializes all locators used by this component.
     * @param page Playwright Page instance
     */
    constructor(page: Page) {
        super(page);

        /// Parent container for the entire header
        this.headerContainer = page.locator('[data-testid="animal-header"]').first();
        // Full header text: e.g., "Olá, eu sou o Max! ❤️"
        this.headerTitle = page.locator('[data-testid="animal-header-title"]');
        // The element containing only the animal's name
        this.animalName = page.locator('[data-testid="animal-name"]');
    }

    // ================================================================
    // VISIBILITY CHECKS
    // ================================================================

    /**
     * Returns true if the header is visible on the page.
     */
    async isHeaderVisible(): Promise<boolean> {
        return await this.isElementVisible(this.headerTitle);
    }

    /**
     * Waits for the header to be fully loaded.
     * Ensures:
     *  - Title is visible
     *  - Animal name is visible
     */
    async waitForHeaderToLoad() {
        await this.waitForElementToBeVisible(this.headerTitle);
        await this.waitForElementToBeVisible(this.animalName);
    }

    // ================================================================
    // TEXT RETRIEVAL METHODS
    // ================================================================

    /**
     * Returns only the animal name shown in the header.
     */
    async getAnimalName(): Promise<string> {
        return await this.getElementText(this.animalName);
    }

    /**
     * Returns the full header text, including greeting and emoji.
     * Example: "Olá, eu sou o Max! ❤️"
     */
    async getFullHeaderText(): Promise<string> {
        return await this.getElementText(this.headerTitle);
    }

    // ================================================================
    // VALIDATION METHODS
    // ================================================================

    /**
     * Validates whether the correct Portuguese article is used
     * based on the expected sex of the animal.
     *
     * @param expectedSex 'male' | 'female' | 'macho' | 'fêmea'
     * @returns true if the article ("o"/"a") is correct
     */
    async hasCorrectArticle(expectedSex: string): Promise<boolean> {
        const fullText = await this.getFullHeaderText();

        // Normalizar o sexo para lowercase
        const sex = expectedSex.toLowerCase();

        if (sex === 'male' || sex === 'macho') {
            // Deve conter "eu sou o"
            return fullText.includes('eu sou o');
        } else if (sex === 'female' || sex === 'fêmea') {
            // Deve conter "eu sou a"
            return fullText.includes('eu sou a');
        }

        return false;
    }

    /**
     * Validates whether the header contains the expected animal name.
     */
    async containsName(expectedName: string): Promise<boolean> {
        const actualName = await this.getAnimalName();
        return actualName === expectedName;
    }

    /**
     * Validates the complete header formatting.
     *
     * Checks:
     *  - greeting starts with "Olá, eu sou"
     *  - correct article based on sex
     *  - correct animal name
     *  - heart emoji is present
     *
     * @param expectedName Name of the animal
     * @param expectedSex Sex of the animal ('male'/'female')
     */
    async hasCorrectFormat(expectedName: string, expectedSex: string): Promise<boolean> {
        const fullText = await this.getFullHeaderText();

        // Must contain the mandatory greeting text
        if (!fullText.includes('Olá, eu sou')) {
            return false;
        }

        // Must contain the animal's name
        if (!fullText.includes(expectedName)) {
            return false;
        }

        // Article must match sex
        const hasCorrectArticle = await this.hasCorrectArticle(expectedSex);
        if (!hasCorrectArticle) {
            return false;
        }

        // Optional but expected design element
        if (!fullText.includes('❤️')) {
            return false;
        }

        return true;
    }

    /**
     * Extracts the article used ("o" or "a") from the header text.
     *
     * @returns 'o' | 'a' | '' (empty string if not detected)
     */
    async getArticle(): Promise<string> {
        const fullText = await this.getFullHeaderText();

        const maleMatch = fullText.match(/eu sou (o)\s/i);
        if (maleMatch) {
            return maleMatch[1];
        }

        const femaleMatch = fullText.match(/eu sou (a)\s/i);
        if (femaleMatch) {
            return femaleMatch[1];
        }

        return '';
    }
}