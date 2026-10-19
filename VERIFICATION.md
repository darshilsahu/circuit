# Circuit branding — September 12, 2026

- Replaced the public CRunner product name with Circuit across the workspace header, footer, metadata, structured data, Learn/About/Privacy/Terms/Contact pages, and publishing notes. The canonical domain and public support address intentionally remain `crunner.pages.dev` and `crunnersupport@gmail.com`.
- Replaced the generic code-bracket mark with an original blue Circuit symbol: a minimal C trace, two node endpoints, and a compact terminal cursor. The shared header/trust-page SVG, versioned favicon, 180px Apple touch icon, 512px regular and maskable PWA icons, web manifest, and 1200×630 Open Graph image use the same design.
- Production static build, TypeScript, nine retained tests, and a six-page rendered-brand sweep passed. Browser verification confirmed the full header mark, title, favicon/Apple/manifest links, Open Graph site name/image, unchanged canonical, and successful Hello World execution.
- Changes are local only. No Cloudflare deployment was performed.

# Header navigation and Learn page — September 12, 2026

- Added Learn, About, Privacy, Terms, and Contact within the existing 48px product header, preserving Circuit branding and workspace actions. Links collapse into the existing dropdown-menu style below 1180px. Footer links remain.
- Moved the guide from the homepage to statically exported `/learn`, with its own metadata and canonical URL, and added it to the sitemap. The homepage now ends after the compiler and footer; existing SEO metadata and structured data remain.
- Production build and TypeScript passed. All six public pages passed canonical and local-link/asset checks. Browser checks covered a 1366px desktop header, 390px mobile menu navigation to Learn and back, 320px header fit without page overflow, and a successful Hello World execution after returning to the compiler.
- Changes are in the local production output; no new deployment was performed.

# SEO and advertising preparation — September 12, 2026

- Existing client workspace moved unchanged from `app/page.tsx` into `components/compiler-workspace.tsx`; the homepage now composes that workspace with statically rendered guide content. No compiler/runtime, terminal, program storage, or shortcut changes were made.
- Production export and TypeScript checks passed. All five public routes have titles, descriptions, canonicals, Open Graph and Twitter metadata. Homepage JSON-LD parses correctly and explanatory content is present in raw exported HTML.
- Static preview returned HTTP 200 for `/`, `/about`, `/privacy`, `/terms`, `/contact`, `/robots.txt`, `/sitemap.xml`, and `/ads.txt`. All local links and referenced assets in the five exported pages resolve. Every public page is included in the sitemap. Pages extensionless HTML URLs are also supported by the local static preview server.
- Browser checks: homepage Hello World exits successfully; three sequential stdin replies (2, 3, 4) produce 24 without focus clicks; trust pages open directly by URL. The workspace height remains the full viewport, and guide content begins below it. No browser console errors were captured during the compiler smoke test. Temporary test source was restored.
- Advertising remains inactive. The reserved editorial placement is hidden without a visible placeholder; `ads.txt` contains comments only. The Contact page clearly labels the operator-requested sample address. A real monitored contact address, actual publisher details, policy review, and applicable consent integration remain necessary before an advertising application/activation.
- This pass validates a local production build; it does not constitute AdSense approval or a new public deployment.

# Browser WebAssembly migration verification — September 12, 2026

The current execution path is entirely browser-side: pinned YoWASP Clang/LLD compiles real C in a Web Worker, and the browser WASM engine runs it through the WASI shim. The former compiler server, Docker runner, and compilation/session API routes were removed after browser acceptance passed. All sections below this migration record describe historical implementations and are superseded for compiler architecture, limits, and deployment.

## Current checks completed

