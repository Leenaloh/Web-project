import { test, expect, APIRequestContext, Page } from '@playwright/test';

const API_BASE = 'http://localhost:8080/api/v1';

async function resetCart(request: APIRequestContext): Promise<void> {
  const response = await request.delete(`${API_BASE}/cart`, {
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
    await page.getByTestId('genre-item-0').click(); // Action

    await expect(page).toHaveURL(/\/movie-list\?/);
    await expect(page).toHaveURL(/genre=Action/);
    await expect(page.getByTestId('page-movie-list')).toBeVisible();
  });

  test('browse by title character opens movie list', async ({ page }) => {
    await page.getByTestId('title-char-11').click(); // A

    await expect(page).toHaveURL(/\/movie-list\?/);
    await expect(page).toHaveURL(/startsWith=A/);
    await expect(page.getByTestId('page-movie-list')).toBeVisible();
  });
});
