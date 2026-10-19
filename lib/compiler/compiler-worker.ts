/// <reference lib="webworker" />
import {
  WASI,
  OpenFile,
  File,
  ConsoleStdout,
  PreopenDirectory,
} from '@bjorn3/browser_wasi_shim';
import {
  ACTIVE_MS,
  STARTED_AT,
  STATE,
  READ,
  WRITE,
  RUNNING,
  WAITING,
  CONTROL_BYTES,
  OUTPUT_LIMIT,
  IDLE_LIMIT_MS,
} from './protocol';
import type { CompilerEvent } from './protocol';

const worker = self as unknown as DedicatedWorkerGlobalScope;
const send = (event: CompilerEvent) => worker.postMessage(event);
class LimitError extends Error {
  constructor(
    public status: string,
    message: string,
  ) {
    super(message);
  }
}
async function loadCompiler() {
  const base = new URL('./toolchain/', worker.location.href);
  const nativeFetch = globalThis.fetch.bind(globalThis);
  const response = await nativeFetch(new URL('assets.json', base));
  if (!response.ok)
    throw new Error(
      'Could not load browser compiler assets. Reload and try again.',
    );
  const manifest = (await response.json()) as Record<
    string,
    { parts: string[]; length: number; sha256: string }
  >;
  // Published toolchain code stays unchanged; unpack the static asset transport here.
  globalThis.fetch = async (input, init) => {
    const url = new URL(
      input instanceof Request ? input.url : String(input),
      worker.location.href,
    );
    const entry = url.href.startsWith(base.href)
      ? manifest[url.href.slice(base.href.length)]
      : undefined;
    if (!entry) return nativeFetch(input, init);
    const parts = await Promise.all(
      entry.parts.map(async (part) => {
        const result = await nativeFetch(new URL(part, base), init);
        if (!result.ok)
          throw new Error(
            'Could not download browser compiler. Check your connection and retry.',
          );
        return result.arrayBuffer();
      }),
    );
    const bytes = await new Response(
      new Blob(parts).stream().pipeThrough(new DecompressionStream('gzip')),
    ).arrayBuffer();
    const hash = Array.from(
      new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)),
      (b) => b.toString(16).padStart(2, '0'),
    ).join('');
    if (bytes.byteLength !== entry.length || hash !== entry.sha256)
      throw new Error(
        'Browser compiler asset integrity check failed. Reload and retry.',
      );
    return new Response(bytes, {
      headers: {
        'Content-Type': url.pathname.endsWith('.wasm')
          ? 'application/wasm'
          : 'application/octet-stream',
        'Content-Length': String(bytes.byteLength),
      },
    });
  };
  const toolchain = await import(
    /* @vite-ignore */ new URL('bundle.js', base).href
  );
  await toolchain.runClang(null);
  return toolchain;
}
worker.onmessage = async ({
  data,
}: MessageEvent<{ code: string; buffer: SharedArrayBuffer }>) => {
  let stage = 'loading';
  const control = new Int32Array(data.buffer, 0, CONTROL_BYTES / 4);
  const input = new Uint8Array(data.buffer, CONTROL_BYTES);
  const pending = { stdout: '', stderr: '', diagnostics: '' };
  const counts = { stdout: 0, stderr: 0, diagnostics: 0 };
  const decoders = {
    stdout: new TextDecoder(),
    stderr: new TextDecoder(),
    diagnostics: new TextDecoder(),
  };
  let lastFlush = 0;
  let lastType: keyof typeof pending | undefined;
  function flush() {
    for (const type of ['stdout', 'stderr', 'diagnostics'] as const) {
      if (pending[type]) {
        send({ type, text: pending[type] });
        pending[type] = '';
      }
    }
    lastFlush = performance.now();
  }
  function output(type: keyof typeof pending, bytes: Uint8Array | null) {
    if (!bytes) return;
    if (lastType && lastType !== type) flush();
    lastType = type;
    const remaining = Math.max(0, OUTPUT_LIMIT - counts[type]);
    counts[type] += bytes.length;
    pending[type] += decoders[type].decode(bytes.subarray(0, remaining), {
      stream: true,
    });
    if (pending[type].length >= 4096 || performance.now() - lastFlush > 16)
      flush();
    if (counts[type] > OUTPUT_LIMIT) {
      flush();
      throw new LimitError('output_limit', 'Output limit exceeded.');
    }
  }
  const resume = () => {
    Atomics.store(control, STARTED_AT, Date.now() | 0);
    Atomics.store(control, STATE, RUNNING);
  };
  class TerminalInput extends OpenFile {
    constructor() {
      super(new File([]));
    }
    fd_read(size: number) {
      if (!size) return { ret: 0, data: new Uint8Array() };
      let read = Atomics.load(control, READ);
      while (read === Atomics.load(control, WRITE)) {
        flush();
        Atomics.add(
          control,
          ACTIVE_MS,
          ((Date.now() | 0) - Atomics.load(control, STARTED_AT)) | 0,
        );
        Atomics.store(control, STATE, WAITING);
        send({ type: 'waiting' });
        const result = Atomics.wait(control, WRITE, read, IDLE_LIMIT_MS);
        resume();
        if (result === 'timed-out' && read === Atomics.load(control, WRITE))
          throw new LimitError(
            'timed_out',
            'Session expired while waiting for input.',
          );
        read = Atomics.load(control, READ);
      }
      const end = Math.min(Atomics.load(control, WRITE), read + size);
      const bytes = input.slice(read, end);
      Atomics.store(control, READ, end);
      return { ret: 0, data: bytes };
    }
  }
  try {
    const clang = await loadCompiler();
    stage = 'compiling';
    send({ type: 'compiling' });
    const files = await clang.runClang(
      [
        'clang',
        '-std=c17',
        '-O0',
        '-Wall',
        '-Wextra',
        '-fno-color-diagnostics',
        '-Wl,-z,stack-size=1048576',
        '-Wl,--max-memory=134217728',
        'main.c',
        'circuit-stdio.c',
        '-lm',
        '-o',
        'program.wasm',
      ],
      {
        'main.c': data.code,
        // Real libc configuration, equivalent to the former stdbuf runner.
        'circuit-stdio.c':
          '#include <stdio.h>\n__attribute__((constructor)) static void circuit_stdio(void) { setvbuf(stdout, 0, _IONBF, 0); setvbuf(stderr, 0, _IONBF, 0); }\n',
      },
      {
        stdout: (bytes: Uint8Array | null) => output('diagnostics', bytes),
        stderr: (bytes: Uint8Array | null) => output('diagnostics', bytes),
      },
    );
    flush();
    if (!(files?.['program.wasm'] instanceof Uint8Array))
      throw new Error('Clang did not produce a WebAssembly executable.');
    const wasi = new WASI(
      ['main.c'],
      [],
      [
        new TerminalInput(),
        new ConsoleStdout((bytes) => output('stdout', bytes)),
        new ConsoleStdout((bytes) => output('stderr', bytes)),
        new PreopenDirectory('.', new Map()),
      ],
    );
    const module = await WebAssembly.compile(
      new Uint8Array(files['program.wasm']),
    );
    const instance = await WebAssembly.instantiate(module, {
      wasi_snapshot_preview1: wasi.wasiImport,
    });
    stage = 'running';
    resume();
    send({ type: 'running' });
    const exitCode = wasi.start(instance as Parameters<WASI['start']>[0]);
    flush();
    send({
      type: 'result',
      status: exitCode === 0 ? 'succeeded' : 'runtime_error',
      exitCode,
      message: `Process exited with code ${exitCode}.`,
    });
  } catch (error) {
    flush();
    const status =
      error instanceof LimitError
        ? error.status
        : stage === 'running'
          ? 'runtime_error'
          : stage === 'compiling'
            ? 'compile_error'
            : 'service_unavailable';
    const exitCode =
      typeof (error as { code?: unknown })?.code === 'number'
        ? (error as { code: number }).code
        : null;
    const message =
      error instanceof LimitError
        ? error.message
        : stage === 'compiling' && counts.diagnostics
          ? 'Compilation failed.'
          : `${stage === 'running' ? 'Runtime error' : 'Browser compiler error'}: ${error instanceof Error ? error.message : String(error)}`;
    send({ type: 'result', status, exitCode, message });
  }
};
