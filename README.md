# Circuit — browser-based C compiler

Circuit keeps the React/Vinext workspace, CodeMirror editor, inline terminal,
IndexedDB program library, tabs, autosave, shortcuts, themes, and backup format.
C now compiles and runs entirely in a browser Web Worker. There is no compiler
API, remote fallback, Docker requirement, server-side execution, or server-side
program storage.

## Build and preview

Use Node **22.22.1** (`.nvmrc` and `.node-version` are included). Node is needed
only for installing/building the frontend or serving a local preview, never for
executing a user's C program. Node 24 on Windows caused the installed Vinext
static exporter to fail during native shutdown; Node 22 was verified.

```sh
npm ci
npm run build
npm start
```

`npm start` serves plain files from `dist/client` at http://localhost:3002.
For development, use `npm run dev -- --port=3002 --hostname=localhost`.
Both build and development automatically package the pinned compiler assets.
No environment variables, backend service, accounts, or credentials are required.
Existing ignored `.env` / `.dev.vars` files from the former backend are unused.

## Cloudflare Pages (.pages.dev)

Create a **Pages** project with these settings:

- Framework preset: None
- Build command: `npm run build`
- Build output directory: `dist/client`
- Build environment variable: `NODE_VERSION=22.22.1`

Alternatively upload the complete `dist/client` output as a static Pages site.
Do not upload `dist/server`: it is only Vinext's intermediate build/prerender
output. There are no Pages Functions or Workers needed at runtime.

Keep the included `_headers` file. Its COOP `same-origin` and COEP `require-corp`
headers enable cross-origin isolation and SharedArrayBuffer for real blocking
stdin. HTTPS or localhost and a modern browser are required. The app reports a
clear error if isolation is missing; it never falls back to a server compiler.
All fonts, worker scripts, compiler binaries, and C libraries are same-origin
assets. Large compiler assets are compressed and split below Pages' 25 MiB
per-file limit, then integrity-checked and decompressed inside the worker.

Browser storage is origin-local. Export from localhost and import on the new
.pages.dev domain to transfer an existing library. A fresh browser starts with
only hello_world.c; subsequent user-created programs persist as before.

## Compiler and interactive runtime

- Compiler: LLVM Clang/LLD, published WASM package
  `@yowasp/clang@22.0.0-git20542-10` (LLVM development snapshot, pinned exactly).
  This is the real LLVM compiler, not a C interpreter or output simulation.
  The YoWASP GitHub packaging repository is archived; the pinned package was
  selected for its complete self-contained Clang/LLD and WASI sysroot and was
  tested here. Future upgrades should re-run the full browser suite.
- Runtime: the browser's WebAssembly engine with
  `@bjorn3/browser_wasi_shim@0.4.2` and WASI libc.
- Each Run creates a fresh module Web Worker. Clang and LLD compile C17 with
  warnings, then the worker instantiates the generated WASM executable.
- Real libc streams are configured unbuffered in a separate constructor unit,
  preserving prompts without newlines without rewriting the user's source.
- stdin uses a single-producer/single-consumer shared byte buffer. The worker's
  WASI read blocks with Atomics.wait while the UI stays responsive. Enter
  publishes the actual UTF-8 input and wakes it. stdout/stderr are decoded and
  streamed back to the existing terminal; no separate input box was added.
- Stop calls Worker.terminate, including during compilation, infinite loops, or
  blocked stdin. Closing/reloading the page discards the running session.
- Waiting input is excluded from the 3-second **active execution** time budget.
  Browsers do not expose reliable per-worker CPU accounting, so this is active
  elapsed time, not the old server CPU measurement. A separate 60-second input
  idle limit and 5-minute total session limit remain. Compilation is capped at
  60 seconds after assets load; initial loading at 120 seconds.
- Source is capped at 100,000 UTF-8 bytes, total stdin at 16,000 bytes, and each
  output stream at 64 KiB. Output is batched to avoid overwhelming the UI.
  Generated program memory is limited to 128 MiB. Compiler memory is separate
  and larger: LLVM's WASM binary expands to about 72 MiB plus its sysroot and
  working memory. Low-memory devices can fail to load it.
- Initial toolchain transfer is about **26 MiB compressed**, loaded on Run.
  Normal browser HTTP caching can reuse these static assets on subsequent runs.

Standard C features, printf/scanf/getchar, arrays, pointers, structures,
functions, recursion, malloc/free and libm are tested. This is a WASI target,
not a Linux/GCC environment: fork, native process spawning, arbitrary network
access, platform-specific headers and full POSIX behavior are not promised.
WASM traps and nonzero exits are reported, but C undefined behavior (including
some invalid pointer accesses within linear memory) is not always detectable.
The terminal remains line-oriented, not a full shell or ANSI/PTY emulator.

## Verification

```sh
npm test
npx tsc --noEmit
npm run build
npm run test:browser
```

The last command serves the static build and browser tests at
http://localhost:3003/__tests/. Click **Run tests**. The harness compiles every
case inside a real browser using exactly the same BrowserSession and worker.
Test harness files are outside the production output.

The browser suite covers printf, one/three scanf, six-second delayed stdin,
getchar, UTF-8 stdout/stderr, loops, arrays, functions, recursion, pointers,
structures, allocation, libm, errors/warnings, nonzero exit, runtime traps,
infinite-loop timeout, Stop, UI responsiveness, output limit and recovery.
Separate app acceptance checks cover inline input focus and tab switching.
Existing storage/import/export/download/workspace unit checks are retained.

Third-party licenses are shipped under `/licenses/`. See VERIFICATION.md for
observed results and limitations. Nothing has been publicly deployed yet.
