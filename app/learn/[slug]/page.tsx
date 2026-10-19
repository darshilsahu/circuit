import { notFound } from 'next/navigation';
import { InfoPage } from '@/components/info-page';
import { Breadcrumbs, ContentSchema } from '@/components/content-schema';
import { guides } from '@/lib/content/guides';
import { pageMetadata } from '@/lib/site';
export const dynamicParams = false;
// Each invitation follows the learning task, rather than repeating a search phrase.
const compilerLinks: Record<string, { before: string; anchor: string; after: string }> = {
  'first-c-program': { before: 'Ready to test your greeting? Use the ', anchor: 'online C compiler', after: ' and compare its output with your prediction.' },
  'how-a-c-compiler-works': { before: 'Make a small source change in Circuit’s ', anchor: 'online C compiler', after: ' to see the difference between compiler diagnostics and program output.' },
  'c-compilation-process': { before: 'Use the ', anchor: 'Circuit C compiler', after: ' to compare a syntax error with a linking error.' },
  'printf-and-scanf': { before: 'Copy the input example into the ', anchor: 'online C compiler', after: '. Enter values directly after the terminal prompt.' },
  'arrays-in-c': { before: 'Change an array’s values in the ', anchor: 'Circuit workspace', after: ' and check the result of each loop iteration.' },
  'functions-in-c': { before: 'Choose a few arguments and ', anchor: 'test your function in Circuit', after: ', checking its return value each time.' },
  'pointers-for-beginners': { before: 'Use the ', anchor: 'online C compiler', after: ' to experiment with valid addresses and dereferencing in a small program.' },
  'common-compiler-errors': { before: 'Fix one diagnostic at a time in the ', anchor: 'Circuit C compiler', after: ' before moving to the next message.' },
  'segmentation-fault': { before: 'After checking your indexes and pointers, ', anchor: 'test the corrected program', after: ' with normal and boundary inputs. A successful run does not prove that all undefined behavior is gone.' },
  'compiler-vs-interpreter': { before: 'To observe a compilation step followed by execution, ', anchor: 'try Circuit', after: ' with a small C program.' },
  'online-compiler-vs-gcc': { before: 'For an exercise that needs no native setup, use Circuit’s ', anchor: 'online C compiler', after: '; use a desktop toolchain when you need the system features described above.' },
  'basic-c-examples': { before: 'Choose one exercise, predict its result, and ', anchor: 'try it in Circuit', after: '. Save a variation to practise the concept again.' },
};
export function generateStaticParams() { return guides.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  return guide ? pageMetadata(`${guide.title} | Circuit`, guide.description, `/learn/${slug}`) : {};
}
export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) notFound();
  const section = { title: 'Learn C', path: '/learn' };
  const compilerLink = compilerLinks[slug];
  return <InfoPage title={guide.title}>
    <ContentSchema title={guide.title} description={guide.description} path={`/learn/${slug}`} section={section} article />
    <Breadcrumbs section={section} title={guide.title} />
    <article><p className="content-lead">{guide.intro}</p>
      <nav className="content-toc" aria-label="On this page"><h2>In this guide</h2><ol>{guide.sections.map((item, i) => <li key={item.heading}><a href={`#section-${i + 1}`}>{item.heading}</a></li>)}</ol></nav>
      {guide.sections.map((item, i) => <section key={item.heading} id={`section-${i + 1}`}><h2>{item.heading}</h2>{item.paragraphs.map((p) => <p key={p}>{p}</p>)}{item.code && <pre tabIndex={0} aria-label="C code example"><code>{item.code}</code></pre>}</section>)}
    </article>
    <aside className="editorial-next"><h2>Put it into practice</h2><p><a className="content-button" href={`/examples/${guide.example}`}>Explore the worked example</a></p><p>{compilerLink ? <>{compilerLink.before}<a href="/">{compilerLink.anchor}</a>{compilerLink.after}</> : <a href="/">Open the compiler</a>}</p><h3>Continue learning</h3><ul>{guide.related.map((related) => { const item = guides.find((g) => g.slug === related)!; return <li key={related}><a href={`/learn/${related}`}>{item.title}</a></li>; })}</ul></aside>
  </InfoPage>;
}
