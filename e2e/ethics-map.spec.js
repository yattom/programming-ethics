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

test('UC008: 各ノードにラベルが表示される', async ({ page }) => {
  await page.goto('/')
  // 通常ノードはラベルがノードの下に表示される
  await expect(page.locator('[data-testid="node-label-N0"]')).toBeVisible()
  await expect(page.locator('[data-testid="node-label-N0"]')).toContainText('倫理的考慮')
  await expect(page.locator('[data-testid="node-label-N1-1"]')).toContainText('安全性')
  // Pノードはラベルがノードの上に表示される
  await expect(page.locator('[data-testid="node-label-P"]')).toContainText('利益優先')
})

test('UC007: Pノードをクリックすると説明パネルにPノードのタイトルが表示される', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-testid="node-P"]').click()
  await expect(page.locator('[data-testid="node-description"]')).toContainText('利益優先')
})

test('E05: ollamaに接続できる場合、接続インジケーターに「接続中」が表示される', async ({ page }) => {
  await page.route('http://localhost:11434/api/tags', (route) =>
    route.fulfill({ status: 200, body: JSON.stringify({ models: [] }) }),
  )
  await page.goto('/')
  await expect(page.locator('[data-testid="ollama-status"]')).toContainText('接続中')
})

test('E05b: ollamaに接続できない場合、接続インジケーターに「未接続」が表示される', async ({
  page,
}) => {
  await page.route('http://localhost:11434/**', (route) => route.abort())
  await page.goto('/')
  await expect(page.locator('[data-testid="ollama-status"]')).toContainText('未接続')
})

test('E06: ポイント変更後に倫理綱領テキストが生成・表示される', async ({ page }) => {
  await page.route('http://localhost:11434/api/tags', (route) =>
    route.fulfill({ status: 200, body: JSON.stringify({ models: [] }) }),
  )
  const mockNdjson = [
    JSON.stringify({ response: 'プログラマーとして、', done: false }),
    JSON.stringify({ response: '安全を最優先します。', done: true }),
  ].join('\n')
  await page.route('http://localhost:11434/api/generate', (route) =>
    route.fulfill({
      status: 200,
      headers: { 'Content-Type': 'application/x-ndjson' },
      body: mockNdjson,
    }),
  )

  await page.goto('/')
  await page.locator('[data-testid="start-distribution"]').click()

  await expect(page.locator('[data-testid="ethics-code"]')).toContainText('プログラマーとして、', {
    timeout: 5000,
  })
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
