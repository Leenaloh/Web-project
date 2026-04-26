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
async function goToLogin(page: Page): Promise<void> {
  await page.goto('/');
  await expect(page.getByTestId('page-login')).toBeVisible();
}

test.describe('Auth', () => {
  test.beforeEach(async ({ page }) => {
    await resetCart(page.request);
    await goToLogin(page);
  });

  test('login success navigates to home', async ({ page }) => {
    await page.getByTestId('input-email').fill('jbrown@ics185.edu');
    await page.getByTestId('input-password').fill('keyboard');
    // await page.getByTestId('input-email').fill('demo@user.com');
    // await page.getByTestId('input-password').fill('password123');
    await page.getByTestId('btn-login').click();

    await expect(page).toHaveURL(/\/home$/);
    await expect(page.getByTestId('page-home')).toBeVisible();
  });

  test('invalid login shows error message', async ({ page }) => {
    await page.getByTestId('input-email').fill('invalid@user.com');
    await page.getByTestId('input-password').fill('wrong-password');
    await page.getByTestId('btn-login').click();

    await expect(page.getByTestId('msg-error')).toBeVisible();
    await expect(page).toHaveURL(/\/$|\/login$/);
  });
});
