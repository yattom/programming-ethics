import { test, expect } from '@playwright/test'

test('UC001: トップページを開くと倫理マップが表示される', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-testid="ethics-map"]')).toBeVisible()
})
