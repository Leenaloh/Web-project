import { test, expect, APIRequestContext, Page } from '@playwright/test';

const API_BASE = process.env['E2E_API_BASE'] ?? 'https://localhost:8443/api/v1';
const TEST_CUSTOMER_ID = '490003';

async function resetCart(request: APIRequestContext): Promise<void> {
  const response = await request.delete(`${API_BASE}/cart`, {
    params: { customerId: TEST_CUSTOMER_ID },
    failOnStatusCode: false
  });
  expect(response.ok()).toBeTruthy();
}

async function openStarDetails(page: Page): Promise<void> {
  await page.goto('/star_details?id=nm0749263');
  await expect(page.getByTestId('page-star-details')).toBeVisible();
}

test.describe('Star Details', () => {
  test.beforeEach(async ({ page }) => {
    await resetCart(page.request);
    await openStarDetails(page);
  });

  test('view star details', async ({ page }) => {
    await expect(page.getByTestId(/heading-star-name-.+/)).toBeVisible();
    await expect(page.getByTestId(/star-birth-year-.+/)).toBeVisible();
    await expect(page.getByTestId('star-movie-list')).toBeVisible();
  });

  test('navigate to movie details from star details', async ({ page }) => {
    const firstMovieLink = page.getByTestId(/movie-link-.+/).first();
    await expect(firstMovieLink).toBeVisible();

    await firstMovieLink.click();

    await expect(page).toHaveURL(/\/movie_details\?/);
    await expect(page.getByTestId('page-movie-details')).toBeVisible();
  });
});
