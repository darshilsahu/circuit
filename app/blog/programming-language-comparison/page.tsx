import { Breadcrumbs, ContentSchema } from '@/components/content-schema';
import { InfoPage } from '@/components/info-page';
import { blogPosts } from '@/lib/content/blog';
import { pageMetadata, siteUrl } from '@/lib/site';

const post = blogPosts.find(({ slug }) => slug === 'programming-language-comparison')!;
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

const cSource = [
  '#include <stdio.h>',
  '',
  'size_t count_at_least(const int values[],',
  '                      size_t length, int threshold) {',
  '    size_t count = 0;',
  '    for (size_t i = 0; i < length; i++) {',
  '        if (values[i] >= threshold) {',
  '            count++;',
  '        }',
  '    }',
  '    return count;',
  '}',
  '',
  'int main() {',
  '    int readings[] = {18, 24, 21, 27};',
  '    size_t length = sizeof readings / sizeof readings[0];',
  '    size_t warm = count_at_least(readings, length, 23);',
  '    printf("Warm readings: %zu\\n", warm);',
  '    return 0;',
  '}',
].join('\n');

const pythonSource = [
  'def count_at_least(values, threshold):',
  '    count = 0',
  '    for value in values:',
  '        if value >= threshold:',
  '            count += 1',
  '    return count',
  '',
  '',
  'readings = [18, 24, 21, 27]',
  'warm = count_at_least(readings, 23)',
  'print(f"Warm readings: {warm}")',
].join('\n');

