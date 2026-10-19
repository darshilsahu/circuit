import { Breadcrumbs, ContentSchema } from '@/components/content-schema';
import { InfoPage } from '@/components/info-page';
import { blogPosts } from '@/lib/content/blog';
import { pageMetadata, siteUrl } from '@/lib/site';
import styles from './compilation-diagram.module.css';

const post = blogPosts.find(({ slug }) => slug === 'compilation-process-in-c')!;
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

const orderSource = [
  '#include <stdio.h>',
  '#define UNITS 6',
  '',
  'int line_total(int units, int price) {',
  '    return units * price;',
  '}',
  '',
  'int main() {',
  '    int total = line_total(UNITS, 7);',
  '    printf("Order total: %d\\n", total);',
  '    return 0;',
  '}',
].join('\n');

const splitMain = [
  '#include <stdio.h>',
  '#include "order.h"',
  '#define UNITS 6',
  '',
  'int main() {',
  '    int total = line_total(UNITS, 7);',
  '    printf("Order total: %d\\n", total);',
  '    return 0;',
  '}',
].join('\n');

const splitHelper = [
  '#include "order.h"',
  '',
  'int line_total(int units, int price) {',
  '    return units * price;',
  '}',
].join('\n');

const stages = [
  { name: 'Preprocessing', task: 'Expand includes and macros', artifact: 'order.i' },
  { name: 'Compilation', task: 'Check C and generate assembly', artifact: 'order.s' },
  { name: 'Assembly', task: 'Encode target instructions', artifact: 'order.o' },
  { name: 'Linking', task: 'Connect objects and libraries', artifact: 'order' },
];

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

