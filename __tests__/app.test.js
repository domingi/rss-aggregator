import { test, expect } from '@playwright/test';

const rssURL = 'https://ru.hexlet.io/lessons.rss';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1000);
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    // Get a unique place for the screenshot.
    const screenshotPath = testInfo.outputPath('failure.png');
    // Add it to the report.
    testInfo.attachments.push({ name: 'screenshot', path: screenshotPath, contentType: 'image/png' });
    // Take the screenshot itself.
    await page.screenshot({ path: screenshotPath, timeout: 5000 });
  }
});

test('has title', async ({ page }) => {
  await expect(page).toHaveTitle(/rss агрегатор/i);
});

test('has main UI', async ({ page }) => {
  await expect(page.getByText(/rss агрегатор/i)).toBeVisible();
  await expect(page.getByText(/Начните читать RSS сегодня. Это легко, это красиво./i)).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});

test('open feed', async ({ page }) => {
  await page.getByPlaceholder(/ссылка RSS/i).fill(rssURL);
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(3000);
  await expect(page.locator('text=Фиды')).toBeVisible();
  await expect(page.locator('text=Посты')).toBeVisible();
  await expect(page.getByText(/RSS успешно загружен/i)).toBeVisible();
});

test('open modals', async ({ page }) => {
  await page.getByPlaceholder(/ссылка RSS/i).fill(rssURL);
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(3000);
  await page.locator('button[data-bs-target="#modal"]').first().click();
  await expect(page.locator('h5[class="modal-title"]')).toBeVisible();
  await page.locator('text=Закрыть').first().click();
  await expect(page.locator('h5[class="modal-title"]')).toBeHidden();
});
