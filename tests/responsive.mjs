// Responsive sweep: every route at mobile/tablet/desktop, checking for
// horizontal overflow of the route viewport and that the bottom nav is visible.
// Run: node tests/responsive.mjs
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:5173';

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
];

const ROUTES = [
  '/', '/journey', '/library', '/login',
  '/journey/creation', '/journey/problem', '/journey/bridge', '/journey/response',
  '/journey/salvation-assurance', '/journey/salvation-assurance/are-you-saved',
  '/journey/quiet-time', '/journey/quiet-time/seven-minutes-with-god',
  '/journey/prayer-assurance', '/journey/forgiveness-assurance',
  '/journey/victory-assurance', '/journey/bible-authority',
  '/journey/bible-intake', '/journey/effective-prayer',
  '/journey/fellowship', '/journey/witnessing',
  '/journey/life-goal', '/journey/spiritual-growth',
];

const browser = await chromium.launch();
const issues = [];

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 15000 });
    const check = await page.evaluate(() => {
      const viewport = document.querySelector('.ifu-route-viewport');
      const nav = document.querySelector('nav.ifu-bottom-nav');
      const overflowEls = [];
      if (viewport) {
        const limit = viewport.clientWidth + 1;
        for (const el of viewport.querySelectorAll('*')) {
          const r = el.getBoundingClientRect();
          if (r.width > limit + 8) {
            overflowEls.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} (${Math.round(r.width)}px > ${limit}px)`);
            if (overflowEls.length >= 3) break;
          }
        }
      }
      return {
        hasViewport: !!viewport,
        viewportHScroll: viewport ? viewport.scrollWidth > viewport.clientWidth + 1 : false,
        bodyHScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        navVisible: nav ? nav.getBoundingClientRect().height > 0 : false,
        overflowEls,
      };
    });
    if (!check.hasViewport) issues.push(`${vp.name} ${route}: route viewport missing`);
    if (check.viewportHScroll) issues.push(`${vp.name} ${route}: horizontal scroll in content — ${check.overflowEls.join('; ')}`);
    if (check.bodyHScroll) issues.push(`${vp.name} ${route}: page body scrolls horizontally`);
    if (!check.navVisible) issues.push(`${vp.name} ${route}: bottom nav not visible`);
  }
  await page.close();
}

await browser.close();

if (issues.length === 0) {
  console.log(`OK — ${ROUTES.length} routes x ${VIEWPORTS.length} viewports clean`);
} else {
  console.log(`${issues.length} issue(s):`);
  for (const i of issues) console.log('- ' + i);
  process.exitCode = 1;
}