const javascriptSource = [
  'function countAtLeast(values, threshold) {',
  '    let count = 0;',
  '    for (const value of values) {',
  '        if (value >= threshold) {',
  '            count++;',
  '        }',
  '    }',
  '    return count;',
  '}',
  '',
  'const readings = [18, 24, 21, 27];',
  'const warm = countAtLeast(readings, 23);',
  'console.log(`Warm readings: ${warm}`);',
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

export default function ProgrammingLanguageComparisonArticle() {
  const section = { title: 'Blog', path: '/blog' };
  return (
    <InfoPage title={post.title}>
      <ContentSchema title={post.title} description={post.description} path={path} section={section} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData).replace(/</g, '\\u003c') }} />
      <Breadcrumbs section={section} title={post.title} />
      <p className="content-note">By <a href="/about">Circuit</a> · Published <time dateTime={post.published}>October 11, 2026</time> · Choose around the work you want to do</p>
      <article>
        <p className="content-lead">Choosing a programming language is a decision about the work you want to finish. A script that checks a folder of reports, a browser interface, and a program for a small device have different needs. C, C++, Python, Java, JavaScript, and Rust can express many of the same algorithms, but they give you different tools, safeguards, and responsibilities.</p>
        <p>This comparison is for learners who want to understand those differences before committing to a project. It explains each language’s useful strengths, the costs that accompany them, and a small task implemented three ways. The project suggestions are editorial judgments based on these characteristics, not measured rankings, popularity scores, or promises about employment.</p>

        <nav className="content-toc" aria-label="Article sections">
          <h2>In this article</h2>
          <ol>
            <li><a href="#criteria">Decide what you are comparing</a></li>
            <li><a href="#overview">Six languages at a glance</a></li>
            <li><a href="#languages">Strengths and trade-offs of each language</a></li>
            <li><a href="#same-task">The same task in C, Python, and JavaScript</a></li>
            <li><a href="#safety">Types, memory, and errors</a></li>
            <li><a href="#performance">Compare performance fairly</a></li>
            <li><a href="#project-fit">Match a language to a real project</a></li>
            <li><a href="#learning">Choose your first language and your next one</a></li>
            <li><a href="#questions">Questions that commonly cause confusion</a></li>
          </ol>
        </nav>

        <section id="criteria">
          <h2>Start with the constraints, before the syntax</h2>
          <p>Write down the smallest useful result your project must deliver. “Build an application” is too broad; “read a CSV file, reject invalid rows, and produce a summary” lets you evaluate libraries, testing, and deployment. Ask four questions:</p>
          <ul>
            <li><strong>Where must it run?</strong> A browser, a server, your laptop, and a microcontroller offer different interfaces. A language’s ability to express an algorithm does not give every environment the same capabilities.</li>
            <li><strong>What must it connect to?</strong> Existing source code, a hardware SDK, a database driver, or a specialist library can make the choice much clearer than a general language comparison.</li>
            <li><strong>Which costs matter?</strong> Development time, memory use, response latency, build complexity, and maintenance all count. Decide which constraint is real rather than assuming execution speed is always the priority.</li>
            <li><strong>Who will maintain it?</strong> A language the team can debug and review may be a better fit than an unfamiliar one with attractive benchmark results.</li>
          </ul>
          <p>These questions also help with learning. If a course requires C, use C for its exercises. If your goal is a website with interactive controls, learn the browser’s programming model. You can explore another language later without discarding the concepts you already understand.</p>
        </section>

        <section id="overview">
          <h2>Six programming languages at a glance</h2>
          <p>This table summarizes common workflows. A language, its implementation, its libraries, and its host environment are separate layers; the entries are not statements that only one implementation is possible.</p>
          <div className="content-table" tabIndex={0} role="region" aria-label="Programming language comparison overview">
            <table>
              <caption>Types, execution, and memory in common implementations</caption>
              <thead><tr><th scope="col" style={{ minWidth: 100 }}>Language</th><th scope="col">Typical model and responsibility</th></tr></thead>
              <tbody>
                <tr><th scope="row">C</th><td>Static types; usually compiled for a selected target. Object lifetime, pointer validity, and array bounds need explicit care.</td></tr>
                <tr><th scope="row">C++</th><td>Static types; usually compiled for a selected target. Containers, destructors, and ownership objects help manage resources.</td></tr>
                <tr><th scope="row">Python</th><td>Dynamic types; runs through a Python implementation. Ordinary object storage is managed by the runtime.</td></tr>
                <tr><th scope="row">Java</th><td>Static types; commonly compiled to JVM bytecode. The runtime provides managed memory with garbage collection.</td></tr>
                <tr><th scope="row">JavaScript</th><td>Dynamic types; executes in a browser or another host such as Node.js. Engines manage object storage and may optimize running code.</td></tr>
                <tr><th scope="row">Rust</th><td>Static types; usually compiled for a selected target. Ownership and borrowing enforce memory rules in safe code.</td></tr>
              </tbody>
            </table>
          </div>
          <p>Static typing does not require writing every type by hand: C++, Java, and Rust have forms of type inference. Dynamic typing does not mean values lack types. It changes when and how many type-related checks happen. Neither model removes the need to validate external data or test your calculations.</p>
        </section>

        <section id="languages">
          <h2>What each language makes easier—and what you must learn</h2>
          <h3>C: make data and operations explicit</h3>
          <p>C is a useful fit for work involving existing C interfaces, device toolchains, or close control over data representation. Its functions, arrays, and structures let you build a program without adopting a large object framework. Learning C makes indexes, addresses, storage lifetime, and the build process difficult to overlook.</p>
          <p>The responsibility is substantial. Standard C does not guarantee automatic array bounds checks, and invalid pointer use can lead to undefined behavior. Local objects often have automatic lifetimes; dynamically allocated storage needs an ownership plan. A program can compile and still be wrong. Our <a href="/blog/what-is-c-language">introduction to C</a> explains its design, while the <a href="https://gcc.gnu.org/onlinedocs/gcc/Standards.html">GCC standards documentation</a> illustrates why language modes and compiler extensions matter.</p>

          <h3>C++: combine native control with richer abstractions</h3>
          <p>C++ adds facilities such as classes, templates, and standard containers to a language designed for demanding native software. A vector can represent a changing collection, and a reusable generic function can operate on several types. <a href="https://www.stroustrup.com/C++.html">Bjarne Stroustrup’s overview</a> explains the emphasis on abstraction and systems programming.</p>
          <p>Modern resource management is more than manually pairing every allocation with a release. RAII ties cleanup to an object’s lifetime; containers and smart pointers can own resources. The <a href="https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rr-raii">C++ Core Guidelines</a> recommend this approach. Raw pointers and invalid accesses can still cause serious defects. The learning cost includes language features, library conventions, and build tooling; importing C habits alone is not a complete C++ education.</p>

          <h3>Python: express a useful workflow quickly</h3>
          <p>Python’s lists, dictionaries, and straightforward iteration suit scripts, data preparation, and small tools that combine existing libraries. Its <a href="https://docs.python.org/3/tutorial/">official tutorial</a> introduces dynamic typing and the standard library. A learner can focus early on the shape of a calculation without first choosing an integer width or managing an allocation.</p>
          <p>That convenience moves some checks to execution time. A function may work with your first input and fail on a different type. Python’s <a href="https://docs.python.org/3/library/typing.html">type annotations</a> support analysis tools but are not automatically enforced by the runtime. Packaging, environment isolation, and deployment still require work. If most of a task is a large loop executing Python-level operations, measure it; a suitable native-backed library may offer a different implementation strategy.</p>

          <h3>Java: work within a managed application platform</h3>
          <p>Java combines static types with a runtime and libraries for building structured applications. Its common workflow compiles source into class files containing bytecode, which a compatible Java Virtual Machine executes. The <a href="https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-1.html#jvms-1.2">JVM specification</a> makes clear that the virtual machine is not inherently limited to interpretation.</p>
          <p>This model is useful when a project already relies on JVM libraries, build conventions, and deployment infrastructure. Managed object memory reduces the need for manual deallocation, but files, connections, and other resources still need deliberate lifetimes. Runtime versions, startup behavior, and memory requirements belong in the deployment decision. Learning Java also means understanding interfaces, collections, exceptions, and the surrounding tooling—not only copying class syntax.</p>

          <h3>JavaScript: program the browser and its events</h3>
          <p>For a page that responds to typing, updates a view, or handles a button click, JavaScript connects directly to browser APIs. Other hosts, including Node.js, provide different interfaces. <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction">MDN’s introduction</a> distinguishes the core language from those host capabilities.</p>
          <p>Dynamic types, conversion rules, asynchronous work, and event ordering require attention. Memory management is automatic in ordinary code, but a retained reference can still keep an unwanted object alive; see <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management">MDN’s memory guide</a>. A browser script cannot assume Node’s filesystem APIs are available. TypeScript can add static checking to a JavaScript workflow, but its <a href="https://www.typescriptlang.org/docs/handbook/2/basic-types.html">type annotations are erased</a> during translation and do not replace runtime input validation.</p>

          <h3>Rust: check ownership before execution</h3>
          <p>Rust is a candidate for systems and native tools where control over resources and strong memory-safety checks are important. Its <a href="https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html">ownership system</a> tracks how values are owned, moved, and borrowed. Safe code must satisfy those rules before it compiles, without requiring a tracing garbage collector for ordinary ownership-based cleanup.</p>
          <p>The trade-off is learning to express relationships that the compiler can verify. An early borrowing error can feel restrictive, but it asks a useful question: who may access this value, and for how long? <a href="https://doc.rust-lang.org/book/ch20-01-unsafe-rust.html">Unsafe operations</a>, foreign interfaces, and library implementations can carry additional obligations. Memory safety also does not prove that a formula is correct, that a program will terminate, or that a business rule has been implemented properly.</p>
        </section>

        <section id="same-task">
          <h2>Compare one task in C, Python, and JavaScript</h2>
          <p>Suppose four temperature readings are 18, 24, 21, and 27. Count how many are at least 23. Two readings qualify: 24 and 27. This small, fixed task lets you compare representations and iteration without mixing in user input, file formats, or dependencies.</p>
          <h3>C: an array, an explicit length, and a typed function</h3>
          <pre tabIndex={0} aria-label="C temperature threshold example"><code>{cSource}</code></pre>
          <p>The function receives access to the array and a length; it cannot recover the caller’s array size from that parameter. sizeof works here in main because readings is still an actual array there. size_t represents the count, and %zu prints it. The caller must supply a valid array range. Run this version in the <a href="/">Circuit online C compiler</a>; the <a href="/learn/arrays-in-c">array guide</a> explains the array-versus-pointer distinction.</p>
          <h3>Python: iterate over the values in a list</h3>
          <pre tabIndex={0} aria-label="Python temperature threshold example"><code>{pythonSource}</code></pre>
          <p>The list carries its length, and the loop supplies each element directly. Indentation groups the statements instead of braces. Save this as threshold.py and run it with an installed Python 3 interpreter. The function assumes comparable numeric values; accepting arbitrary input would require validation.</p>
          <h3>JavaScript: iterate over an array in its host environment</h3>
          <pre tabIndex={0} aria-label="JavaScript temperature threshold example"><code>{javascriptSource}</code></pre>
          <p>for...of supplies values, while let allows the counter to change. const prevents rebinding the readings variable; it does not make the array’s contents immutable. Save the snippet as threshold.js and run it with Node.js, or use a browser developer console. Circuit’s editor runs C, so the Python and JavaScript examples belong in their own environments.</p>
          <p>All three versions print the same line:</p>
          <pre tabIndex={0} aria-label="Expected threshold example output"><code>{'Warm readings: 2'}</code></pre>
          <p>Each makes one pass through the readings and keeps one counter. For n readings, that is O(n) work and O(1) additional counting space, excluding the input collection. The notation describes how work grows; it does not claim the implementations have identical running times or memory representations.</p>
          <h3>Use boundary cases to check the meaning</h3>
          <ul>
            <li>Replace the readings with 23, 22, 23, and 0. The result should remain 2: the exact threshold is included.</li>
            <li>Use 1, 2, 3, and 4. The result should be 0.</li>
            <li>Use 23, 24, 25, and 26. The result should be 4.</li>
          </ul>
          <p>Changing the comparison from greater-than-or-equal to strictly greater would break the first test. That mistake is possible in every language here. A shared expected result is a better learning tool than deciding that the shortest snippet must be the best one.</p>
        </section>

        <section id="safety">
          <h2>Types and memory change where errors become visible</h2>
          <p>Static checking can reject some incompatible operations before a program runs. Dynamic checking can report a type error when the affected operation executes. Both leave room for logical defects: passing the wrong threshold, comparing the wrong field, or returning a count before the loop has finished.</p>
          <p>Type inference and dynamic typing are different. A compiler can infer a fixed type from an initializer without allowing that variable to become an unrelated type later. Similarly, adding annotations to Python or adopting TypeScript changes the analysis workflow without making untrusted incoming data valid automatically.</p>
          <p>Memory management is another independent dimension. In C, an array index and a pointer need valid bounds and lifetime. C++ ownership objects can automate cleanup. Rust checks borrowing relationships in safe code. Java, Python, and JavaScript runtimes manage ordinary object storage, though their mechanisms differ. Keeping references indefinitely can retain memory in a managed language, too.</p>
          <p>Resource cleanup goes beyond reclaiming object memory. A database connection or an open file may need prompt release even if its wrapper object will eventually be collected. Ask how each resource is acquired, who owns it, and what happens on an error path. This question transfers well between languages and is more useful than treating “automatic memory” as “no cleanup responsibilities.”</p>
        </section>

        <section id="performance">
          <h2>Performance needs a workload, not a universal ranking</h2>
          <p>A short printing program mostly tells you about startup and output overhead. It does not establish which language is fastest for processing a large dataset, serving requests, or running on a constrained device. C, C++, and Rust give you ways to control representation and allocation; managed implementations can also optimize execution.</p>
          <p>For a useful comparison, fix the input, expected result, machine, and implementation versions. Record whether you are timing startup, steady execution, or the whole task. Include memory use when that matters. Account for compiler optimization, runtime warm-up where applicable, and whether one solution delegates its work to an optimized library.</p>
          <p>Also inspect the algorithm. Replacing a repeated full search with an appropriate lookup structure may matter more than translating the same inefficient approach into another language. A Python program calling a native numerical library is a different workload from a Python loop doing every arithmetic operation itself.</p>
          <p>For a learner’s small exercise, correctness and an explainable design usually deserve attention first. Measure when the project has a real performance requirement. This article intentionally provides no invented speed ratios or benchmark scores.</p>
        </section>

        <section id="project-fit">
          <h2>Match the language to the project you can describe</h2>
          <p>These are starting points for a decision, not exclusive territories. Check the actual libraries, target platform, and team experience before committing.</p>
          <div className="content-table" tabIndex={0} role="region" aria-label="Programming language project decision guide">
            <table>
              <caption>Project constraints and a sensible first investigation</caption>
              <thead><tr><th scope="col">Your goal</th><th scope="col">What to investigate first</th></tr></thead>
              <tbody>
                <tr><th scope="row">Interactive browser page</th><td>JavaScript and browser APIs; consider TypeScript when static checking helps the project.</td></tr>
                <tr><th scope="row">Local reporting or automation</th><td>Python’s relevant libraries, environment setup, and distribution to the people who will use the tool.</td></tr>
                <tr><th scope="row">Existing JVM application</th><td>Java’s compatibility with the project’s dependencies, runtime, tests, and build conventions.</td></tr>
                <tr><th scope="row">Device firmware or a C interface</th><td>The supported C toolchain, hardware SDK, available memory, and platform documentation.</td></tr>
                <tr><th scope="row">Native project with C++ libraries</th><td>C++ library support, resource ownership, platform builds, and the project’s chosen language standard.</td></tr>
                <tr><th scope="row">New native utility with ownership checks</th><td>Rust’s target support, dependencies, foreign interfaces, and the time available to learn its model.</td></tr>
              </tbody>
            </table>
          </div>
          <h3>Distinguish learning costs from operating costs</h3>
          <p>A language that feels quick during a tutorial can still need packaging and maintenance work. A native executable needs compatible platform builds; a runtime-based application needs a suitable runtime or a packaging strategy. Every approach needs tests, dependency updates, and a reproducible way to build or launch the result.</p>
          <p>Before choosing, make a tiny prototype that touches the hardest integration: open the required device interface, parse one real file, or call the intended database driver. Confirm how another person will run it. This gives you evidence about the project instead of relying on a feature list alone.</p>
          <h3>Several languages can share one application</h3>
          <p>A browser interface might use JavaScript, while a service or a native library uses another language. Mixing languages can reuse existing work, but the boundary has a cost: serialization, error propagation, ownership rules, and deployment must agree. Start with a clear boundary and a reason for introducing it rather than adding languages simply to demonstrate variety.</p>
        </section>

        <section id="learning">
          <h2>Choose a first language around a small achievable goal</h2>
          <p>If you want to understand arrays, pointers, and the compilation process, C provides a direct setting for those topics. Start with <a href="/learn/first-c-program">one complete C program</a>, then practise functions and arrays before introducing dynamic allocation. Circuit lets you begin without a desktop installation, while its <a href="/docs#environment">documented browser environment</a> defines which programs it supports.</p>
          <p>If your first goal is a useful script, Python can be a practical starting point. If it is a browser interface, JavaScript connects the exercise to the page. A course, an existing project, or a team may supply a stronger reason to begin with Java, C++, or Rust. None of these paths requires learning all six languages simultaneously.</p>
          <ol>
            <li><strong>Finish one small program.</strong> Predict the result and handle at least one error or boundary case.</li>
            <li><strong>Explain its data.</strong> Know which values are stored, how they are grouped, and how long they are needed.</li>
            <li><strong>Separate calculation from input and output.</strong> A small function is easier to test in another environment.</li>
            <li><strong>Translate it once you understand it.</strong> Compare what the new language makes explicit, what it automates, and which assumptions changed.</li>
          </ol>
          <p>Our <a href="/examples">C example library</a> and <a href="/learn">Learn guides</a> provide focused exercises. For the next language, use its official documentation and an environment designed for it. Learning transfers through concepts and testing habits, not through pretending every language follows C’s rules.</p>
        </section>

        <section id="questions">
          <h2>Questions that commonly cause confusion</h2>
          <h3>Is C++ simply a newer version of C?</h3>
          <p>No. They have related syntax and history, but are distinct languages with different rules and facilities. Use the correct compiler mode and learn the language you intend to write. Changing a filename does not establish source compatibility.</p>
          <h3>Are Java and JavaScript closely interchangeable?</h3>
          <p>No. Their names are similar, but their type systems, object models, common runtimes, and ecosystems differ. A Java library does not automatically become a browser JavaScript library. Choose according to the interface and environment your project needs.</p>
          <h3>Does “compiled” always mean faster?</h3>
          <p>No. Translation and execution are stages, and implementations can combine bytecode, interpretation, and native compilation. Read the <a href="/blog/compiler-vs-interpreter">compiler and interpreter guide</a> to separate those mechanisms from language labels. Then measure a representative task.</p>
          <h3>Will a safer language remove every bug?</h3>
          <p>No. Memory and type safeguards address particular categories of errors. They do not choose the correct algorithm, authorize access to data, or establish that your result matches a user’s needs. Keep expected outputs and boundary tests in every language.</p>
          <h3>Can Circuit run the other languages in this comparison?</h3>
          <p>Circuit currently compiles and runs C. Its Clang toolchain targets WebAssembly and executes through a WASI runtime in a worker; that does not make the editor a Python, JavaScript, Java, C++, or Rust runner. Use the C example here, and move the other examples to their stated environments.</p>
          <p>A useful language choice is one you can explain: it fits the target, has the interfaces you need, and lets you build a result you can test and maintain. Begin with that result, keep the first version small, and let evidence from the project guide your next step.</p>
        </section>
      </article>
      <aside className="editorial-next" aria-label="Related reading">
        <h2>Put the comparison into practice</h2>
        <p>Try the threshold example, explore <a href="/learn/functions-in-c">functions in C</a>, or follow the <a href="/blog/compilation-process-in-c">compilation process walkthrough</a> to understand what happens between source and execution.</p>
        <p><a className="content-button" href="/">Run the C example in Circuit</a> <a href="/blog">More Circuit articles →</a></p>
      </aside>
    </InfoPage>
  );
}
