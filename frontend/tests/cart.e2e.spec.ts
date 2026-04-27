import { test, expect, APIRequestContext, Page } from '@playwright/test';

const API_BASE = 'http://localhost:8080/api/v1';

type CartItem = { movieId: string; quantity: number };

async function login(page: Page): Promise<void> {
  await page.goto('/');

  await page.getByTestId('input-email').fill('kwhite@ics185.edu');
  await page.getByTestId('input-password').fill('book');
  await page.getByTestId('btn-login').click();

  await expect(page).toHaveURL(/\/home$/);
}

async function resetCart(request: APIRequestContext): Promise<void> {
  const response = await request.delete(`${API_BASE}/cart`, {
    failOnStatusCode: false,
  });

  const text = await response.text();
  console.log('resetCart:', response.status(), text);

  expect(response.ok()).toBeTruthy();
}

async function seedCart(request: APIRequestContext, movieId: string, quantity: number): Promise<void> {
  const response = await request.post(`${API_BASE}/cart/items`, {
    params: { movieId, quantity: String(quantity) },
    failOnStatusCode: false,
  });

  const text = await response.text();
  console.log('seedCart:', movieId, response.status(), text);

  expect(response.ok()).toBeTruthy();
}

async function getCartItems(request: APIRequestContext): Promise<CartItem[]> {
  const response = await request.get(`${API_BASE}/cart`, {
    failOnStatusCode: false,
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

  if (Array.isArray(raw)) return raw as CartItem[];

  if (raw && typeof raw === 'object') return Object.values(raw) as CartItem[];

  throw new Error(`Unexpected /cart response shape: ${JSON.stringify(body)}`);
}

async function openCart(page: Page): Promise<void> {
  await page.goto('/cart');
  await expect(page.getByTestId('page-cart')).toBeVisible();
}

test.describe.serial('Cart', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await resetCart(page.request);
  });

  test('view cart with seeded items', async ({ page }) => {
    await seedCart(page.request, 'tt0421974', 2);
    await seedCart(page.request, 'tt0313792', 1);

    await openCart(page);
    await expect(page.getByTestId('cart-table')).toBeVisible();
    await expect(page.locator('[data-testid^="btn-remove-"]')).toHaveCount(2);
  });

  test('update quantity from cart page', async ({ page }) => {
  await seedCart(page.request, 'tt0421974', 1);
  await openCart(page);

  const updatePromise = page.waitForResponse(
    res =>
      res.url().includes('//localhost:8080/api/v1/cart/items') &&
      res.request().method() === 'PUT'
  );

  await page.getByTestId(`btn-update-qty-inc-tt0421974`).click();

  const updateResponse = await updatePromise;
  console.log('update status:', updateResponse.status(), await updateResponse.text());

  const items = await getCartItems(page.request);
  const item = items.find((i) => i.movieId === 'tt0421974');

  expect(item?.quantity).toBe(2);
});
  test('remove item from cart', async ({ page }) => {
  await seedCart(page.request, 'tt0421974', 1);
  await openCart(page);

  await page.getByTestId(`btn-remove-tt0421974`).click();

  await expect(page.getByTestId(`btn-remove-tt0421974`)).toHaveCount(0);

  const items = await getCartItems(page.request);
  expect(items.find((i) => i.movieId === 'tt0421974')).toBeUndefined();
});
  test('clear cart', async ({ page }) => {
    await seedCart(page.request, 'tt0421974', 2);
    await seedCart(page.request, 'tt0313792', 1);
    await openCart(page);

    await page.getByTestId('btn-clear').click();

    const items = await getCartItems(page.request);
    expect(items).toHaveLength(0);
  });
});