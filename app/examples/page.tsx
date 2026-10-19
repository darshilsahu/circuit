import { InfoPage } from '@/components/info-page';
import { ContentSchema } from '@/components/content-schema';
import { categories, examples } from '@/lib/content/examples';
import { pageMetadata } from '@/lib/site';
const description = 'Explore runnable C examples for conditions, loops, arrays, functions, strings, pointers, structures, and file handling, with explanations and output.';
export const metadata = pageMetadata('C Program Examples — Code, Logic & Output | Circuit', description, '/examples');
export default function Examples() {
  return <InfoPage title="C program examples">
    <ContentSchema title="C Program Examples" description={description} path="/examples" />
    <p className="content-lead">Small programs you can understand, run, and change. Each example includes its logic, sample output, and the concepts to watch.</p>
    <p>“Try in Circuit” opens a new saved copy. Your existing programs stay intact. Interactive examples accept input in the terminal; sample responses shown on each page are for you to enter.</p>
    <nav className="category-links" aria-label="Example categories">{categories.map((category, i) => <a key={category} href={`#category-${i}`}>{category}</a>)}</nav>
    {categories.map((category, i) => <section key={category} id={`category-${i}`}><h2>{category}</h2><div className="content-grid">{examples.filter((example) => example.category === category).map((example) => <a className="content-card" key={example.slug} href={`/examples/${example.slug}`}><h3>{example.title}</h3><p>{example.description}</p><span className="content-card-action">View code and explanation →</span></a>)}</div></section>)}
    <aside className="editorial-next"><p>Want the concepts behind these programs? Follow the <a href="/learn">Learn C guides</a>, or check the <a href="/docs#environment">supported environment</a> before adapting desktop-specific code.</p></aside>
  </InfoPage>;
}
