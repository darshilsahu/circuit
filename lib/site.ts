import type { Metadata } from 'next';

export const siteUrl = 'https://crunner.pages.dev';
export const siteDescription =
  'Circuit is an online C compiler for writing, compiling, and running C code in your browser. Use interactive input, local saves, and a built-in terminal with no account.';

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}${path}` },
    openGraph: {
      type: 'website',
      siteName: 'Circuit',
      locale: 'en_US',
      title,
      description,
      url: `${siteUrl}${path}`,
      images: [
        {
          url: '/og-image.png?v=4',
          width: 1200,
          height: 630,
          alt: 'Circuit — Online C Compiler',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png?v=4'],
    },
  };
}

// Set only to an address the operator has approved for public support.
export const contactEmail = 'crunnersupport@gmail.com';
