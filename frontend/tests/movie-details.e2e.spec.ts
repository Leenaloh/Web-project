import { test, expect, APIRequestContext, Page } from '@playwright/test';

const API_BASE = 'http://localhost:8080/api/v1';

type CartItem = { movieId: string; quantity: number };

async function resetCart(request: APIRequestContext): Promise<void> {
  const response = await request.delete(`${API_BASE}/cart`, {
    failOnStatusCode: false
  });
  expect(response.ok()).toBeTruthy();
}

async function getCartItems(request: APIRequestContext): Promise<CartItem[]> {
  const response = await request.get(`${API_BASE}/cart`, {
    failOnStatusCode: false
  });
  expect(response.ok()).toBeTruthy();

  const body = (await response.json()) as any;

  const raw =
    body?.items ??
    body?.cartItems ??
    body?.data?.items ??
    body?.data?.cartItems ??
    body?.cart?.items ??
    body;

  // Array response
  if (Array.isArray(raw)) return raw as CartItem[];

  // Object/Map response: { "tt001": {...}, "tt002": {...} }
  if (raw && typeof raw === 'object') return Object.values(raw) as CartItem[];

  throw new Error(`Unexpected /cart response shape: ${JSON.stringify(body)}`);
}
async function openMovieDetails(page: Page): Promise<void> {
  await page.goto('/movie_details?id=tt001');
  await expect(page.getByTestId('page-movie-details')).toBeVisible();
}

test.describe('Movie Details', () => {
  test.beforeEach(async ({ page }) => {
    await resetCart(page.request);
    await openMovieDetails(page);
  });

  test('view movie details', async ({ page }) => {
    await expect(page.getByTestId(/heading-movie-title-.+/)).toBeVisible();
    await expect(page.getByTestId('heading-stars')).toBeVisible();
    await expect(page.getByTestId('star-list')).toBeVisible();
  });

  test('navigate to star details', async ({ page }) => {
    const firstStarLink = page.getByTestId(/star-link-.+/).first();
    await expect(firstStarLink).toBeVisible();

    await firstStarLink.click();

    await expect(page).toHaveURL(/\/star_details\?/);
    await expect(page.getByTestId('page-star-details')).toBeVisible();
  });

  test('add to cart updates backend cart state', async ({ page }) => {
    await page.getByTestId('btn-update-qty-inc').click(); // qty: 2
    await page.getByTestId('btn-add-to-cart').click();

    await expect(page.getByTestId('msg-success')).toBeVisible();

    const items = await getCartItems(page.request);
    const added = items.find((i) => i.movieId === 'tt001');
    expect(added).toBeDefined();
    expect(added?.quantity).toBeGreaterThanOrEqual(2);
  });
});

