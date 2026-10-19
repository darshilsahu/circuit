import { notFound } from 'next/navigation';
import { InfoPage } from '@/components/info-page';
import { Breadcrumbs, ContentSchema } from '@/components/content-schema';
import { examples } from '@/lib/content/examples';
import { pageMetadata } from '@/lib/site';
export const dynamicParams = false;
export function generateStaticParams() { return examples.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const example = examples.find((item) => item.slug === slug);
  return example ? pageMetadata(`${example.title} in C — Example & Explanation | Circuit`, example.description, `/examples/${slug}`) : {};
}
export default async function ExamplePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const example = examples.find((item) => item.slug === slug);
  if (!example) notFound();
  const section = { title: 'Examples', path: '/examples' };
  const related = examples.filter((item) => item.slug !== slug && (item.category === example.category || item.guide === example.guide)).slice(0, 3);
  return <InfoPage title={`${example.title} in C`}>
    <ContentSchema title={`${example.title} in C`} description={example.description} path={`/examples/${slug}`} section={section} article />
    <Breadcrumbs section={section} title={example.title} />
    <article><p className="content-eyebrow">{example.category}</p><p className="content-lead">{example.description}</p>
      <h2>Complete program</h2><pre tabIndex={0} aria-label="Complete C program"><code>{example.code}</code></pre>
      <p><a className="content-button" href={`/#example=${example.slug}`}>Try in Circuit →</a></p><p className="content-note">Opens a new program without replacing your saved code. Press Run when you are ready.</p>
      <h2>How it works</h2>{example.explanation.map((p) => <p key={p}>{p}</p>)}
      {example.input && <><h2>Sample input</h2><pre tabIndex={0}><code>{example.input}</code></pre><p>Enter these values when prompted. The transcript below includes typed responses.</p></>}
      <h2>Expected output</h2><pre tabIndex={0} aria-label="Expected terminal output"><code>{example.output}</code></pre>
      <h2>Concepts to practice</h2><ul>{example.concepts.map((concept) => <li key={concept}>{concept}</li>)}</ul>
      <p>Predict a different input or change one value, then compare the result with your prediction. Keep changes within the documented bounds and read warnings before trusting an answer.</p>
    </article>
    <aside className="editorial-next"><h2>Keep exploring</h2><p><a href={`/learn/${example.guide}`}>Read the related C guide</a> · <a href="/docs">Circuit documentation</a></p>{related.length > 0 && <ul>{related.map((item) => <li key={item.slug}><a href={`/examples/${item.slug}`}>{item.title}</a></li>)}</ul>}</aside>
  </InfoPage>;
}
