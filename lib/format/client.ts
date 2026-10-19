export function formatC(code: string, signal: AbortSignal): Promise<string> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) return reject(new Error('Formatting cancelled.'));
    const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
    const finish = (error?: Error, result?: string) => {
      clearTimeout(timer);
      signal.removeEventListener('abort', abort);
      worker.terminate();
      if (error) reject(error);
      else resolve(result!);
    };
    const abort = () => finish(new Error('Formatting cancelled.'));
    const timer = setTimeout(() => finish(new Error('Formatting timed out. Please try again.')), 30000);
    signal.addEventListener('abort', abort, { once: true });
    worker.onerror = () => finish(new Error('Could not load the formatter. Please try again.'));
    worker.onmessage = (event: MessageEvent<{ code?: string; error?: string }>) => {
      if (typeof event.data.code === 'string') finish(undefined, event.data.code);
      else finish(new Error(event.data.error || 'Formatting failed.'));
    };
    worker.postMessage(code);
  });
}
