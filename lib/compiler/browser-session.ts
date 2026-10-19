import {
  INPUT_LIMIT,
  CONTROL_BYTES,
  WRITE,
  STATE,
  ACTIVE_MS,
  STARTED_AT,
  RUNNING,
  WAITING,
  ACTIVE_LIMIT_MS,
  IDLE_LIMIT_MS,
  SESSION_LIMIT_MS,
} from './protocol';
import type { CompilerEvent } from './protocol';

export class BrowserSession {
  private worker: Worker;
  private control: Int32Array;
  private bytes: Uint8Array;
  private timer: ReturnType<typeof setInterval>;
  private finished = false;
  private phase = 'loading';
  private started = Date.now();
  private phaseStarted = this.started;
  private lastActivity = this.started;
  constructor(
    code: string,
    private receive: (event: CompilerEvent) => void,
  ) {
    if (
      !globalThis.crossOriginIsolated ||
      typeof SharedArrayBuffer === 'undefined'
    )
      throw new Error(
        'Interactive C requires cross-origin isolation. Serve this site with its included COOP/COEP headers over HTTPS or localhost.',
      );
    if (new TextEncoder().encode(code).length > 100000)
      throw new Error('Source code must be smaller than 100,000 UTF-8 bytes.');
    const buffer = new SharedArrayBuffer(CONTROL_BYTES + INPUT_LIMIT);
    this.control = new Int32Array(buffer, 0, CONTROL_BYTES / 4);
    this.bytes = new Uint8Array(buffer, CONTROL_BYTES);
    this.worker = new Worker('/compiler/worker.js', {
      type: 'module',
      name: 'Circuit C compiler',
    });
    this.worker.onmessage = ({ data }: MessageEvent<CompilerEvent>) => {
      if (this.finished) return;
      if (data.type === 'result') {
        this.finish(data);
        return;
      }
      if (data.type === 'compiling' || data.type === 'running') {
        this.phase = data.type;
        this.phaseStarted = Date.now();
      }
      if (
        data.type === 'stdout' ||
        data.type === 'stderr' ||
        data.type === 'waiting'
      )
        this.lastActivity = Date.now();
      receive(data);
    };
    this.worker.onerror = (event) => {
      event.preventDefault();
      this.finish({
        type: 'result',
        status: 'runtime_error',
        message: `Browser compiler error: ${event.message || 'Worker failed to start.'}`,
        exitCode: null,
      });
    };
    this.timer = setInterval(() => {
      const now = Date.now();
      const state = Atomics.load(this.control, STATE);
      const active =
        Atomics.load(this.control, ACTIVE_MS) +
        (state === RUNNING
          ? ((now | 0) - Atomics.load(this.control, STARTED_AT)) | 0
          : 0);
      if (this.phase === 'running' && active >= ACTIVE_LIMIT_MS)
        this.timeout('Execution time limit exceeded.');
      else if (
        this.phase === 'running' &&
        state === WAITING &&
        now - this.lastActivity >= IDLE_LIMIT_MS
      )
        this.timeout('Session expired while waiting for input.');
      else if (now - this.started >= SESSION_LIMIT_MS)
        this.timeout('Session time limit exceeded.');
      else if (this.phase === 'compiling' && now - this.phaseStarted >= 60000)
        this.timeout('Compilation timed out.');
      else if (this.phase === 'loading' && now - this.phaseStarted >= 120000)
        this.timeout(
          'Browser compiler download timed out. Check your connection and retry.',
        );
    }, 50);
    this.worker.postMessage({ code, buffer });
  }
  input(text: string) {
    if (this.finished || this.phase !== 'running') return false;
    const bytes = new TextEncoder().encode(text);
    const write = Atomics.load(this.control, WRITE);
    if (write + bytes.length > INPUT_LIMIT)
      throw new Error('This session has reached its 16,000-byte input limit.');
    this.bytes.set(bytes, write);
    this.lastActivity = Date.now();
    Atomics.store(this.control, WRITE, write + bytes.length);
    Atomics.notify(this.control, WRITE);
    return true;
  }
  private timeout(message: string) {
    this.finish({
      type: 'result',
      status: 'timed_out',
      message,
      exitCode: null,
    });
  }
  private finish(event: Extract<CompilerEvent, { type: 'result' }>) {
    if (this.finished) return;
    this.dispose();
    this.receive(event);
  }
  stop() {
    this.finish({
      type: 'result',
      status: 'cancelled',
      message: 'Execution cancelled.',
      exitCode: null,
    });
  }
  dispose() {
    this.finished = true;
    clearInterval(this.timer);
    this.worker.terminate();
  }
}
