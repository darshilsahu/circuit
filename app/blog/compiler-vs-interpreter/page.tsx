import { Breadcrumbs, ContentSchema } from '@/components/content-schema';
import { InfoPage } from '@/components/info-page';
import { blogPosts } from '@/lib/content/blog';
import { pageMetadata, siteUrl } from '@/lib/site';

const post = blogPosts.find(({ slug }) => slug === 'compiler-vs-interpreter')!;
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

const cExample = [
  '#include <stdio.h>',
  '',
  'int main() {',
  '    const int limit = 4;',
  '    int total = 0;',
  '',
  '    for (int number = 1; number <= limit; number++) {',
  '        total += number;',
  '    }',
  '',
  '    printf("Total: %d\\n", total);',
  '    return 0;',
  '}',
].join('\n');

const pythonExample = [
  'limit = 4',
  'total = 0',
  '',
  'for number in range(1, limit + 1):',
  '    total += number',
  '',
  'print(f"Total: {total}")',
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

export default function CompilerAndInterpreterArticle() {
  const section = { title: 'Blog', path: '/blog' };
  return (
    <InfoPage title={post.title}>
      <ContentSchema title={post.title} description={post.description} path={path} section={section} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData).replace(/</g, '\\u003c') }} />
      <Breadcrumbs section={section} title={post.title} />
      <p className="content-note">By <a href="/about">Circuit</a> · Published <time dateTime={post.published}>October 6, 2026</time> · A practical guide to translation and execution</p>
      <article>
        <p className="content-lead">A compiler translates a program into another representation. An interpreter executes a program by carrying out its instructions. That is the central difference—but real programming environments often use both. Understanding the steps between source code and output is more useful than labeling a language “compiled” or “interpreted.”</p>
        <p>Imagine writing a loop that adds the numbers from 1 to 4. You can express that calculation in C or Python and get the same answer: 10. What changes is how your tools prepare the instructions, execute them, and report a mistake. We will follow that small calculation through both workflows, then connect the idea to the browser compiler in Circuit.</p>

        <nav className="content-toc" aria-label="Article sections">
          <h2>In this article</h2>
          <ol>
            <li><a href="#compiler">What does a compiler do?</a></li>
            <li><a href="#interpreter">What does an interpreter do?</a></li>
            <li><a href="#comparison">Compare the two roles</a></li>
            <li><a href="#c-example">Follow a C program from source to output</a></li>
            <li><a href="#python-example">Follow the same calculation in Python</a></li>
            <li><a href="#errors">Separate translation errors from execution errors</a></li>
            <li><a href="#mixed-workflows">Understand bytecode and JIT compilation</a></li>
            <li><a href="#tradeoffs">Reason about speed and portability</a></li>
            <li><a href="#browser">Understand what a browser compiler runs</a></li>
            <li><a href="#practice">Check your understanding with small experiments</a></li>
          </ol>
        </nav>

        <section id="compiler">
          <h2>What is a compiler?</h2>
          <p>A compiler is software that translates source code into a target form while checking the rules required for that translation. The target can be native machine code, assembly, bytecode, or another language. “Compiler” describes the translation job; it does not promise that the result is always an executable file or that the file runs on every computer.</p>
          <p>In a typical desktop C workflow, GCC or Clang participates in a build that produces a program for a particular platform. The build and the execution are separate events. You can build today and run the resulting executable later, without supplying the original source to the compiler again.</p>
          <p>This is often called <strong>ahead-of-time compilation</strong>: translation happens before the application runs. A compiler can also run during execution, which we will discuss under JIT compilation. Keep those two timings distinct rather than making “before execution” part of every possible compiler’s definition.</p>
          <p>The compiler is also separate from your editor. VS Code helps you write source and launch commands; installing it does not automatically install a C toolchain. Our <a href="/blog/how-to-install-c-compiler-in-vs-code">VS Code compiler setup guide</a> shows how to verify those connections individually.</p>
        </section>

        <section id="interpreter">
          <h2>What is an interpreter?</h2>
          <p>An interpreter is a program that performs the operations described by another program. It may work with source structures or with an intermediate instruction format. It reads those instructions, tracks the program’s state, and carries out actions such as calculating a value, calling a function, or selecting the next instruction.</p>
          <p>“It executes code line by line” is a tempting introduction, but a text line is not the unit that defines interpretation. One statement can span several lines; one line can contain several operations. A loop revisits instructions, a function call changes the execution path, and an interpreter may never execute the original source text directly.</p>
          <p>In a common Python workflow, you ask an installed Python implementation to run a .py file rather than building a separate native executable yourself. An interactive prompt also lets you submit a small expression and inspect its result. Neither workflow means that parsing or compilation is absent from the implementation.</p>
        </section>

        <section id="comparison">
          <h2>Compiler vs interpreter: compare jobs, not slogans</h2>
          <p className="content-note">On narrow screens, scroll the table sideways to compare both columns.</p>
          <div className="content-table" tabIndex={0} role="region" aria-label="Compiler and interpreter comparison">
            <table style={{ minWidth: 600 }}>
              <caption>Translation and execution roles</caption>
              <thead><tr><th scope="col">Question</th><th scope="col">Compiler’s role</th><th scope="col">Interpreter’s role</th></tr></thead>
              <tbody>
                <tr><th scope="row">Main job</th><td>Translate a program into a target representation.</td><td>Carry out a program’s instructions.</td></tr>
                <tr><th scope="row">Typical result</th><td>Code or an intermediate artifact used by another stage.</td><td>Executed operations and their effects, such as terminal output.</td></tr>
                <tr><th scope="row">When it runs</th><td>Before execution in an AOT build; during execution in a JIT system.</td><td>While the program is being executed.</td></tr>
                <tr><th scope="row">What it checks</th><td>Rules needed for translation; often additional warnings.</td><td>Operations as they execute, with checks determined by its runtime.</td></tr>
                <tr><th scope="row">What runs on the CPU</th><td>Native output can run on the processor; bytecode needs a compatible execution system.</td><td>The interpreter’s own machine instructions implement the interpreted operations.</td></tr>
                <tr><th scope="row">Can they coexist?</th><td>Yes: a compiler can produce instructions an interpreter consumes.</td><td>Yes: an interpreter can execute bytecode or work alongside a JIT compiler.</td></tr>
              </tbody>
            </table>
          </div>
          <p>A practical question is therefore: what representation do I have, and which tool consumes it next? A .c source file, an object file, a native executable, and a bytecode file are different artifacts. Knowing their roles helps explain why opening a source file is not the same action as launching a program.</p>
        </section>

        <section id="c-example">
          <h2>A C example: build once, then execute the result</h2>
          <p>Save this as <code>total.c</code>. It uses four loop iterations to compute 1 + 2 + 3 + 4.</p>
          <pre tabIndex={0} aria-label="C program that adds numbers from one to four"><code>{cExample}</code></pre>
          <p>With GCC installed on Linux, the following commands build the program and then launch it. Run the second command only after the first succeeds.</p>
          <pre aria-label="Compile and run total.c with GCC on Linux"><code>{'gcc -std=c17 -Wall -Wextra total.c -o total\n./total'}</code></pre>
          <p>The expected output is <code>Total: 10</code>. On Windows with GCC, name the output <code>total.exe</code> and launch it from PowerShell using <code>.\total.exe</code>. On macOS with Apple’s toolchain, use <code>clang</code> for the build. The installation guide above provides the platform-specific setup.</p>
          <h3>What happened during the build?</h3>
          <ol>
            <li><strong>Preprocessing</strong> handles directives such as includes and macros.</li>
            <li><strong>Compilation</strong> translates the prepared C source toward the target’s instructions.</li>
            <li><strong>Assembly</strong> produces an object file in a conventional native GCC build.</li>
            <li><strong>Linking</strong> resolves references and connects the required objects and libraries.</li>
          </ol>
          <p>GCC’s <a href="https://gcc.gnu.org/onlinedocs/gcc/Overall-Options.html">official output-options reference</a> describes these stages. Its -c option stops before linking. Our command performs the full build; you do not need to manage each intermediate file for this single-source exercise.</p>
          <p>Now change limit from 4 to 5 and save the source. Launching the old executable still runs its earlier calculation. Rebuild successfully, then launch the new result to get 15. Editing the source does not reach backward and rewrite an executable that already exists.</p>
        </section>

        <section id="python-example">
          <h2>A Python example: the same calculation, a different workflow</h2>
          <p>Save the equivalent calculation as <code>total.py</code>:</p>
          <pre tabIndex={0} aria-label="Python program that adds numbers from one to four"><code>{pythonExample}</code></pre>
          <p>On a system where Python 3 is available as python3, run <code>python3 total.py</code>. If your installation uses python instead, first check <code>python --version</code> and confirm it is Python 3. Circuit’s editor runs C, so execute this Python example in a suitable Python environment.</p>
          <p>This also prints Total: 10. The range ends before its second argument, so limit + 1 includes 4. Changing limit to 5 and running the file again gives 15, without an explicit native build command in this workflow.</p>
          <h3>But CPython compiles code too</h3>
          <p>CPython, the implementation commonly downloaded from python.org, compiles Python source to bytecode and executes that intermediate form. Bytecode consists of instructions for its execution system rather than a native executable you launch independently. The <a href="https://docs.python.org/3/glossary.html#term-bytecode">Python glossary</a> documents this translation and the bytecode caches used for imported modules.</p>
          <p>A .pyc cache can avoid repeating source-to-bytecode compilation when it is valid. It is not a general-purpose native executable, and Python bytecode is not guaranteed to remain compatible across releases. “No separate build command” and “no compilation occurs” are different claims.</p>
        </section>

        <section id="errors">
          <h2>Errors: what is checked, and when?</h2>
          <p>Consider three mistakes in the C example. They happen at different stages and require different responses.</p>
          <ul>
            <li><strong>Missing punctuation:</strong> remove the semicolon after the total declaration. The translation fails with a diagnostic; restore it and rebuild.</li>
            <li><strong>Incorrect loop condition:</strong> change number &lt;= limit to number &lt; limit. This valid program prints 6 for a limit of 4. Compilation success does not certify your intended calculation.</li>
            <li><strong>An invalid operation during a run:</strong> a bad pointer or an out-of-bounds access in a different program may cause a failure or other undefined behavior. A compiler cannot be assumed to catch every such mistake.</li>
          </ul>
          <p>Interpreted workflows have preparation errors too. If a Python file contains invalid syntax, CPython can reject that file before executing its first statement. An interactive prompt parses the separately submitted units, which is a different situation from loading a whole script.</p>
          <p>By contrast, this valid Python source begins execution and then raises an exception when it attempts the division:</p>
          <pre aria-label="Python example of an error during execution"><code>{'print("Starting calculation")\ncount = 0\nprint(12 / count)'}</code></pre>
          <p>The first print executes; the division raises <code>ZeroDivisionError</code>. Python’s <a href="https://docs.python.org/3/tutorial/errors.html">errors and exceptions tutorial</a> distinguishes syntax problems from exceptions during execution. Do not use error timing alone to decide whether a tool contains a compiler or an interpreter.</p>
          <p>In C, read the first meaningful diagnostic, identify whether the build or the run failed, and test the intended result separately. The <a href="/learn/common-compiler-errors">compiler error guide</a> and <a href="/learn/segmentation-fault">memory failure guide</a> explain those investigations with C examples.</p>
        </section>

        <section id="mixed-workflows">
          <h2>Bytecode and JIT: why real systems mix the approaches</h2>
          <p>An intermediate representation separates the language’s source syntax from the execution mechanism. A bytecode compiler can handle source translation, while an interpreter handles the resulting instruction stream. This is a pipeline with two different jobs, rather than a contradiction.</p>
          <p>A <strong>just-in-time compiler</strong>, or JIT, generates code while a program is running. A runtime may initially interpret instructions, observe frequently executed regions, and compile selected parts to machine code. It can retain an interpreter for other parts. Not every implementation uses this strategy, and its decisions depend on the runtime.</p>
          <p>V8 is a concrete example of an engine with both an interpreter and compiler components. Its documentation describes the <a href="https://v8.dev/docs/ignition">Ignition interpreter</a> and <a href="https://v8.dev/docs/turbofan">TurboFan optimizing compiler</a>. Calling JavaScript simply “interpreted” leaves out how an engine can prepare and optimize its execution.</p>
          <p>The language defines the rules your program follows; an implementation chooses how to carry them out. “C is usually compiled ahead of time” describes a familiar workflow. It is more accurate than treating compilation as an immutable property of every possible C implementation.</p>
        </section>

        <section id="tradeoffs">
          <h2>Speed and portability depend on the complete environment</h2>
          <h3>What does “faster” measure?</h3>
          <p>Native code can avoid the repeated instruction-dispatch work of a simple interpreter. But total performance also includes startup, preparation, optimization, allocation, libraries, and the algorithm itself. A program waiting for input or a network reply is not mainly limited by arithmetic execution speed.</p>
          <p>For a tiny script run once, preparation costs matter. For a calculation repeated many times, execution costs may matter more. A JIT can spend time optimizing before benefiting from its generated code. Measure the actual task in the environment you plan to use rather than ranking every program by its language label.</p>
          <h3>Which file can you move to another computer?</h3>
          <p>Portable source still depends on language rules and available libraries. A native binary usually targets a particular combination of processor architecture and operating-system conventions; it does not become portable merely because the source was written in C.</p>
          <p>A script or bytecode artifact needs a compatible runtime and dependencies on its destination. Code that opens an operating-system-specific path can fail even when the language is supported there. WebAssembly supplies another target with its own host environment; its <a href="https://webassembly.org/docs/portability/">portability documentation</a> explains how embedding support affects that environment.</p>
        </section>

        <section id="browser">
          <h2>What happens when you press Run in Circuit?</h2>
          <p>Circuit uses LLVM Clang distributed through YoWASP to compile C17 source to WebAssembly, then executes the result with WASI support inside a Web Worker. Compilation and execution happen on your device. The terminal connects the running program to supported standard input and output.</p>
          <p>Clang translates the C source; the browser’s WebAssembly execution engine handles the compiled module; the WASI support supplies facilities such as stdin and stdout. An engine may compile WebAssembly into native instructions internally. A Run button can orchestrate these stages without displaying a separate command for each one.</p>
          <p>Answering scanf is runtime input to the already-running C program. Your reply is data, not a new C source line being interpreted. Changing the editor text prepares a future build; it does not change the process that is currently waiting in the terminal.</p>
          <p>You can <a href="/">try the C calculation in Circuit</a> and inspect the real output. For native APIs, multiple source files, or a desktop debugger, use an appropriate local toolchain. Read the <a href="/docs#environment">runtime documentation</a> and <a href="/learn/online-compiler-vs-gcc">browser and GCC comparison</a> before expecting two environments to support the same libraries.</p>
        </section>

        <section id="practice">
          <h2>Three experiments that make the distinction stick</h2>
          <ol>
            <li><strong>Separate source from executable.</strong> Build the desktop C example, change its limit to 5, and launch the old result before rebuilding. Predict both outputs. The saved source and the runnable artifact represent different versions until the new build succeeds.</li>
            <li><strong>Separate valid code from correct logic.</strong> Reset limit to 4, use the &lt; loop condition, predict 6, then confirm it. Explain why neither a compiler nor an interpreter can infer that you wanted to include the final number.</li>
            <li><strong>Trace the actual pipeline.</strong> For Circuit, identify C source, the Clang build, the WebAssembly module, the runtime, and terminal output. For CPython, identify source, bytecode preparation, and execution. Label jobs rather than memorizing a two-column list of languages.</li>
          </ol>
          <p>These observations help with ordinary debugging: check that the current source built, that the intended result was launched, and that the executed operations match your requirements. Translation, execution, and testing each answer a different question.</p>
        </section>
      </article>
      <aside className="editorial-next">
        <h2>Put the workflow into practice</h2>
        <p>Read <a href="/learn/first-c-program">Your First C Program</a>, explore <a href="/examples">worked C examples</a>, or set up a <a href="/blog/how-to-install-c-compiler-in-vs-code">C compiler in VS Code</a>. Return to the <a href="/blog">Circuit Blog</a> for the full article list.</p>
      </aside>
    </InfoPage>
  );
}
