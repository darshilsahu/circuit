import { Breadcrumbs, ContentSchema } from '@/components/content-schema';
import { InfoPage } from '@/components/info-page';
import { blogPosts } from '@/lib/content/blog';
import { pageMetadata, siteUrl } from '@/lib/site';

const post = blogPosts.find(({ slug }) => slug === 'how-to-debug-c-programs')!;
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

const brokenSource = [
  '#include <stdio.h>',
  '',
  'int average_positive(const int values[],',
  '                     size_t count, double *result) {',
  '    long total = 0;',
  '    size_t positive_count = 0;',
  '',
  '    for (size_t i = 0; i < count; i++) {',
  '        if (values[i] > 0) {',
  '            total += values[i];',
  '            positive_count++;',
  '        }',
  '    }',
  '',
  '    if (positive_count == 0) {',
  '        return 0;',
  '    }',
  '',
  '    *result = total / count;',
  '    return 1;',
  '}',
  '',
  'int main() {',
  '    int values[] = {4, -2, 0, 7};',
  '    size_t count = sizeof values / sizeof values[0];',
  '    double average = 0.0;',
  '',
  '    if (average_positive(values, count, &average)) {',
  '        printf("Average: %.2f\\n", average);',
  '    } else {',
  '        puts("No positive values.");',
  '    }',
  '    return 0;',
  '}',
].join('\n');

const traceStatement = [
  'fprintf(stderr, "total=%ld selected=%zu all=%zu\\n",',
  '        total, positive_count, count);',
].join('\n');

const correctedSource = brokenSource.replace(
  '*result = total / count;',
  '*result = (double) total / positive_count;',
);
const calculationLine = brokenSource.split('\n').findIndex((line) => line.includes('*result =')) + 1;
const debuggerCommands = [
  'break average.c:' + calculationLine,
  'run',
  'print total',
  'print positive_count',
  'print count',
  'print total / positive_count',
  'print (double) total / positive_count',
].join('\n');

