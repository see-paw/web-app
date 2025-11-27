import { Locator, Page } from "@playwright/test";
import { BasePage } from "../core/base.page";

/**
 * Page Object for Create Animal page
 * Handles all interactions with the animal creation form
 */
export class CreateAnimalPage extends BasePage {
    // Form sections
    readonly pageTitle: Locator;
    readonly pageSubtitle: Locator;

    // Basic information fields
    readonly nameInput: Locator;
    readonly speciesSelect: Locator;
    readonly breedSelect: Locator;
    readonly sizeSelect: Locator;
    readonly sexMaleRadio: Locator;
    readonly sexFemaleRadio: Locator;
    readonly colourInput: Locator;
    readonly birthDateInput: Locator;
    readonly sterilizedCheckbox: Locator;
    readonly costInput: Locator;

    // Additional information fields
    readonly featuresTextarea: Locator;
    readonly descriptionTextarea: Locator;

    // Image upload
    readonly imageUploadInput: Locator;
    readonly imageUploadButton: Locator;
    readonly imageCards: Locator;

    // Form actions
    readonly cancelButton: Locator;
    readonly submitButton: Locator;

    // Error elements
    readonly errorAlert: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);

        // Header
        this.pageTitle = page.getByRole('heading', { name: /adicionar novo animal/i });
        this.pageSubtitle = page.getByText(/preencha os dados do animal/i);

        // Basic info fields
        this.nameInput = page.getByLabel(/^nome/i);
        this.speciesSelect = page.getByLabel(/^espécie/i);
        this.breedSelect = page.getByLabel(/^raça/i);
        this.sizeSelect = page.getByLabel(/^porte/i);
        this.sexMaleRadio = page.getByRole('radio', { name: /macho/i });
        this.sexFemaleRadio = page.getByRole('radio', { name: /fêmea/i });
        this.colourInput = page.getByLabel(/^cor/i);
        this.birthDateInput = page.getByLabel(/data de nascimento/i);
        this.sterilizedCheckbox = page.getByRole('checkbox', { name: /esterilizado/i });
        this.costInput = page.getByLabel(/custo mensal \(€\)/i);

        // Additional info fields
        this.featuresTextarea = page.getByLabel(/características/i);
        this.descriptionTextarea = page.getByLabel(/descrição/i);

        // Image upload
        this.imageUploadInput = page.locator('input[type="file"]#image-upload');
        this.imageUploadButton = page.getByRole('button', { name: /selecionar imagens/i });
        this.imageCards = page.locator('[class*="imageCard"]');

        // Actions
        this.cancelButton = page.getByRole('button', { name: /cancelar/i });
        this.submitButton = page.getByRole('button', { name: /criar animal|adicionar/i });

        // Errors
        this.errorAlert = page.locator('[class*="errorAlert"]').first();
        this.errorMessage = page.locator('[class*="errorAlertMessage"]');
    }

    async waitForPageToLoad() {
        await this.waitForElementToBeVisible(this.pageTitle);
    }

    async isPageVisible(): Promise<boolean> {
        return await this.isElementVisible(this.pageTitle);
    }

    async fillName(name: string) {
        await this.fillFormField(this.nameInput, name);
    }

    async selectSpecies(species: string) {
        await this.selectDropdownOption(this.speciesSelect, species);
    }

    async selectBreed(breed: string) {
        // Wait a bit for breeds to load after species selection
        await this.page.waitForTimeout(500);
        await this.selectDropdownOption(this.breedSelect, breed);
    }

    async selectSize(size: string) {
        await this.selectDropdownOption(this.sizeSelect, size);
    }

    async selectSex(sex: 'Male' | 'Female') {
        if (sex === 'Male') {
            await this.sexMaleRadio.check();
        } else {
            await this.sexFemaleRadio.check();
        }
    }

    async fillColour(colour: string) {
        await this.fillFormField(this.colourInput, colour);
    }

    async fillBirthDate(date: string) {
        await this.fillFormField(this.birthDateInput, date);
    }

    async checkSterilized(checked: boolean) {
        if (checked) {
            await this.sterilizedCheckbox.check();
        } else {
            await this.sterilizedCheckbox.uncheck();
        }
    }

    async fillCost(cost: string) {
        await this.fillFormField(this.costInput, cost);
    }

    async fillFeatures(features: string) {
        await this.fillFormField(this.featuresTextarea, features);
    }

    async fillDescription(description: string) {
        await this.fillFormField(this.descriptionTextarea, description);
    }

    async uploadImages(imagePaths: string[]) {
        await this.imageUploadInput.setInputFiles(imagePaths);
        await this.waitForElementToBeVisible(this.imageCards.first());
    }

    async setImageDescription(index: number, description: string) {
        const descInput = this.page.locator(`input#image-description-${index}`);
        await this.fillFormField(descInput, description);
    }

    async setPrincipalImage(index: number) {
        const radio = this.page.locator(`input[name="principalImage"]`).nth(index);
        await radio.check();
    }

    async getImageCount(): Promise<number> {
        return await this.imageCards.count();
    }

    async clickSubmit() {
        await this.submitButton.click();
    }

    async clickCancel() {
        await this.cancelButton.click();
    }

    async isSubmitButtonDisabled(): Promise<boolean> {
        return await this.submitButton.isDisabled();
    }

    async isErrorAlertVisible(): Promise<boolean> {
        return await this.isElementVisible(this.errorAlert);
    }

    async getErrorMessage(): Promise<string> {
        return await this.getElementText(this.errorMessage);
    }

    async waitForRedirectToAnimalDetails(animalId: string) {
        await this.page.waitForURL(`**/animals/${animalId}`);
    }
}