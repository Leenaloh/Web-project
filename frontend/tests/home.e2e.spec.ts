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

async function openHome(page: Page): Promise<void> {
  await page.goto('/home');
  await expect(page.getByTestId('page-home')).toBeVisible();
}

test.describe('Home', () => {
  test.beforeEach(async ({ page }) => {
    await resetCart(page.request);
    await openHome(page);
  });

  test('search flow navigates to movie list with query params', async ({ page }) => {
    await page.getByTestId('input-title').fill('Shawshank');
    await page.getByTestId('input-year').fill('1994');
    await page.getByTestId('input-director').fill('Frank Darabont');
    await page.getByTestId('input-star').fill('Tim Robbins');

    await page.getByTestId('btn-search').click();

    await expect(page).toHaveURL(/\/movie-list\?/);
    await expect(page).toHaveURL(/title=Shawshank/);
    await expect(page.getByTestId('page-movie-list')).toBeVisible();
  });

  test('browse by genre opens movie list', async ({ page }) => {
    await page.locator('#genre').selectOption('1');
    await page.getByTestId('btn-search').click();

    await expect(page).toHaveURL(/\/movie-list\?/);
    await expect(page).toHaveURL(/genreId=1/);
    await expect(page.getByTestId('page-movie-list')).toBeVisible();
  });

  test('browse by title character opens movie list', async ({ page }) => {
    await page.locator('#letter').selectOption('A');
    await page.getByTestId('btn-search').click();

    await expect(page).toHaveURL(/\/movie-list\?/);
    await expect(page).toHaveURL(/startsWith=A/);
    await expect(page.getByTestId('page-movie-list')).toBeVisible();
  });
});
