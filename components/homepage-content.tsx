const features = [
  ['Run C programs online', 'Write a complete source file and select Run code. Circuit compiles and executes it on your device, so a short exercise needs no desktop installation. Start with a small program whose result you can predict. When you change the source, run again to build the new version; editing a file does not change a process that is already running.'],
  ['Standard input support', 'Use scanf to read numbers or getchar to read characters. Enter your reply directly after the prompt in the terminal, then press Enter to submit the line. Continue answering when the program requests another value. This makes it possible to test interactive exercises rather than replacing every input with a constant in the source.'],
  ['An integrated terminal', 'Output, compiler diagnostics, and process status share one terminal. Read the first diagnostic before changing code, and distinguish text printed by your program from messages about the run. Resize the terminal to suit the exercise, or hide it when you need more editor space. On smaller workspaces, it moves below the editor.'],
  ['A local program library', 'Create, rename, duplicate, and search programs, or return to recent work. Tabs let you keep several exercises open while each file retains its own source. Closing a tab leaves the saved program in your library; deleting the program removes it. Use descriptive names such as array_sum.c instead of relying on a sequence of untitled files.'],
  ['Source downloads and backups', 'Download the active program as a .c file when you want to use it in another environment. Export all creates a JSON backup of your saved library; Import restores a Circuit backup without replacing programs with matching names. To bring in an existing .c file, paste its source into a new program. Source downloads and library backups serve different purposes.'],
  ['No account required', 'Open the workspace and begin without signing up. Your library belongs to the browser profile and site address you are using. There is no account to connect programs across devices, so keep a separate backup of important work. This is useful for a quick lesson or experiment, provided you understand where the saved files live.'],
];

const tutorials = [
  ['first-c-program', 'Your First C Program', 'Understand headers, main, printf, and return values. Change the greeting, predict the output, and learn to read your first diagnostic.'],
  ['printf-and-scanf', 'printf and scanf', 'Match conversion specifiers to argument types, check input results, and understand why leftover whitespace can affect the next read.'],
  ['arrays-in-c', 'Arrays in C', 'Keep indexes within bounds, distinguish length from capacity, and pass the information a function needs to process an array.'],
  ['functions-in-c', 'Functions in C', 'Separate calculation from input and output. Design parameters and return values that make a function easier to test.'],
  ['pointers-for-beginners', 'Pointers for Beginners', 'Connect each address to a real object, then reason about dereferencing, object lifetime, and updates through pointers.'],
  ['common-compiler-errors', 'Common Compiler Errors', 'Use diagnostics to investigate punctuation, declarations, format mismatches, and linking problems without making random changes.'],
];

const steps = [
  ['Write', 'Create a program with one clear purpose. Include the necessary headers, declare variables before using them, and save the source. Before pressing Run, write down one input and the output you expect. This gives you a check against your intended behavior rather than only against whether the build succeeds.'],
  ['Compile', 'Select Run code or press Ctrl/Cmd + Enter. Circuit translates and links the active source. If a diagnostic prevents the build, inspect the first message and its surrounding lines. Fix a cause you understand, then compile again. Later errors may be consequences of that first missing token.'],
  ['Run', 'After a successful build, the program executes in a worker. Supply requested input in the terminal and observe what the program does with it. Use Stop if the run is stuck or no longer useful. Each execution starts a new process; it does not resume the previous run’s variables.'],
  ['Inspect output', 'Compare the result with your prediction. Test a boundary value and, when relevant, an invalid input. If the answer is wrong, trace the calculation with small temporary prints. Change one thing at a time so you can explain which change affected the result.'],
];

const inputExample = [
  '#include <stdio.h>', '', 'int main() {', '    int first, second;', '',
  '    printf("First number: ");', '    if (scanf("%d", &first) != 1) {',
  '        puts("Please enter an integer.");', '        return 1;', '    }', '',
  '    printf("Second number: ");', '    if (scanf("%d", &second) != 1) {',
  '        puts("Please enter an integer.");', '        return 1;', '    }', '',
  '    if (first < -1000 || first > 1000 ||',
  '        second < -1000 || second > 1000) {',
  '        puts("Use values from -1000 to 1000.");', '        return 1;', '    }', '',
  '    printf("Sum: %d\\n", first + second);', '    return 0;', '}',
].join('\n');