- 21/21 real browser tests passed against the exported `dist/client` static site: printf; one and three sequential scanf calls; multiple values in one input line; a six-second human input delay; getchar and UTF-8 stdout/stderr; loops and arrays; functions and recursion; pointers and structures; malloc/free; libm; compilation errors; nonfatal warnings; nonzero exit; WASM runtime trap; automatic infinite-loop timeout; manual Stop during a loop and blocked stdin; abandoned-input idle timeout; output limit; and recovery in a fresh worker. UI heartbeat checks remained responsive during infinite loops.
- Main application acceptance: entered three values continuously with raw keyboard input and no intervening focus clicks. Input appeared after each prompt and produced the expected product. Running a program while selecting another editor tab preserved the running program's terminal ownership; entering 2, 3, and 4 produced 24. The actual Stop button cancelled an infinite loop.
- Saved source and workspace tabs survived reload. Removed only the temporary `wasm_qa.c` program afterward; the existing `hello_world.c` remains the sole saved program in the tested browser. Terminal was cleared.
- 9/9 retained storage, backup, validation, download, and workspace tests passed. TypeScript (`npx tsc --noEmit`) passed. Dependency audit reported zero vulnerabilities at verification time.
- Static production export passed using Node 22.22.1. The installed Vinext exporter on Windows failed during native shutdown under Node 24, so Node 22 is pinned and documented.
- Static preview returned the app with COOP `same-origin` and COEP `require-corp`; the removed `/api/sessions` route returned 404. No compiler service was running. No browser console errors were captured in the final application check.
- Deployable output is `dist/client`, including `_headers`, local compiler assets, and license notices. Largest asset is 20 MiB, below the Pages 25 MiB per-file limit. No deployment was performed.

## Current limits

The runtime allows 3 seconds of active elapsed execution, excluding blocked stdin, with a separately tested 60-second input idle limit. The five-minute total session cap was not tested by waiting out its full duration. Initial toolchain transfer is approximately 26 MiB compressed. Tests used the in-app Chromium browser; physical mobile devices and other browser engines were not tested. WASI is not a complete Linux environment, and not all C undefined behavior produces a detectable trap. See README.md for pinned toolchain versions, the archived upstream packaging repository caveat, resource limits, and Pages settings.

# Historical: Stage 2 verification

## Latest regression audit

- Fixed duplicate filename selection when an existing copy differs only by letter case. Browser reproduction previously produced a misleading storage-full error; it now creates the next available copy.
- Normalized uppercase `.C` extensions to `.c` and kept normalized/duplicated filenames within the 100-character limit.
- Rename now commits to IndexedDB before changing the visible program name or closing its dialog; rejected writes retain the existing name.
- Passed all 63 automated test entries: 11 storage/validation/workspace/download tests, 38 real GCC checks, 12 interactive checks through the app, and 2 batch API checks. TypeScript and production build passed.
- Browser checks: duplicate collision and uppercase-extension fixes; renamed filename and edited source survive reload; search; Quick Open; closing/reopening tabs; dark/light toggle; actual three-input execution (10, 20, 30 -> Sum: 60) with keyboard focus retained; loop CPU timeout; manual Stop while waiting for stdin. No browser console errors were captured.
- Removed all temporary audit programs through the app. The original hello_world.c remains as the only program in this browser.
- Repository-wide lint is not clean: existing shared-component accessibility rules, React compiler compatibility rules, and test typing/style diagnostics remain. These are not covered by the passing build/type-check claim. No claim of exhaustive bug freedom or public deployment is made.

Real compiler: GCC 14.3.0 inside the Docker image `circuit-gcc:local`, C17 with nonfatal warnings. The existing architecture and browser database schema were preserved.

## Automated checks

- Nine storage/API unit tests: persistence and rapid auto-save; deleting all does not reseed; backup validation; preserving larger saved source/input; input/body limits; service authentication; concurrency; collision-safe concurrent imports and creates.
- Real compiler HTTP suite: 38 passing test entries (37 cases plus parent test). Hello World, arithmetic, variables, if/else, for/while loops, arrays, strings, functions, recursion, pointers, structures, malloc/free, multiple printf calls and multiline output.
- stdin: integer, two integers on separate lines, integer/float, strings, and byte-preserving whitespace/CRLF/newline input.
- GCC errors: missing semicolon, undefined variable, invalid syntax, wrong function arity. Filename/line/column and original diagnostic text are retained. Nonfatal warnings still allow execution.
- Runtime: nonzero exit, genuine null-pointer segmentation fault, SIGILL, infinite while/for loops, long sleep, and excessive stdout/stderr. Timeout/output-limit states are explicit.
- Security: rejected allocation beyond address-space limit; bounded fork attempts; read-only root; unprivileged UID; denied outbound network; one request cannot read another request's temporary file; two-request concurrency cap; disconnect cleanup; no leftover labeled containers after requests.
- Two actual application API checks: Worker → authenticated-capable Node API → Docker → GCC → stdin → stdout, plus malformed/oversized/wrong-method/wrong-media/cross-origin requests.

