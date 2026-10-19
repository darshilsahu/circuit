import { Breadcrumbs, ContentSchema } from '@/components/content-schema';
import { InfoPage } from '@/components/info-page';
import { blogPosts } from '@/lib/content/blog';
import { pageMetadata, siteUrl } from '@/lib/site';

const post = blogPosts.find(({ slug }) => slug === 'what-is-c-language')!;
const path = '/blog/' + post.slug;
const baseMetadata = pageMetadata(post.title + ' | Circuit', post.description, path);
export const metadata = {
  ...baseMetadata,
  openGraph: {
    ...baseMetadata.openGraph,
    type: 'article' as const,
    publishedTime: post.published,
    modifiedTime: post.published,
  },
};

const readingsSource = [
  '#include <stdio.h>',
  '',
  'int main() {',
  '    int readings[3] = {18, 21, 24};',
  '    int total = 0;',
  '',
  '    for (int i = 0; i < 3; i++) {',
  '        total += readings[i];',
  '    }',
  '',
  '    double average = total / 3.0;',
  '    printf("Total: %d\\n", total);',
  '    printf("Average: %.1f\\n", average);',
  '    return 0;',
  '}',
].join('\n');

const articleData = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.description,
  datePublished: post.published,
  dateModified: post.published,
  inLanguage: 'en',
  mainEntityOfPage: siteUrl + path,
  image: siteUrl + '/og-image.png',
  author: { '@type': 'Organization', name: 'Circuit', url: siteUrl + '/about' },
  publisher: {
    '@type': 'Organization',
    name: 'Circuit',
    url: siteUrl + '/',
    logo: { '@type': 'ImageObject', url: siteUrl + '/icon-512.png' },
  },
  isPartOf: { '@type': 'Blog', name: 'Circuit Blog', url: siteUrl + '/blog' },
};

