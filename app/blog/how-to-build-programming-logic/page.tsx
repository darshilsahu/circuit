import { Breadcrumbs, ContentSchema } from '@/components/content-schema';
import { InfoPage } from '@/components/info-page';
import { blogPosts } from '@/lib/content/blog';
import { pageMetadata, siteUrl } from '@/lib/site';

const post = blogPosts.find(({ slug }) => slug === 'how-to-build-programming-logic')!;
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

const pseudocode = [
  'current_run = 0',
  'best_run = 0',
  '',
  'for each score, in its original order:',
  '    if score >= threshold:',
  '        current_run = current_run + 1',
  '        best_run = larger of best_run and current_run',
  '    otherwise:',
  '        current_run = 0',
  '',
  'return best_run',
].join('\n');

const cSource = [
  '#include <stdio.h>',
  '',
  'size_t longest_run(const int scores[],',
  '                   size_t count, int threshold) {',
  '    size_t current_run = 0;',
  '    size_t best_run = 0;',
  '',
  '    for (size_t i = 0; i < count; i++) {',
  '        if (scores[i] >= threshold) {',
  '            current_run++;',
  '            if (current_run > best_run) {',
  '                best_run = current_run;',
  '            }',
  '        } else {',
  '            current_run = 0;',
  '        }',
  '    }',
  '',
  '    return best_run;',
  '}',
  '',
  'int main() {',
  '    int scores[] = {65, 42, 78, 91, 38, 80, 84, 86};',
  '    size_t count = sizeof scores / sizeof scores[0];',
  '    size_t best = longest_run(scores, count, 60);',
  '',
  '    printf("Longest qualifying run: %zu\\n", best);',
  '    return 0;',
  '}',
].join('\n');

const pythonSource = [
  'def longest_run(scores, threshold):',
  '    current_run = 0',
  '    best_run = 0',
  '',
  '    for score in scores:',
  '        if score >= threshold:',
  '            current_run += 1',
  '            if current_run > best_run:',
  '                best_run = current_run',
  '        else:',
  '            current_run = 0',
  '',
  '    return best_run',
  '',
  '',
  'scores = [65, 42, 78, 91, 38, 80, 84, 86]',
  'best = longest_run(scores, 60)',
  'print(f"Longest qualifying run: {best}")',
].join('\n');

