// Route smoke sweep: visits every route, collects console errors, page errors,
// failed requests, and checks the page actually rendered content.
// Run: node tests/smoke.mjs
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:5173';

const ROUTES = [
  '/',
  '/journey',
  '/library',
  '/journey/creation',
  '/journey/problem',
  '/journey/bridge',
  '/journey/response',
  '/journey/salvation-assurance',
  '/journey/salvation-assurance/are-you-saved',
  '/journey/salvation-assurance/faith-vs-superstition',
  '/journey/quiet-time',
  '/journey/quiet-time/seven-minutes-with-god',
  '/journey/quiet-time/new-to-you',
  '/journey/prayer-assurance',
  '/journey/prayer-assurance/pour-out-your-heart',
  '/journey/prayer-assurance/how-do-we-pray',
  '/journey/forgiveness-assurance',
  '/journey/forgiveness-assurance/confession-and-forgiveness',
  '/journey/forgiveness-assurance/how-can-sin-be-forgiven',
  '/journey/victory-assurance',
  '/journey/victory-assurance/growing-through-temptation',
  '/journey/victory-assurance/overcoming-temptation',
  '/journey/bible-authority',
  '/journey/bible-authority/is-the-bible-gods-word',
  '/journey/bible-authority/is-the-bible-text-reliable',
  '/journey/bible-intake',
  '/journey/bible-intake/word-hand',
  '/journey/bible-intake/grasping-gods-word',
  '/journey/effective-prayer',
  '/journey/effective-prayer/acceptable-prayer',
  '/journey/effective-prayer/friendship-with-god',
  '/journey/fellowship',
  '/journey/fellowship/do-not-walk-alone',
  '/journey/fellowship/church-family',
  '/journey/witnessing',
  '/journey/witnessing/personal-testimony',
  '/journey/life-goal',
  '/journey/spiritual-growth',
  '/profile',
  '/login',
  '/admin',
  '/definitely-not-a-route',
];

const browser = await chromium.launch();
const page = await browser.newPage();

const findings = [];
let consoleErrors = [];
let pageErrors = [];
let failedRequests = [];

page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => pageErrors.push(err.message));
page.on('requestfailed', (req) => {
  failedRequests.push(`${req.method()} ${req.url()} — ${req.failure()?.errorText}`);
});
page.on('response', (res) => {
  if (res.status() >= 400 && !res.url().includes('supabase')) {
    failedRequests.push(`${res.status()} ${res.url()}`);
  }
});

for (const route of ROUTES) {
  consoleErrors = [];
  pageErrors = [];
  failedRequests = [];
  try {
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 15000 });
  } catch (e) {
    findings.push({ route, kind: 'navigation-failed', detail: e.message });
    continue;
  }
  await page.waitForTimeout(300);
  const bodyText = (await page.locator('#root').innerText().catch(() => '')).trim();
  if (bodyText.length < 10) {
    findings.push({ route, kind: 'blank-page', detail: `root text length ${bodyText.length}` });
  }
  for (const e of pageErrors) findings.push({ route, kind: 'page-error', detail: e });
  for (const e of consoleErrors) findings.push({ route, kind: 'console-error', detail: e });
  for (const e of failedRequests) findings.push({ route, kind: 'request-failed', detail: e });
}

await browser.close();

if (findings.length === 0) {
  console.log(`OK — ${ROUTES.length} routes clean`);
} else {
  console.log(`${findings.length} finding(s):`);
  for (const f of findings) {
    console.log(`- [${f.kind}] ${f.route}\n    ${f.detail.split('\n')[0].slice(0, 300)}`);
  }
  process.exitCode = 1;
}