export default function WhatIsCLanguageArticle() {
  const section = { title: 'Blog', path: '/blog' };
  return (
    <InfoPage title={post.title}>
      <ContentSchema title={post.title} description={post.description} path={path} section={section} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData).replace(/</g, '\\u003c') }} />
      <Breadcrumbs section={section} title={post.title} />
      <p className="content-note">By <a href="/about">Circuit</a> · Published <time dateTime={post.published}>October 10, 2026</time> · From Bell Labs to your first program</p>
      <article>
        <p className="content-lead">C is a general-purpose programming language used to describe calculations, control flow, and operations on data and memory. You write those instructions as source code, then use a compiler and an execution environment to turn them into a running program. Its compact syntax can express a small classroom exercise or become part of a much larger system.</p>
        <p>To understand C, it helps to connect three questions: where did it come from, what does it let a programmer control, and what responsibilities come with that control? This guide follows its origins, explains the people involved, and uses one small program to make the language’s main ideas concrete.</p>

        <nav className="content-toc" aria-label="Article sections">
          <h2>In this article</h2>
          <ol>
            <li><a href="#definition">What kind of language is C?</a></li>
            <li><a href="#creator">Who created C, and where?</a></li>
            <li><a href="#origins">How BCPL and B led to C</a></li>
            <li><a href="#unix">Why the UNIX connection mattered</a></li>
            <li><a href="#features">The features that define C</a></li>
            <li><a href="#uses">Where C is used</a></li>
            <li><a href="#first-program">Read and run a complete program</a></li>
            <li><a href="#standards">C standards, from C89 to C23</a></li>
            <li><a href="#distinctions">Separate C from C++, compilers, and editors</a></li>
            <li><a href="#tradeoffs">Understand C’s strengths and responsibilities</a></li>
            <li><a href="#learning">A practical path for learning C</a></li>
          </ol>
        </nav>

        <section id="definition">
          <h2>What kind of programming language is C?</h2>
          <p>C is commonly described as <strong>procedural</strong>: a program is organized around functions that operate on data. Inside those functions, statements change values, choose between actions, repeat operations, and call other functions. It is also <strong>statically typed</strong>: declarations provide type information used when the program is translated.</p>
          <p>For example, int can represent an integer, double can represent a floating-point value, and a pointer type describes a reference to an object or function of a particular type. These categories affect which operations are allowed and how expressions are interpreted. The same written operator can therefore behave differently depending on its operands.</p>
          <p>You may hear C called a “middle-level language.” That is an informal teaching label, not an official level in the C standard. The useful idea is that C provides structured programming constructs while still exposing details such as object representation, addresses, and resource lifetime. You do not need to memorize the label to use the language correctly.</p>
        </section>

        <section id="creator">
          <h2>Who created C, and where did it originate?</h2>
          <p><strong>Dennis M. Ritchie created C at Bell Labs</strong>, in the United States. Bell Labs’ <a href="https://www.nokia.com/bell-labs/unix-history/ritchiebio.html">archival biography of Ritchie</a> lists 1972 as the year of its creation. That makes 1972 a useful short answer, although the language developed through several iterations rather than appearing fully formed on one day.</p>
          <div className="content-table" tabIndex={0} role="region" aria-label="C language origin facts">
            <table>
              <caption>The essential origin facts</caption>
              <tbody>
                <tr><th scope="row">Creator</th><td>Dennis M. Ritchie</td></tr>
                <tr><th scope="row">Research setting</th><td>Bell Labs, Murray Hill, New Jersey, United States</td></tr>
                <tr><th scope="row">Commonly cited creation year</th><td>1972</td></tr>
                <tr><th scope="row">Immediate predecessor</th><td>B, developed by Ken Thompson</td></tr>
                <tr><th scope="row">Early purpose</th><td>System implementation, closely connected with UNIX</td></tr>
              </tbody>
            </table>
          </div>
          <p>The surrounding contributors had different roles. Ken Thompson created B and was central to UNIX’s development. Brian Kernighan coauthored <em>The C Programming Language</em> with Ritchie; the first edition appeared in 1978. The familiar name “K&amp;R” refers to those authors, not to two people jointly inventing C.</p>
          <p>In <a href="https://www.nokia.com/bell-labs/about/dennis-m-ritchie/chist.html">Ritchie’s own account of C’s development</a>, the broader emergence spans 1969–1973, with especially important work in 1972. That explains why a history can give a range while a quick reference gives a single year.</p>
        </section>

        <section id="origins">
          <h2>How BCPL and B led to C</h2>
          <p>C had predecessors. Martin Richards designed BCPL in 1966 and first implemented it at MIT in spring 1967, according to his <a href="https://www.cl.cam.ac.uk/~mr10/BCPL.html">first-person BCPL history</a>. BCPL influenced B, and B became the starting point for C.</p>
          <p>B’s word-oriented model was awkward for the byte-oriented PDP-11. Ritchie added types and developed a compiler producing machine instructions; an intermediate version was called NB, for “New B.” Bell Labs’ <a href="https://www.nokia.com/bell-labs/unix-history/btoc.html">B-to-C archive</a> describes this transition. C was therefore a response to practical language and implementation problems, not merely a new spelling of B.</p>
          <p>Why the letter C? Ritchie followed the single-letter naming style after B, while leaving open whether the progression was through the alphabet or the letters of BCPL. C is not an abbreviation for “compiler.” The concise name hides a history of changing types, syntax, and compiler implementation.</p>
          <p>The connection to modern programming is useful: an int, a char, and a pointer are different kinds of values. A language that distinguishes them gives its compiler more information than one that treats every value as the same undifferentiated word. Those distinctions also ask the programmer to understand conversions and the meaning of each operation.</p>
        </section>

        <section id="unix">
          <h2>Why UNIX mattered to C’s development</h2>
          <p>Early UNIX was written in assembly language. In 1973, its kernel was rewritten in C, a milestone described in <a href="https://www.nokia.com/bell-labs/about/dennis-m-ritchie/hist.html">Ritchie’s history of UNIX</a>. This gave the language a demanding real application: implementing an operating system rather than only demonstrating short calculations.</p>
          <p>Assembly instructions are tied closely to a processor’s instruction set. Expressing more of a system in C allowed developers to preserve more source while changing the compiler and the platform-specific pieces. This helped make portability a practical concern. It did not eliminate hardware-specific code or make every operating-system interface part of standard C.</p>
          <p>For a learner, the distinction is important. Portable source means the program can be adapted or rebuilt for compatible environments. It does not mean one native executable runs unchanged everywhere. A Windows executable, a Linux executable, and a WebAssembly module are different targets even when some of their C source is identical.</p>
        </section>

        <section id="features">
          <h2>The features that define C</h2>
          <h3>Functions and structured control flow</h3>
          <p>Functions separate work into named operations with parameters and return values. if and switch choose actions; for, while, and do loops repeat work. You can keep a calculation in one function and input handling in another, making each easier to inspect. The <a href="/learn/functions-in-c">functions guide</a> shows how to turn that separation into testable code.</p>
          <h3>Explicit types and data structures</h3>
          <p>Arrays group elements of one type, while a struct groups named members that can have different types. An array of readings and a record containing a sensor identifier are different representations. Choosing the representation deliberately helps you explain which values belong together and which operations should act on them.</p>
          <h3>Pointers and object lifetime</h3>
          <p>Pointers let code refer to objects through addresses, pass access to data into functions, and work with dynamically allocated storage. A pointer’s type does not prove that its value refers to a live, correctly sized object. Lifetime, bounds, and ownership remain part of the program’s design. Begin with the <a href="/learn/pointers-for-beginners">pointer guide</a> before trying complicated allocation patterns.</p>
          <h3>A language plus a standard library</h3>
          <p>C’s syntax and its library are related but distinct. return is a language keyword; printf is a library function declared through stdio.h. Other headers provide facilities for strings, allocation, mathematics, and more. A header makes interfaces available; the build and runtime supply the implementations used by the program.</p>
          <h3>Portability with conditions</h3>
          <p>Well-chosen standard features help source move between systems, but assumptions can undermine that portability. Do not assume an int has one fixed width on every implementation, that a particular operating-system header exists everywhere, or that a file’s raw binary representation is universal. Define the needed ranges and interfaces before relying on a platform’s details.</p>
        </section>

        <section id="uses">
          <h2>Where is C used?</h2>
          <p>C remains useful when software must work closely with data representation, existing native interfaces, or constrained execution environments. Two concrete examples show different roles:</p>
          <ul>
            <li><strong>Operating-system code.</strong> The <a href="https://docs.kernel.org/process/programming-language.html">Linux kernel documentation</a> describes its C implementation and compiler dialect, while also documenting support for Rust. A large system can use several languages; “uses C” need not mean “uses only C.”</li>
            <li><strong>Embedded libraries.</strong> SQLite provides a database engine within an application rather than requiring a separate database server. Its <a href="https://www.sqlite.org/about.html">project overview</a> points to the C source distribution. Here, “embedded” describes integration into an application, not necessarily a microcontroller.</li>
          </ul>
          <p>Other suitable projects include command-line utilities, parsers for file formats, and firmware components built with a device’s toolchain. These tasks still need libraries and interfaces supplied by their environment. Standard C alone does not provide a desktop window system, a universal networking API, or a driver for every piece of hardware.</p>
          <p>For learning, you can start much smaller: summarize a few readings, check a condition, or process an array. The value comes from being able to explain the data and operations, not from making your first program resemble an operating system.</p>
        </section>

        <section id="first-program">
          <h2>A complete C program you can read and run</h2>
          <p>This program summarizes three readings. Before running it, calculate 18 + 21 + 24 and divide the result by three. The source makes the data, repetition, and output visible without requiring interactive input yet.</p>
          <pre tabIndex={0} aria-label="C program that summarizes three readings"><code>{readingsSource}</code></pre>
          <p>Paste it into the <a href="/">online C compiler</a> and select Run code. The expected program output is:</p>
          <pre tabIndex={0} aria-label="Expected readings program output"><code>{'Total: 63\nAverage: 21.0'}</code></pre>
          <h3>Connect the source to its behavior</h3>
          <ol>
            <li><strong>The include directive</strong> makes the standard output declarations available. It is handled as part of preparing the source.</li>
            <li><strong>main</strong> is the starting function for this hosted C program. Returning zero reports a successful exit to the execution environment.</li>
            <li><strong>readings</strong> stores three integers. The valid element indexes are 0, 1, and 2.</li>
            <li><strong>The loop</strong> visits each of those indexes once. total starts at zero, then becomes 18, 39, and 63.</li>
            <li><strong>The average</strong> uses 3.0 so the division is floating-point. %.1f displays one digit after the decimal point; %d displays the integer total.</li>
          </ol>
          <p>Change the last reading from 24 to 25. Predict the total of 64 and the displayed average of 21.3, then run again. Next try three zeros. Small controlled changes test your understanding more effectively than copying a much larger program.</p>
          <p>This exercise deliberately fixes the element count at three. If you add elements, update both the array size and the loop and averaging logic, or learn how to derive the count with sizeof. The <a href="/learn/arrays-in-c">array lesson</a> explains why a count and an array’s capacity must be managed consistently.</p>
          <p>For terminal input, continue with <a href="/learn/printf-and-scanf">printf and scanf</a>. Keep the known-value version as a reference, then add one input request at a time and check whether the conversion succeeded. That separates a calculation error from an input-handling error.</p>
        </section>

        <section id="standards">
          <h2>C standards: the language has continued to evolve</h2>
          <p>C is standardized through ISO/IEC JTC 1/SC 22/WG14. Its <a href="https://www.open-std.org/jtc1/sc22/wg14/www/projects">official revision list</a> distinguishes familiar version names from the publication identifiers:</p>
          <div className="content-table" tabIndex={0} role="region" aria-label="Major C language standard revisions">
            <table>
              <caption>Selected standardization milestones</caption>
              <thead><tr><th scope="col">Name</th><th scope="col">Publication</th></tr></thead>
              <tbody>
                <tr><th scope="row">C89 / ANSI C</th><td>ANSI X3.159-1989</td></tr>
                <tr><th scope="row">C90</th><td>ISO/IEC 9899:1990</td></tr>
                <tr><th scope="row">C99</th><td>ISO/IEC 9899:1999</td></tr>
                <tr><th scope="row">C11</th><td>ISO/IEC 9899:2011</td></tr>
                <tr><th scope="row">C17</th><td>ISO/IEC 9899:2018</td></tr>
                <tr><th scope="row">C23</th><td>ISO/IEC 9899:2024</td></tr>
              </tbody>
            </table>
          </div>
          <p>As of this article’s publication, C23 is the latest published revision; ISO lists it as <a href="https://www.iso.org/standard/82075.html">ISO/IEC 9899:2024</a>. Its informal name does not mean the ISO document was published in 2023. Likewise, C17’s publication identifier uses 2018.</p>
          <p>A standard specifies language and library rules; it is not a particular compiler installation. Compiler support and the selected language mode both matter. Circuit currently uses C17 with Clang, as described in the <a href="/docs#environment">environment documentation</a>. A newer standard’s existence does not mean that every older course example is obsolete or that every compiler enables its features by default.</p>
        </section>

        <section id="distinctions">
          <h2>C is not the compiler, the editor, or C++</h2>
          <p><strong>C is the language.</strong> GCC and Clang are toolchains that implement translation for selected targets. VS Code is an editor that can launch those tools. Circuit provides an editor, a browser-based compiler/runtime, and a local program manager. Keeping these roles separate makes setup and troubleshooting easier.</p>
          <p>A .c filename conventionally identifies C source, but the extension cannot make invalid text a valid program. The compiler still checks the source. The <a href="/blog/compilation-process-in-c">compilation process walkthrough</a> follows the intermediate files, while our <a href="/blog/how-to-install-c-compiler-in-vs-code">VS Code setup article</a> explains how an editor and a toolchain work together.</p>
          <p><strong>C and C++ are related, distinct languages.</strong> C++ has facilities such as classes and templates that are not standard C features. Similar-looking source can also have different rules in the two languages. Do not assume a program intended for one becomes correct for the other simply by changing its extension or compiler command.</p>
          <p>Describing C as a compiled language summarizes a common workflow, but compilation is an implementation step rather than a feature belonging only to C. Our <a href="/blog/compiler-vs-interpreter">compiler and interpreter guide</a> explains the difference between translating code and executing its instructions.</p>
        </section>

        <section id="tradeoffs">
          <h2>C’s strengths come with responsibilities</h2>
          <h3>What you gain</h3>
          <p>C makes many decisions visible: how data is grouped, which object a pointer refers to, when allocated storage is released, and how an operation changes state. This is useful both in systems work and in learning how software uses memory. Its interfaces also make it possible to work with existing C libraries and platform APIs.</p>
          <p>That control can support efficient implementations, but C is not automatically the fastest choice for every problem. Algorithms, data layout, compiler optimization, libraries, and the workload all affect performance. A careful solution in another language can outperform a poorly designed C program.</p>
          <h3>What you must check</h3>
          <p>Array indexing does not provide automatic bounds checks as a language guarantee. A pointer can outlive the object it referred to. Signed integer overflow and many invalid memory operations have undefined behavior. A program might appear to work during one run while still violating its language rules.</p>
          <p>Not all memory needs manual allocation: local objects can have automatic storage duration. When you do use allocation functions such as malloc, you must handle allocation failure and arrange the corresponding release. Learn that distinction before turning every local variable into dynamically allocated storage.</p>
          <p>Successful compilation and a zero exit status are useful observations, not proofs of correctness. Check expected answers, boundary cases, and error paths. Read warnings, keep inputs small while learning, and consult the <a href="/learn/common-compiler-errors">diagnostic guide</a> rather than suppressing a message you do not understand.</p>
        </section>

        <section id="learning">
          <h2>A practical path for learning C</h2>
          <ol>
            <li><strong>Understand one complete program.</strong> Work through <a href="/learn/first-c-program">your first C program</a>. Explain the header, main, each statement, and the output before adding more code.</li>
            <li><strong>Connect variables to decisions and repetition.</strong> Use small values in an if statement and a loop. Predict the first and last iteration, then compare your prediction with the terminal.</li>
            <li><strong>Group data and separate work.</strong> Practise <a href="/learn/arrays-in-c">arrays</a> and <a href="/learn/functions-in-c">functions</a>. Keep input/output separate from calculations so each part is easier to test.</li>
            <li><strong>Learn addresses and lifetime deliberately.</strong> Begin with a pointer to one live local object. Introduce allocation only when you can explain who owns the storage and how long it must remain valid.</li>
          </ol>
          <p>Circuit lets you practise these single-source exercises in your browser with interactive terminal input and local program saves. Its Clang toolchain builds WebAssembly for a WASI runtime; it does not give a browser arbitrary access to your computer’s hardware or native operating-system APIs. Read the <a href="/docs">workspace documentation</a> when choosing a larger exercise.</p>
          <p>You do not need to memorize C’s whole history before writing useful code. Knowing its origins gives context to its design; understanding a small program gives you a starting point for using that design well. Keep the readings example, change one operation, predict its effect, and use the result to decide what to learn next.</p>
        </section>
      </article>
      <aside className="editorial-next" aria-label="Related reading">
        <h2>Take the next step</h2>
        <p>Browse the <a href="/examples">C example library</a>, explore <a href="/learn/how-a-c-compiler-works">how a C compiler analyzes source</a>, or return to the <a href="/blog">Circuit Blog</a> for longer guides.</p>
        <p><a className="content-button" href="/">Try a C program in Circuit</a></p>
      </aside>
    </InfoPage>
  );
}
