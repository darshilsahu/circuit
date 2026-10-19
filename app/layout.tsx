import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SiteFooter } from '@/components/site-footer';
import { siteDescription, siteUrl } from '@/lib/site';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Circuit',
  manifest: '/site.webmanifest',
  icons: {
    icon: { url: '/favicon.svg?v=4', type: 'image/svg+xml' },
    shortcut: '/favicon.svg?v=4',
    apple: { url: '/apple-touch-icon.png?v=4', sizes: '180x180' },
  },
  title: 'Circuit — Online C Compiler',
  description: siteDescription,
  robots: { index: true, follow: true },
  verification: {
    google: 'sHLiwRgvdVrfUInWM3WThq6xYQRDX_KUSr9tXvrp8NE',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          async
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9626165868473979"
        />
        <script
          async
          crossOrigin="anonymous"
          src="https://www.googletagmanager.com/gtag/js?id=G-83YZXXW8GJ"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-83YZXXW8GJ');`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
