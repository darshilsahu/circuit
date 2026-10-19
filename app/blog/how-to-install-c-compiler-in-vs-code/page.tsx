import { Breadcrumbs, ContentSchema } from '@/components/content-schema';
import { InfoPage } from '@/components/info-page';
import { blogPosts } from '@/lib/content/blog';
import { pageMetadata, siteUrl } from '@/lib/site';

const post = blogPosts[0];
const path = '/blog/' + post.slug;
export const metadata = pageMetadata(post.title + ' | Circuit', post.description, path);

const hello = '#include <stdio.h>\n\nint main() {\n    printf("Hello, C!\\n");\n    return 0;\n}';
const input = '#include <stdio.h>\n\nint main() {\n    int number;\n\n    printf("Enter an integer: ");\n    fflush(stdout);\n\n    if (scanf("%d", &number) != 1) {\n        fprintf(stderr, "That was not an integer.\\n");\n        return 1;\n    }\n\n    printf("You entered %d.\\n", number);\n    return 0;\n}';
const buildTask = JSON.stringify({
  version: '2.0.0',
  tasks: [{
    label: 'Build active C file',
    type: 'process',
    command: 'gcc',
    args: ['-std=c17', '-Wall', '-Wextra', '-g', '${file}', '-o', '${fileDirname}/${fileBasenameNoExtension}'],
    options: { cwd: '${fileDirname}' },
    windows: {
      command: 'C:/msys64/ucrt64/bin/gcc.exe',
      args: ['-std=c17', '-Wall', '-Wextra', '-g', '${file}', '-o', '${fileDirname}/${fileBasenameNoExtension}.exe'],
    },
    osx: { command: 'clang' },
    problemMatcher: ['$gcc'],
    group: { kind: 'build', isDefault: true },
  }],
}, null, 2);

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
  publisher: { '@type': 'Organization', name: 'Circuit', url: siteUrl + '/', logo: { '@type': 'ImageObject', url: siteUrl + '/icon-512.png' } },
  isPartOf: { '@type': 'Blog', name: 'Circuit Blog', url: siteUrl + '/blog' },
};