export function HomepageContent() {
  return (
    <article className="site-content homepage-content" aria-label="Using the Circuit online C compiler">
      <section aria-labelledby="home-about">
        <span className="home-eyebrow">WRITE · TEST · UNDERSTAND</span>
        <h2 id="home-about">What is Circuit?</h2>
        <p className="content-lead">Circuit is an online C compiler for writing, compiling, running, and managing small C programs directly in your browser. The workspace above brings a source editor, a saved program library, and an interactive terminal together. You can try an idea, give the program input, inspect its output, and keep a useful version without setting up a desktop toolchain.</p>
        <p>If you need a C compiler online for a lesson or quick experiment, begin with a question you can test: does this loop include the last number, does this function return the expected value, or does this input check reject a letter? Circuit helps you turn that question into a small program. It is especially useful when you are learning C and want the feedback from actually running your own source.</p>
        <p>The most valuable result is an explanation you can reproduce. A program that builds can still calculate the wrong answer or access memory incorrectly. Use the workspace to compare your prediction with real behavior, then use the <a href="/learn">Learn guides</a> to understand the language behind it. Read <a href="/about">about Circuit</a> for the product’s purpose and scope.</p>
      </section>

      <section aria-labelledby="home-features">
        <h2 id="home-features">Tools that support a complete practice session</h2>
        <p>A useful exercise involves more than pressing Run. You need to edit, supply input, interpret feedback, and return to the source later. These features keep that workflow together while letting you decide how to organize your work.</p>
        <div className="home-feature-grid">{features.map(([title, text], index) => <div className="home-feature" key={title}><span className="home-number" aria-hidden="true">0{index + 1}</span><h3>{title}</h3><p>{text}</p></div>)}</div>
      </section>

      <section aria-labelledby="home-workflow">
        <h2 id="home-workflow">From source code to a result you can check</h2>
        <ol className="home-workflow">{steps.map(([title, text], index) => <li key={title}><span className="home-step-title"><span className="home-number">0{index + 1}</span><h3>{title}</h3>{index < steps.length - 1 && <span aria-hidden="true" className="home-arrow">→</span>}</span><p>{text}</p></li>)}</ol>
        <p>For a first session, run the greeting in hello_world.c, then replace the message with your own text. Add a second print and decide whether it should start on a new line. The <code>\n</code> inside a string creates that newline; simply placing a printf statement on another source line does not. This small experiment separates the layout of your source from the layout of its output.</p>
        <p>Next, store a number in a variable and print a calculation. Use small values you can verify mentally before asking the user for input. A program with fixed, known values is easier to inspect than one that combines an unfamiliar calculation with an unfamiliar input format. Add one concept at a time and keep a working copy before moving on.</p>
      </section>

      <section aria-labelledby="home-input">
        <h2 id="home-input">Interactive input: follow the program’s conversation</h2>
        <p>Many C exercises begin with a prompt: enter two numbers, choose an option, or supply a table limit. Circuit’s terminal connects your reply to the running program. If the prompt has no newline, your typed value appears on the same line. Enter submits the line, advances the cursor, and keeps focus ready for the next request. You can answer several scanf calls in succession.</p>
        <p>Try this addition exercise with small integers. Each scanf call checks that one conversion succeeded before using the variable. The range check keeps the demonstrated calculation small. Use ordinary numeric inputs for this lesson; a production parser also needs to handle text whose numeric value cannot fit in an int.</p>
        <pre tabIndex={0} aria-label="C program with two checked input requests"><code>{inputExample}</code></pre>
        <p>Enter 45, press Enter, then enter 20. The terminal conversation should look like this; the replies are your input, not extra text printed by the source.</p>
        <pre aria-label="Expected interactive terminal transcript"><code>{'First number: 45\nSecond number: 20\nSum: 65'}</code></pre>
        <p>Run again with -5 and 5 to check zero as a result. On a separate run, type a letter at the first prompt and confirm that the program reports invalid input instead of calculating with an uninitialized value. This gives you three distinct tests of the same source.</p>
        <p>Input arrives a line at a time. getchar reads characters from the submitted line, including its newline; it is not an immediate keypress interface. Avoid adding trailing whitespace to a scanf format casually, because that can make a read wait for another non-whitespace character. The <a href="/learn/printf-and-scanf">printf and scanf guide</a> explains conversion counts, addresses, and leftover input in detail.</p>
      </section>

      <section aria-labelledby="home-diagnostics">
        <h2 id="home-diagnostics">Read errors by the stage that failed</h2>
        <p>A compiler error means the current source could not be translated or linked into a runnable program. Begin with the first diagnostic, then inspect the reported line and the line before it. A missing semicolon can be reported near the next statement. A misspelled variable may be undeclared, while a missing function definition can cause a linking error even when its declaration was valid.</p>
        <p>Warnings deserve attention too. A format mismatch in printf or scanf is evidence that the arguments do not match the conversion string. Adding a cast without understanding the types can conceal the problem. Read both the expected and supplied type, then correct the operation that made them disagree.</p>
        <p>A runtime failure happens after execution begins. Check division, indexes, pointer lifetime, allocation results, and recursion depth. A program that exits successfully but prints an incorrect answer has a different problem: its logic needs testing. Circuit reports process status, but it cannot establish that your algorithm meets its requirements. Use the <a href="/learn/common-compiler-errors">compiler error guide</a> and <a href="/learn/segmentation-fault">memory failure guide</a> to investigate the appropriate stage.</p>
      </section>

      <section aria-labelledby="home-runtime">
        <h2 id="home-runtime">What actually runs inside your browser?</h2>
        <p>Circuit’s C compiler uses LLVM Clang distributed through YoWASP. It translates C17 source into WebAssembly and links the libraries supplied by that toolchain. A WASI runtime then provides the supported input, output, memory, and file facilities. Compilation and execution happen in a Web Worker, away from the editor’s main thread. The first run downloads compiler assets and can take longer than later runs.</p>
        <p>This architecture keeps source, terminal input, and output local to the execution path. It also defines the environment’s boundaries. Ordinary exercises with functions, arrays, pointers, structures, and standard input are appropriate. Native windows, arbitrary host filesystem access, launching other processes, and operating-system-specific APIs are not part of this browser environment.</p>
        <p>File streams use temporary in-memory runtime files. A file created with fopen is separate from your saved .c program and disappears after that run. Likewise, an array access that appears to work is not proof of memory safety: some invalid operations trigger WebAssembly traps, while others can stay within linear memory and produce misleading results.</p>
        <p>Execution, input-idle, and overall-session limits keep mistakes bounded. Waiting for stdin uses a separate allowance from active execution; an abandoned input request can still expire. Stop terminates the worker when you need to end a process yourself. See <a href="/docs#environment">the documented environment and current limits</a> before choosing an exercise with large data, extensive output, or platform dependencies.</p>
      </section>

      <section aria-labelledby="home-practice">
        <h2 id="home-practice">Turn an exercise into a repeatable experiment</h2>
        <p>For a loop, choose a tiny range first. A multiplication table from 1 to 3 gives you three rows to inspect; a thousand rows mainly makes mistakes harder to locate. Decide whether the ending value is included and test the first and last iteration. If the loop never stops, check whether the variable used by its condition changes in the direction you intended.</p>
        <p>For an array, use distinct values so swapped indexes do not go unnoticed. Test a one-element case and keep the element count separate from the array’s capacity. When passing data to a function, pass the count it needs rather than expecting a pointer to carry a length automatically.</p>
        <p>For a function, start with known arguments before connecting interactive input. Test zero, a small positive value, and a small negative value when the calculation allows them. Keep prompting in main and calculation in the function so a wrong input conversion is easier to distinguish from a wrong result.</p>
        <p>For pointers, name the object each address should refer to and identify how long that object exists. Printing an address does not establish that it is valid to dereference. Start with a swap of two ordinary variables, then move to arrays and structures. Use the <a href="/learn/pointers-for-beginners">pointer guide</a> to reason about lifetime before experimenting with dynamic allocation.</p>
      </section>

      <section aria-labelledby="home-learn">
        <h2 id="home-learn">A learning path with explanations, not just answers</h2>
        <p>The Learn section connects language concepts with small experiments, common mistakes, and ways to check your understanding. Begin with program structure and input, then move to arrays and functions. Read about pointers when you can already explain the variables and objects involved. Return to compilation and errors as new questions arise.</p>
        <div className="content-grid">{tutorials.map(([slug, title, text]) => <a className="content-card" key={slug} href={'/learn/' + slug}><h3>{title}</h3><p>{text}</p><span className="content-card-link">Read guide →</span></a>)}</div>
        <p><a className="content-button" href="/learn">View all tutorials</a></p>
      </section>

      <section aria-labelledby="home-examples">
        <h2 id="home-examples">Use examples as starting points for your own tests</h2>
        <p>Each page in the <a href="/examples">example library</a> includes source, an explanation, and expected output. Try in Circuit creates a new saved copy without changing the published example or replacing an existing program. Read the sample input before running, then make one purposeful variation.</p>
        <ul className="home-example-list">
          <li><a href="/examples/hello-world">Hello World</a>: add a second message and predict where its output begins.</li>
          <li><a href="/examples/add-two-numbers">Add Two Numbers</a>: test a positive pair, zero, and the demonstrated rejected input.</li>
          <li><a href="/examples/even-or-odd">Even or Odd</a>: compare positive, negative, and zero values against the condition.</li>
          <li><a href="/examples/multiplication-table">Multiplication Table</a>: reduce the range and explain every iteration before expanding it.</li>
          <li><a href="/examples/array-sum">Array Sum</a>: change one element and calculate how much the result should change.</li>
        </ul>
        <p>Keep a short note in a source comment explaining what you tested and what you observed. A named variation with a known input is more useful to return to than a copied program whose output you have never checked.</p>
      </section>

      <section aria-labelledby="home-library">
        <h2 id="home-library">Keep the source you understand, and back it up</h2>
        <p>Before making a large change, duplicate a working program. Give each version a name that describes the difference, such as sum_loop.c and sum_function.c. Tabs help compare the two sources, but running one file does not combine it with another open tab. The terminal identifies the program that owns the current run even if you switch editor tabs.</p>
        <p>Autosave reduces the need to save manually, but check the save indicator. Saved locally confirms storage; a storage failure needs attention before you close the page. Formatting can make nested code easier to read: use Shift + Alt + F or the Format code action. Formatting changes presentation, not the meaning of an incorrect condition or a misplaced semicolon.</p>
        <p>Download a .c file for one source you want to keep outside the browser. Export all for a recoverable library backup, then import that backup in the destination browser. Treat deletion as removal of a saved program, not merely closing its view. The <a href="/docs#programs">program management documentation</a> explains these actions and how imported name collisions are handled.</p>
      </section>

      <section className="home-privacy" aria-labelledby="home-privacy">
        <h2 id="home-privacy">Local storage, privacy, and what “local” means</h2>
        <p>Saved programs use IndexedDB; interface preferences use browser storage. The library belongs to a particular browser profile and site origin. Another device, private browsing session, browser, or website address does not automatically contain the same programs. An account is not required, and there is no account-based synchronization.</p>
        <p>Browser persistence is convenient but is not a guaranteed backup. Clearing site data, private-session cleanup, or storage eviction can remove saved work. Available quota varies between devices and browsers, so there is no promise of an unlimited program count. Export important programs before switching browsers or clearing storage; Circuit cannot recover a deleted local library from a server account.</p>
        <p>Local compilation does not make the entire website free of network requests. Visiting Circuit downloads hosting and compiler assets. The site also includes Google Analytics and the AdSense setup script, with separate implications for connection data and cookies. Read the <a href="/privacy">Privacy Policy</a> for those details and <a href="/docs#storage">the storage documentation</a> for practical backup guidance.</p>
      </section>

      <section aria-labelledby="home-desktop">
        <h2 id="home-desktop">When to move an exercise to a desktop toolchain</h2>
        <p>A browser workspace suits short, single-source experiments. A desktop environment becomes useful when you need several source files, persistent disk files, native libraries, or a debugger that can inspect variables at breakpoints. Choose the environment around the task rather than treating a successful browser run as a compatibility promise for every operating system.</p>
        <p>You can carry your learning forward by downloading the .c source and building it locally. Our <a href="/blog/how-to-install-c-compiler-in-vs-code">guide to installing a C compiler for VS Code</a> explains the Windows, macOS, and Linux setup paths, verifies the compiler separately from the editor, and shows how to run an input-driven program in a real terminal. The <a href="/learn/online-compiler-vs-gcc">browser compiler and GCC comparison</a> helps you decide when that change is useful.</p>
        <p>If an exercise fails here, first reduce it to a small reproduction and read the terminal message. Consult <a href="/docs#troubleshooting">troubleshooting</a>, or <a href="/contact">contact support</a> with the browser, operating system, error text, and a non-sensitive example. A specific observation makes a problem much easier to investigate than an unexplained screenshot of the whole program.</p>
      </section>

      <section className="home-cta" aria-labelledby="home-start"><div><h2 id="home-start">Start with one question you can test.</h2><p>Write a small program, predict its result, and use the terminal to check your reasoning.</p></div><a className="content-button" href="#compiler">Start coding in C ↑</a></section>
    </article>
  );
}

