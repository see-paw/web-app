import { Locator, Page } from "@playwright/test";
import { BasePage } from "../core/base.page";

/**
 * Component Object para o header do animal
 * Reutilizável em qualquer página que precise mostrar o nome do animal
 * com o artigo correto (o/a) baseado no sexo
 */
export class AnimalHeaderComponent extends BasePage {
    // ========================================
    // LOCATORS
    // ========================================
    readonly headerContainer: Locator;
    readonly headerTitle: Locator;
    readonly animalName: Locator;

    constructor(page: Page) {
        super(page);

        // O container pode não ter testid, mas vamos assumir que existe
        // Se não, podemos usar o h1 diretamente
        this.headerContainer = page.locator('[data-testid="animal-header"]').first();
        this.headerTitle = page.locator('[data-testid="animal-header-title"]');
        this.animalName = page.locator('[data-testid="animal-name"]');
    }

    // ========================================
    // MÉTODOS DE VALIDAÇÃO
    // ========================================

    async isHeaderVisible(): Promise<boolean> {
        return await this.isElementVisible(this.headerTitle);
    }

    async waitForHeaderToLoad() {
        await this.waitForElementToBeVisible(this.headerTitle);
        await this.waitForElementToBeVisible(this.animalName);
    }

    // ========================================
    // MÉTODOS DE OBTENÇÃO DE DADOS
    // ========================================

    async getAnimalName(): Promise<string> {
        return await this.getElementText(this.animalName);
    }

    async getFullHeaderText(): Promise<string> {
        return await this.getElementText(this.headerTitle);
    }

    // ========================================
    // MÉTODOS DE VALIDAÇÃO DE CONTEÚDO
    // ========================================

    /**
     * Valida se o artigo usado está correto baseado no sexo
     * @param expectedSex - 'male' ou 'female' (ou 'macho'/'fêmea')
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
     * Valida que o header contém o nome esperado
     */
    async containsName(expectedName: string): Promise<boolean> {
        const actualName = await this.getAnimalName();
        return actualName === expectedName;
    }

    /**
     * Valida que o header tem o formato completo correto
     * Ex: "Olá, eu sou o Max! ❤️"
     */
    async hasCorrectFormat(expectedName: string, expectedSex: string): Promise<boolean> {
        const fullText = await this.getFullHeaderText();

        // Verificar estrutura básica
        if (!fullText.includes('Olá, eu sou')) {
            return false;
        }

        // Verificar nome
        if (!fullText.includes(expectedName)) {
            return false;
        }

        // Verificar artigo correto
        const hasCorrectArticle = await this.hasCorrectArticle(expectedSex);
        if (!hasCorrectArticle) {
            return false;
        }

        // Verificar emoji (opcional, mas bom ter)
        if (!fullText.includes('❤️')) {
            return false;
        }

        return true;
    }

    /**
     * Extrai apenas o artigo usado (o/a)
     */
    async getArticle(): Promise<string> {
        const fullText = await this.getFullHeaderText();

        // Procurar por "eu sou o" ou "eu sou a"
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