export default function InstallCompilerGuide() {
  const section = { title: 'Blog', path: '/blog' };
  return (
    <InfoPage title={post.title}>
      <ContentSchema title={post.title} description={post.description} path={path} section={section} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData).replace(/</g, '\\u003c') }} />
      <Breadcrumbs section={section} title={post.title} />
      <p className="content-note">By <a href="/about">Circuit</a> · Published <time dateTime={post.published}>October 5, 2026</time> · Installation steps checked against official documentation</p>
      <article>
        <p className="content-lead">To use a C compiler in VS Code, install a toolchain on your computer, make sure the terminal can find it, and then connect the editor to it. This guide takes you from an empty setup to a compiled C program, a repeatable build task, and working scanf input.</p>
        <p>The most useful checkpoint is simple: compile one small source file from the integrated terminal before configuring buttons or a debugger. If that works, you have a working compiler and can investigate editor configuration separately. If it fails, a short terminal command gives you a clearer starting point than several extensions running at once.</p>

        <nav className="content-toc" aria-label="Article sections"><h2>In this guide</h2><ol>
          <li><a href="#tools">Understand the tools and choose your setup</a></li>
          <li><a href="#windows">Windows: install GCC with MSYS2</a></li>
          <li><a href="#macos">macOS: install Clang</a></li>
          <li><a href="#linux">Linux: install GCC</a></li>
          <li><a href="#first-build">Compile and run your first C file</a></li>
          <li><a href="#build-task">Add a VS Code build task</a></li>
          <li><a href="#stdin">Test scanf in the terminal</a></li>
          <li><a href="#troubleshooting">Troubleshoot the failure you actually have</a></li>
          <li><a href="#next">Verify the setup and choose the next step</a></li>
        </ol></nav>

        <section id="tools">
          <h2>1. Understand what you are installing</h2>
          <p>VS Code edits your source. A compiler such as GCC or Clang translates it, and a linker connects it with library implementations. A debugger lets you pause execution and inspect state. Installing an editor extension does not supply all those tools. Microsoft’s <a href="https://code.visualstudio.com/docs/languages/cpp">C/C++ extension documentation</a> makes that distinction explicit.</p>
          <p>Install <a href="https://code.visualstudio.com/Download">VS Code from its official download page</a>. In Extensions, search for <strong>C/C++</strong>, published by Microsoft; its identifier is <code>ms-vscode.cpptools</code>. Despite the name, it supports C source as well as C++. It provides editor and debugging integration. You do not need a separate Code Runner extension for the workflow below.</p>
          <div className="content-table"><table><caption>Setup paths used in this article</caption><thead><tr><th scope="col">Computer</th><th scope="col">Toolchain</th><th scope="col">Check command</th></tr></thead><tbody>
            <tr><th scope="row">Windows x64</th><td>MSYS2 UCRT64 GCC / MinGW-w64</td><td><code>gcc --version</code></td></tr>
            <tr><th scope="row">macOS</th><td>Apple Command Line Tools / Clang</td><td><code>clang --version</code></td></tr>
            <tr><th scope="row">Ubuntu or Debian Linux</th><td>GCC from distribution packages</td><td><code>gcc --version</code></td></tr>
          </tbody></table></div>
          <p>If your course specifies a toolchain, use that requirement first. This article’s Windows commands are for the x64 UCRT64 environment. Windows ARM64 and other Linux distributions have different installation choices; consult their official instructions rather than mixing package names from unrelated platforms.</p>
        </section>

        <section id="windows">
          <h2>2. Windows: install GCC through MSYS2</h2>
          <h3>Install and update MSYS2</h3>
          <p>Download MSYS2 from <a href="https://www.msys2.org/">the official MSYS2 website</a> and follow the installer. The default folder is <code>C:\msys64</code>. The current installer requires a supported 64-bit Windows version; check the requirements on that page before downloading. The remaining paths assume this default location.</p>
          <p>Open <strong>MSYS2 UCRT64</strong> from the Start menu. Update packages using the command below. If the updater asks you to close the terminal, finish that step, reopen UCRT64, and run the update again. Follow <a href="https://www.msys2.org/docs/updating/">MSYS2’s update instructions</a> for any required restart.</p>
          <pre aria-label="Update MSYS2 packages"><code>pacman -Syu</code></pre>
          <p>In the MSYS2 terminal, install the toolchain:</p>
          <pre aria-label="Install the Windows UCRT64 toolchain"><code>pacman -S --needed base-devel mingw-w64-ucrt-x86_64-toolchain</code></pre>
          <p>Accept the package selection and installation prompts. This toolchain includes GCC and GDB. The command follows <a href="https://code.visualstudio.com/docs/cpp/config-mingw">Microsoft’s MinGW setup guide</a>; for C files, we will call gcc rather than the g++ command used in its C++ example. Do not enter pacman commands in an ordinary PowerShell terminal.</p>
          <h3>Add the compiler directory to PATH</h3>
          <p>In Windows, search for “Edit environment variables for your account.” Edit the user <strong>Path</strong> variable and add a new entry:</p>
          <pre aria-label="Windows compiler directory"><code>{'C:\\msys64\\ucrt64\\bin'}</code></pre>
          <p>Keep the existing entries. Close all VS Code windows, reopen the editor, and choose <strong>Terminal → New Terminal</strong>. In PowerShell, verify both the version and the executable location:</p>
          <pre aria-label="Verify GCC and GDB in PowerShell"><code>{'gcc --version\ngdb --version\nwhere.exe gcc'}</code></pre>
          <p>The location should include <code>C:\msys64\ucrt64\bin\gcc.exe</code>. If another GCC appears first, you have more than one installation and should select the intended one explicitly. Avoid substituting <code>C:\msys64\usr\bin</code>: that belongs to a different environment. <a href="https://www.msys2.org/docs/environments/">MSYS2’s environment reference</a> explains why UCRT64 and MSYS are distinct.</p>
        </section>

        <section id="macos">
          <h2>3. macOS: install the command-line Clang toolchain</h2>
          <p>First open Terminal and try <code>clang --version</code>. If it reports an Apple Clang version, a compiler is already available. Otherwise request the command-line developer tools:</p>
          <pre aria-label="Install and verify Clang on macOS"><code>{'xcode-select --install\nclang --version'}</code></pre>
          <p>Complete the installation dialog before running the version check. You do not need to install the full Xcode application just for the small C programs in this guide. See <a href="https://developer.apple.com/xcode/resources/">Apple’s Command Line Tools resources</a> and <a href="https://code.visualstudio.com/docs/cpp/config-clang-mac">VS Code’s macOS Clang guide</a> for the official setup path.</p>
          <p>Reopen VS Code after installation and check the command in its integrated terminal too. Use <code>clang</code> for the following C builds. Some macOS systems expose a gcc command that is backed by Apple Clang, so inspect the version output rather than assuming the command name identifies the implementation.</p>
        </section>

        <section id="linux">
          <h2>4. Linux: install GCC and verify the environment</h2>
          <p>On Ubuntu or Debian, open a terminal and install the build tools and GDB:</p>
          <pre aria-label="Install GCC and GDB on Ubuntu or Debian"><code>{'sudo apt-get update\nsudo apt-get install build-essential gdb\ngcc --version\ngdb --version'}</code></pre>
          <p>These are package-manager commands for those distributions. Fedora, Arch, and other distributions use their own packages and installation commands. Microsoft’s <a href="https://code.visualstudio.com/docs/cpp/config-linux">Linux GCC guide</a> documents the Ubuntu setup and compiler checks.</p>
          <p>For this local workflow, run the check and the program in the same environment. A compiler installed inside WSL is not automatically a native Windows compiler available to PowerShell. If you choose WSL, work in a VS Code WSL window and use its Linux terminal throughout; use a Windows UCRT64 setup when you want Windows executables.</p>
        </section>

        <section id="first-build">
          <h2>5. Compile a C program before configuring the editor</h2>
          <p>Create a folder called <code>c-practice</code> and open it through <strong>File → Open Folder</strong>. Save a file named <code>hello.c</code> containing the following source. Use the .c extension: naming a file .cpp selects a different language workflow.</p>
          <pre aria-label="Hello World C source"><code>{hello}</code></pre>
          <p>The header declares printf, main contains the executed statements, and return zero reports success. The newline escape finishes the output line. Save the source before compiling; the terminal compiler reads the file on disk, not unsaved editor text.</p>
          <h3>Windows PowerShell</h3>
          <pre aria-label="Build and run C in Windows PowerShell"><code>{'gcc -std=c17 -Wall -Wextra -g hello.c -o hello.exe\n.\\hello.exe'}</code></pre>
          <h3>Linux terminal</h3>
          <pre aria-label="Build and run C on Linux"><code>{'gcc -std=c17 -Wall -Wextra -g hello.c -o hello\n./hello'}</code></pre>
          <h3>macOS terminal</h3>
          <pre aria-label="Build and run C on macOS"><code>{'clang -std=c17 -Wall -Wextra -g hello.c -o hello\n./hello'}</code></pre>
          <p>Run the second line only after the first finishes successfully. In all three cases, the expected program output is <code>Hello, C!</code>. A successful compile commonly produces no terminal message at all. Look for the generated executable, then launch it.</p>
          <p>The <code>-std=c17</code> option chooses the language standard; <code>-Wall -Wextra</code> enables useful warnings; <code>-g</code> adds debugging information; and <code>-o</code> names the output. These commands build and link a single file. Consult GCC’s <a href="https://gcc.gnu.org/onlinedocs/gcc/Overall-Options.html">overall options</a> and <a href="https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html">warning options</a> for the exact behavior. Warning flags do not establish that a program is correct or memory-safe.</p>
        </section>

        <section id="build-task">
          <h2>6. Give VS Code a repeatable build task</h2>
          <p>Once the terminal build works, create <code>.vscode/tasks.json</code> inside your project folder. Use this configuration for the active C file. Change the Windows compiler path if you installed MSYS2 elsewhere.</p>
          <pre tabIndex={0} aria-label="VS Code tasks.json for a single C source file"><code>{buildTask}</code></pre>
          <p>This task launches the compiler as a process and passes each argument separately. Its Windows override generates an .exe file and uses the known UCRT64 compiler; macOS selects clang; Linux uses gcc from PATH. These platform overrides and the problem matcher are documented in <a href="https://code.visualstudio.com/docs/debugtest/tasks">VS Code’s task reference</a>.</p>
          <p>Save hello.c, keep it as the active editor, and select <strong>Terminal → Run Build Task</strong>, or press Ctrl+Shift+B on Windows/Linux and Cmd+Shift+B on macOS. The task compiles the active file. If tasks.json itself is active, you will be passing JSON to the compiler, so select your C tab first.</p>
          <p>This task builds an executable; it does not launch it. Run the output from the terminal using the platform command above. Later, a project with several C files needs a build command that lists its sources or a build system. Do not assume that opening several tabs makes this single-file task link them together.</p>
          <h3>Keep IntelliSense and the build configuration consistent</h3>
          <p>Open the Command Palette and choose <strong>C/C++: Edit Configurations (UI)</strong>. Set Compiler path to the compiler used by your task and choose C17 as the C standard. This helps the extension understand your environment; it does not rewrite tasks.json. If the terminal build succeeds but the editor marks standard headers as missing, investigate this configuration before changing valid C code.</p>
        </section>

        <section id="stdin">
          <h2>7. Test scanf in an interactive terminal</h2>
          <p>Save this as <code>input.c</code>. It prints a prompt, checks one integer conversion, and echoes the value. The flush makes the prompt visible before the read; fprintf sends an invalid-input message to stderr.</p>
          <pre aria-label="C source that reads terminal input"><code>{input}</code></pre>
          <p>Build input.c using the task, then run <code>.\input.exe</code> in PowerShell or <code>./input</code> on Linux/macOS. Type 42 and press Enter. You should see <code>You entered 42.</code> Run again with a letter to check the rejection path. Use small, representable integer values for this introductory example.</p>
          <p>When the program waits, enter data in the terminal that launched it. The Output panel and Debug Console are not substitutes for an stdin-capable terminal. If you use another extension and it runs the program in an output-only panel, change that extension’s execution settings or return to the terminal workflow. Microsoft’s <a href="https://code.visualstudio.com/docs/cpp/faq-cpp">C/C++ FAQ</a> explains the terminal requirement for input during debugging.</p>
          <p>To begin debugging, use the C/C++ extension’s build-and-debug action for the active C file and select your installed compiler. Check that its build task uses gcc or clang and that its debugger exists. Keep stdin in an integrated or external terminal. The build task here includes debugging symbols, but it does not by itself create a debugger configuration.</p>
        </section>

        <section id="troubleshooting">
          <h2>8. Diagnose the setup problem before reinstalling</h2>
          <h3>“gcc is not recognized” or “command not found”</h3>
          <p>The shell cannot locate the executable. On Windows, try <code>&amp; "C:\msys64\ucrt64\bin\gcc.exe" --version</code> in PowerShell. If that works, check PATH and restart VS Code. If it does not, inspect whether the toolchain package was installed in the expected folder. The ampersand invokes a quoted executable path in PowerShell.</p>
          <h3>“hello.c: No such file or directory”</h3>
          <p>Check the terminal’s current folder using <code>pwd</code>, then list its files with <code>dir</code> in PowerShell or <code>ls</code> on Linux/macOS. Save the editor file and move to its directory. Distinguish a missing source path from a broken compiler installation.</p>
          <h3>The old result runs after an edit</h3>
          <p>Save and rebuild, then check the compiler’s exit result. If compilation failed, an older executable can still exist on disk. Launching it does not mean the new source compiled. Keep build and run as separate steps until you can recognize that failure.</p>
          <h3>The terminal works, but the build button fails</h3>
          <p>Compare the successful command with the task’s command, arguments, working folder, and output path. A stale path in tasks.json is not repaired by changing IntelliSense settings. Ensure hello.c is active and that the output name matches the file you launch.</p>
          <h3>The program shows a prompt and then waits</h3>
          <p>A successful read normally waits for input. Click the running terminal and submit a line. If it still waits, inspect the format string and any earlier unread input. For example, trailing whitespace in a scanf format can require another non-whitespace character. See our <a href="/learn/printf-and-scanf">input guide</a> for a language-level explanation.</p>
          <h3>A run fails for a reason unrelated to installation</h3>
          <p>Once Hello World compiles and runs, a missing semicolon, invalid pointer, or undefined function in another exercise needs its own diagnosis. Read the earliest meaningful message and reduce the failing source. Our <a href="/learn/common-compiler-errors">compiler error guide</a> separates common source mistakes from environment problems.</p>
        </section>

        <section id="next">
          <h2>9. Verify the complete workflow</h2>
          <p>Your setup is ready for small C exercises when the compiler reports its version in VS Code’s terminal, hello.c builds with no unexplained diagnostics, the new executable prints the greeting, the build task compiles the active file, and input.c accepts a reply in the running terminal. Each checkpoint confirms a different connection; a working extension icon alone confirms none of them.</p>
          <p>Next, change the input example into a small calculation or split that calculation into a function. Keep known test inputs and expected results. Add a debugger when you need to inspect variables rather than repeatedly printing them, and move to a project build system when multiple files become necessary.</p>
          <p>You can also test a portable exercise in the <a href="/">Circuit online C compiler</a>, then download its .c source for your desktop setup. Circuit uses Clang and WebAssembly rather than a native GCC environment, so check <a href="/docs#environment">its runtime boundaries</a> before comparing platform-specific code. The <a href="/learn/online-compiler-vs-gcc">browser and desktop compiler comparison</a> explains when each workflow helps.</p>
        </section>
      </article>
      <aside className="editorial-next"><h2>Continue with a small working program</h2><p><a href="/learn/first-c-program">Understand your first C program</a>, explore the <a href="/examples">worked examples</a>, or return to the <a href="/blog">Circuit Blog</a>. If you find an unclear step, <a href="/contact">send feedback</a> with your operating system, terminal, and exact error message.</p></aside>
    </InfoPage>
  );
}
