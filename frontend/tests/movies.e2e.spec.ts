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

async function openMovies(page: Page, query = ''): Promise<void> {
  await page.goto(`/movie-list${query}`);
  await expect(page.getByTestId('page-movie-list')).toBeVisible();
}

test.describe('Movie List', () => {
  test.beforeEach(async ({ page }) => {
    await resetCart(page.request);
  });

  test('filtering flow (from query params) loads movie list', async ({ page }) => {
    await openMovies(page, '?title=Shawshank&year=1994&director=Frank%20Darabont&star=Tim');
    await expect(page.getByTestId('heading-movie-list')).toBeVisible();
  });

  test('pagination flow keeps requested page params', async ({ page }) => {
    await openMovies(page, '?page=2&pageSize=20');
    await expect(page).toHaveURL(/page=2/);
    await expect(page).toHaveURL(/pageSize=20/);
  });

  test('sorting flow keeps requested sort params', async ({ page }) => {
    await openMovies(page, '?sort=title&order=asc');
    await expect(page).toHaveURL(/sort=title/);
    await expect(page).toHaveURL(/order=asc/);
  });

  test('open movie details from movie list', async ({ page }) => {
    await openMovies(page);

    const firstMovieLink = page.getByTestId(/movie-link-.+/).first();
    await expect(firstMovieLink).toBeVisible();
    await firstMovieLink.click();

    await expect(page).toHaveURL(/\/movie_details\?/);
    await expect(page.getByTestId('page-movie-details')).toBeVisible();
  });
});
