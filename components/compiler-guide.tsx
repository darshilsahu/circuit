export function CompilerGuide() {
  return (
    <>
      <p>
        Circuit is a free online C compiler and personal program manager. Write
        C code, compile it, and interact with a running program in your browser.
        There is no account to create or desktop compiler to install. The{' '}
        <a href="/">online C compiler workspace</a> keeps your editor, saved
        programs, and terminal together.
      </p>

      <h2>How to run a C program</h2>
      <ol>
        <li>
          Start with <code>hello_world.c</code> or create a new program. Enter
          your C source in the editor.
        </li>
        <li>
          Select <strong>Run code</strong>, or press <kbd>Ctrl</kbd> +{' '}
          <kbd>Enter</kbd>. The first run downloads the compiler assets and can
          take longer than later runs.
        </li>
        <li>
          Read output and compiler messages in the terminal. If your program
          requests input, type it there and press Enter.
        </li>
        <li>
          Edit and run again to check your changes. Use Stop if you want to end
          a running program.
        </li>
      </ol>
      <p>
        For example, a program can print a question with{' '}
        <code>printf("Number: ");</code> and read your reply with{' '}
        <code>scanf("%d", &amp;number);</code>. Declare <code>number</code> as
        an integer first and include <code>stdio.h</code>. The value you type
        appears after the prompt, even when the prompt has no newline.
      </p>

      <h2>Interactive input with scanf and getchar</h2>
      <p>
        The terminal sends your input to the actual running C program. You can
        answer several <code>scanf()</code> requests in succession without
        clicking the terminal between replies. <code>getchar()</code> also reads
        from stdin; input is submitted a line at a time when you press Enter.
        This is an interactive program terminal, not a command shell.
      </p>
      <p>
        Time spent waiting for stdin does not consume the active execution
        budget. Separate idle and session limits end abandoned programs.
        Compilation errors, nonzero exit codes, and detectable WebAssembly
        runtime failures appear in the same terminal.
      </p>

      <h2>A workspace for small C projects</h2>
      <p>
        Syntax highlighting, editor tabs, keyboard shortcuts, and a resizable
        terminal help you work through a program. You can create, rename,
        duplicate, delete, and search saved programs, or return to recent work.
        Autosave keeps edits in your browser. Download a single <code>.c</code>{' '}
        file or export your full library as a backup that you can import later.
      </p>
      <p>
        Use Circuit to practice loops and arrays, trace pointer operations,
        experiment with structures and functions, or prepare a small classroom
        example. Try changing one part of a program and comparing its output. It
        is also useful for checking a short algorithm before moving it into a
        larger project.
      </p>

      {/* Inactive placement boundary: no ad, script, placeholder, or layout gap is rendered.
          Future reviewed ads belong here, between reading sections and far below the workspace. */}
      <div
        className="editorial-ad-slot"
        data-ad-placement="guide-only"
        hidden
        aria-hidden="true"
      />

      <h2>Real C compilation inside your browser</h2>
      <p>
        Circuit uses LLVM Clang and a WebAssembly runtime. Compilation and
        execution happen in a Web Worker on your device, so a busy program does
        not run on the editor's main thread. Source code and terminal input are
        not sent to a remote compilation service.
      </p>
      <p>
        The compiler targets C17 with WASI libraries. Common standard C features
        work, including functions, arrays, structures, pointers, and dynamic
        memory allocation. Operating-system-specific headers, native processes,
        and a full Linux environment are outside its scope. Resource limits keep
        runs bounded; an older or low-memory device may have difficulty loading
        the compiler.
      </p>

      <h2>Your programs stay in local browser storage</h2>
      <p>
        Your program library is stored in IndexedDB on this device and browser
        profile. It can persist after you close the website, but it does not
        sync between devices. Clearing site data, using private browsing, or
        browser storage eviction can remove it. Export a backup before changing
        browsers or clearing storage.
      </p>
      <p>
        The website still downloads its static files over the internet, and the
        hosting provider can process ordinary connection data. Read the{' '}
        <a href="/privacy">Privacy Policy</a> for details about local storage,
        hosting, and any future advertising. Learn more{' '}
        <a href="/about">about Circuit</a> or visit{' '}
        <a href="/contact">Contact</a> for reporting guidance.
      </p>
    </>
  );
}
