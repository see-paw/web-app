import { test, expect } from "../fixtures/base.fixture";
import type { Page } from "@playwright/test";
import { mockAnimalMaria } from "../test-data/AnimalDetailsPage/mockAnimalDetails";
import { mockFosteringSuccess } from "../test-data/Fosterings/mockFostering";

/**
 * Helper function to authenticate the user before page load.
 * 
 * Seeds the Zustand persisted auth store in localStorage with a mock user
 * and tokens, simulating an authenticated session.
 * 
 * @param page - Playwright page instance
 */
async function setAuthenticatedUser(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "seepaw-auth",
      JSON.stringify({
        state: {
          user: {
            id: "test-user",
            email: "test@example.com",
            role: "User",
          },
          tokens: {
            accessToken: "dummy-access",
            refreshToken: "dummy-refresh",
          },
        },
      })
    );
  });
}

test.describe("Fostering Flow (Select → Form → Confirmation)", () => {
  test.use({ ignoreHTTPSErrors: true });

  test.beforeEach(async ({ page, apiMock }) => {
    await page.route('**/notificationHub/**', route => route.abort());
    await apiMock.mockApiCall('http://localhost:5000/api/notifications**', []);
  });

  // ---------------------------------------------------------------------------
  // 1) SELECT FOSTER VALUE PAGE
  // ---------------------------------------------------------------------------

  test("should enable Continue when a predefined value is selected and navigate to form", async ({
    page,
    apiMock,
  }) => {
    // Authenticate user before navigation
    await setAuthenticatedUser(page);

    // Mock animal details API response
    await apiMock.mockApiCall("**/api/animals/**", mockAnimalMaria);

    // Navigate to fostering value selection page
    await page.goto(`/animals/${mockAnimalMaria.id}/foster`);

    const continueButton = page.getByTestId("continue-button");
    
    // Continue button should be disabled initially
    await expect(continueButton).toBeDisabled();

    // Select predefined value of 10€
    await page.getByTestId("select-value-10").click();
    
    // Continue button should now be enabled
    await expect(continueButton).toBeEnabled();

    await continueButton.click();

    // Should navigate to form page with selected value in query params
    await expect(page).toHaveURL(
      `/animals/${mockAnimalMaria.id}/foster/form?value=10`
    );
  });

  test("should keep Continue disabled for custom value < 10 and enable it for value >= 10", async ({
    page,
    apiMock,
  }) => {
    await setAuthenticatedUser(page);

    await apiMock.mockApiCall("**/api/animals/**", mockAnimalMaria);

    await page.goto(`/animals/${mockAnimalMaria.id}/foster`);

    const customInput = page.getByTestId("custom-value-input");
    const continueButton = page.getByTestId("continue-button");

    // Enter value below minimum (10€)
    await customInput.fill("5");
    // Continue should remain disabled
    await expect(continueButton).toBeDisabled();

    // Enter valid value (>= 10€)
    await customInput.fill("12");
    // Continue should now be enabled
    await expect(continueButton).toBeEnabled();

    await continueButton.click();

    // Should navigate with custom value in query params
    await expect(page).toHaveURL(
      `/animals/${mockAnimalMaria.id}/foster/form?value=12`
    );
  });

  test("should navigate back to animal details when back button is clicked on select value page", async ({
    page,
    apiMock,
  }) => {
    await setAuthenticatedUser(page);

    await apiMock.mockApiCall("**/api/animals/**", mockAnimalMaria);

    // Navigate from animal details to fostering
    await page.goto(`/animals/${mockAnimalMaria.id}`);
    await page.goto(`/animals/${mockAnimalMaria.id}/foster`);

    // Click back button
    await page.getByTestId("back-button").click();

    // Should go back to previous page (animal details)
    await expect(page).toHaveURL(`/animals/${mockAnimalMaria.id}`);
  });

  // ---------------------------------------------------------------------------
  // 2) FOSTERING FORM PAGE
  // ---------------------------------------------------------------------------

  test("submit button stays disabled when form is empty", async ({ page, apiMock }) => {
    await setAuthenticatedUser(page);

    await apiMock.mockApiCall("**/api/animals/**", mockAnimalMaria);

    // Navigate directly to form page with a value
    await page.goto(`/animals/${mockAnimalMaria.id}/foster/form?value=10`);

    const submitButton = page.getByTestId("form-submit-button");

    // Submit button should be disabled when form is empty
    await expect(submitButton).toBeDisabled();
  });

  test("should navigate back to value selection when form back button is clicked", async ({
    page,
    apiMock,
  }) => {
    await setAuthenticatedUser(page);

    await apiMock.mockApiCall("**/api/animals/**", mockAnimalMaria);

    // Start from value selection and navigate to form
    await page.goto(`/animals/${mockAnimalMaria.id}/foster`);
    await page.getByTestId("select-value-10").click();
    await page.getByTestId("continue-button").click();

    // Should be on form page
    await expect(page).toHaveURL(
      new RegExp(`/animals/${mockAnimalMaria.id}/foster/form`)
    );

    // Click form back button
    await page.getByTestId("form-back-button").click();

    // Should navigate back to value selection
    await expect(page).toHaveURL(`/animals/${mockAnimalMaria.id}/foster`);
  });

  test("should allow submitting fostering form with valid data and navigate to confirmation", async ({
    page,
    apiMock,
  }) => {
    await setAuthenticatedUser(page);

    // Mock GET animal details
    await apiMock.mockApiCall("**/api/animals/**", mockAnimalMaria);

    // Mock POST fostering creation - intercept and respond with success
    await page.route("**/api/fosterings**", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(mockFosteringSuccess),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto(`/animals/${mockAnimalMaria.id}/foster/form?value=10`);

    // Fill all required form fields with valid data
    await page.getByTestId("fullName-input").fill("Maria Sousa");
    await page.getByTestId("nif-input").fill("123456789");
    await page.getByTestId("iban-input").fill("PT50123456789012345678901");
    await page.getByTestId("cvv-input").fill("123");

    const submitButton = page.getByTestId("form-submit-button");
    
    // Submit button should be enabled with valid data
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Should navigate to confirmation page
    await expect(page).toHaveURL(
      new RegExp(`/animals/${mockAnimalMaria.id}/foster/confirmation$`)
    );
  });

  // ---------------------------------------------------------------------------
  // 3) FOSTER CONFIRMATION PAGE
  // ---------------------------------------------------------------------------

  test("should display confirmation message, heart image and download button", async ({
    page,
    apiMock,
  }) => {
    await setAuthenticatedUser(page);

    // Mock GET animal details
    await apiMock.mockApiCall("**/api/animals/**", mockAnimalMaria);

    // Mock POST fostering creation - intercept and respond with success
    await page.route("**/api/fosterings**", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(mockFosteringSuccess),
        });
      } else {
        await route.continue();
      }
    });

    // Start fostering flow from value selection page
    await page.goto(`/animals/${mockAnimalMaria.id}/foster`);

    await page.getByTestId("select-value-10").click();
    await page.getByTestId("continue-button").click();

    // Wait for navigation to form page
    await page.waitForURL(new RegExp(`/animals/${mockAnimalMaria.id}/foster/form`));

    // Fill form with valid data
    await page.getByTestId("fullName-input").fill("Maria Apadrinhadora");
    await page.getByTestId("nif-input").fill("123456789");
    await page.getByTestId("iban-input").fill("PT50123456789012345678901");
    await page.getByTestId("cvv-input").fill("123");
    
    // Submit form using correct test-id
    await page.getByTestId("form-submit-button").click();

    // Wait for navigation to confirmation page
    await page.waitForURL(new RegExp(`/animals/${mockAnimalMaria.id}/foster/confirmation`));

    // Verify all elements are displayed on confirmation page
    await expect(
      page.getByRole("heading", { name: /Obrigada por me apadrinhares!/i })
    ).toBeVisible();

    await expect(page.getByText("Ansiosa/o por te conhecer!")).toBeVisible();

    await expect(page.getByTestId("heart-image")).toBeVisible();
    await expect(page.getByTestId("download-receipt")).toBeVisible();
  });

  test("should allow the user to click the download receipt button", async ({
    page,
    apiMock,
  }) => {
    await setAuthenticatedUser(page);

    // Mock GET animal details
    await apiMock.mockApiCall("**/api/animals/**", mockAnimalMaria);
    
    // Mock POST fostering creation
    await page.route("**/api/fosterings**", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(mockFosteringSuccess),
        });
      } else {
        await route.continue();
      }
    });

    // Start fostering flow
    await page.goto(`/animals/${mockAnimalMaria.id}/foster`);
    
    await page.getByTestId("select-value-10").click();
    await page.getByTestId("continue-button").click();

    // Wait for navigation to form
    await page.waitForURL(new RegExp(`/animals/${mockAnimalMaria.id}/foster/form`));

    // Fill form
    await page.getByTestId("fullName-input").fill("Maria Santos");
    await page.getByTestId("nif-input").fill("123456789");
    await page.getByTestId("iban-input").fill("PT50123456789012345678901");
    await page.getByTestId("cvv-input").fill("123");
    
    // Submit form
    await page.getByTestId("form-submit-button").click();

    // Wait for navigation to confirmation
    await page.waitForURL(new RegExp(`/animals/${mockAnimalMaria.id}/foster/confirmation`));

    const downloadButton = page.getByTestId("download-receipt");

    // Download button should be visible
    await expect(downloadButton).toBeVisible();
    await downloadButton.click();
    
  });
});