## Browser acceptance actually performed

Local test origin: http://localhost:3002. Original port-3000 data was not cleared or migrated. QA records were created rather than replacing preexisting programs.

1. Created `qa_stdin.c` through New Program, typed real C into CodeMirror, supplied `10\n20\n`, clicked Run, and saw `Hello from real GCC!` and `Sum: 30` in the website console.
2. Copied the console and read back the exact program output; Clear returned the console to Idle.
3. Reloaded the page and confirmed auto-saved source returned.
4. Created a separate error program; real GCC displayed `main.c:3:5` missing-semicolon diagnostics and its unused-variable warning.
5. Entered an infinite loop and used Ctrl+Enter. The UI displayed `Execution timed out`, exit 152, roughly 3 seconds, and re-enabled Run.
6. Intentionally stopped the compiler service. Run displayed a clear service-unavailable message and recovered after restarting the service.
7. Switched programs, reran code, and inspected both light and dark themes.
8. At 390 × 844, opened the program drawer, selected a file, edited source, supplied stdin, ran code, read `Mobile result: 42`, and returned to editing. Editor horizontal overflow stayed in its own scroller; panels stayed within the viewport. The temporary viewport override was reset.
9. Imported a backup with two filenames that collided with `qa_stdin.c`; the library kept the original and added `qa_stdin-2.c` and `qa_stdin-3.c`.
10. Inspected browser developer errors/warnings: none in the tested stable page session. Transient development HMR/build messages are not production console verification.

## Fixes found during this stage

Structured execution statuses; separated diagnostics/stderr; amber warnings; copy action; bounded output capture that kills excessive writers; SIGXCPU timeout classification; address-space limit; disconnect cleanup and cleanup confirmation; optional hardened runtime; stricter HTTP/media/body validation; sanitized upstream failures; transactional filename collision protection; removed WebMCP; mobile scroll/Run usability; clear old results when importing/opening a different file; reset cursor metadata on file changes.

## Limits and remaining work

No physical phone/virtual keyboard test, load/soak test, gVisor/microVM validation, kernel-escape proof, or public deployment was performed. Public production hardening remains the explicit Prompt-4 list in README. Browser library edits in multiple tabs remain last-write-wins. Browser storage is device/origin-local and needs backups. A hard service/host failure requires external orphan reconciliation. The development toolchain's known transitive sharp advisory still needs upstream review; no image-processing feature was added.


# Blue workspace and interactive terminal upgrade

## Implementation

Preserved the React/Vinext, CodeMirror and IndexedDB architecture. Added streaming live sessions and bounded line input to the same disposable GCC runner; the original batch API remains functional. Added blue UI accents, a unified resizable terminal, Stop/Copy/Clear, draggable scrolling tabs, Quick Open, the command palette, and workspace restoration in the existing settings store. Editor undo history survives file/theme switches; source/input records and database schema are preserved.

## Checks completed

