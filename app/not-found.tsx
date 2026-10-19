import type { Metadata } from 'next';
import { InfoPage } from '@/components/info-page';

export const metadata: Metadata = {
  title: 'Page not found | Circuit',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <InfoPage title="Page not found"><p className="content-eyebrow">404</p><p>This address does not point to a Circuit page. Check the URL, return to the compiler, or explore the learning library.</p><div className="content-actions"><a className="content-button" href="/">Go to Compiler</a><a href="/">Go Home</a></div><p><a href="/learn">Learn C</a> · <a href="/examples">C examples</a> · <a href="/docs">Documentation</a></p></InfoPage>;
}
