import { test, expect } from '../fixtures/base.fixture';
import type { Page } from '@playwright/test';
import type { ApiMockHelper } from '../core/ApiMockHelper';
import { TEST_ANIMALS } from '../test-data/OwnershipRequests/testConstants';
import {OwnershipRequestsPage} from ".";


/**
 * Setup helper to mock SignalR and notifications
 */
async function setupBasicMocks(apiMock: ApiMockHelper, page: Page) {
    await page.route('**/notificationHub/**', route => route.abort());
    await apiMock.mockApiCall('http://localhost:5000/api/notifications**', []);
}

/**
 * Helper to create ownership request via API
 * Returns true if successful
 */
async function createOwnershipRequestViaAPI(page: Page, animalId: string): Promise<boolean> {
    // Get token from localStorage
    const authData = await page.evaluate(() => {
        const auth = localStorage.getItem('seepaw-auth');
        return auth ? JSON.parse(auth) : null;
    });

    const token = authData?.state?.tokens?.accessToken;

    if (!token) {
        throw new Error('No auth token found in localStorage');
    }

    console.log('🔑 Token:', token.substring(0, 30) + '...'); // debug
    console.log('🐾 Animal ID:', animalId); // debug

    // Create ownership request via API
    const response = await page.request.post('http://localhost:5000/api/OwnershipRequests', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        data: {
            animalId: animalId
        }
    });

    console.log('📡 Response status:', response.status()); //debug
    console.log('📦 Response body:', await response.text()); //debug

    return response.ok();
}

