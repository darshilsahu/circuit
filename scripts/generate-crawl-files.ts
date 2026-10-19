import { writeFile } from 'node:fs/promises';
import { guides } from '../lib/content/guides';
import { examples } from '../lib/content/examples';
import { blogPosts } from '../lib/content/blog';
import { siteUrl } from '../lib/site';
const paths = [
  '/',
  '/learn',
  '/blog',
  '/examples',
  '/docs',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  ...guides.map(({ slug }) => `/learn/${slug}`),
  ...examples.map(({ slug }) => `/examples/${slug}`),
  ...blogPosts.map(({ slug }) => `/blog/${slug}`),
];

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[
      character
    ]!,
  );
}

const urls = [...new Set(paths.map((path) => new URL(path, siteUrl).href))];
for (const url of urls) {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' || parsed.origin !== new URL(siteUrl).origin || parsed.search || parsed.hash) {
    throw new Error(`Sitemap requires a canonical HTTPS page URL: ${url}`);
  }
}

// Only page URLs are needed. Do not invent lastmod dates from build time;
// Google ignores priority/changefreq; this site needs no sitemap index.
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url>\n    <loc>${escapeXml(url)}</loc>\n  </url>`).join('\n')}\n</urlset>\n`;

await writeFile('public/sitemap.xml', sitemap, 'utf8');
await writeFile(
  'public/robots.txt',
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
);
console.log(`Generated sitemap with ${urls.length} URLs from lib/site.ts.`);
