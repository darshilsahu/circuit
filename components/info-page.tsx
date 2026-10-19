import type { ReactNode } from 'react';
import { SiteNavigation } from '@/components/site-navigation';
import { BrandMark } from '@/components/brand-mark';
import { InfoTheme } from '@/components/info-theme';

export function InfoPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="info-shell">
      <a className="skip-content" href="#main-content">Skip to content</a>
      <header className="info-header">
        <a className="site-wordmark" href="/">
          <BrandMark />
          Circuit
        </a>
        <SiteNavigation />
        <InfoTheme />
      </header>
      <main id="main-content" className="site-content" tabIndex={-1}>
        <h1>{title}</h1>
        {children}
      </main>
    </div>
  );
}