export default function CompilationProcessArticle() {
  const section = { title: 'Blog', path: '/blog' };
  return (
    <InfoPage title={post.title}>
      <ContentSchema title={post.title} description={post.description} path={path} section={section} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData).replace(/</g, '\\u003c') }} />
      <Breadcrumbs section={section} title={post.title} />
      <p className="content-note">By <a href="/about">Circuit</a> · Published <time dateTime={post.published}>October 9, 2026</time> · Follow the files behind a successful build</p>
      <article>
        <p className="content-lead">The compilation process in C turns source code into a program that an execution environment can run. In a conventional native build, that journey has four useful stages: preprocessing, compilation, assembly, and linking. Each stage answers a different question—and leaves different evidence when something goes wrong.</p>
        <p>Instead of memorizing four names, we will follow a small order-total calculator from its .c file to its output. You will see what changes at each step, how to keep the intermediate files with GCC, and why “it compiled” is not the same as “it works.” The desktop walkthrough also gives us a useful reference for understanding Circuit’s browser-based build.</p>

        <nav className="content-toc" aria-label="Article sections">
          <h2>In this article</h2>
          <ol>
            <li><a href="#diagram">The C compilation process diagram</a></li>
            <li><a href="#example">Start with one complete C program</a></li>
            <li><a href="#preprocessing">Preprocessing: prepare a translation unit</a></li>
            <li><a href="#compilation">Compilation: translate checked C into assembly</a></li>
            <li><a href="#assembly">Assembly: create an object file</a></li>
            <li><a href="#linking">Linking: connect the missing pieces</a></li>
            <li><a href="#diagnostics">Find the stage that failed</a></li>
            <li><a href="#browser">How this relates to Circuit</a></li>
            <li><a href="#practice">Three experiments to make it stick</a></li>
          </ol>
        </nav>

        <section id="diagram">
          <h2>C compilation process diagram: source to executable</h2>
          <p>Read the arrows as “this output becomes the next stage’s input.” The filenames are the ones we will create below. Linking also needs startup code and appropriate library support; your object file is only one part of that final step.</p>
          <figure className={styles.diagram} aria-labelledby="build-diagram-caption">
            <span className={styles.label}>A conventional native GCC build</span>
            <div className={styles.source}><strong>Source: <code>order.c</code></strong><span>+ included headers such as <code>stdio.h</code></span></div>
            <ol className={styles.stages}>
              {stages.map((stage, index) => (
                <li className={styles.stage} key={stage.name}>
                  <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{stage.name}</h3>
                  <p>{stage.task}</p>
                  <code className={styles.artifact}>{stage.artifact}</code>
                </li>
              ))}
            </ol>
            <p className={styles.linkInputs}>Additional linking inputs: startup objects + C library support + any other program objects.</p>
            <div className={styles.runtime}><strong>After the build</strong><code>order</code><span aria-hidden="true">→</span><strong>Load and run</strong><span aria-hidden="true">→</span><code>Order total: 42</code></div>
            <figcaption id="build-diagram-caption" className={styles.caption}>Figure 1. Preprocessing produces prepared C; compilation produces assembly; assembly produces an object; linking produces an executable. Loading and execution happen afterward. A normal build need not save every intermediate file.</figcaption>
          </figure>
          <p>The word <em>compilation</em> is used in two ways: for the whole build and for the narrower C-to-assembly stage. Also, these four toolchain stages are a practical model, not a complete list of the C standard’s translation phases. Implementations can combine work internally without changing the language rules.</p>
        </section>

        <section id="example">
          <h2>Start with a program whose answer you can predict</h2>
          <p>Save this as <code>order.c</code>. Six items at a price of seven each should produce a total of 42. The named macro, helper function, and printf call will give us something specific to track through the build.</p>
          <pre tabIndex={0} aria-label="Complete order.c example"><code>{orderSource}</code></pre>
          <p>With GCC installed and available in your terminal, this command performs the complete native build:</p>
          <pre tabIndex={0} aria-label="Build order.c with GCC"><code>{'gcc -std=c17 -Wall -Wextra -O0 order.c -o order'}</code></pre>
          <p>On Linux, run the successful result with <code>./order</code>. On Windows with GCC, use <code>-o order.exe</code> and run <code>.\order.exe</code> in PowerShell. On macOS, Apple’s toolchain uses Clang; the build concepts still apply. See our <a href="/blog/how-to-install-c-compiler-in-vs-code">C compiler setup guide for VS Code</a> if your terminal cannot find a compiler.</p>
          <p>The program should print <code>Order total: 42</code> followed by a newline. -std=c17 selects the language version, -Wall and -Wextra request useful warnings, and -O0 keeps optimization low for inspection. These are desktop commands; Circuit’s terminal accepts input for your running C program, not shell commands such as gcc.</p>
        </section>

        <section id="preprocessing">
          <h2>1. Preprocessing: prepare the C that will be checked</h2>
          <p>The preprocessor handles directives such as #include, #define, and conditional #if blocks. For this example, it brings in the contents needed from stdio.h and replaces uses of UNITS with the macro’s replacement tokens. A macro is not a variable stored in memory, and expanding it does not execute the multiplication.</p>
          <pre tabIndex={0} aria-label="Save the preprocessing output"><code>{'gcc -std=c17 -E order.c -o order.i'}</code></pre>
          <p>Open <code>order.i</code> as text and search for <code>line_total(6, 7)</code>. That call is the visible result of expanding UNITS. The file may be much larger than order.c because headers contribute declarations and other material. Exact content depends on the compiler’s target and installed headers.</p>
          <h3>What the prepared source reveals</h3>
          <p>Your comments normally disappear from this output. You may also see lines beginning with # that name a file and a line number. Those line markers help diagnostics refer back to the original sources; they are not another call to your program. GCC documents this output format in its <a href="https://gcc.gnu.org/onlinedocs/cpp/Preprocessor-Output.html">preprocessor output reference</a>.</p>
          <p>After preprocessing, the source together with its included material forms a <strong>translation unit</strong>. In a project with two .c files, there are normally two translation units. A header can contribute declarations to both without becoming a separately executable program.</p>
          <p>Including stdio.h makes the printf interface available to the compiler; it does not mean the header contains the entire machine-code implementation of printf. That distinction will matter at linking. GCC’s <a href="https://gcc.gnu.org/onlinedocs/cpp/Macros.html">macro documentation</a> explains the token-replacement part of this step.</p>
        </section>

        <section id="compilation">
          <h2>2. Compilation: move from C meaning to target instructions</h2>
          <p>The compiler parses expressions and declarations, checks the required type and language rules, and generates code for a selected target. In our example, it must understand that line_total multiplies two int values and returns an int. It also checks the calls using the declarations it can see.</p>
          <pre tabIndex={0} aria-label="Compile preprocessed C into assembly"><code>{'gcc -std=c17 -O0 -S order.i -o order.s'}</code></pre>
          <p>The .i extension tells GCC that this source has already been preprocessed. Open <code>order.s</code> in a text editor. Look for labels associated with main and line_total, then notice that C statements have become assembly instructions and assembler directives.</p>
          <p>There is no single assembly listing that every reader should get. An x86 compiler and an ARM compiler target different instruction sets. Compiler version, operating system, calling convention, and optimization options also affect the output. Even symbol names may gain a prefix on some platforms.</p>
          <h3>Why one source line does not equal one instruction</h3>
          <p>Evaluating a multiplication may involve loading arguments, calculating a result, and returning it. A call can also require placing arguments where the platform expects them. At higher optimization levels, the compiler may inline line_total or simplify the calculation so that no separate multiplication remains on the executed path.</p>
          <p>Those changes are a reason to inspect assembly with a specific question, such as “is this function still called?” Reading every instruction is unnecessary for understanding the pipeline. Assembly is still a textual representation; it is not the final executable you launch.</p>
        </section>

        <section id="assembly">
          <h2>3. Assembly: turn the listing into an object file</h2>
          <p>The assembler encodes target instructions and data into an object file. In addition to code and data, that file carries information that later tools need, including symbols and relocation records. Think of it as a prepared component of a program, with some connections still to be made.</p>
          <pre tabIndex={0} aria-label="Assemble order.s into an object file"><code>{'gcc -c order.s -o order.o'}</code></pre>
          <p><code>order.o</code> is binary, so opening it as ordinary text will not give you a useful C listing. If your GNU toolchain provides nm, try <code>nm order.o</code>. Look for a definition corresponding to line_total and an external printing-related reference. That reference is often printf; some Windows headers wrap it, so a MinGW build may instead need a helper such as __mingw_vprintf.</p>
          <p>An unresolved library reference is expected here. The assembler can record that your code needs a symbol without supplying its implementation. It is the linker’s job to connect that reference later. A .o file is therefore not simply a “smaller executable,” and renaming it to .exe cannot finish the build.</p>
          <p>To go straight from source to an object without saving the earlier text files, use <code>gcc -std=c17 -Wall -Wextra -O0 -c order.c -o order.o</code>. The -c option stops before linking. GNU’s <a href="https://sourceware.org/binutils/docs/as/Object.html">assembler output documentation</a> describes the object-file role.</p>
        </section>

        <section id="linking">
          <h2>4. Linking: connect objects, startup code, and libraries</h2>
          <p>The linker combines inputs, resolves symbol references, and performs the relocations needed for the output. Use the GCC driver to link the object; it supplies the normal platform startup and library choices that a direct call to a linker would require you to arrange.</p>
          <pre tabIndex={0} aria-label="Link order.o into an executable"><code>{'gcc order.o -o order'}</code></pre>
          <p>For this build, your definition of line_total and the library support for printf now belong to a usable program. Depending on the platform and linking options, library code can be included in the executable or supplied through shared libraries at runtime. Do not assume every executable contains all its dependencies.</p>
          <p>Loading is the next event, after a successful build. The operating system prepares the executable and any required runtime dependencies, startup code establishes the C environment, and main is called. Only now does our program calculate a total and print it. The GNU linker’s <a href="https://sourceware.org/binutils/docs/ld/Overview.html">overview</a> and GCC’s <a href="https://gcc.gnu.org/onlinedocs/gcc/Link-Options.html">link options</a> distinguish the inputs and available linking choices.</p>
          <h3>A two-file experiment makes linking visible</h3>
          <p>In a separate folder, split the same program into these three files. Put the shared declaration in <code>order.h</code>:</p>
          <pre tabIndex={0} aria-label="order.h shared function declaration"><code>{'#ifndef ORDER_H\n#define ORDER_H\n\nint line_total(int units, int price);\n\n#endif'}</code></pre>
          <p>Put the calculation’s definition in <code>pricing.c</code>:</p>
          <pre tabIndex={0} aria-label="pricing.c function implementation"><code>{splitHelper}</code></pre>
          <p>Use this version of <code>order.c</code>. It includes the declaration but no longer defines line_total itself:</p>
          <pre tabIndex={0} aria-label="order.c for the two-file desktop project"><code>{splitMain}</code></pre>
          <pre tabIndex={0} aria-label="Compile two translation units and link them"><code>{'gcc -std=c17 -Wall -Wextra -c order.c -o order.o\ngcc -std=c17 -Wall -Wextra -c pricing.c -o pricing.o\ngcc order.o pricing.o -o order'}</code></pre>
          <p>Both translation units can compile independently. If you leave pricing.o out of the last command, linking fails because line_total has a declaration but no supplied definition. Adding the missing object fixes that connection. These two-file commands are for a desktop toolchain; Circuit currently runs one source program per build.</p>
        </section>

        <section id="diagnostics">
          <h2>When something fails, identify the stage first</h2>
          <p>“Compiler error” is often used for every problem shown in a build terminal. The message becomes more useful when you ask which input could not become the next output. Start with the earliest diagnostic; later messages can be consequences of the first mistake.</p>
          <p className="content-note">On narrow screens, scroll the table sideways to compare the failure and next action.</p>
          <div className="content-table" tabIndex={0} role="region" aria-label="Build and runtime failure diagnosis">
            <table style={{ minWidth: 600 }}>
              <caption>Use the stage to narrow your investigation</caption>
              <thead><tr><th scope="col">Stage</th><th scope="col">Example problem</th><th scope="col">What to check</th></tr></thead>
              <tbody>
                <tr><th scope="row">Preprocessing</th><td>An included header cannot be found.</td><td>The header’s name, installation, and include search path.</td></tr>
                <tr><th scope="row">Compilation</th><td>A missing semicolon or an undeclared identifier.</td><td>The reported location, surrounding syntax, and declarations.</td></tr>
                <tr><th scope="row">Assembly</th><td>Invalid instructions in edited assembly.</td><td>The assembly syntax and intended target architecture.</td></tr>
                <tr><th scope="row">Linking</th><td>line_total is declared but pricing.o is missing.</td><td>The supplied objects, definitions, and required libraries.</td></tr>
                <tr><th scope="row">Loading</th><td>A required shared library is unavailable.</td><td>The runtime dependencies and platform compatibility.</td></tr>
                <tr><th scope="row">Execution</th><td>The program prints an incorrect total or never finishes.</td><td>The algorithm, input, loop progress, and memory use.</td></tr>
              </tbody>
            </table>
          </div>
          <p>A useful distinction: duplicate external definitions can also cause a link error. Copying a function body into a header and including it in several .c files is different from sharing its declaration. Our header avoids that mistake; the include guard handles repeated inclusion within a translation unit.</p>
          <p>After any failed build, do not launch an old executable and mistake its output for the new source. Successful translation also cannot prove that your algorithm is right or that every pointer is safe. Our <a href="/learn/common-compiler-errors">guide to common C compiler errors</a> and <a href="/learn/segmentation-fault">memory failure guide</a> help separate those cases.</p>
        </section>

        <section id="browser">
          <h2>How the compilation process works in Circuit</h2>
          <p>The desktop diagram describes a native GCC workflow. Circuit uses a downloaded WebAssembly build of LLVM Clang, distributed through YoWASP, to compile and link your C source inside a browser worker. The resulting program targets WebAssembly with WASI support rather than your computer’s native executable format.</p>
          <p>The conceptual journey still matters: includes and macros are processed, C is checked and translated, references are linked, and a compatible environment runs the result. The literal .s and .o artifacts in our GCC walkthrough are not files that Circuit’s UI exposes. Circuit executes the linked module with its WASI runtime and connects stdin, stdout, and stderr to the integrated terminal.</p>
          <p>You can paste the first, single-file order.c example into the <a href="/">online C compiler</a> and verify the total without installing a desktop toolchain. Source compilation happens on your device; loading the website and compiler assets still requires network requests. The <a href="/docs#environment">supported environment documentation</a> explains the target, limits, and available features.</p>
        </section>

        <section id="practice">
          <h2>Three small experiments that test your understanding</h2>
          <ol>
            <li><strong>Track a macro.</strong> Change UNITS from 6 to 8. Predict the prepared call in order.i and the new output: 56. Regenerate the files and rebuild before running.</li>
            <li><strong>Separate declaration from definition.</strong> In the two-file desktop project, compile both sources successfully, then try linking only order.o. Read the unresolved-symbol diagnostic and restore pricing.o to the link command.</li>
            <li><strong>Find a logic error that builds.</strong> Change the multiplication in line_total to addition. The source is valid, but the original inputs now produce 13 instead of 42. Explain why no build stage can infer that you intended a price calculation.</li>
          </ol>
          <p>For each experiment, keep the question small: what changed, which stage can observe it, and what artifact or output should differ? That habit turns the compilation diagram into a debugging method. You no longer need to guess whether to edit a declaration, add a missing object, rebuild stale output, or inspect the running algorithm.</p>
          <p>To inspect the tools GCC would invoke without running them, try <code>gcc -### order.c -o order</code>. To execute a build while printing the invoked commands, use -v instead. The exact tool names vary by installation. The <a href="https://gcc.gnu.org/onlinedocs/gcc/Overall-Options.html">GCC driver options</a> document these inspection switches and the -E, -S, and -c stopping points used above.</p>
        </section>
      </article>
      <aside className="editorial-next" aria-label="Related reading">
        <h2>Continue learning with Circuit</h2>
        <p>Read <a href="/learn/how-a-c-compiler-works">how a C compiler analyzes your source</a>, compare <a href="/blog/compiler-vs-interpreter">compilers and interpreters</a>, or practise <a href="/learn/functions-in-c">C functions</a> by changing the helper in this example.</p>
        <p><a href="/blog">View all blog articles</a> · <a href="/">Try the single-file program in Circuit</a></p>
      </aside>
    </InfoPage>
  );
}