test.describe('Ownership Requests', () => {

    test.describe.serial('Approval Flow - Lunica', () => {

        test('should allow user to create ownership request for Lunica', async ({ page, apiMock, authenticatedUser }) => {
            await setupBasicMocks(apiMock, page);

            const success = await createOwnershipRequestViaAPI(page, TEST_ANIMALS.LUNICA.id);

            expect(success).toBe(true);
        });

        test('should display Lunica request in AdminCAA ownership requests list', async ({ pm, page, apiMock, authenticatedAdminCAA }) => {
            await setupBasicMocks(apiMock, page);

            // Navigate to ownership requests page
            await page.goto('/admin/ownership-requests');

            const ownershipRequestsPage = pm.getOwnershipRequestsPage();
            await ownershipRequestsPage.waitForPageToLoad();

            // Verify table is visible (not empty state)
            const isTableVisible = await ownershipRequestsPage.isTableVisible();
            expect(isTableVisible).toBe(true);
        });

        test('should allow AdminCAA to move Lunica request to Analysing state', async ({ pm, page, apiMock, authenticatedAdminCAA }) => {
            await setupBasicMocks(apiMock, page);
            
            await page.goto('/admin/ownership-requests');
            
            const ownershipRequestsPage = pm.getOwnershipRequestsPage();
            await ownershipRequestsPage.waitForPageToLoad();
            
            const tableComponent = pm.getOwnershipRequestsTableComponent();
            
            // Click "Analisar" button for Lunica
            await tableComponent.clickActionButton(TEST_ANIMALS.LUNICA.name, 'Analisar');
            
            // Confirm in dialog
            const confirmButton = page.getByRole('button', { name: 'Confirmar' });
            await confirmButton.click();
            
            // Wait for update and verify status changed
            await page.waitForTimeout(1000);
            
            const status = await tableComponent.getStatusByAnimalName(TEST_ANIMALS.LUNICA.name);
            expect(status).toContain('Em Análise');
        });

        test('should allow AdminCAA to approve Lunica request from Analysing state', async ({ pm, page, apiMock, authenticatedAdminCAA }) => {
            await setupBasicMocks(apiMock, page);
            
            await page.goto('/admin/ownership-requests');
            
            const ownershipRequestsPage = pm.getOwnershipRequestsPage();
            await ownershipRequestsPage.waitForPageToLoad();
            
            const tableComponent = pm.getOwnershipRequestsTableComponent();
            
            // Click "Aprovar" button for Lunica (opens modal)
            await tableComponent.clickActionButton(TEST_ANIMALS.LUNICA.name, 'Aprovar');
            
            // Confirm in dialog - use specific selector for modal button
            const modalConfirmButton = page.locator('#portal-root').getByRole('button', { name: 'Aprovar' });
            await modalConfirmButton.click();
            
            // Wait for mutation and verify status changed to Approved
            await page.waitForTimeout(1000);
            
            const status = await tableComponent.getStatusByAnimalName(TEST_ANIMALS.LUNICA.name);
            expect(status).toContain('Aprovado');
        });

        test('should display receipts modal when clicking approved Lunica request', async ({ pm, page, apiMock, authenticatedAdminCAA }) => {
            await setupBasicMocks(apiMock, page);
            
            await page.goto('/admin/ownership-requests');
            
            const ownershipRequestsPage = pm.getOwnershipRequestsPage();
            await ownershipRequestsPage.waitForPageToLoad();
            
            const tableComponent = pm.getOwnershipRequestsTableComponent();
            
            // Click on approved row (should open receipts modal)
            await tableComponent.clickRowForReceipts(TEST_ANIMALS.LUNICA.name);
            
            // Wait for modal title to be visible
            const modalTitle = page.getByText('Recibos de Adoção');
            await modalTitle.waitFor({ state: 'visible', timeout: 5000 });
            
            // Verify it's visible
            const isVisible = await modalTitle.isVisible();
            expect(isVisible).toBe(true);
        });
    });

    // Rejection Flow - Bolinhas (after Approval Flow)
    test.describe.serial('Rejection Flow - Bolinhas', () => {
        test('should allow user to create ownership request for Bolinhas', async ({ page, apiMock, authenticatedUser }) => {
            await setupBasicMocks(apiMock, page);

            const success = await createOwnershipRequestViaAPI(page, TEST_ANIMALS.BOLINHAS.id);
            expect(success).toBe(true);
        });

        test('should allow AdminCAA to move Bolinhas request to Analysing state', async ({ pm, page, apiMock, authenticatedAdminCAA }) => {
            await setupBasicMocks(apiMock, page);
            
            await page.goto('/admin/ownership-requests');
            
            const ownershipRequestsPage = pm.getOwnershipRequestsPage();
            await ownershipRequestsPage.waitForPageToLoad();
            
            const tableComponent = pm.getOwnershipRequestsTableComponent();
            
            await tableComponent.clickActionButton(TEST_ANIMALS.BOLINHAS.name, 'Analisar');
            
            const confirmButton = page.getByRole('button', { name: 'Confirmar' });
            await confirmButton.click();
            
            await page.waitForTimeout(1000);
            
            const status = await tableComponent.getStatusByAnimalName(TEST_ANIMALS.BOLINHAS.name);
            expect(status).toContain('Em Análise');
        });


        test('should allow AdminCAA to reject Bolinhas request with reason', async ({ pm, page, apiMock, authenticatedAdminCAA }) => {
            await setupBasicMocks(apiMock, page);
            await page.goto('/admin/ownership-requests');
            
            const ownershipRequestsPage = pm.getOwnershipRequestsPage();
            await ownershipRequestsPage.waitForPageToLoad();
            
            const tableComponent = pm.getOwnershipRequestsTableComponent();
            
            await tableComponent.clickActionButton(TEST_ANIMALS.BOLINHAS.name, 'Rejeitar');
            
            // Wait for modal heading to appear
            const modalHeading = page.getByRole('heading', { name: 'Rejeitar Pedido' });
            await modalHeading.waitFor({ state: 'visible' });

            const textarea = page.locator('textarea');
            await textarea.fill('Animal precisa de mais tempo de adaptação no abrigo.');
            
            // Get the Rejeitar button that's a sibling of Cancelar
            const modalRejectButton = page.getByRole('button', { name: 'Rejeitar' }).last();
            await modalRejectButton.click();
            
            // Wait for modal heading to disappear (modal closed)
            await modalHeading.waitFor({ state: 'hidden', timeout: 5000 });
            
            // Small wait for table refresh
            await page.waitForTimeout(500);
            
            const status = await tableComponent.getStatusByAnimalName(TEST_ANIMALS.BOLINHAS.name);
            
            expect(status).toContain('Rejeitado');
        });

        test('should allow AdminCAA to reopen rejected Bolinhas request to Analysing', async ({ pm, page, apiMock, authenticatedAdminCAA }) => {
            await setupBasicMocks(apiMock, page);
            
            await page.goto('/admin/ownership-requests');
            
            const ownershipRequestsPage = pm.getOwnershipRequestsPage();
            await ownershipRequestsPage.waitForPageToLoad();
            
            const tableComponent = pm.getOwnershipRequestsTableComponent();
            
            // Click "Reabrir" button for rejected Bolinhas
            await tableComponent.clickActionButton(TEST_ANIMALS.BOLINHAS.name, 'Reabrir');
            
            // Confirm in modal
            const confirmButton = page.getByRole('button', { name: 'Confirmar' });
            await confirmButton.click();
            
            // Wait and verify status changed back to Analysing
            await page.waitForTimeout(1000);
            
            const status = await tableComponent.getStatusByAnimalName(TEST_ANIMALS.BOLINHAS.name);
            expect(status).toContain('Em Análise');
        });

        test('should allow AdminCAA to approve Bolinhas request after reopening', async ({ pm, page, apiMock, authenticatedAdminCAA }) => {
            await setupBasicMocks(apiMock, page);
            
            await page.goto('/admin/ownership-requests');
            
            const ownershipRequestsPage = pm.getOwnershipRequestsPage();
            await ownershipRequestsPage.waitForPageToLoad();
            
            const tableComponent = pm.getOwnershipRequestsTableComponent();
            
            // Click "Aprovar" button for Bolinhas
            await tableComponent.clickActionButton(TEST_ANIMALS.BOLINHAS.name, 'Aprovar');
            
            // Confirm in modal
            const modalConfirmButton = page.locator('#portal-root').getByRole('button', { name: 'Aprovar' });
            await modalConfirmButton.click();
            
            // Wait and verify status changed to Approved
            await page.waitForTimeout(1000);
            
            const status = await tableComponent.getStatusByAnimalName(TEST_ANIMALS.BOLINHAS.name);
            expect(status).toContain('Aprovado');
        });

        test('should display receipts modal when clicking approved Bolinhas request', async ({ pm, page, apiMock, authenticatedAdminCAA }) => {
            await setupBasicMocks(apiMock, page);
            
            await page.goto('/admin/ownership-requests');
            
            const ownershipRequestsPage = pm.getOwnershipRequestsPage();
            await ownershipRequestsPage.waitForPageToLoad();
            
            const tableComponent = pm.getOwnershipRequestsTableComponent();
            
            // Click on approved Bolinhas row
            await tableComponent.clickRowForReceipts(TEST_ANIMALS.BOLINHAS.name);
            
            // Wait for modal title to be visible
            const modalTitle = page.getByText('Recibos de Adoção');
            await modalTitle.waitFor({ state: 'visible', timeout: 5000 });
            
            const isVisible = await modalTitle.isVisible();
            expect(isVisible).toBe(true);
        });
    });

    // Error Handling - Edge Cases with Mocks (parallel tests)
    test.describe('Error Handling', () => {
        test('should show error when trying to create request for already adopted animal', async ({ page, apiMock, authenticatedUser }) => {
            await setupBasicMocks(apiMock, page);

            // Mock 409 Conflict - animal already has approved request
            await apiMock.mockApiCall('**/api/OwnershipRequests', {
                status: 409,
                body: { message: 'Animal already has an approved ownership request' }
            });

            const success = await createOwnershipRequestViaAPI(page, TEST_ANIMALS.LUNICA.id);
            expect(success).toBe(false);
        });

        test('should show empty state when server returns 500', async ({ pm, page, apiMock, authenticatedAdminCAA }) => {
            await setupBasicMocks(apiMock, page);

            // Mock ownership requests list to return error
            await apiMock.mockApiCall('**/api/ownershiprequests?**', {
                status: 500,
                body: { message: 'Internal Server Error' }
            });

            await page.goto('/admin/ownership-requests');

            const ownershipRequestsPage = pm.getOwnershipRequestsPage();
            
            // Wait for page load
            await page.waitForTimeout(1000);
            
            // Verify empty state is shown (current behavior)
            const emptyState = await ownershipRequestsPage.isEmptyStateVisible();
            expect(emptyState).toBe(true);
        });

        test('should handle rejection failure gracefully', async ({ pm, page, apiMock, authenticatedAdminCAA }) => {
            await setupBasicMocks(apiMock, page);

            // Mock initial list with Bolinhas in Analysing state
            await apiMock.mockApiCall('**/api/ownershiprequests?**', {
                items: [{
                    id: '123',
                    animalId: TEST_ANIMALS.BOLINHAS.id,
                    animalName: TEST_ANIMALS.BOLINHAS.name,
                    userName: 'Carlos Santos',
                    amount: 30,
                    status: 'Analysing',
                    requestedAt: new Date().toISOString()
                }],
                currentPage: 1,
                totalPages: 1,
                totalCount: 1
            });

            await page.goto('/admin/ownership-requests');

            const ownershipRequestsPage = pm.getOwnershipRequestsPage();
            await ownershipRequestsPage.waitForPageToLoad();

            const tableComponent = pm.getOwnershipRequestsTableComponent();

            // Mock rejection to fail
            await apiMock.mockApiCall('**/api/OwnershipRequests/*/reject', {
                status: 400,
                body: { message: 'Cannot reject request in current state' }
            });

            await tableComponent.clickActionButton(TEST_ANIMALS.BOLINHAS.name, 'Rejeitar');

            const modalHeading = page.getByRole('heading', { name: 'Rejeitar Pedido' });
            await modalHeading.waitFor({ state: 'visible' });

            const textarea = page.locator('textarea');
            await textarea.fill('Motivo de teste');

            const modalRejectButton = page.getByRole('button', { name: 'Rejeitar' }).last();
            await modalRejectButton.click();

            // Wait for error toast/message
            await page.waitForTimeout(1000);

            // Verify error message is shown (adjust selector based on your error UI)
            const errorToast = page.getByText(/Erro ao rejeitar/i);
            const isErrorVisible = await errorToast.isVisible();
            expect(isErrorVisible).toBe(true);
        });
    });
});