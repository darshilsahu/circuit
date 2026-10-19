import { siteUrl } from '@/lib/site';
export function ContentSchema({ title, description, path, section, article = false }: { title: string; description: string; path: string; section?: { title: string; path: string }; article?: boolean }) {
  const crumbs = [{ name: 'Compiler', item: `${siteUrl}/` }, ...(section ? [{ name: section.title, item: siteUrl + section.path }] : []), { name: title, item: siteUrl + path }];
  const data = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'BreadcrumbList', itemListElement: crumbs.map((crumb, i) => ({ '@type': 'ListItem', position: i + 1, ...crumb })) },
    ...(article ? [{ '@type': 'Article', headline: title, description, inLanguage: 'en', mainEntityOfPage: siteUrl + path, image: siteUrl + '/og-image.png', isPartOf: { '@type': 'WebSite', name: 'Circuit', url: siteUrl + '/' } }] : []),
  ] };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
export function Breadcrumbs({ section, title }: { section: { title: string; path: string }; title: string }) {
  return <nav className="content-breadcrumbs" aria-label="Breadcrumb"><a href="/">Compiler</a><span aria-hidden="true">/</span><a href={section.path}>{section.title}</a><span aria-hidden="true">/</span><span aria-current="page">{title}</span></nav>;
}
