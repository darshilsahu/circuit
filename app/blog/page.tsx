import { ContentSchema } from '@/components/content-schema';
import { InfoPage } from '@/components/info-page';
import { blogPosts } from '@/lib/content/blog';
import { pageMetadata } from '@/lib/site';

const description = 'C programming articles from Circuit: explore the language’s history, understand compilation, set up your tools, and connect browser practice with desktop development.';
export const metadata = pageMetadata('Circuit Blog — Practical C Development Guides', description, '/blog');

export default function Blog() {
  return (
    <InfoPage title="Circuit Blog">
      <ContentSchema title="Circuit Blog" description={description} path="/blog" />
      <p className="content-lead">Explore C’s history and foundations, understand how programs run, and build a development workflow you can verify.</p>
      <p>The <a href="/learn">Learn section</a> provides focused language lessons. These longer articles connect the background, practical examples, and tools behind your programming decisions.</p>
      <div className="content-grid">
        {blogPosts.map((post) => (
          <a className="content-card" href={'/blog/' + post.slug} key={post.slug}>
            <span className="content-eyebrow">{post.category}</span>
            <h2>{post.title}</h2>
            <p>{post.description}</p>
            <span className="content-card-action">Read article →</span>
          </a>
        ))}
      </div>
      <aside className="editorial-next"><h2>Keep learning while you set up</h2><p>Use the <a href="/">Circuit online C compiler</a> to test a short standard C program, then take its source to your desktop environment. Our <a href="/examples/hello-world">Hello World example</a> gives you a small starting point with a predictable result.</p></aside>
    </InfoPage>
  );
}
