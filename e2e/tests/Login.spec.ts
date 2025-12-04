import { test, expect } from '../fixtures/base.fixture';
import {
    mockLoginResponse,
    mockUserDataRegular,
    mockUserDataAdminCAA,
    validCredentials,
    invalidEmailCredentials,
    shortPasswordCredentials,
    wrongCredentials
} from '../test-data/LoginPage/mockLoginData';
import type { Page } from '@playwright/test';
import type { ApiMockHelper } from '../core/ApiMockHelper';
import { mockAnimalsPage1 } from '../test-data/AnimalsPage/animals-page1';

async function setupAuthMocks(apiMock: ApiMockHelper, page: Page, userRole: 'User' | 'AdminCAA' = 'User') {
    await page.route('**/notificationHub/**', route => route.abort());
    await apiMock.mockApiCall('**api/login', mockLoginResponse);
    await apiMock.mockApiCall('**api/users/me', userRole === 'User' ? mockUserDataRegular : mockUserDataAdminCAA);
    await apiMock.mockApiCall('**/api/animals?**', mockAnimalsPage1);
    await apiMock.mockApiCall('http://localhost:5000/api/notifications**', []);
}

test.describe('Login Page', () => {

    test.beforeEach(async ({ pm }) => {
        await pm.navigateToLogin();
    });

    test.describe('Basic Rendering', () => {

        test('should render login page with all elements', async ({ pm }) => {
            const loginPage = pm.getLoginPage();
            await loginPage.waitForPageToLoad();

            expect(await loginPage.isLogoVisible()).toBe(true);
            await expect(loginPage.emailInput).toBeVisible();
            await expect(loginPage.passwordInput).toBeVisible();
            await expect(loginPage.submitButton).toBeVisible();
            await expect(loginPage.registerLink).toBeVisible();
        });

        test('should display correct logo', async ({ pm }) => {
            const loginPage = pm.getLoginPage();
            await loginPage.waitForPageToLoad();

            const logo = loginPage.logo;
            await expect(logo).toBeVisible();
            await expect(logo).toHaveAttribute('alt', 'Seepaw');
        });

        test('should have register link pointing to signup', async ({ pm }) => {
            const loginPage = pm.getLoginPage();
            await loginPage.waitForPageToLoad();

            await expect(loginPage.registerLink).toHaveAttribute('href', '/signup');
        });
    });

    test.describe('Form Validation - Client Side', () => {

        test('should show error for invalid email format', async ({ pm, page }) => {
            const loginPage = pm.getLoginPage();
            await loginPage.waitForPageToLoad();

            await loginPage.fillEmail(invalidEmailCredentials.email);
            await loginPage.fillPassword(invalidEmailCredentials.password);
            await loginPage.clickSubmit();

            await page.waitForTimeout(1000);

            expect(await loginPage.isEmailErrorVisible()).toBe(true);
            const errorMessage = await loginPage.getEmailErrorMessage();
            expect(errorMessage).toContain('email não tem um formato válido');
        });

        test('should show error for short password', async ({ pm, page }) => {
            const loginPage = pm.getLoginPage();
            await loginPage.waitForPageToLoad();

            await loginPage.fillEmail(shortPasswordCredentials.email);
            await loginPage.fillPassword(shortPasswordCredentials.password);
            await loginPage.clickSubmit();

            await page.waitForTimeout(500);

            expect(await loginPage.isPasswordErrorVisible()).toBe(true);
            const errorMessage = await loginPage.getPasswordErrorMessage();
            expect(errorMessage).toContain('password deve ter pelo menos 8 caracteres');
        });

        test('should clear validation errors when correcting input', async ({ pm, page }) => {
            const loginPage = pm.getLoginPage();
            await loginPage.waitForPageToLoad();

            await loginPage.fillEmail(invalidEmailCredentials.email);
            await loginPage.clickSubmit();
            await page.waitForTimeout(500);

            expect(await loginPage.isEmailErrorVisible()).toBe(true);

            await loginPage.fillEmail(validCredentials.email);
            await loginPage.fillPassword(validCredentials.password);
            await page.waitForTimeout(500);

            expect(await loginPage.isEmailErrorVisible()).toBe(false);
        });
    });

    test.describe('Successful Login', () => {

        test('should login successfully with valid credentials (User role)', async ({ pm, apiMock, page }) => {
            await setupAuthMocks(apiMock, page);

            const loginPage = pm.getLoginPage();
            const animalsPage = pm.getAnimalsPage();

            await loginPage.waitForPageToLoad();

            await loginPage.fillAndSubmitLogin(validCredentials.email, validCredentials.password);

            await animalsPage.waitForAnimalsToLoad(10000);
            expect(page.url()).toContain('/animals');
        });

        test('should redirect AdminCAA to /admin after successful login', async ({ pm, apiMock, page }) => {
            await setupAuthMocks(apiMock, page, 'AdminCAA');

            await apiMock.mockApiCall('**/api/ownershiprequests?**', {
                items: [],
                currentPage: 1,
                totalPages: 1,
                totalCount: 0
            });

            const loginPage = pm.getLoginPage();
            await loginPage.waitForPageToLoad();

            await loginPage.fillAndSubmitLogin(validCredentials.email, validCredentials.password);

            await page.waitForTimeout(1000);
            
            expect(page.url()).toContain('/admin');
        });

        test('should display success toast on successful login', async ({ pm, apiMock, page}) => {
            await page.route('**/notificationHub/**', route => route.abort());
            await apiMock.mockApiCall('http://localhost:5000/api/notifications**', []); 
            await apiMock.mockApiCall('**/login', mockLoginResponse);
            await apiMock.mockApiCall('**/users/me', mockUserDataRegular);
            await apiMock.mockApiCall('**/api/animals?**', mockAnimalsPage1);

            const loginPage = pm.getLoginPage();
            await loginPage.waitForPageToLoad();

            await loginPage.fillAndSubmitLogin(validCredentials.email, validCredentials.password);

            await loginPage.waitForToast('Bem vindo à SeePaw!!');
            expect(await loginPage.isToastVisible('Bem vindo à SeePaw!!')).toBe(true);
        });
    });


    test.describe('Failed Login', () => {

        test('should show error message for wrong credentials', async ({ pm, apiMock, page }) => {
            await apiMock.mockError('**/login', 401, 'Unauthorized');

            const loginPage = pm.getLoginPage();
            await loginPage.waitForPageToLoad();

            await loginPage.fillAndSubmitLogin(wrongCredentials.email, wrongCredentials.password);

            await page.waitForTimeout(1000);

            expect(await loginPage.isRootErrorVisible()).toBe(true);
            const errorMessage = await loginPage.getRootErrorMessage();
            expect(errorMessage).toContain('Email ou password incorretos');
        });

        test('should show validation error for malformed request', async ({ pm, apiMock, page }) => {
            await apiMock.mockError('**/login', 400, 'Bad Request');

            const loginPage = pm.getLoginPage();
            await loginPage.waitForPageToLoad();

            await loginPage.fillAndSubmitLogin(validCredentials.email, validCredentials.password);

            await page.waitForTimeout(1000);

            expect(await loginPage.isRootErrorVisible()).toBe(true);
            const errorMessage = await loginPage.getRootErrorMessage();
            expect(errorMessage).toContain('Dados inválidos');
        });

        test('should not navigate away on failed login', async ({ pm, apiMock, page }) => {
            await apiMock.mockError('**/login', 401, 'Unauthorized');

            const loginPage = pm.getLoginPage();
            await loginPage.waitForPageToLoad();

            await loginPage.fillAndSubmitLogin(wrongCredentials.email, wrongCredentials.password);

            await page.waitForTimeout(1000);

            expect(page.url()).toContain('/login');
        });
    });

    test.describe('Network Errors', () => {

        test('should handle network error gracefully', async ({ pm, page }) => {
            await page.route('**/login', route => route.abort('failed'));

            const loginPage = pm.getLoginPage();
            await loginPage.waitForPageToLoad();

            await loginPage.fillAndSubmitLogin(validCredentials.email, validCredentials.password);

            await page.waitForTimeout(1000);

            expect(await loginPage.isRootErrorVisible()).toBe(true);
            const errorMessage = await loginPage.getRootErrorMessage();
            expect(errorMessage).toContain('Sem ligação');
        });

        test('should handle timeout error', async ({ pm, apiMock, page }) => {
            await apiMock.mockWithDelay('**/login', mockLoginResponse, 15000);

            const loginPage = pm.getLoginPage();
            await loginPage.waitForPageToLoad();

            await loginPage.fillAndSubmitLogin(validCredentials.email, validCredentials.password);

            await page.waitForTimeout(12000);

            expect(await loginPage.isRootErrorVisible()).toBe(true);
        });

        test('should handle 500 server error', async ({ pm, apiMock, page }) => {
            await apiMock.mockError('**/login', 500, 'Internal Server Error');

            const loginPage = pm.getLoginPage();
            await loginPage.waitForPageToLoad();

            await loginPage.fillAndSubmitLogin(validCredentials.email, validCredentials.password);

            await page.waitForTimeout(1000);

            expect(await loginPage.isRootErrorVisible()).toBe(true);
            const errorMessage = await loginPage.getRootErrorMessage();
            expect(errorMessage).toContain('Erro no servidor');
        });
    });

    test.describe('Loading States', () => {

        test('should disable submit button while logging in', async ({ pm, apiMock, page }) => {
            await apiMock.mockWithDelay('**/login', mockLoginResponse, 2000);
            await apiMock.mockApiCall('**/users/me', mockUserDataRegular);

            const loginPage = pm.getLoginPage();
            await loginPage.waitForPageToLoad();

            await loginPage.fillAndSubmitLogin(validCredentials.email, validCredentials.password);

            await page.waitForTimeout(500);

            expect(await loginPage.isSubmitButtonDisabled()).toBe(true);
        });

        test('should change button text to "A entrar..." while loading', async ({ pm, apiMock, page }) => {
            await apiMock.mockWithDelay('**/login', mockLoginResponse, 2000);
            await apiMock.mockApiCall('**/users/me', mockUserDataRegular);

            const loginPage = pm.getLoginPage();
            await loginPage.waitForPageToLoad();

            await loginPage.fillAndSubmitLogin(validCredentials.email, validCredentials.password);

            await page.waitForTimeout(500);

            const buttonText = await loginPage.getSubmitButtonText();
            expect(buttonText).toBe('A entrar...');
        });

        test('should re-enable button after login completes', async ({ pm, apiMock, page }) => {
            await setupAuthMocks(apiMock, page);

            await apiMock.mockApiCall('**/api/ownershiprequests?**', {
                items: [],
                currentPage: 1,
                totalPages: 1,
                totalCount: 0
            });

            const loginPage = pm.getLoginPage();
            await loginPage.waitForPageToLoad();

            await loginPage.fillAndSubmitLogin(validCredentials.email, validCredentials.password);

            await page.waitForURL('**/animals**');
            await apiMock.clearMocks();
            const navbar = await pm.getNavbarComponent()
            await navbar.clickLogout()
            await navbar.goToLogin()
            await loginPage.waitForPageToLoad();

            expect(await loginPage.isSubmitButtonDisabled()).toBe(false);
        });
    });

    test.describe('Form Interaction', () => {

        test('should allow typing in email field', async ({ pm }) => {
            const loginPage = pm.getLoginPage();
            await loginPage.waitForPageToLoad();

            await loginPage.fillEmail('test@example.com');

            const value = await loginPage.emailInput.inputValue();
            expect(value).toBe('test@example.com');
        });

        test('should allow typing in password field', async ({ pm }) => {
            const loginPage = pm.getLoginPage();
            await loginPage.waitForPageToLoad();

            await loginPage.fillPassword('MyPassword123');

            const value = await loginPage.passwordInput.inputValue();
            expect(value).toBe('MyPassword123');
        });

        test('should mask password input', async ({ pm }) => {
            const loginPage = pm.getLoginPage();
            await loginPage.waitForPageToLoad();

            const inputType = await loginPage.passwordInput.getAttribute('type');
            expect(inputType).toBe('password');
        });

        test('should clear form fields', async ({ pm }) => {
            const loginPage = pm.getLoginPage();
            await loginPage.waitForPageToLoad();

            await loginPage.fillEmail('test@example.com');
            await loginPage.fillPassword('Password123');

            await loginPage.clearForm();

            const emailValue = await loginPage.emailInput.inputValue();
            const passwordValue = await loginPage.passwordInput.inputValue();

            expect(emailValue).toBe('');
            expect(passwordValue).toBe('');
        });
    });

    test.describe('User Flow', () => {

        test('should complete full login flow end-to-end', async ({ pm, apiMock, page }) => {
            await setupAuthMocks(apiMock, page);

            await apiMock.mockApiCall('**/api/ownershiprequests?**', {
                items: [],
                currentPage: 1,
                totalPages: 1,
                totalCount: 0
            });

            const loginPage = pm.getLoginPage();
            await loginPage.waitForPageToLoad();

            expect(await loginPage.isLogoVisible()).toBe(true);

            await loginPage.fillEmail(validCredentials.email);
            await loginPage.fillPassword(validCredentials.password);

            await loginPage.clickSubmit();

            await loginPage.waitForToast('Bem vindo à SeePaw!!');

            await page.waitForURL('**/animals**');

            expect(page.url()).toContain('/animals');
        });

        test('should handle retry after failed login', async ({ pm, apiMock, page }) => {
            await page.route('**/notificationHub/**', route => route.abort());
            await apiMock.mockApiCall('http://localhost:5000/api/notifications**', []);
            await apiMock.mockApiCall('**/api/animals?**', mockAnimalsPage1);

            let attemptCount = 0;

            await page.route('**/login', async (route) => {
                attemptCount++;
                if (attemptCount === 1) {
                    await route.fulfill({
                        status: 401,
                        contentType: 'application/json',
                        body: JSON.stringify({ message: 'Unauthorized' })
                    });
                } else {
                    await route.fulfill({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify(mockLoginResponse)
                    });
                }
            });

            await apiMock.mockApiCall('**/users/me', mockUserDataRegular);

            const loginPage = pm.getLoginPage();
            await loginPage.waitForPageToLoad();

            await loginPage.fillAndSubmitLogin(wrongCredentials.email, wrongCredentials.password);
            await page.waitForTimeout(1000);

            expect(await loginPage.isRootErrorVisible()).toBe(true);

            await loginPage.clearForm();

            await loginPage.fillAndSubmitLogin(validCredentials.email, validCredentials.password);

            await page.waitForURL('**/animals**');
            expect(page.url()).toContain('/animals');
        });
    });
});
