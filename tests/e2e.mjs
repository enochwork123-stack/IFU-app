// E2E tests for critical user journeys (library-style Playwright, no test runner).
// Run: node tests/e2e.mjs
import { chromium } from 'playwright';
import assert from 'node:assert';

const BASE = process.env.BASE_URL || 'http://localhost:5173';
const results = [];

async function test(name, fn) {
  try {
    await fn();
    results.push({ name, ok: true });
    console.log(`  PASS  ${name}`);
  } catch (e) {
    results.push({ name, ok: false, error: e.message });
    console.log(`  FAIL  ${name}\n        ${e.message.split('\n')[0]}`);
  }
}

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

// ---------- Home → navigation happy path ----------
await test('home renders hero and 3 entry cards', async () => {
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  assert.ok(await page.getByText('基督門徒訓練').first().isVisible());
  assert.ok(await page.getByText('認識福音').first().isVisible());
  assert.ok(await page.getByText('初信栽培').first().isVisible());
  assert.ok(await page.getByText('查經學習').first().isVisible());
});

await test('bottom nav navigates to journey overview', async () => {
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.locator('nav button', { hasText: '初信栽培' }).click();
  await page.waitForURL('**/journey');
  await page.getByText('門徒生命成長路徑').first().waitFor({ state: 'visible', timeout: 5000 });
});

await test('journey overview lists 12 steps and opens a lesson', async () => {
  await page.goto(BASE + '/journey', { waitUntil: 'networkidle' });
  const steps = page.locator('button', { hasText: /Step \d+/ });
  assert.strictEqual(await steps.count(), 12, `expected 12 steps, got ${await steps.count()}`);
  await steps.first().click();
  await page.waitForURL('**/journey/salvation-assurance');
});

// ---------- Bottom nav active state (regression for fix) ----------
await test('journey tab highlights on all lesson families', async () => {
  for (const route of ['/journey/salvation-assurance', '/journey/forgiveness-assurance', '/journey/bible-authority', '/journey/spiritual-growth']) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    const active = page.locator('nav button[aria-current="page"]');
    assert.strictEqual(await active.count(), 1, `${route}: expected one active tab`);
    const label = await active.innerText();
    assert.ok(label.includes('初信栽培'), `${route}: active tab is "${label}", expected 初信栽培`);
  }
});

await test('gospel pages highlight the 認識福音 tab', async () => {
  await page.goto(BASE + '/journey/creation', { waitUntil: 'networkidle' });
  const active = page.locator('nav button[aria-current="page"]');
  assert.ok((await active.innerText()).includes('認識福音'));
});

// ---------- Reflection answer autosave (core feature) ----------
await test('reflection answer persists across reload (localStorage autosave)', async () => {
  await page.goto(BASE + '/journey/salvation-assurance', { waitUntil: 'networkidle' });
  const box = page.locator('textarea').first();
  await box.scrollIntoViewIfNeeded();
  const marker = `qa-test-${Date.now()}`;
  await box.fill(marker);
  await page.reload({ waitUntil: 'networkidle' });
  const after = await page.locator('textarea').first().inputValue();
  assert.strictEqual(after, marker);
  await page.locator('textarea').first().fill(''); // clean up
});

// ---------- Scripture toggle ----------
await test('scripture toggle expands and collapses verse text', async () => {
  await page.goto(BASE + '/journey/salvation-assurance', { waitUntil: 'networkidle' });
  const toggle = page.locator('button', { hasText: 'John 5: 24' }).first();
  await toggle.scrollIntoViewIfNeeded();
  const verse = page.getByText('我實實在在的告訴你們');
  assert.strictEqual(await verse.count(), 0, 'verse should be hidden before toggle');
  await toggle.click();
  assert.ok(await verse.first().isVisible(), 'verse should show after toggle');
  await toggle.click();
  assert.strictEqual(await verse.count(), 0, 'verse should hide after second toggle');
});

// ---------- Library: search / filter / star ----------
await test('library search filters entries and empty state resets', async () => {
  await page.goto(BASE + '/library', { waitUntil: 'networkidle' });
  const countLabel = page.getByText(/共找到 \d+ 篇/);
  const initial = parseInt((await countLabel.innerText()).match(/\d+/)[0], 10);
  assert.ok(initial > 0, 'library should have entries');
  await page.getByPlaceholder('搜尋題目、經文或主題關鍵字...').fill('zzz-no-match-zzz');
  assert.ok(await page.getByText('沒有找到符合條件的靈修材料').isVisible());
  await page.locator('button', { hasText: '重設所有篩選' }).click();
  const restored = parseInt((await countLabel.innerText()).match(/\d+/)[0], 10);
  assert.strictEqual(restored, initial);
});

await test('library star persists across reload', async () => {
  await page.goto(BASE + '/library', { waitUntil: 'networkidle' });
  const star = page.locator('[aria-label="加入收藏"]').first();
  await star.click();
  assert.ok(await page.getByText(/已收藏 \d+ 篇/).isVisible());
  await page.reload({ waitUntil: 'networkidle' });
  assert.ok(await page.getByText(/已收藏 \d+ 篇/).isVisible(), 'star count should persist');
  await page.locator('[aria-label="取消收藏"]').first().click(); // clean up
});

await test('library deck mode draws a card and flips it', async () => {
  await page.goto(BASE + '/library', { waitUntil: 'networkidle' });
  await page.locator('button', { hasText: '靈修抽卡' }).click();
  await page.waitForTimeout(600); // draw animation
  assert.ok(await page.getByText('每日靈修卡').isVisible(), 'card back should show');
  await page.getByText('每日靈修卡').click(); // flip
  await page.waitForTimeout(800);
  assert.ok(await page.getByText(/已抽過: \d+\//).isVisible(), 'card front should show after flip');
});

// ---------- Auth-gated routes ----------
await test('profile route shows login wall when logged out', async () => {
  await page.goto(BASE + '/profile', { waitUntil: 'networkidle' });
  assert.ok(await page.getByText('需要登錄').isVisible());
});

await test('admin route shows login wall when logged out', async () => {
  await page.goto(BASE + '/admin', { waitUntil: 'networkidle' });
  assert.ok(await page.getByText('需要登錄').isVisible());
});

await test('login page renders Google sign-in', async () => {
  await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
  assert.ok(await page.getByText('使用 Google 帳戶登入').isVisible());
});

// ---------- Unknown route redirect ----------
await test('unknown route redirects to /journey', async () => {
  await page.goto(BASE + '/no-such-page', { waitUntil: 'networkidle' });
  assert.ok(page.url().endsWith('/journey'));
});

// ---------- Lesson pager navigation ----------
await test('lesson pager next button navigates forward', async () => {
  await page.goto(BASE + '/journey/creation', { waitUntil: 'networkidle' });
  const next = page.locator('a', { hasText: '人的問題' }).last();
  await next.scrollIntoViewIfNeeded();
  await next.click();
  await page.waitForURL('**/journey/problem');
});

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
if (failed.length > 0) process.exitCode = 1;
