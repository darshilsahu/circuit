import { ContentSchema } from '@/components/content-schema';
import { guides } from '@/lib/content/guides';
import { InfoPage } from '@/components/info-page';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'Learn C Programming — Beginner Guides | Circuit',
  'Learn C with practical guides, then apply each concept in Circuit’s online C compiler. Study input, arrays, functions, pointers, compilation, and debugging.',
  '/learn',
);

export default function Learn() {
  return (
    <InfoPage title="Learn C, one working program at a time">
      <ContentSchema title="Learn C" description="Practical C programming guides and experiments." path="/learn" />
      <p className="content-lead">Understand the code you run. These guides connect C fundamentals with small experiments, common mistakes, and practical ways to test your understanding in Circuit’s online C compiler.</p>
      <p>New to C? Start with your first program, then input, arrays, and functions. The compiler guides explain what happens between pressing Run and seeing a result.</p>
      <div className="content-grid">{guides.map((guide, i) => <a className="content-card" key={guide.slug} href={`/learn/${guide.slug}`}><span className="content-eyebrow">Guide {String(i + 1).padStart(2, '0')}</span><h2>{guide.title}</h2><p>{guide.description}</p><span className="content-card-action">Read guide →</span></a>)}</div>
      <aside className="editorial-next"><h2>Learn by changing a real program</h2><p>The <a href="/examples">C examples library</a> includes complete programs, expected output, and a safe way to open a new copy in your workspace. For product features and current execution limits, read the <a href="/docs">Circuit documentation</a>.</p></aside>
    </InfoPage>
  );
}