- 11 unit tests pass, including storage/import collisions, workspace restoration and generated download filename/UTF-8/backup contents.
- TypeScript check passes; production build completes. Existing Vite warnings about JSON import attributes and a large client chunk remain nonfatal.
- All 38 existing GCC/compiler/security test entries pass against the updated image.
- Interactive suite: 10 test entries pass against the authenticated compiler service and independently through the actual application API. Covers printf, sequential scanf with unflushed prompts, getchar, compiler errors, runtime errors, infinite loops, waiting-input timeout, Stop, and bounded output.
- Browser: typed qa_live.c, clicked Run, entered 10 and then 20 into the live process, and observed First / Second prompts followed by Sum: 30 and exit code 0.
- Browser: Hello World, real missing-semicolon GCC diagnostic, return code 7, infinite loop timeout via Ctrl+Enter, and manual Stop all worked.
- Browser at 390 × 844: opened drawer, selected a file, entered 21 at runtime, saw Mobile result: 42, and verified Copy excluded process metadata. Viewport override reset afterward.
- Browser: created a QA program; duplicated and renamed a QA copy; deleted only that disposable copy; searched library; viewed recent sorting; imported a colliding backup as qa_stdin-6.c and qa_stdin-7.c with originals retained.
- Browser: Quick Open Ctrl+P, filtered results and Enter; command palette Ctrl+Shift+P and Clear Terminal; Ctrl+W closes only a tab; Ctrl+1 selects first tab; Ctrl+Tab / Ctrl+Shift+Tab cycle. Closing/reopening preserves saved source and cursor.
- Browser: dragged qa_live.c before hello_world.c; resized terminal by pointer from 300 to 370 pixels; keyboard resizing also works. Refresh restored ordered tabs, selected program, cursor (line 2, column 17), terminal height, and editor scroll (543.2 pixels in the QA long file).
- Existing CodeMirror bracket pairing, undo (Ctrl+Z), Windows redo (Ctrl+Y), Tab indentation and Ctrl+Enter were exercised; basicSetup and existing keymaps remain intact.
- Natural terminal scrolling: a real program streamed 120 lines, paused, then printed Finished. Scrolling upward during the pause left scrollTop at 0 after Finished arrived rather than pulling the view back down.
- Dark/light and narrow layouts visually inspected. Fixed active-tab visibility, mobile terminal visibility on Run, and scrollbar theme. Stable browser developer logs showed no errors or warnings.

## Practical limits

The existing runtime budget is deliberately unchanged: three CPU seconds and four wall seconds, including time waiting for user input. This makes interactive sessions short; a longer human-input budget requires a separate explicit resource-policy decision. Terminal input is line based, not a shell/full ANSI screen emulator. A live process is cancelled when its stream closes; programs, tabs and editor positions persist, but running processes and terminal transcripts are not restored after refresh.

The in-app browser accepted download clicks without console errors, but its download-event hook timed out, so saving the generated files to the host Downloads folder was not independently confirmed. Generated file bytes, names and MIME types passed automated checks; the download helper now attaches its link to the DOM and allows 60 seconds before revoking its Blob URL. Physical phone keyboards and browser-reserved shortcuts in standalone Chrome were not tested. Prompt-4 hardening remains in README. Nothing was deployed.

Final resumed check: reopened the browser workspace after services were restarted; the five-tab order and 370-pixel terminal height restored. A real running program completed correctly while rapidly switching between other tabs. A final live two-input run displayed Sum: 30 and exit 0. Production build completed with exit code 0; the retained batch API passed both tests again. The local app and compiler were left running on ports 3002 and 3001.



## Interactive timeout correction — 2026-09-11

Supersedes the earlier four-second interactive waiting limitation. Interactive runs now use a three-second aggregate container CPU budget (including forked workers), 60 seconds of input/output inactivity, and a five-minute absolute session limit. Blocked scanf/getchar input does not consume executable CPU time. Batch wall timeout, compilation limits, memory/PID/output restrictions and cleanup remain unchanged. Docker, application-proxy and browser watchdogs allow the bounded interactive session to finish; Input/Stop request timeouts remain short.

All 12 interactive test entries passed through the real application API, including input delayed by 6 seconds and then 37 seconds (Product: 46), 60-second abandoned-input cleanup, infinite loops, aggregate CPU enforcement across forked workers, manual Stop and output limits. Browser testing separately waited beyond four seconds before each scanf value and displayed Sum: 25 with exit 0. Eleven unit tests, TypeScript checks, production build and both batch API tests passed. A concurrent batch probe correctly received 429 while two interactive slots were occupied; it passed after a slot was released. No labeled runner containers remained after verification. The five-minute hard cap is implemented but was not exercised with a full five-minute test.
