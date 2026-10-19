import { BrandMark } from '@/components/brand-mark';
import { CopyrightYear } from '@/components/copyright-year';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <a href="/" className="site-wordmark">
        <BrandMark />
        Circuit
      </a>
      <nav aria-label="Site information">
        <a href="/">Compiler</a>
        <a href="/learn">Learn C</a>
        <a href="/blog">Blog</a>
        <a href="/examples">Examples</a>
        <a href="/docs">Docs</a>
        <a href="/about">About</a>
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Use</a>
        <a href="/contact">Contact</a>
        <a href="/sitemap.xml">Sitemap</a>
      </nav>
      <small>© <CopyrightYear year={new Date().getFullYear()} /> Circuit. All rights reserved.</small>
    </footer>
  );
}
