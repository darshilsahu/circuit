'use client';
import { useEffect, useRef } from 'react';
import { EditorView, keymap } from '@codemirror/view';
import type { EditorPosition } from '@/lib/workspace';
import { EditorState, StateEffect, Transaction } from '@codemirror/state';
import { formatC } from '@/lib/format/client';
import { cpp } from '@codemirror/lang-cpp';
import {
  syntaxHighlighting,
  HighlightStyle,
  indentUnit,
} from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { basicSetup } from 'codemirror';
import { indentWithTab, isolateHistory } from '@codemirror/commands';

export function CodeEditor({
  value,
  onChange,
  onPosition,
  theme,
  visible = true,
  initialPosition,
  onViewState,
  onFormatReady,
  onNotice,
}: {
  value: string;
  onChange: (value: string) => void;
  onPosition: (line: number, col: number) => void;
  theme: string;
  visible?: boolean;
  initialPosition?: EditorPosition;
  onViewState?: (state: EditorPosition) => void;
  onFormatReady?: (command: (() => void) | null) => void;
  onNotice?: (message: string) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const callbacks = useRef({ onChange, onPosition });
  callbacks.current = { onChange, onPosition };
  const initialValue = useRef(value);
  const retained = useRef<EditorState | null>(null);
  const location = useRef(initialPosition);
  const viewCallback = useRef(onViewState);
  viewCallback.current = onViewState;
  const showing = useRef(visible);
  const formatCallbacks = useRef({ onFormatReady, onNotice });
  formatCallbacks.current = { onFormatReady, onNotice };
  showing.current = visible;
  function capture(editor: EditorView) {
    if (!showing.current) return;
    const { anchor, head } = editor.state.selection.main;
    location.current = {
      anchor,
      head,
      top: editor.scrollDOM.scrollTop,
      left: editor.scrollDOM.scrollLeft,
    };
    viewCallback.current?.(location.current);
  }
  useEffect(() => {
    if (!host.current) return;
    const dark = theme === 'dark';
    const extensions = [
      basicSetup,
      cpp(),
      indentUnit.of('    '),
      keymap.of([indentWithTab]),
      EditorView.contentAttributes.of({
        'aria-label': 'C code editor',
        spellcheck: 'false',
      }),
      EditorView.theme(
        {
          '&': {
            height: '100%',
            backgroundColor: 'var(--editor)',
            color: 'var(--foreground)',
            fontSize: '14px',
          },
          '.cm-scroller': {
            fontFamily: 'var(--font-geist-mono), Consolas, monospace',
            lineHeight: '1.85',
            overflow: 'auto',
          },
          '.cm-content': { padding: '20px 0', caretColor: 'var(--blue)' },
          '.cm-line': { padding: '0 18px' },
          '.cm-gutters': {
            backgroundColor: 'var(--editor)',
            border: 'none',
            color: 'var(--subtle)',
            paddingLeft: '12px',
          },
          '.cm-activeLineGutter, .cm-activeLine': {
            backgroundColor: dark ? '#ffffff03' : '#00000003',
          },
          '.cm-cursor': { borderLeftColor: 'var(--blue)' },
          '&.cm-focused': { outline: 'none' },
          '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
            backgroundColor: dark ? '#264568 !important' : '#cfe3fa !important',
          },
          '.cm-tooltip': {
            backgroundColor: 'var(--popover)',
            borderColor: 'var(--border)',
            color: 'var(--foreground)',
          },
          '.cm-panels': {
            backgroundColor: 'var(--panel)',
            color: 'var(--foreground)',
          },
        },
        { dark },
      ),
      syntaxHighlighting(
        HighlightStyle.define([
          { tag: tags.keyword, color: dark ? '#c39de6' : '#81519a' },
          {
            tag: [tags.typeName, tags.standard(tags.variableName)],
            color: dark ? '#e2c486' : '#9a7025',
          },
          { tag: tags.string, color: dark ? '#ceaa91' : '#975d35' },
          { tag: tags.number, color: dark ? '#e7ae7b' : '#a95820' },
          {
            tag: tags.comment,
            color: dark ? '#808891' : '#6e7782',
            fontStyle: 'italic',
          },
          { tag: tags.meta, color: dark ? '#c39de6' : '#81519a' },
          {
            tag: tags.function(tags.variableName),
            color: dark ? '#91badb' : '#286a9c',
          },
          { tag: tags.operator, color: dark ? '#a3bfdc' : '#38648b' },
        ]),
      ),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          initialValue.current = update.state.doc.toString();
          callbacks.current.onChange(initialValue.current);
        }
        if (update.selectionSet || update.docChanged) {
          capture(update.view);
          const pos = update.state.selection.main.head;
          const line = update.state.doc.lineAt(pos);
          callbacks.current.onPosition(line.number, pos - line.from + 1);
        }
      }),
    ];
    const state = retained.current
      ? retained.current.update({
          effects: StateEffect.reconfigure.of(extensions),
        }).state
      : EditorState.create({
          doc: initialValue.current,
          extensions,
          selection: location.current
            ? {
                anchor: Math.min(
                  initialValue.current.length,
                  location.current.anchor,
                ),
                head: Math.min(
                  initialValue.current.length,
                  location.current.head,
                ),
              }
            : undefined,
        });
    const editor = new EditorView({ parent: host.current, state });
    view.current = editor;
    let formatting: AbortController | null = null;
    formatCallbacks.current.onFormatReady?.(() => {
      if (formatting) return;
      const controller = new AbortController();
      formatting = controller;
      const document = editor.state.doc;
      formatCallbacks.current.onNotice?.('Formatting C code…');
      void formatC(document.toString(), controller.signal).then((code) => {
        if (controller.signal.aborted) return;
        if (editor.state.doc !== document) {
          formatCallbacks.current.onNotice?.('Code changed while formatting. Run Format Document again.');
          return;
        }
        if (code !== document.toString()) {
          const head = Math.min(editor.state.selection.main.head, code.length);
          editor.dispatch({
            changes: { from: 0, to: document.length, insert: code },
            selection: { anchor: head },
            annotations: [Transaction.userEvent.of('input.format'), isolateHistory.of('full')],
          });
        }
        formatCallbacks.current.onNotice?.('Document formatted.');
      }).catch((error) => {
        if (!controller.signal.aborted) formatCallbacks.current.onNotice?.(error.message);
      }).finally(() => { formatting = null; });
    });
    const restore = () => {
      if (location.current) {
        editor.scrollDOM.scrollTop = location.current.top;
        editor.scrollDOM.scrollLeft = location.current.left;
      }
    };
    const frame = requestAnimationFrame(restore);
    const scroll = () => capture(editor);
    editor.scrollDOM.addEventListener('scroll', scroll);
    return () => {
      formatting?.abort();
      formatCallbacks.current.onFormatReady?.(null);
      cancelAnimationFrame(frame);
      retained.current = editor.state;
      editor.scrollDOM.removeEventListener('scroll', scroll);
      editor.destroy();
      view.current = null;
    };
  }, [theme]);
  useEffect(() => {
    const editor = view.current;
    if (visible && editor) {
      editor.requestMeasure();
      const frame = requestAnimationFrame(() => {
        if (location.current) {
          editor.scrollDOM.scrollTop = location.current.top;
          editor.scrollDOM.scrollLeft = location.current.left;
        }
        const pos = editor.state.selection.main.head;
        const line = editor.state.doc.lineAt(pos);
        callbacks.current.onPosition(line.number, pos - line.from + 1);
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [visible]);
  useEffect(() => {
    const editor = view.current;
    if (editor && editor.state.doc.toString() !== value) {
      initialValue.current = value;
      editor.dispatch({
        changes: { from: 0, to: editor.state.doc.length, insert: value },
      });
    }
  }, [value]);
  return <div className="codemirror-host" ref={host} />;
}
