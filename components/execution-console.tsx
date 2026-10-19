'use client';
import { Copy, Trash2, Terminal, Loader2 } from 'lucide-react';
import {
  consoleText,
  statusLabels,
  type ExecutionResult,
} from '@/lib/execution.mjs';
export function ExecutionConsole({
  result,
  running,
  clear,
  notify,
}: {
  result: ExecutionResult | null;
  running: boolean;
  clear: () => void;
  notify: (text: string) => void;
}) {
  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(consoleText(result));
      notify('Console output copied.');
    } catch {
      notify(
        'Clipboard access is unavailable. Select and copy the output manually.',
      );
    }
  }
  let warning = false;
  return (
    <section className="output-panel" aria-label="Execution console">
      <div className="panel-heading">
        <div>
          <Terminal size={16} />
          <h2>Output</h2>
          <span
            role="status"
            className={
              running
                ? ''
                : result?.success
                  ? 'success-text'
                  : result
                    ? 'error-text'
                    : ''
            }
          >
            {running
              ? 'Compiling / Running'
              : result
                ? statusLabels[result.status]
                : 'Idle'}
          </span>
        </div>
        <div className="console-actions">
          <button
            className="icon-button"
            aria-label="Copy output"
            onClick={copy}
            disabled={!result || running}
          >
            <Copy size={15} />
          </button>
          <button
            className="icon-button"
            aria-label="Clear output"
            onClick={clear}
            disabled={running}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      <div className="output-body" aria-live="polite" aria-busy={running}>
        {running ? (
          <div className="output-empty">
            <Loader2 size={22} />
            <strong>Compiling / Running</strong>
            <span>Execution is limited to 4 seconds.</span>
          </div>
        ) : result ? (
          <>
            {result.stdout && (
              <pre className="stdout" aria-label="Standard output">
                {result.stdout}
              </pre>
            )}
            {result.stderr && (
              <div className="console-block">
                <span className="console-label">stderr</span>
                <pre className="error-text" aria-label="Standard error">
                  {result.stderr}
                </pre>
              </div>
            )}
            {result.diagnostics && (
              <div className="console-block">
                <span className="console-label">GCC diagnostics</span>
                <pre aria-label="Compiler diagnostics">
                  {result.diagnostics.split('\n').map((line, i) => {
                    if (/warning:/.test(line)) warning = true;
                    else if (/error:|fatal error:/.test(line)) warning = false;
                    return (
                      <span
                        key={i}
                        className={
                          warning
                            ? 'warning-text'
                            : result.status === 'compile_error'
                              ? 'error-text'
                              : ''
                        }
                      >
                        {line}
                        {'\n'}
                      </span>
                    );
                  })}
                </pre>
              </div>
            )}
            <div className="execution-meta" aria-label="Execution summary">
              <strong>{result.message || statusLabels[result.status]}</strong>
              <span>
                {result.exitCode !== null ? `Exit ${result.exitCode} · ` : ''}
                {result.durationMs > 0
                  ? `${(result.durationMs / 1000).toFixed(2)}s total · ${(result.compileMs / 1000).toFixed(2)}s compile · ${(result.runMs / 1000).toFixed(2)}s run`
                  : ''}
              </span>
            </div>
          </>
        ) : (
          <div className="output-empty">
            <div className="terminal-symbol">&gt;_</div>
            <strong>Ready when you are</strong>
            <span>Run your program to see the output here.</span>
          </div>
        )}
      </div>
    </section>
  );
}
