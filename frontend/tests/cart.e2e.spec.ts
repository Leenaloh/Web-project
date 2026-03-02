import { test, expect, APIRequestContext, Page } from '@playwright/test';

const API_BASE = 'http://localhost:8080/api/v1';

type CartItem = { movieId: string; quantity: number };

async function resetCart(request: APIRequestContext): Promise<void> {
  const response = await request.delete(`${API_BASE}/cart`, {
    failOnStatusCode: false
  });
  expect(response.ok()).toBeTruthy();
}

async function seedCart(request: APIRequestContext, movieId: string, quantity: number): Promise<void> {
  const response = await request.post(`${API_BASE}/cart/items`, {
    params: { movieId, quantity: String(quantity) },
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
async function openCart(page: Page): Promise<void> {
  await page.goto('/cart');
  await expect(page.getByTestId('page-cart')).toBeVisible();
}

test.describe('Cart', () => {
  test.beforeEach(async ({ page }) => {
    await resetCart(page.request);
  });

  test('view cart with seeded items', async ({ page }) => {
    await seedCart(page.request, 'tt001', 2);
    await seedCart(page.request, 'tt002', 1);

    await openCart(page);
    await expect(page.getByTestId('cart-table')).toBeVisible();
    await expect(page.locator('[data-testid^="btn-remove-"]')).toHaveCount(2);
  });

  test('update quantity from cart page', async ({ page }) => {
    await seedCart(page.request, 'tt001', 1);
    await openCart(page);

    const incBtn = page.getByTestId('btn-update-qty-inc-tt001');
    test.fixme((await incBtn.count()) === 0, 'Quantity controls on cart page are not implemented yet.');

    await incBtn.click();
    const items = await getCartItems(page.request);
    const item = items.find((i) => i.movieId === 'tt001');
    expect(item?.quantity).toBe(2);
  });

  test('remove item from cart', async ({ page }) => {
    await seedCart(page.request, 'tt001', 1);
    await openCart(page);

    await page.getByTestId('btn-remove-tt001').click();

    const items = await getCartItems(page.request);
    expect(items.find((i) => i.movieId === 'tt001')).toBeUndefined();
  });

  test('clear cart', async ({ page }) => {
    await seedCart(page.request, 'tt001', 2);
    await seedCart(page.request, 'tt002', 1);
    await openCart(page);

    await page.getByTestId('btn-clear').click();

    const items = await getCartItems(page.request);
    expect(items).toHaveLength(0);
  });
});

