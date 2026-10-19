import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { guides } from '../lib/content/guides';
import { examples } from '../lib/content/examples';
import { siteUrl, siteDescription } from '../lib/site';

const root = resolve('dist/client');
for (const directory of ['public', root]) {
  assert.deepEqual((await readdir(directory)).filter((name) => /^sitemap/i.test(name)), ['sitemap.xml'], `Only sitemap.xml is allowed in ${directory}`);
}
const bytes = await readFile(resolve(root, 'sitemap.xml'));
assert.equal(bytes.subarray(0, 5).toString('ascii'), '<?xml', 'No BOM or leading whitespace');
const xml = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
assert.equal(xml, await readFile('public/sitemap.xml', 'utf8'), 'Exported sitemap must match generated source');
assert.ok(!/xml-stylesheet|<lastmod>|<priority>|<changefreq>|sitemap_index/.test(xml));
assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n'));
assert.ok(xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'));
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(new Set(urls).size, urls.length);
assert.equal(urls.length, 8 + guides.length + examples.length);
const documents = new Map<string, string>();
const titles = new Set<string>();
const descriptions = new Set<string>();
for (const url of urls) {
  assert.ok(url.startsWith(siteUrl + '/'));
  const path = new URL(url).pathname;
  assert.ok(!new URL(url).hash && !new URL(url).search && !path.endsWith('.xml'));
  const html = await readFile(resolve(root, path === '/' ? 'index.html' : '.' + path + '.html'), 'utf8');
  documents.set(path, html);
  assert.ok(!/\bcrunner\b/i.test(html.replaceAll('crunner.pages.dev', '').replaceAll('crunnersupport@gmail.com', '')), `Stale brand: ${path}`);
  assert.ok(html.includes('property="og:site_name" content="Circuit"'), `Site name: ${path}`);
  assert.ok(html.includes('name="application-name" content="Circuit"'), `Application name: ${path}`);
  assert.ok(html.includes('name="google-site-verification" content="sHLiwRgvdVrfUInWM3WThq6xYQRDX_KUSr9tXvrp8NE"'), `Search Console verification: ${path}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `Non-indexable sitemap entry ${path}`);
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  assert.ok(title && !titles.has(title), `Missing/duplicate title: ${path}`);
  assert.ok(description && !descriptions.has(description), `Missing/duplicate description: ${path}`);
  titles.add(title); descriptions.add(description);
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  assert.ok(canonical && new URL(canonical).href === new URL(url).href, `Canonical ${path}`);
  assert.ok(html.includes('property="og:title"') && html.includes('name="twitter:card"'), `Social metadata ${path}`);
  assert.ok(html.includes('favicon.svg') && html.includes('apple-touch-icon'), `Icons ${path}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `H1 ${path}`);
  assert.ok(html.includes('All rights reserved.'), `Copyright ${path}`);
  assert.ok(!/support@example\.com|A public support inbox has not/.test(html), `Placeholder ${path}`);
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const data = JSON.parse(match[1]);
    assert.equal(data['@context'], 'https://schema.org');
    for (const schema of data['@graph'] || [data]) {
      assert.ok(schema['@type']);
      if (schema['@type'] === 'BreadcrumbList') schema.itemListElement.forEach((item: {position: number; item: string}, i: number) => { assert.equal(item.position, i + 1); assert.ok(item.item.startsWith(siteUrl)); });
      if (schema['@type'] === 'Article') { assert.ok(schema.headline && schema.mainEntityOfPage === url); }
      assert.ok(!schema.aggregateRating && !schema.review);
    }
  }
}
const homepage = documents.get('/')!;
assert.ok(homepage.includes('<title>Online C Compiler — Run C Code Online | Circuit</title>'));
assert.ok(homepage.includes(`name="description" content="${siteDescription}"`));
assert.match(homepage, /<h1[^>]*>Online C Compiler<\/h1>/);
const homeSchemas = [...homepage.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((match) => {
  const data = JSON.parse(match[1]);
  return data['@graph'] || [data];
});
const websites = homeSchemas.filter((schema) => schema['@type'] === 'WebSite');
assert.equal(websites.length, 1);
assert.equal(websites[0].name, 'Circuit');
assert.equal(websites[0].url, siteUrl + '/');
assert.equal(guides.length, 12);
for (const guide of guides) {
  assert.ok(urls.includes(siteUrl + '/learn/' + guide.slug));
  assert.match(documents.get('/learn/' + guide.slug)!, /<aside class="editorial-next">[\s\S]*?<a href="\/">/);
}
const manifest = JSON.parse(await readFile(resolve(root, 'site.webmanifest'), 'utf8'));
assert.equal(manifest.short_name, 'Circuit');
assert.equal(manifest.name, 'Circuit — Online C Compiler');
let links = 0;
for (const [path, html] of documents) {
  assert.match(html, /<footer\b[^>]*>[\s\S]*?href="\/sitemap\.xml"[\s\S]*?<\/footer>/, `Footer sitemap missing: ${path}`);
  for (const match of html.matchAll(/<a\b[^>]*href="([^"]*)"/g)) {
    const href = match[1].replaceAll('&amp;', '&');
    assert.ok(href && href !== '#', `Empty link ${path}`);
    if (/^(https?:|mailto:)/.test(href)) continue;
    const target = new URL(href, siteUrl + path);
    if (documents.has(target.pathname)) {
      if (target.hash && !target.hash.startsWith('#example=')) assert.ok(documents.get(target.pathname)!.includes(`id="${target.hash.slice(1)}"`), `Broken anchor ${path} -> ${href}`);
      if (target.hash.startsWith('#example=')) assert.ok(examples.some((item) => target.hash === '#example=' + item.slug));
    } else {
      assert.ok((await stat(resolve(root, '.' + target.pathname))).isFile(), `Broken link ${path} -> ${href}`);
    }
    links++;
  }
}
const robots = await readFile(resolve(root, 'robots.txt'), 'utf8');
assert.ok(robots.includes('Allow: /'));
assert.deepEqual(robots.split(/\r?\n/).filter((line) => /^Sitemap:/i.test(line)), [`Sitemap: ${siteUrl}/sitemap.xml`]);
const missing = await readFile(resolve(root, '404.html'), 'utf8');
assert.ok(missing.includes('Page not found') && missing.includes('Go to Compiler') && missing.includes('Go Home') && missing.includes('noindex'));
assert.equal(await readFile(resolve(root, '_headers'), 'utf8'), await readFile('public/_headers', 'utf8'));
const headers = await readFile(resolve(root, '_headers'), 'utf8');
assert.ok(headers.includes('/sitemap.xml\n  Content-Type: application/xml; charset=UTF-8'));
assert.ok(!headers.includes('sitemap-v2') && !headers.includes('sitemap.txt'));
assert.ok(!headers.includes('sitemap_index') && !headers.includes('sitemap.xsl'));
for (const guide of guides) {
  const words = [guide.intro, ...guide.sections.flatMap((section) => section.paragraphs)].join(' ').split(/\s+/).length;
  console.log(`${guide.slug}: ${words} words`);
}
console.log(`PASS: ${urls.length} pages; ${links} internal links; unique metadata, canonical URLs, JSON-LD, sitemap, robots, 404, copyright, and isolation headers.`);
