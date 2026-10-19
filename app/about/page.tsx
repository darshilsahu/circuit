import { InfoPage } from '@/components/info-page';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'About Circuit | Online C Compiler',
  'Learn how Circuit provides an online C compiler with interactive input, browser-based execution, and a local program library.',
  '/about',
);

export default function About() {
  return (
    <InfoPage title="About Circuit">
      <p>
        Circuit is a free online C compiler and browser-based coding environment
        for learning, experimentation, and small programs. Its purpose is simple: give you a
        place to write C, run it, and return to your saved work without setting
        up an account or installing a desktop toolchain.
      </p>
      <h2>From an idea to a running program</h2>
      <p>
        The workspace brings together a syntax-highlighted editor, program tabs,
        and an interactive terminal. You can test a function, practice pointers,
        or step through the output of a loop. When a program asks for input,
        reply directly in the terminal and continue with the next question.
      </p>
      <h2>How it is built</h2>
      <p>
        The compiler uses LLVM Clang compiled to WebAssembly, distributed
        through YoWASP, with WASI libraries and a browser runtime. It executes
        in a Web Worker on your device. Circuit provides the surrounding
        workspace and program manager; it does not build a new C compiler or
        send your programs to a remote compilation service.
      </p>
      <p>
        LLVM, Clang, WebAssembly, and the other third-party components belong to
        their respective projects; Circuit is not their official service.
      </p>
      <h2>Local by design</h2>
      <p>
        Programs are stored in your browser using IndexedDB. Export and import
        let you move your own backups between browsers or devices. There is no
        account-based synchronization, and browser storage is not a substitute
        for a backup.
      </p>
      <h2>Scope and limitations</h2>
      <p>The <a href="/learn">Learn C guides</a> explain the language behind the workspace, and the <a href="/examples">examples library</a> connects those ideas to complete, testable programs. The goal is to help you understand and check your own work, not merely copy an answer. See the <a href="/docs">documentation</a> for actual features, storage behavior, and execution limits.</p>
      <p>
        Circuit is intended for short, single-source C programs. It is not a
        full operating system, project build server, or production testing
        service. Some native libraries and operating-system APIs are
        unavailable. Execution and memory limits apply, and compatibility
        depends on your browser and device.
      </p>
      <p>
        <a href="/">Open the online C compiler</a>, read our{' '}
        <a href="/privacy">Privacy Policy</a>, or see{' '}
        <a href="/contact">Contact</a> for feedback and support information.
      </p>
    </InfoPage>
  );
}
