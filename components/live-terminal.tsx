'use client';
import { useEffect, useRef, useState } from 'react';
import type { useTerminal } from '@/hooks/use-terminal';
export function LiveTerminal({
  terminal,
  hidden,
  onHide,
}: {
  terminal: ReturnType<typeof useTerminal>;
  hidden: boolean;
  onHide: () => void;
}) {
  const scroll = useRef<HTMLDivElement>(null),
    field = useRef<HTMLInputElement>(null),
    follow = useRef(true);
  const panel = useRef<HTMLElement>(null);
  const [line, setLine] = useState('');
  const inputQueue = useRef(Promise.resolve());
  const generation = useRef(0);
  const phase = useRef(terminal.phase);
  phase.current = terminal.phase;
  useEffect(() => {
    if (follow.current && scroll.current)
      scroll.current.scrollTop = scroll.current.scrollHeight;
  }, [terminal.chunks]);
  useEffect(() => {
    if (terminal.phase === 'Running' || terminal.phase === 'Compiling')
      field.current?.focus({ preventScroll: true });
  }, [terminal.phase, hidden]);
  useEffect(() => {
    if (terminal.phase === 'Compiling') {
      follow.current = true;
      generation.current++;
      inputQueue.current = Promise.resolve();
      setLine('');
      panel.current?.scrollIntoView({ block: 'nearest' });
    }
  }, [terminal.phase]);
  return (
    <section
      ref={panel}
      className="live-terminal"
      aria-label="Integrated terminal"
      hidden={hidden}
    >
      <div className="panel-heading">
        <div>
          <h2>TERMINAL</h2>
          <span role="status">{terminal.phase}</span>
          <small>{terminal.owner}</small>
        </div>
        <div>
          <button
            className="text-button"
            aria-label="Copy terminal"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  terminal.chunks
                    .filter((c) => !['status', 'success'].includes(c.kind))
                    .map((c) => c.text)
                    .join(''),
                );
              } catch {}
            }}
          >
            Copy
          </button>
          <button
            className="text-button"
            onClick={() => {
              terminal.clear();
              follow.current = true;
            }}
          >
            Clear Terminal
          </button>
          <button
            className="text-button"
            aria-label="Hide terminal"
            title="Hide terminal"
            onClick={onHide}
          >
            ×
          </button>
          {terminal.running && (
            <button className="text-button" onClick={terminal.stop}>
              Stop
            </button>
          )}
        </div>
      </div>
      <div
        className="terminal-scroll"
        ref={scroll}
        onScroll={(e) => {
          const el = e.currentTarget;
          follow.current =
            el.scrollHeight - el.scrollTop - el.clientHeight < 35;
        }}
      >
        {!terminal.chunks.length && (
          <p className="terminal-hint">
            {terminal.running
              ? terminal.phase === 'Compiling'
                ? 'Compiling…'
                : 'Program is running.'
              : 'Run a program to start. Type here when your program needs input.'}
          </p>
        )}
        <form
          className="terminal-session"
          onSubmit={(e) => {
            e.preventDefault();
            if (terminal.phase !== 'Running') return;
            const text = line + '\n',
              current = generation.current;
            setLine('');
            follow.current = true;
            field.current?.focus({ preventScroll: true });
            inputQueue.current = inputQueue.current
              .then(async () => {
                if (
                  current === generation.current &&
                  phase.current === 'Running'
                )
                  await terminal.input(text);
              })
              .catch(() => {});
          }}
        >
          <pre aria-label="Terminal output">
            {terminal.chunks.map((chunk, i) => (
              <span key={i} className={`terminal-${chunk.kind}`}>
                {chunk.kind === 'diagnostics'
                  ? chunk.text.split(/(?<=\n)/).map((line, j) => (
                      <span
                        key={j}
                        className={
                          line.includes('warning:')
                            ? 'warning-text'
                            : line.includes('error:')
                              ? 'error-text'
                              : ''
                        }
                      >
                        {line}
                      </span>
                    ))
                  : chunk.text}
              </span>
            ))}
            {terminal.running && (
              <input
                key="stdin"
                className="terminal-inline-input"
                ref={field}
                aria-label="Terminal input"
                autoComplete="off"
                spellCheck={false}
                value={line}
                maxLength={16000}
                readOnly={terminal.phase !== 'Running'}
                style={{
                  width: Math.max(1, Array.from(line).length + 1) + 'ch',
                }}
                onChange={(e) => setLine(e.target.value)}
                onKeyDown={(e) => {
                  if (e.ctrlKey && e.key === 'c') {
                    e.preventDefault();
                    void terminal.stop();
                  }
                }}
              />
            )}
          </pre>
        </form>
      </div>
      <div className="terminal-footnote">
        Enter sends a line · Ctrl+C stops · 3s active · 60s idle · 5min session
      </div>
    </section>
  );
}