const trace = [
  [65, 1, 1],
  [42, 0, 1],
  [78, 1, 1],
  [91, 2, 2],
  [38, 0, 2],
  [80, 1, 2],
  [84, 2, 2],
  [86, 3, 3],
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

export default function ProgrammingLogicArticle() {
  const section = { title: 'Blog', path: '/blog' };
  return (
    <InfoPage title={post.title}>
      <ContentSchema title={post.title} description={post.description} path={path} section={section} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData).replace(/</g, '\\u003c') }} />
      <Breadcrumbs section={section} title={post.title} />
      <p className="content-note">By <a href="/about">Circuit</a> · Published <time dateTime={post.published}>October 13, 2026</time> · A practical guide to reasoning before syntax</p>
      <article>
        <p className="content-lead">You may know how to write a loop and still feel stuck when a problem does not tell you which loop to use. The missing step is often a clear model of the problem: what the input means, what result you need, and what must change as you work toward that result.</p>
        <p>Programming logic is the reasoning that connects those pieces. You can develop it in C, Python, Java, JavaScript, or another language. The syntax will differ, and the environment will impose its own rules, but you can begin with the same questions. This guide follows one complete problem, then shows how to test your reasoning and practise it on new tasks.</p>

        <nav className="content-toc" aria-label="Article sections">
          <h2>In this article</h2>
          <ol>
            <li><a href="#logic-and-syntax">Separate logic from syntax</a></li>
            <li><a href="#define-the-problem">Turn a request into precise rules</a></li>
            <li><a href="#choose-state">Solve a small example and choose your state</a></li>
            <li><a href="#pseudocode">Write pseudocode you can actually follow</a></li>
            <li><a href="#dry-run">Trace the algorithm by hand</a></li>
            <li><a href="#implement">Translate the idea into C and Python</a></li>
            <li><a href="#test-cases">Choose tests that challenge your assumptions</a></li>
            <li><a href="#debugging">Find the first step that goes wrong</a></li>
            <li><a href="#larger-problems">Break larger problems into clear parts</a></li>
            <li><a href="#practice">Practise with three reasoning exercises</a></li>
          </ol>
        </nav>

        <section id="logic-and-syntax">
          <h2>Logic answers “what happens?”; syntax expresses it</h2>
          <p>Consider a program that adds a delivery charge to small orders. “Use an if statement” is a syntax decision. “Charge delivery when the order total is below the free-delivery threshold, but not when it equals the threshold” is a rule. You need the rule before choosing a comparison operator.</p>
          <p>A compiler can reject a missing parenthesis. It generally cannot tell you that you used a strict comparison when the business rule required an inclusive one. A program may run successfully and produce the wrong answer. Keep three questions separate: does the source follow the language, can the program execute in this environment, and does its result satisfy the requirement?</p>
          <p>You do need language knowledge. Integer division, overflow, indexing, and string comparison can change how a plan must be implemented. However, learning another keyword is not always the answer to a reasoning problem. First describe the intended behavior without relying on code.</p>
        </section>

        <section id="define-the-problem">
          <h2>1. Replace a vague request with a small, testable contract</h2>
          <p>Our worked problem is: <strong>find the longest consecutive run of scores that meet a threshold.</strong> A list of scores could represent practice attempts in their original order. Before writing a function, define the terms that would otherwise invite guesses:</p>
          <ul>
            <li><strong>Input:</strong> an ordered list of integer scores from 0 to 100, and an integer threshold in the same range.</li>
            <li><strong>Qualifying:</strong> a score greater than or equal to the threshold.</li>
            <li><strong>Consecutive:</strong> neighboring entries in the original list, with no nonqualifying entry between them.</li>
            <li><strong>Output:</strong> the length of the longest qualifying run, not the total number of qualifying scores.</li>
            <li><strong>Empty input:</strong> return 0. If nothing qualifies, also return 0.</li>
          </ul>
          <p>The calculation below assumes these inputs are already valid. An application accepting text from a user must parse and validate it separately. Decide what invalid data means before processing it; silently deleting a bad entry could join two runs that were originally separated.</p>
          <p>For scores 65, 42, 78, 91, 38, 80, 84, and 86, with threshold 60, the qualifying runs have lengths 1, 2, and 3. The answer is 3. Counting all qualifying scores would give 6, which solves a different problem. Sorting the scores would also destroy the order the question depends on.</p>
          <p>When a task is ambiguous, write a concrete input and ask which output is intended. An example often reveals a disagreement faster than another paragraph of abstract wording.</p>
        </section>

        <section id="choose-state">
          <h2>2. Work through one example before inventing variables</h2>
          <p>Read the sample from left to right. After 65, you have a qualifying run of length 1. The next score, 42, breaks it. The pair 78 and 91 creates a run of length 2, which 38 breaks. Finally, 80, 84, and 86 create a run of length 3.</p>
          <p>What information did you carry while doing that? You needed the length of the run that is currently continuing, and the best length you had seen anywhere. Those become two variables:</p>
          <ul>
            <li><code>current_run</code>: the number of qualifying scores in the run ending at the most recently processed entry.</li>
            <li><code>best_run</code>: the largest run length found in the processed part of the list.</li>
          </ul>
          <p>One counter is insufficient. If it resets at a failing score, it forgets an earlier best run. If it never resets, it counts qualifying entries that are not consecutive. These variables are useful because they represent distinct facts, not because an example happened to contain two numbers.</p>
          <p>Both start at 0: before reading any scores, you have seen no run. After each qualifying score, extend the current run and update the best if necessary. After a nonqualifying score, reset the current run while preserving the best. Nothing else needs to be remembered to return the length.</p>
        </section>

        <section id="pseudocode">
          <h2>3. Write instructions that do not hide the difficult step</h2>
          <p>Pseudocode describes an algorithm without committing to a language’s exact grammar. <a href="https://cs50.harvard.edu/x/notes/0/#pseudocode">CS50’s introduction to pseudocode</a> explains how readable instructions connect decisions, repetition, and functions. Your own draft should be precise enough for someone to execute with a pencil.</p>
          <pre tabIndex={0} aria-label="Pseudocode for the longest qualifying run"><code>{pseudocode}</code></pre>
          <p>“Find the longest run” would not be useful pseudocode here: it merely repeats the question. The version above explains the comparison, the changing state, the reset, and the returned value. A good draft exposes the part you are trying to understand.</p>
          <p>The update order matters. Extend <code>current_run</code> before comparing it with <code>best_run</code>; otherwise, you compare against the old length. Updating the best during the loop also handles a longest run at the end of the list, where no later failing score arrives to announce that it has finished.</p>
          <h3>Give yourself a statement that stays true</h3>
          <p>After each processed entry, <code>current_run</code> is the qualifying suffix length of the processed entries, and <code>best_run</code> is their longest qualifying run. This is a loop invariant: a statement you maintain across iterations. You do not need formal notation to use it.</p>
          <p>It is true initially, when both lengths are 0. A qualifying score extends the suffix and may establish a new best; a failing score makes the suffix length 0 while leaving earlier runs intact. When the loop finishes, the processed part is the whole list, so the best value answers the question. The loop terminates because it processes one entry per iteration from a finite list.</p>
        </section>

        <section id="dry-run">
          <h2>4. Make a dry run visible instead of keeping it in your head</h2>
          <p>A dry run records what the program would do without executing it. Write down the state after each step. This table uses the sample scores and threshold 60; both counters are 0 before the first row.</p>
          <div className="content-table" tabIndex={0} role="region" aria-label="Longest run dry-run table">
            <table>
              <caption>State after each score has been processed</caption>
              <thead><tr><th scope="col">Score</th><th scope="col">Current run</th><th scope="col">Best run</th></tr></thead>
              <tbody>{trace.map(([score, current, best], index) => <tr key={index}><th scope="row">{score}</th><td>{current}</td><td>{best}</td></tr>)}</tbody>
            </table>
          </div>
          <p>The rows for 42 and 38 reveal the key distinction: the current value resets, but the best does not. The last row shows why the answer is 3. If your implementation produces another answer, compare its state against these rows rather than rereading the entire source repeatedly.</p>
          <p>For a different problem, record different state: a remaining balance, a search interval, a previous value, or a collection of items already seen. Include what each column means. A table full of numbers is less helpful when you cannot explain whether they describe the state before or after an operation.</p>
        </section>

        <section id="implement">
          <h2>5. Translate each decision into the language you are using</h2>
          <p>Once the algorithm survives a manual trace, implementation becomes a set of smaller choices. What represents the input? How do you visit each entry? Which type holds a length? How do you return the result? Preserve the meaning of the state while answering these language-specific questions.</p>
          <h3>A complete C program</h3>
          <pre tabIndex={0} aria-label="C longest qualifying run example"><code>{cSource}</code></pre>
          <p>The function receives the element count explicitly because an array parameter does not carry its original length. <code>size_t</code> holds lengths, and <code>%zu</code> prints that type. The caller must provide a valid range of <code>count</code> elements. The <code>sizeof</code> calculation works in <code>main</code>, where <code>scores</code> is an actual array; it is not a way to recover the array’s length inside the function.</p>
          <p>Paste this program into the <a href="/">Circuit online C compiler</a> and run it. It uses fixed data deliberately, so you can investigate the calculation before introducing input parsing. See the <a href="/learn/arrays-in-c">array guide</a> and <a href="/learn/functions-in-c">function guide</a> if those parts are unfamiliar.</p>
          <h3>The same reasoning in Python</h3>
          <pre tabIndex={0} aria-label="Python longest qualifying run example"><code>{pythonSource}</code></pre>
          <p>Python’s loop visits the list values directly, and indentation groups the statements. The state updates and qualifying rule remain the same. Its <a href="https://docs.python.org/3/tutorial/controlflow.html#for-statements">official control-flow tutorial</a> explains this iteration model. Run this version with Python 3 in its own environment; Circuit currently runs C.</p>
          <p>Both examples print:</p>
          <pre tabIndex={0} aria-label="Expected longest run output"><code>{'Longest qualifying run: 3'}</code></pre>
          <p>This transfer is the useful part of learning logic. You can recognize the same algorithm despite different braces, declarations, and loop forms. It does not mean every language behaves identically: check its numeric types, collection rules, and error handling when you translate.</p>
        </section>

        <section id="test-cases">
          <h2>6. Pick tests that can expose a mistaken assumption</h2>
          <p>One successful sample is evidence about one input. Design more examples around the rules most likely to go wrong. For threshold 60, use these cases and predict the answer before running them:</p>
          <div className="content-table" tabIndex={0} role="region" aria-label="Longest run boundary cases">
            <table>
              <caption>Inputs and expected longest qualifying run lengths</caption>
              <thead><tr><th scope="col">Scores → answer</th><th scope="col">What it checks</th></tr></thead>
              <tbody>
                <tr><th scope="row">Empty list → 0</th><td>No entries to process; initialization must already produce the correct result.</td></tr>
                <tr><th scope="row">60 → 1</th><td>A score exactly at the threshold qualifies.</td></tr>
                <tr><th scope="row">59 → 0</th><td>A score just below the threshold does not qualify.</td></tr>
                <tr><th scope="row">60, 75, 90 → 3</th><td>The longest run reaches the end of the input.</td></tr>
                <tr><th scope="row">10, 20, 30 → 0</th><td>No score qualifies.</td></tr>
                <tr><th scope="row">80, 40, 90, 30 → 1</th><td>Separated successes must not be joined.</td></tr>
                <tr><th scope="row">80, 90, 40, 70 → 2</th><td>The best run occurs earlier than the final run.</td></tr>
                <tr><th scope="row">70, 80, 30, 90, 95 → 2</th><td>Two equally long runs still return a single length.</td></tr>
              </tbody>
            </table>
          </div>
          <p>In Python, call <code>longest_run([], 60)</code> for the empty case. In C, call <code>longest_run(NULL, 0, 60)</code>: the loop performs no accesses when the count is 0. For nonempty C tests, replace the sample array and retain the count calculation. Do not use a nonzero count with a null pointer or a count larger than the real array.</p>
          <p>There are useful relationships to check too. The answer must be between 0 and the number of entries. Raising the threshold cannot increase it. Appending a failing score cannot reduce the best length already seen. These properties complement exact expected answers; they do not replace them.</p>
          <p>For repeated work, automate the cases in your language’s test tools. Python’s <a href="https://docs.python.org/3/library/unittest.html#basic-example">unittest documentation</a> shows how to compare a function’s actual result with an expected one. Keep tests independent of prompts and display formatting when you are checking a calculation.</p>
        </section>

        <section id="debugging">
          <h2>7. Debug the first incorrect transition</h2>
          <p>Suppose you accidentally return <code>current_run</code> instead of <code>best_run</code>. The main sample still prints 3 because its longest run happens to be at the end. But 80, 90, 40, 70 should produce 2 and would produce 1. The smaller test reveals a bug that the larger sample concealed.</p>
          <p>Reduce a failure to the shortest input that preserves it, then trace that input. Inspect which variable first stops matching its definition. In this example the state may be correct throughout the loop; the return statement chooses the wrong fact. If you reset <code>best_run</code> along with the current run, the first failing score after a success already breaks the invariant.</p>
          <ol>
            <li>Record the input, expected result, and actual result.</li>
            <li>Identify whether the failure is in reading data, calculating, or presenting the answer.</li>
            <li>Inspect state at the relevant steps with a debugger or temporary output.</li>
            <li>Explain one suspected cause before changing it.</li>
            <li>Rerun the failing case and the previously passing cases.</li>
          </ol>
          <p>In C, a temporary print of the index, score, current length, and best length after each iteration can reproduce the dry-run table. Remove those prints when you have answered the question. Adding random statements or changing several conditions at once makes it harder to tell which change corrected the behavior.</p>
        </section>

        <section id="larger-problems">
          <h2>8. Split larger tasks at boundaries you can test</h2>
          <p>If the application must accept scores from a user, do not mix all its responsibilities into the loop. Separate reading text, validating scores, computing the longest run, and displaying the result. Each part should have a clear input and result. The calculation can then be tested with known values without repeatedly typing into a terminal.</p>
          <p>This does not require creating a function for every line. A boundary earns its place when it has a useful meaning, can be checked independently, or is reused. The <a href="/learn/printf-and-scanf">input guide</a> explains the separate concerns around C conversions and invalid input.</p>
          <h3>Recognize the shape of the work</h3>
          <ul>
            <li><strong>Counting or totaling:</strong> carry an accumulator, with an initial value that matches the operation.</li>
            <li><strong>Comparing neighbors:</strong> remember the previous value and decide how to handle the first entry.</li>
            <li><strong>Finding a best candidate:</strong> carry the best found so far; define what happens when no candidate exists.</li>
            <li><strong>Detecting something already seen:</strong> consider a set or another lookup structure, with clear equality rules.</li>
            <li><strong>Matching nested openings and closings:</strong> consider a stack when the kind and order of unmatched openings matter.</li>
          </ul>
          <p>These are starting questions, not recipes to apply blindly. Our streak problem combines counting with a best-so-far value because a break changes what “current” means. A total alone would lose that structure.</p>
          <p>The streak algorithm visits each of <code>n</code> scores once and carries two counters: O(n) time and O(1) auxiliary space, excluding the input. Start with this understandable solution. If a real workload later needs improvement, measure it and revisit the algorithm instead of guessing that shorter source must be faster.</p>
        </section>

        <section id="getting-unstuck">
          <h2>When you are stuck, make the next question smaller</h2>
          <p>A blank editor encourages you to solve everything simultaneously. Replace “How do I write the program?” with a specific question: what should an empty input return, what ends a run, or which fact must survive a reset? Try the smallest example that answers it.</p>
          <p>If even a manual solution is unclear, return to the problem statement. If the manual steps are clear but you cannot express them, draft pseudocode. If the pseudocode is clear but the source is not, consult the language’s documentation for that particular operation. Different kinds of difficulty need different next steps.</p>
          <p>You can ask a classmate, teacher, or an AI tool for a hint, but ask about the unresolved step. Compare any suggested solution with your contract and tests. Before adopting it, explain why it handles an empty list, a broken run, and a longest run at the end. A pasted answer that you cannot trace gives you little basis for adapting it to the next problem.</p>
        </section>

        <section id="practice">
          <h2>Three exercises that change what you need to remember</h2>
          <p>For each exercise, write the input rules, a manual example, the state you need, and at least three tests before coding. The reasoning notes are included so you can compare approaches after trying it yourself.</p>
          <h3>Exercise 1: return where the longest run begins</h3>
          <p>Extend the worked problem to return both a start index and a length. Use zero-based indexes, choose the earliest run when lengths tie, and return “no qualifying run” when the length is 0. For the original sample, the answer is start index 5 and length 3. For 70, 80, 30, 90, 95, choose index 0 and length 2.</p>
          <p><strong>Reasoning:</strong> remember the current run’s start when its length changes from 0 to 1. When its length becomes strictly greater than the best, copy both its length and its start into the best result. Updating on equality instead would select a later tied run. Choose a suitable representation for “no run” in your language; do not let a valid index 0 silently mean “missing.”</p>
          <h3>Exercise 2: count changes between neighboring values</h3>
          <p>For 7, 7, 4, 4, 9, return 2: the value changes from 7 to 4 and from 4 to 9. Empty and one-element lists return 0. The list 3, 3, 3 returns 0; 3, 4, 3 returns 2.</p>
          <p><strong>Reasoning:</strong> compare each entry after the first with its actual predecessor. Keep a previous value or use neighboring indexes, and increment only when they differ. A fabricated previous value of 0 would incorrectly count the first entry as a change in many inputs. There are only <code>n - 1</code> adjacent pairs in a nonempty list.</p>
          <h3>Exercise 3: check a sequence of parentheses</h3>
          <p>Accept only opening and closing parentheses. Decide whether the sequence is balanced: the empty string and <code>(())()</code> are valid; <code>())(</code> and <code>(()</code> are not. Reject other characters according to this input contract.</p>
          <p><strong>Reasoning:</strong> increase a balance for an opening parenthesis and decrease it for a closing one. A negative balance means a closing parenthesis arrived without an unmatched opening, so reject immediately. At the end, require a balance of 0. Checking only the final balance would wrongly accept <code>())(</code>. If you later add different bracket types, a single counter no longer records enough information about their nesting order.</p>
        </section>

        <section id="practice-habit">
          <h2>Build a practice habit around explanations</h2>
          <p>Choose one small problem, finish a simple version, and write a short note explaining why it works. On a later attempt, change one requirement: include the boundary, return a position instead of a length, or accept empty input. This makes you reconsider the reasoning instead of only memorizing the source.</p>
          <p>Keep a record of useful mistakes. “Used the final run instead of the best run” identifies a state-model problem. “Used a count larger than the array” identifies a caller contract problem. Those notes are more actionable than deciding that you are simply bad at logic.</p>
          <p>Before calling a program finished, ask whether you can explain every stored value, each condition, the progress of the loop, and the returned result. Then check the boundary cases. This habit applies across languages, while each language’s documentation supplies the implementation details.</p>
        </section>
      </article>
      <aside className="editorial-next" aria-label="Related reading">
        <h2>Turn the reasoning into a small experiment</h2>
        <p>Run the C streak example, then use the <a href="/examples">example library</a> to practise predicting output. The <a href="/blog/programming-language-comparison">programming language comparison</a> explains how implementations differ, and the <a href="/docs">Circuit documentation</a> describes the browser environment.</p>
        <p><a className="content-action" href="/">Try the C example in Circuit</a> <a className="content-action" href="/blog">More Circuit articles →</a></p>
      </aside>
    </InfoPage>
  );
}
