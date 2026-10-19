'use client';
import { useRef, useState, useEffect } from 'react';
import { BrowserSession } from '@/lib/compiler/browser-session';
export type TerminalChunk = { kind: string; text: string };
export function useTerminal(notify: (message: string) => void) {
  const [chunks, setChunks] = useState<TerminalChunk[]>([]);
  const [phase, setPhase] = useState('Idle');
  const [owner, setOwner] = useState('');
  const session = useRef<BrowserSession | null>(null);
  const add = (kind: string, text: string) =>
    setChunks((old) => {
      const last = old.at(-1);
      return last?.kind === kind
        ? [...old.slice(0, -1), { kind, text: last.text + text }]
        : [...old, { kind, text }];
    });
  const clear = () => setChunks([]);
  useEffect(() => () => session.current?.dispose(), []);
  async function stop() {
    session.current?.stop();
  }
  async function input(text: string) {
    try {
      if (!session.current?.input(text)) return false;
      add('input', text);
      return true;
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Could not send input.');
      return false;
    }
  }
  async function run(program: { name: string; code: string }) {
    if (session.current) return;
    clear();
    setOwner(program.name);
    setPhase('Compiling');
    try {
      session.current = new BrowserSession(program.code, (event) => {
        if (event.type === 'running') setPhase('Running');
        else if ('text' in event) add(event.type, event.text);
        else if (event.type === 'result') {
          session.current = null;
          setPhase(
            event.status === 'succeeded'
              ? 'Succeeded'
              : event.status.replaceAll('_', ' '),
          );
          add(
            event.status === 'succeeded' ? 'success' : 'status',
            '\n' + event.message + '\n',
          );
        }
      });
    } catch (error) {
      session.current = null;
      setPhase('Compiler unavailable');
      add(
        'status',
        '\n' +
          (error instanceof Error
            ? error.message
            : 'Browser compiler unavailable.') +
          '\n',
      );
    }
  }
  return {
    chunks,
    phase,
    owner,
    running: ['Compiling', 'Running', 'Stopping'].includes(phase),
    run,
    stop,
    input,
    clear,
  };
}
