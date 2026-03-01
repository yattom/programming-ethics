import { test, expect } from '@playwright/test'

test('UC001: トップページを開くと倫理マップが表示される', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-testid="ethics-map"]')).toBeVisible()
})

test('UC002: ノードをクリックすると説明が表示される', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-testid="node-N1-1"]').click()
  await expect(page.locator('[data-testid="node-description"]')).toBeVisible()
  await expect(page.locator('[data-testid="node-description"]')).toContainText('安全性')
})

test('UC004: マップ状態をURLで保存・共有できる', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-testid="start-distribution"]').click()
  await page.locator('[data-testid="node-N0"]').click()
  await page.locator('[data-testid="add-point"]').click()

  await page.locator('[data-testid="user-name"]').fill('やっとむ')
  await page.locator('[data-testid="copy-url"]').click()

  // クリップボードからURLを取得して直接アクセス
  const url = await page.evaluate(() => navigator.clipboard.readText())
  await page.goto(url)

  // 配布モードで復元されている
  await expect(page.locator('[data-testid="node-N0"]')).toContainText('1')
  await expect(page.locator('[data-testid="reset"]')).toBeVisible()
})

test('UC005: ポイントを減らすボタンでポイントが減る', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-testid="start-distribution"]').click()

  // N0を選択してポイントを追加
  await page.locator('[data-testid="node-N0"]').click()
  await page.locator('[data-testid="add-point"]').click()
  await expect(page.locator('[data-testid="node-N0"]')).toContainText('1')

  // -1ボタンでポイントを減らす
  await page.locator('[data-testid="remove-point"]').click()
  await expect(page.locator('[data-testid="node-N0"]')).not.toContainText('1')
  await expect(page.locator('[data-testid="p-points"]')).toContainText('10')
})

test('UC006: トークンをクリックするとポイントが減る', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-testid="start-distribution"]').click()

  // N0を選択してポイントを追加
  await page.locator('[data-testid="node-N0"]').click()
  await page.locator('[data-testid="add-point"]').click()
  await expect(page.locator('[data-testid="node-N0"]')).toContainText('1')

  // トークンをクリックしてポイントを減らす
  await page.locator('[data-testid="token-N0-1"]').click()
  await expect(page.locator('[data-testid="node-N0"]')).not.toContainText('1')
  await expect(page.locator('[data-testid="p-points"]')).toContainText('10')
})

test('UC007: Pノードをクリックすると説明パネルにPノードのタイトルが表示される', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-testid="node-P"]').click()
  await expect(page.locator('[data-testid="node-description"]')).toContainText('利益優先')
})

test('UC003: ポイントを配布してマップを作る', async ({ page }) => {
  await page.goto('/')

  // 配布開始でPノードに10ポイント付与される
  await page.locator('[data-testid="start-distribution"]').click()
  await expect(page.locator('[data-testid="p-points"]')).toContainText('10')

  // N0を選択して[+]ボタンでポイントを追加
  await page.locator('[data-testid="node-N0"]').click()
  await page.locator('[data-testid="add-point"]').click()
  await expect(page.locator('[data-testid="node-N0"]')).toContainText('1')

  // リセットで全ポイントが0に戻り、配布前の状態に戻る
  await page.locator('[data-testid="reset"]').click()
  await page.locator('[data-testid="confirm-reset"]').click()
  await expect(page.locator('[data-testid="start-distribution"]')).toBeVisible()
})
