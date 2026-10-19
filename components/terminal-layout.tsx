'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { LiveTerminal } from '@/components/live-terminal';
import type { useTerminal } from '@/hooks/use-terminal';

const layoutKey = 'circuit-terminal-layout';

export function TerminalLayout({
  children,
  terminal,
  height,
  onHeight,
}: {
  children: ReactNode;
  terminal: ReturnType<typeof useTerminal>;
  height: number;
  onHeight: (height: number) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const drag = useRef<{ coordinate: number; size: number } | null>(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });
  const [width, setWidth] = useState(38);
  const [open, setOpen] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const side = bounds.width >= 760;
  const maxSize = side
    ? Math.max(180, bounds.width - 306)
    : Math.max(160, bounds.height - 226);
  const size = Math.min(
    maxSize,
    Math.max(side ? 180 : 160, side ? (bounds.width * width) / 100 : height),
  );

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(layoutKey) || 'null');
      if (typeof saved?.width === 'number' && Number.isFinite(saved.width))
        setWidth(Math.max(5, Math.min(95, saved.width)));
      if (typeof saved?.open === 'boolean') setOpen(saved.open);
    } catch {}
    setLoaded(true);
    const observer = new ResizeObserver(([entry]) =>
      setBounds({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      }),
    );
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem(layoutKey, JSON.stringify({ width, open }));
      } catch {}
    }
  }, [width, open, loaded]);
  useEffect(() => {
    if (terminal.phase === 'Compiling') setOpen(true);
  }, [terminal.phase]);

  function resize(value: number) {
    const next = Math.max(side ? 180 : 160, Math.min(maxSize, value));
    if (side) setWidth((next / bounds.width) * 100);
    else onHeight(next);
  }
  function endDrag() {
    drag.current = null;
    setDragging(false);
  }

  return (
    <div
      ref={root}
      className={`terminal-layout ${side ? 'terminal-side' : 'terminal-bottom'} ${open ? '' : 'terminal-collapsed'} ${dragging ? 'terminal-dragging' : ''}`}
      style={{ '--terminal-size': `${size}px` } as CSSProperties}
    >
      {!open && (
        <button
          className="text-button terminal-reopen"
          onClick={() => setOpen(true)}
          aria-expanded={false}
        >
          Show terminal
        </button>
      )}
      {children}
      {open && (
        <div
          className="terminal-divider"
          role="separator"
          tabIndex={0}
          aria-label="Resize terminal"
          aria-orientation={side ? 'vertical' : 'horizontal'}
          aria-valuemin={side ? 180 : 160}
          aria-valuemax={Math.round(maxSize)}
          aria-valuenow={Math.round(size)}
          onKeyDown={(event) => {
            const increase = side ? 'ArrowLeft' : 'ArrowUp';
            const decrease = side ? 'ArrowRight' : 'ArrowDown';
            if ([increase, decrease, 'Home', 'End'].includes(event.key)) {
              event.preventDefault();
              resize(
                event.key === 'Home'
                  ? 0
                  : event.key === 'End'
                    ? maxSize
                    : size + (event.key === increase ? 20 : -20),
              );
            }
          }}
          onPointerDown={(event) => {
            event.preventDefault();
            drag.current = {
              coordinate: side ? event.clientX : event.clientY,
              size,
            };
            setDragging(true);
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (drag.current)
              resize(
                drag.current.size +
                  drag.current.coordinate -
                  (side ? event.clientX : event.clientY),
              );
          }}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={endDrag}
        />
      )}
      <LiveTerminal
        terminal={terminal}
        hidden={!open}
        onHide={() => setOpen(false)}
      />
    </div>
  );
}