const regressionMain = [
  '#include <math.h>',
  '',
  'int main() {',
  '    const struct {',
  '        const char *name;',
  '        int values[4];',
  '        size_t count;',
  '        int expected_ok;',
  '        double expected;',
  '    } tests[] = {',
  '        {"mixed", {4, -2, 0, 7}, 4, 1, 5.5},',
  '        {"single", {9}, 1, 1, 9.0},',
  '        {"fraction", {2, 3}, 2, 1, 2.5},',
  '        {"zero excluded", {0, 8}, 2, 1, 8.0},',
  '        {"negative excluded", {-3, 6}, 2, 1, 6.0},',
  '        {"no positives", {-3, 0, -2}, 3, 0, 0.0},',
  '        {"empty", {0}, 0, 0, 0.0}',
  '    };',
  '    size_t test_count = sizeof tests / sizeof tests[0];',
  '',
  '    for (size_t i = 0; i < test_count; i++) {',
  '        double answer = -1.0;',
  '        const int *data = tests[i].count ? tests[i].values : NULL;',
  '        int ok = average_positive(data, tests[i].count, &answer);',
  '',
  '        if (ok != tests[i].expected_ok ||',
  '            (ok && !(fabs(answer - tests[i].expected) <= 1e-9)) ||',
  '            (!ok && answer != -1.0)) {',
  '            fprintf(stderr, "FAIL: %s\\n", tests[i].name);',
  '            return 1;',
  '        }',
  '    }',
  '',
  '    printf("All %zu regression tests passed.\\n", test_count);',
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

export default function DebuggingCArticle() {
  const section = { title: 'Blog', path: '/blog' };
  return (
    <InfoPage title={post.title}>
      <ContentSchema title={post.title} description={post.description} path={path} section={section} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData).replace(/</g, '\\u003c') }} />
      <Breadcrumbs section={section} title={post.title} />
      <p className="content-note">By <a href="/about">Circuit</a> · Published <time dateTime={post.published}>October 16, 2026</time> · Follow the evidence from a wrong answer to a tested fix</p>
      <article>
        <p className="content-lead">A C program prints the wrong average. You change a comparison, add a cast, and move a statement, but the next result is still wrong. The problem is no longer just the original bug: several changes have made it difficult to tell which explanation was correct.</p>
        <p>Debugging works better as a sequence of small experiments. Preserve the failure, calculate the result you expect, observe the program’s state, and test one explanation at a time. This guide follows a complete example with two independent mistakes, then explains how warnings, regression tests, debuggers, and sanitizers help with different kinds of failure.</p>

        <nav className="content-toc" aria-label="Article sections">
          <h2>In this article</h2>
          <ol>
            <li><a href="#classify">Identify what kind of failure you have</a></li>
            <li><a href="#reproduce">Keep a small program that reproduces it</a></li>
            <li><a href="#warnings">Read warnings without expecting them to prove correctness</a></li>
            <li><a href="#observe">Trace the state that matters</a></li>
            <li><a href="#hypotheses">Test two separate explanations</a></li>
            <li><a href="#corrected">Run the corrected program</a></li>
            <li><a href="#regression">Turn the failure into regression tests</a></li>
            <li><a href="#debugger">Inspect the calculation with a desktop debugger</a></li>
            <li><a href="#sanitizers">Know when memory tools can help</a></li>
            <li><a href="#habits">Build a repeatable debugging workflow</a></li>
          </ol>
        </nav>

        <section id="classify">
          <h2>First identify the stage that failed</h2>
          <p>“My code does not work” leaves too many possibilities open. Record what you actually observe. A compiler diagnostic, an unresolved function, a process that stops unexpectedly, and a successful run with an incorrect answer call for different investigations.</p>
          <div className="content-table" tabIndex={0} role="region" aria-label="C failure classification">
            <table>
              <caption>Use the symptom to choose your first question</caption>
              <thead><tr><th scope="col">Symptom</th><th scope="col">What to inspect first</th></tr></thead>
              <tbody>
                <tr><th scope="row">Compilation fails</th><td>The first diagnostic, its reported line, and the preceding source line.</td></tr>
                <tr><th scope="row">Linking fails</th><td>Function definitions, linked source files, and required libraries.</td></tr>
                <tr><th scope="row">Execution fails or stalls</th><td>Input waits, loop progress, bounds, pointer lifetime, and the runtime message.</td></tr>
                <tr><th scope="row">Output is incorrect</th><td>The requirement, the input, intermediate values, and the calculation’s types.</td></tr>
              </tbody>
            </table>
          </div>
          <p>Fix the earliest meaningful build error before chasing every later message; one missing token can confuse the parser about the rest of a function. For a runtime problem, preserve the exact input and exit message. If a program appears stuck, distinguish waiting for input from repeatedly executing a loop.</p>
          <p>Our example belongs to the last row. It builds and exits normally. Its result is wrong, so an exit status of 0 cannot settle whether the program meets its requirement. The <a href="/learn/common-compiler-errors">compiler error guide</a> covers translation diagnostics in more detail.</p>
        </section>

        <section id="reproduce">
          <h2>Make the expected result explicit before editing</h2>
          <p>The task is to calculate the average of the <strong>strictly positive</strong> values in a list. Negative numbers and zero are excluded from both the sum and the divisor. If no positive values exist, report that no average is available.</p>
          <p>For 4, −2, 0, and 7, only 4 and 7 qualify. Their sum is 11, their count is 2, and the expected average is 5.5. Printing two decimal places should produce <code>Average: 5.50</code>. The following deliberately incorrect program prints <code>Average: 2.00</code> instead:</p>
          <pre tabIndex={0} aria-label="Deliberately incorrect C average program"><code>{brokenSource}</code></pre>
          <p>Use fixed data at first. It removes input conversion from the experiment, so every run receives the same values. You can run this example in the <a href="/">Circuit online C compiler</a>; keep a named copy before editing so the original failure remains reproducible.</p>
          <h3>State the function’s boundaries</h3>
          <p>For this exercise, the caller supplies at most 1,000 values, each between −1,000 and 1,000. A nonzero count requires a valid array range, and <code>result</code> must point to a writable <code>double</code>. The <code>long</code> sum can hold the largest permitted positive total, 1,000,000. The function returns 1 and writes the answer on success; it returns 0 without changing the output when there are no positive values.</p>
          <p>These are preconditions, not input checks hidden inside the example. An application accepting arbitrary text must validate it separately. Increasing the permitted range would also require reconsidering overflow. A small stated contract gives this debugging exercise a result you can reason about.</p>
        </section>

        <section id="warnings">
          <h2>Warnings are evidence, not a correctness certificate</h2>
          <p>Read every warning before investigating a wrong result. Format mismatches, suspicious conversions, and uninitialized values can point to real defects. Do not silence a warning with a cast until you understand what values and types are involved.</p>
          <p>For a desktop GCC setup, save the first program as <code>average.c</code> and build with:</p>
          <pre tabIndex={0} aria-label="Desktop GCC debug build command"><code>{'gcc -std=c17 -Wall -Wextra -Wpedantic -g -O0 average.c -o average'}</code></pre>
          <p>The <a href="https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html">GCC warning documentation</a> explains the warning groups. <code>-Wall</code> does not enable every possible warning. Here, <code>-g</code> provides debug information and <code>-O0</code> keeps this learning build unoptimized. Exact diagnostics depend on the compiler and flags; the program can still compile without reporting either logic mistake.</p>
          <p>This is a desktop command, not a command to type into Circuit’s program terminal. On a Unix-like desktop, run <code>./average</code>; in PowerShell, use <code>.\average.exe</code> when the toolchain creates that executable. The <a href="/blog/how-to-install-c-compiler-in-vs-code">desktop setup guide</a> explains how to verify a compiler independently of the editor.</p>
        </section>

        <section id="observe">
          <h2>Observe the values immediately before the wrong calculation</h2>
          <p>The loop has one job: collect the sum and count of qualifying values. Trace those two facts before assuming the loop is broken. After each element of the sample, the intended state is:</p>
          <div className="content-table" tabIndex={0} role="region" aria-label="Positive average trace table">
            <table>
              <caption>State after each element has been processed</caption>
              <thead><tr><th scope="col">Value</th><th scope="col">Total</th><th scope="col">Positive count</th></tr></thead>
              <tbody>
                <tr><th scope="row">4</th><td>4</td><td>1</td></tr>
                <tr><th scope="row">−2</th><td>4</td><td>1</td></tr>
                <tr><th scope="row">0</th><td>4</td><td>1</td></tr>
                <tr><th scope="row">7</th><td>11</td><td>2</td></tr>
              </tbody>
            </table>
          </div>
          <p>Temporarily insert this statement just before the assignment to <code>*result</code>, after the no-positive-values check:</p>
          <pre tabIndex={0} aria-label="Temporary diagnostic output"><code>{traceStatement}</code></pre>
          <p>For the sample it reports:</p>
          <pre tabIndex={0} aria-label="Expected diagnostic output"><code>{'total=11 selected=2 all=4'}</code></pre>
          <p>The sum and selected count agree with the manual calculation. That narrows the investigation to how the result is formed. The labels are useful: three unlabeled numbers are easier to misread. <code>%ld</code> matches the <code>long</code> total, while <code>%zu</code> matches each <code>size_t</code> count.</p>
          <p>Diagnostic messages use <code>stderr</code>, leaving ordinary output on <code>stdout</code>. Both are available in Circuit’s terminal, but do not depend on a particular interleaving of the two streams. If the program handles many entries, trace a small failing input instead of flooding the terminal with output.</p>
        </section>

        <section id="hypotheses">
          <h2>Test one explanation at a time—and look for a second defect</h2>
          <p>The expression <code>total / count</code> divides by all four entries even though only two contributed to the numerator. The first hypothesis is that the divisor should be <code>positive_count</code>. Try that change alone:</p>
          <pre tabIndex={0} aria-label="Incomplete denominator-only fix"><code>{'*result = total / positive_count;'}</code></pre>
          <p>The sample now prints <code>Average: 5.00</code>. The divisor is correct, but the answer is still not 5.50. Both operands are integer types, so the division discards the fractional part before its value is assigned to the <code>double</code> output. A floating-point destination does not retroactively change the operation.</p>
          <p>Convert an operand before dividing:</p>
          <pre tabIndex={0} aria-label="Correct positive average assignment"><code>{'*result = (double) total / positive_count;'}</code></pre>
          <p>This computes 11.0 divided by 2 and produces 5.5. Casting the result afterward, as in <code>(double) (total / positive_count)</code>, would preserve the already truncated value 5.0. Likewise, adding a cast while keeping the original divisor would produce 2.75, which is a more precise answer to the wrong question.</p>
          <div className="content-table" tabIndex={0} role="region" aria-label="Average debugging hypothesis results">
            <table>
              <caption>Predictions for the same four-element sample</caption>
              <thead><tr><th scope="col">Version</th><th scope="col">Printed average</th></tr></thead>
              <tbody>
                <tr><th scope="row">Original calculation</th><td>2.00</td></tr>
                <tr><th scope="row">Change only the divisor</th><td>5.00</td></tr>
                <tr><th scope="row">Convert first, but keep the wrong divisor</th><td>2.75</td></tr>
                <tr><th scope="row">Correct divisor and floating-point division</th><td>5.50</td></tr>
              </tbody>
            </table>
          </div>
          <p>Keep the input fixed while comparing these versions. Changing the data and calculation simultaneously can make an incorrect version appear successful. The improvement from 2.00 to 5.00 is useful evidence, but “closer” is not the same as meeting the requirement.</p>
        </section>

        <section id="corrected">
          <h2>The complete corrected program</h2>
          <p>The only necessary calculation change is the assignment to <code>*result</code>. This clean version removes the temporary diagnostic and keeps the guard against dividing when no positive values exist:</p>
          <pre tabIndex={0} aria-label="Corrected C positive average program"><code>{correctedSource}</code></pre>
          <pre tabIndex={0} aria-label="Expected corrected average output"><code>{'Average: 5.50'}</code></pre>
          <p>The status return and output parameter describe different things. The return value tells the caller whether an average exists; the pointed-to object receives the average only when it does. Read that object as an answer only after a successful return. This is a useful place to review <a href="/learn/functions-in-c">functions</a> and <a href="/learn/pointers-for-beginners">pointer parameters</a>.</p>
        </section>

        <section id="regression">
          <h2>Keep the failure as a regression test</h2>
          <p>A regression test protects behavior you have already corrected. The mixed input must remain in the test set, but it is not enough by itself. All-positive values with a fractional average isolate integer division. Zero and negative entries challenge the selection rule. Empty input checks the no-result path.</p>
          <p>Keep <code>average_positive</code> from the corrected program and replace its <code>main</code> with the following test driver. The additional header supplies <code>fabs</code>. The driver calls the real function, reports a failing case by name, and returns a nonzero status if a check fails.</p>
          <pre tabIndex={0} aria-label="C average regression test driver"><code>{regressionMain}</code></pre>
          <p>With the corrected function, it prints <code>All 7 regression tests passed.</code> With the original calculation, it reports <code>FAIL: mixed</code> and exits with code 1. The empty case passes a null data pointer with count 0; the function performs no element access and leaves the output unchanged. A null pointer with a nonzero count is outside the contract.</p>
          <p>The small examples use an absolute tolerance of <code>1e-9</code> when comparing computed averages. A tolerance should match the scale and accuracy needs of the problem, not be copied as a universal constant. The check also refuses a non-finite NaN result rather than accidentally treating it as close enough.</p>
          <p>On a Unix-like desktop, one build command for this test version is <code>gcc -std=c17 -Wall -Wextra average.c -lm -o average-tests</code>. The <code>-lm</code> option links the math library on systems that require it. Circuit supplies its supported math facilities through the browser toolchain. You can also test properties: adding a zero must not change a positive-only average, and reordering valid input must not change the answer.</p>
        </section>

        <section id="debugger">
          <h2>Use a debugger when inspecting state is easier than adding prints</h2>
          <p>A debugger lets you stop before a statement and inspect its inputs. For a desktop with GCC and GDB installed, build the original example with the earlier <code>-g -O0</code> command, then start <code>gdb ./average</code>. Enter these commands inside GDB:</p>
          <pre tabIndex={0} aria-label="GDB commands for the average example"><code>{debuggerCommands}</code></pre>
          <p>The breakpoint targets the assignment line in the exact first program above. If you edited the file or added trace statements, use the assignment’s current line number instead. GDB stops before that statement executes, so the loop has already established the values you want to inspect.</p>
          <p>Expect the sum 11, positive count 2, and full count 4. Comparing the two division expressions exposes truncation without changing the source. The official manuals explain <a href="https://sourceware.org/gdb/current/onlinedocs/gdb.html/Set-Breaks.html">setting breakpoints</a> and <a href="https://sourceware.org/gdb/current/onlinedocs/gdb.html/Data.html">examining data</a>. An IDE debugger can offer the same investigation through its breakpoint and variable panels.</p>
          <p>These are desktop tools. Circuit’s current workspace provides compilation, interactive execution, diagnostics, and output; it does not expose a GDB session or a variable-inspection debugger. Download the source when you need that workflow rather than typing debugger commands into a C program’s stdin.</p>
        </section>

        <section id="sanitizers">
          <h2>Use memory tools for memory defects, not as a substitute for requirements</h2>
          <p>An incorrect average is different from accessing a freed object or an array element outside its bounds. <a href="https://clang.llvm.org/docs/AddressSanitizer.html">AddressSanitizer</a> can detect categories of invalid memory access. <a href="https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html">UndefinedBehaviorSanitizer</a> checks selected undefined operations, including signed integer overflow. They instrument supported builds and report problems encountered during execution.</p>
          <p>For a supported desktop Clang installation with the required runtime libraries, a separate diagnostic build can use:</p>
          <pre tabIndex={0} aria-label="Desktop Clang sanitizer build command"><code>{'clang -std=c17 -g -O1 -fno-omit-frame-pointer \\\n  -fsanitize=address,undefined average.c -o average-sanitized'}</code></pre>
          <p>The backslash is a Unix-shell line continuation; use one line in PowerShell. Tool availability depends on the platform and installed runtimes. This is not a promise that Circuit’s WebAssembly target supports those flags or native sanitizer libraries.</p>
          <p>Neither sanitizer should be expected to diagnose the original average calculation for our valid sample. Integer division by a nonzero divisor is defined, and dividing by the wrong count does not inherently violate memory rules. The missing ingredient is knowledge of the intended result, which belongs in your specification and tests.</p>
          <p>A clean instrumented run covers the paths you actually exercised. It does not prove the entire program correct. Likewise, C undefined behavior does not have to crash, and some invalid accesses can stay within a WebAssembly memory region. Read the <a href="/learn/segmentation-fault">memory-failure guide</a> when the symptom suggests bounds or pointer lifetime.</p>
        </section>

        <section id="other-failures">
          <h2>Apply the same method to other common C problems</h2>
          <h3>An array loop reads one extra element</h3>
          <p>If a loop uses <code>i &lt;= count</code>, the final index equals the number of elements. That is beyond the last valid index for an array of that length. Inspect the bound before running it; change the condition to match the intended range, then test zero, one, and several elements. Do not use a predictable-looking value from an invalid access as your expected answer.</p>
          <h3>An input-driven program uses a value that was not read</h3>
          <p>Check the conversion count returned by <code>scanf</code> before using a destination variable. For one <code>%d</code> conversion, require a return of 1. If a letter is entered instead, a program that ignores the return value may use an uninitialized or stale value. The <a href="/learn/printf-and-scanf">input guide</a> explains conversion failures and leftover input; validating an integer’s representable range is a separate parsing concern.</p>
          <h3>A program runs without finishing</h3>
          <p>Ask whether it is waiting for stdin or repeating work. For a loop, inspect how the condition can become false and whether the relevant variable actually changes. In Circuit, Stop ends a run you no longer need. Consult the <a href="/docs#environment">documented execution limits</a> rather than interpreting every timeout as proof of the same bug.</p>
        </section>

        <section id="habits">
          <h2>Keep a short investigation record</h2>
          <p>Before the next edit, write down four things: the exact input, expected behavior, observed behavior, and one explanation you can test. For our example, the record starts with “mixed values should average 5.5, but print 2.00.” It then separates the wrong divisor from integer truncation instead of grouping both under “the math looks wrong.”</p>
          <ol>
            <li>Preserve a failing source version and its input.</li>
            <li>Reduce unrelated input, functions, and formatting while keeping the failure.</li>
            <li>Inspect the first state that disagrees with the requirement.</li>
            <li>Predict what one proposed change should do.</li>
            <li>Make that change, rebuild, and compare the actual result.</li>
            <li>Add the failing case to tests and rerun related cases.</li>
            <li>Remove temporary traces and rerun the clean version.</li>
          </ol>
          <p>Reduction is an experiment too. Removing the negative and zero entries from our sample would remove evidence of the wrong divisor, leaving only the truncation defect. A smaller program is useful only if it still demonstrates the behavior under investigation.</p>
          <p>When asking for help, share a small non-sensitive program, the input, expected and actual output, compiler or browser details, and relevant diagnostics as text. Describe changes already tested. This lets another person reproduce the problem instead of guessing from a screenshot.</p>
          <p>The goal is to finish with an explanation and a check that can fail again if the defect returns. A corrected line is more valuable when you know why it is correct and which test protects it.</p>
        </section>
      </article>
      <aside className="editorial-next" aria-label="Related reading">
        <h2>Practise with a program small enough to explain</h2>
        <p>Try the average example, then use the <a href="/examples">C example library</a> for another investigation. The <a href="/blog/how-to-build-programming-logic">programming logic guide</a> develops the reasoning before implementation, while the <a href="/blog/compilation-process-in-c">compilation walkthrough</a> explains the build stages behind diagnostics.</p>
        <p><a className="content-action" href="/">Run the C example in Circuit</a> <a className="content-action" href="/blog">More Circuit articles →</a></p>
      </aside>
    </InfoPage>
  );
}
