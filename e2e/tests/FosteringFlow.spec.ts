import { test, expect } from "../fixtures/base.fixture";
import { mockAnimalMaria } from "../test-data/AnimalDetailsPage/mockAnimalDetails";
import { mockFosteringSuccess } from "../test-data/Fosterings/mockFostering";

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
    authenticatedUser
  }) => {
    await apiMock.mockApiCall("**/api/animals/**", mockAnimalMaria);

    await page.goto(`/animals/${mockAnimalMaria.id}/foster`);

    const continueButton = page.getByTestId("continue-button");
    
    await expect(continueButton).toBeDisabled();

    await page.getByTestId("select-value-10").click();
    
    await expect(continueButton).toBeEnabled();

    await continueButton.click();

    await expect(page).toHaveURL(
      `/animals/${mockAnimalMaria.id}/foster/form?value=10`
    );
  });

  test("should keep Continue disabled for custom value < 10 and enable it for value >= 10", async ({
    page,
    apiMock,
    authenticatedUser
  }) => {
    await apiMock.mockApiCall("**/api/animals/**", mockAnimalMaria);

    await page.goto(`/animals/${mockAnimalMaria.id}/foster`);

    const customInput = page.getByTestId("custom-value-input");
    const continueButton = page.getByTestId("continue-button");

    await customInput.fill("5");
    await expect(continueButton).toBeDisabled();

    await customInput.fill("12");
    await expect(continueButton).toBeEnabled();

    await continueButton.click();

    await expect(page).toHaveURL(
      `/animals/${mockAnimalMaria.id}/foster/form?value=12`
    );
  });

  test("should navigate back to animal details when back button is clicked on select value page", async ({
    page,
    apiMock,
    authenticatedUser
  }) => {
    await apiMock.mockApiCall("**/api/animals/**", mockAnimalMaria);

    await page.goto(`/animals/${mockAnimalMaria.id}`);
    await page.goto(`/animals/${mockAnimalMaria.id}/foster`);

    await page.getByTestId("back-button").click();

    await expect(page).toHaveURL(`/animals/${mockAnimalMaria.id}`);
  });

  // ---------------------------------------------------------------------------
  // 2) FOSTERING FORM PAGE
  // ---------------------------------------------------------------------------

  test("submit button stays disabled when form is empty", async ({ page, apiMock, authenticatedUser }) => {
    await apiMock.mockApiCall("**/api/animals/**", mockAnimalMaria);

    await page.goto(`/animals/${mockAnimalMaria.id}/foster/form?value=10`);

    const submitButton = page.getByTestId("form-submit-button");

    await expect(submitButton).toBeDisabled();
  });

  test("should navigate back to value selection when form back button is clicked", async ({
    page,
    apiMock,
    authenticatedUser
  }) => {
    await apiMock.mockApiCall("**/api/animals/**", mockAnimalMaria);

    await page.goto(`/animals/${mockAnimalMaria.id}/foster`);
    await page.getByTestId("select-value-10").click();
    await page.getByTestId("continue-button").click();

    await expect(page).toHaveURL(
      new RegExp(`/animals/${mockAnimalMaria.id}/foster/form`)
    );

    await page.getByTestId("form-back-button").click();

    await expect(page).toHaveURL(`/animals/${mockAnimalMaria.id}/foster`);
  });

  test("should allow submitting fostering form with valid data and navigate to confirmation", async ({
    page,
    apiMock,
    authenticatedUser
  }) => {
    await apiMock.mockApiCall("**/api/animals/**", mockAnimalMaria);

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

    await page.getByTestId("fullName-input").fill("Maria Sousa");
    await page.getByTestId("nif-input").fill("123456789");
    await page.getByTestId("iban-input").fill("PT50123456789012345678901");
    await page.getByTestId("cvv-input").fill("123");

    const submitButton = page.getByTestId("form-submit-button");
    
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

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
    authenticatedUser
  }) => {
    await apiMock.mockApiCall("**/api/animals/**", mockAnimalMaria);

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

    await page.goto(`/animals/${mockAnimalMaria.id}/foster`);

    await page.getByTestId("select-value-10").click();
    await page.getByTestId("continue-button").click();

    await page.waitForURL(new RegExp(`/animals/${mockAnimalMaria.id}/foster/form`));

    await page.getByTestId("fullName-input").fill("Maria Apadrinhadora");
    await page.getByTestId("nif-input").fill("123456789");
    await page.getByTestId("iban-input").fill("PT50123456789012345678901");
    await page.getByTestId("cvv-input").fill("123");
    
    await page.getByTestId("form-submit-button").click();

    await page.waitForURL(new RegExp(`/animals/${mockAnimalMaria.id}/foster/confirmation`));

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
    authenticatedUser
  }) => {
    await apiMock.mockApiCall("**/api/animals/**", mockAnimalMaria);
    
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

    await page.goto(`/animals/${mockAnimalMaria.id}/foster`);
    
    await page.getByTestId("select-value-10").click();
    await page.getByTestId("continue-button").click();

    await page.waitForURL(new RegExp(`/animals/${mockAnimalMaria.id}/foster/form`));

    await page.getByTestId("fullName-input").fill("Maria Santos");
    await page.getByTestId("nif-input").fill("123456789");
    await page.getByTestId("iban-input").fill("PT50123456789012345678901");
    await page.getByTestId("cvv-input").fill("123");
    
    await page.getByTestId("form-submit-button").click();

    await page.waitForURL(new RegExp(`/animals/${mockAnimalMaria.id}/foster/confirmation`));

    const downloadButton = page.getByTestId("download-receipt");

    await expect(downloadButton).toBeVisible();
    await downloadButton.click();
  });
});