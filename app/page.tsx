import type { Metadata } from 'next';
import CompilerWorkspace from '@/components/compiler-workspace';
import { HomepageContent } from '@/components/homepage-content';
import { pageMetadata, siteDescription, siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  ...pageMetadata(
    'Online C Compiler — Compile & Run C Code Online | Circuit',
    siteDescription,
    '/',
  ),
  verification: {
    google: 'sHLiwRgvdVrfUInWM3WThq6xYQRDX_KUSr9tXvrp8NE',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': siteUrl + '/#website',
      name: 'Circuit',
      alternateName: 'Circuit — Online C Compiler',
      url: siteUrl + '/',
      description: siteDescription,
    },
    {
      '@type': 'WebApplication',
      '@id': siteUrl + '/#application',
      name: 'Circuit',
      url: siteUrl + '/',
      description: siteDescription,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any with a compatible web browser',
      browserRequirements:
        'JavaScript, WebAssembly, Web Workers and SharedArrayBuffer support',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      featureList: [
        'C17 compilation in the browser',
        'Interactive stdin and scanf',
        'Local program library',
        'Import and export backups',
      ],
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <CompilerWorkspace />
      <HomepageContent />
    </>
  );
}
