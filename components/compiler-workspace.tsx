'use client';
import { SiteNavigation } from '@/components/site-navigation';
import { BrandMark } from '@/components/brand-mark';
import { TerminalLayout } from '@/components/terminal-layout';
import { useTerminal } from '@/hooks/use-terminal';
import { restoreWorkspace, type EditorPosition } from '@/lib/workspace';
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from '@/components/ui/command';
import { CodeEditor } from '@/components/code-editor';
import { useEffect, useRef, useState } from 'react';
import {
  Code2,
  Plus,
  Play,
  Search,
  FolderOpen,
  Clock3,
  MoreHorizontal,
  Download,
  Upload,
  Sun,
  Moon,
  Check,
  Terminal,
  ChevronRight,
  Copy,
  Pencil,
  Trash2,
  HardDrive,
  Keyboard,
  Loader2,
  FileCode2,
  X,
} from 'lucide-react';
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  loadPrograms,
  readWorkspace,
  writeWorkspace,
  savePrograms,
  starter,
  normalizeName,
  duplicateName,
  importPrograms,
  download,
  type Program,
} from '@/lib/programs';

export default function Home() {
  return (
    <SidebarProvider>
      <Workspace />
    </SidebarProvider>
  );
}
function Workspace() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [activeId, setActiveId] = useState('');
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState('');
  const [recent, setRecent] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [saved, setSaved] = useState('Saved locally');
  const [notice, setNotice] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [dialog, setDialog] = useState<'new' | 'rename' | null>(null);
  const [name, setName] = useState('');
  const terminal = useTerminal(setNotice);
  const running = terminal.running;
  const [tabs, setTabs] = useState<string[]>([]);
  const [height, setHeight] = useState(260);
  const positions = useRef<Record<string, EditorPosition>>({});
  const formatCommands = useRef(new Map<string, () => void>());
  const [palette, setPalette] = useState<'files' | 'commands' | null>(null);
  const dragged = useRef('');
  const workspaceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const workspaceLatest = useRef({
    tabs,
    active: activeId,
    height,
    positions: positions.current,
  });
  workspaceLatest.current = {
    tabs,
    active: activeId,
    height,
    positions: positions.current,
  };
  function saveWorkspace() {
    if (workspaceTimer.current) clearTimeout(workspaceTimer.current);
    workspaceTimer.current = setTimeout(() => {
      void writeWorkspace(workspaceLatest.current).catch(() =>
        setNotice('Could not save workspace layout.'),
      );
    }, 100);
  }
  useEffect(() => {
    if (ready) saveWorkspace();
  }, [tabs, activeId, height, ready]);
  useEffect(() => {
    if (!ready) return;
    const flush = () => {
      void writeWorkspace(workspaceLatest.current).catch(() => {});
    };
    window.addEventListener('pagehide', flush);
    return () => window.removeEventListener('pagehide', flush);
  }, [ready]);
  function closeTab(id = activeId) {
    const index = tabs.indexOf(id),
      next = tabs.filter((tab) => tab !== id);
    setTabs(next);
    if (id === activeId)
      setActiveId(next[Math.min(index, next.length - 1)] || '');
  }
  function focusTab(id: string) {
    setTabs((old) => (old.includes(id) ? old : [...old, id]));
    setActiveId(id);
  }
  const [position, setPosition] = useState({ line: 1, col: 1 });
  const tabbar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    tabbar.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [activeId, tabs]);
  const fileInput = useRef<HTMLInputElement>(null);
  const latest = useRef(programs);
  latest.current = programs;
  const pending = useRef(0);
  const { setOpenMobile, toggleSidebar } = useSidebar();
  const active = programs.find((p) => p.id === activeId);
  useEffect(() => {
    setPosition({ line: 1, col: 1 });
  }, [activeId]);
  useEffect(() => {
    try {
      const t = localStorage.getItem('circuit-theme') || 'dark';
      setTheme(t);
    } catch {}
    loadPrograms()
      .then(async (list) => {
        setPrograms(list);
        const restored = restoreWorkspace(
          await readWorkspace(),
          [...list].sort((a, b) => b.openedAt - a.openedAt).map((p) => p.id),
        );
        positions.current = restored.positions;
        setTabs(restored.tabs);
        setActiveId(restored.active);
        setHeight(restored.height);
        // Example links only add a new imported program; existing IDs/code are untouched.
        const exampleSlug = new URLSearchParams(window.location.hash.slice(1)).get('example');
        if (exampleSlug) {
          try {
            const { examples } = await import('@/lib/content/examples');
            const example = examples.find((item) => item.slug === exampleSlug);
            if (example) {
              const imported = await importPrograms({ format: 'circuit-backup', version: 1, programs: [{ name: `${example.slug}.c`, code: example.code, input: '' }] });
              setPrograms([...list, ...imported]);
              setTabs([...restored.tabs, imported[0].id]);
              setActiveId(imported[0].id);
              window.history.replaceState(null, '', window.location.pathname + window.location.search);
            } else {
              setNotice('This example is not available. Choose one from the Examples page.');
            }
          } catch {
            setNotice('Could not open the example. Check available browser storage and try again.');
          }
        }
        setReady(true);
      })
      .catch(() => {
        setSaved('Storage unavailable');
        setNotice(
          'Browser storage is unavailable. Allow site storage and reload to save programs.',
        );
      });
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem('circuit-theme', theme);
    } catch {}
  }, [theme]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 6000);
    return () => clearTimeout(timer);
  }, [notice]);
  async function persist(items: Program[], deleteId?: string) {
    const revision = ++pending.current;
    setSaved('Saving…');
    try {
      await savePrograms(items, deleteId);
      if (revision === pending.current) setSaved('Saved locally');
    } catch {
      setSaved('Not saved');
      setNotice(
        'Could not save. Your browser storage may be full. Export a backup before closing.',
      );
    }
  }
  function select(program: Program) {
    const next = { ...program, openedAt: Date.now() };
    focusTab(program.id);

    setPrograms((list) => list.map((p) => (p.id === next.id ? next : p)));
    void persist([next]);
    setOpenMobile(false);
  }
  function openNew() {
    setName('untitled.c');
    setDialog('new');
  }
  async function submitName(event: React.FormEvent) {
    event.preventDefault();
    try {
      const filename = normalizeName(name);
      if (
        programs.some(
          (p) =>
            p.name.toLocaleLowerCase() === filename.toLocaleLowerCase() &&
            (dialog === 'new' || p.id !== activeId),
        )
      )
        throw new Error('A program with this name already exists.');
      if (dialog === 'rename') {
        if (!active) return;
        const next = { ...active, name: filename, updatedAt: Date.now() };
        await savePrograms([next]);
        setPrograms((list) => list.map((p) => (p.id === next.id ? next : p)));
      } else {
        const p = {
          id: crypto.randomUUID(),
          name: filename,
          code: starter,
          input: '',
          updatedAt: Date.now(),
          openedAt: Date.now(),
        };
        await savePrograms([p]);
        setPrograms((list) => [...list, p]);
        focusTab(p.id);
      }
      setDialog(null);
      setOpenMobile(false);
    } catch (e) {
      setNotice(e instanceof Error ? e.message : 'Could not save program.');
    }
  }
  async function duplicate() {
    if (!active) return;
    const filename = duplicateName(
      active.name,
      programs.map((p) => p.name),
    );
    const p = {
      ...active,
      id: crypto.randomUUID(),
      name: filename,
      updatedAt: Date.now(),
      openedAt: Date.now(),
    };
    try {
      await savePrograms([p]);
      setPrograms((list) => [...list, p]);
      focusTab(p.id);

      setNotice('Program duplicated.');
    } catch {
      setNotice('Could not duplicate: browser storage is unavailable or full.');
    }
  }
  async function run() {
    if (active) await terminal.run(active);
  }
  function formatDocument() {
    if (active) formatCommands.current.get(active.id)?.();
  }
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!palette && !dialog && !deleteOpen && e.shiftKey && e.altKey && !e.ctrlKey && !e.metaKey && e.code === 'KeyF') {
        e.preventDefault();
        formatDocument();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setPalette(e.shiftKey ? 'commands' : 'files');
        return;
      }
      if (!palette && !dialog && !deleteOpen && (e.ctrlKey || e.metaKey)) {
        if (e.key.toLowerCase() === 'w') {
          e.preventDefault();
          closeTab();
          return;
        }
        if (e.key === 'Tab') {
          e.preventDefault();
          if (tabs.length)
            setActiveId(
              tabs[
                (tabs.indexOf(activeId) + (e.shiftKey ? -1 : 1) + tabs.length) %
                  tabs.length
              ],
            );
          return;
        }
        if (/^[1-9]$/.test(e.key)) {
          const id = tabs[Number(e.key) - 1];
          if (id) {
            e.preventDefault();
            setActiveId(id);
          }
          return;
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        void run();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (active) void persist([active]);
      }
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  });
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (saved === 'Saving…' || saved === 'Not saved') e.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [saved]);

  function exportAll() {
    download(
      'circuit-backup.json',
      JSON.stringify(
        {
          format: 'circuit-backup',
          version: 1,
          exportedAt: new Date().toISOString(),
          programs: latest.current,
        },
        null,
        2,
      ),
      'application/json',
    );
    setNotice('Backup downloaded. Keep it somewhere safe.');
  }
  async function importAll(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      if (file.size > 25 * 1024 * 1024)
        throw new Error('Backups must be smaller than 25 MB.');
      const imported = await importPrograms(JSON.parse(await file.text()));
      setPrograms((list) => [...list, ...imported]);
      if (imported[0]) {
        focusTab(imported[0].id);
      }
      setNotice(
        `Imported ${imported.length} programs. Existing programs were kept.`,
      );
    } catch (e) {
      setNotice(e instanceof Error ? e.message : 'Import failed.');
    }
  }
  const visible = programs
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      recent ? b.openedAt - a.openedAt : a.name.localeCompare(b.name),
    );
  return (
    <div className="workspace" id="compiler">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">
            <BrandMark />
          </div>
          <span>Circuit</span>
          <h1 className="product-label">Online C Compiler</h1>
        </div>
        <SiteNavigation />
        <div className="top-actions">
          <span className="local-label">
            <span className="status-dot" /> Local workspace
          </span>
          <button
            className="icon-button"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle color theme"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="icon-button"
            aria-label="Quick Open"
            title="Quick Open (Ctrl+P)"
            onClick={() => setPalette('files')}
          >
            <Search size={18} />
          </button>
          <button
            className="icon-button"
            aria-label="Command Palette"
            title="Command Palette (Ctrl+Shift+P)"
            onClick={() => setPalette('commands')}
          >
            <Terminal size={18} />
          </button>
          <span className="top-divider" />
          <button
            className="button secondary"
            onClick={openNew}
            disabled={!ready}
          >
            <Plus size={16} />
            <span>New program</span>
          </button>
        </div>
      </header>
      <div className="body-grid">
        <Sidebar collapsible="offcanvas" className="program-sidebar">
          <SidebarContent className="library-content">
            <div className="library-title">
              WORKSPACE <span>LOCAL</span>
            </div>
            <button
              className={`library-nav ${!recent ? 'selected' : ''}`}
              onClick={() => setRecent(false)}
            >
              <FolderOpen size={18} /> All programs{' '}
              <span>{programs.length}</span>
            </button>
            <button
              className={`library-nav ${recent ? 'selected' : ''}`}
              onClick={() => setRecent(true)}
            >
              <Clock3 size={18} /> Recent programs
            </button>
            <div className="library-section">
              <span>{recent ? 'RECENTLY OPENED' : 'MY PROGRAMS'}</span>
              <button
                className="icon-button"
                aria-label="Create program"
                onClick={openNew}
                disabled={!ready}
              >
                <Plus size={16} />
              </button>
            </div>
            <label className="search">
              <Search size={15} />
              <input
                aria-label="Search programs"
                placeholder="Search programs…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <div className="program-list">
              {visible.map((p) => (
                <button
                  className={`program-row ${p.id === activeId ? 'active' : ''}`}
                  key={p.id}
                  onClick={() => select(p)}
                >
                  <span className="c-icon">C</span>
                  <span>{p.name}</span>
                  {p.id === activeId && <span className="status-dot" />}
                </button>
              ))}
              {!visible.length && (
                <div className="list-empty">
                  {ready
                    ? search
                      ? 'No matching programs.'
                      : 'Your next program starts here.'
                    : 'Opening your workspace…'}
                </div>
              )}
            </div>
            <button className="add-program" onClick={openNew} disabled={!ready}>
              <Plus size={16} /> New program
            </button>
            <div className="library-bottom">
              <div className="storage-note">
                <HardDrive size={17} />
                <div>
                  Stored on this device
                  <small>No account. Just your code.</small>
                </div>
              </div>
              <div className="backup-actions">
                <button
                  onClick={() => fileInput.current?.click()}
                  disabled={!ready}
                >
                  <Upload size={15} /> Import
                </button>
                <button onClick={exportAll} disabled={!ready}>
                  <Download size={15} /> Export all
                </button>
              </div>
              <p>Back up your programs before clearing browser data.</p>
            </div>
          </SidebarContent>
        </Sidebar>
        <main className="main-workspace">
          <div className="workspace-heading">
            <div className="breadcrumb">
              <SidebarTrigger className="mobile-trigger" />
              <span>Workspace</span>
              <ChevronRight size={13} />
              <span className="workspace-filename">
                {active?.name || 'No program open'}
              </span>
            </div>
            <div className="run-bar">
              <span>
                <Keyboard size={16} />
                <span>
                  <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to run your code
                </span>
              </span>
              <button
                className="button primary run-button"
                onClick={running ? terminal.stop : run}
                disabled={!active && !running}
              >
                {running ? (
                  <Loader2 size={16} className="spin" />
                ) : (
                  <Play size={15} fill="currentColor" />
                )}
                {running ? 'Stop program' : 'Run code'}
                <kbd>↵</kbd>
              </button>
            </div>
          </div>
          <TerminalLayout
            terminal={terminal}
            height={height}
            onHeight={setHeight}
          >
            <section className="editor-card">
              <div className="editor-toolbar">
                <div
                  className="program-tabs"
                  ref={tabbar}
                  role="tablist"
                  aria-label="Open programs"
                >
                  {tabs.map((id) => {
                    const program = programs.find((p) => p.id === id);
                    return (
                      program && (
                        <div
                          className={`program-tab ${id === activeId ? 'active' : ''}`}
                          key={id}
                          draggable
                          onDragStart={(e) => {
                            dragged.current = id;
                            e.dataTransfer.effectAllowed = 'move';
                            e.dataTransfer.setData('text/plain', id);
                          }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const from = dragged.current;
                            if (!tabs.includes(from) || from === id) return;
                            setTabs((old) => {
                              const next = old.filter((t) => t !== from);
                              next.splice(next.indexOf(id), 0, from);
                              return next;
                            });
                          }}
                        >
                          <button
                            role="tab"
                            aria-selected={id === activeId}
                            onClick={() => select(program)}
                          >
                            <span className="c-icon">C</span>
                            {program.name}
                          </button>
                          <button
                            className="tab-close"
                            aria-label={`Close ${program.name} tab`}
                            onClick={() => closeTab(id)}
                          >
                            <X size={13} />
                          </button>
                        </div>
                      )
                    );
                  })}
                  <button
                    className="icon-button"
                    aria-label="New program tab"
                    onClick={openNew}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="editor-tools">
                  <span
                    className={`save-status ${saved === 'Not saved' ? 'error-text' : ''}`}
                  >
                    <Check size={13} />
                    {saved}
                  </span>
                  <button
                    className="icon-button"
                    aria-label="Download C file"
                    title="Download .c file"
                    disabled={!active}
                    onClick={() => active && download(active.name, active.code)}
                  >
                    <Download size={16} />
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="icon-button"
                      aria-label="Program actions"
                      disabled={!active}
                    >
                      <MoreHorizontal size={19} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={formatDocument} title="Shift+Alt+F">
                        Format Document
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setName(active?.name || '');
                          setDialog('rename');
                        }}
                      >
                        <Pencil />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={duplicate}>
                        <Copy />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setDeleteOpen(true)}
                      >
                        <Trash2 />
                        Delete program
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              {tabs.map((id) => {
                const program = programs.find((p) => p.id === id);
                return (
                  program && (
                    <div
                      className="code-area"
                      key={id}
                      style={{ display: id === activeId ? 'flex' : 'none' }}
                    >
                      <CodeEditor
                        onNotice={setNotice}
                        onFormatReady={(command) => {
                          if (command) formatCommands.current.set(id, command);
                          else formatCommands.current.delete(id);
                        }}
                        value={program.code}
                        theme={theme}
                        visible={id === activeId}
                        initialPosition={positions.current[id]}
                        onViewState={(state) => {
                          positions.current[id] = state;
                          saveWorkspace();
                        }}
                        onChange={(code) => {
                          const current = latest.current.find(
                            (p) => p.id === id,
                          );
                          if (!current) return;
                          const next = {
                            ...current,
                            code,
                            updatedAt: Date.now(),
                          };
                          latest.current = latest.current.map((p) =>
                            p.id === id ? next : p,
                          );
                          setPrograms(latest.current);
                          void persist([next]);
                        }}
                        onPosition={(line, col) => {
                          if (id === activeId) setPosition({ line, col });
                        }}
                      />
                    </div>
                  )
                );
              })}
              {!active && (
                <div className="editor-empty">
                  <FileCode2 size={38} />
                  <h2>{ready ? 'A blank slate.' : 'Opening your programs…'}</h2>
                  <p>Create a program or import your backup to start coding.</p>
                  <button
                    className="button primary"
                    onClick={openNew}
                    disabled={!ready}
                  >
                    <Plus size={16} />
                    New program
                  </button>
                </div>
              )}
              <div className="editor-footer">
                <span>
                  <span className="status-dot" /> C17{' '}
                  <span className="footer-separator">|</span> UTF-8
                </span>
                <span>
                  Ln {position.line}, Col {position.col}
                  <span className="footer-separator">|</span>Spaces: 4
                </span>
              </div>
            </section>
          </TerminalLayout>
          <footer className="page-footer">
            <span>
              <span className="status-dot" /> Your code stays yours. Saved in
              your browser.
            </span>
            <span>
              Built for the love of C <Code2 size={14} />
            </span>
          </footer>
        </main>
      </div>
      <input
        ref={fileInput}
        type="file"
        accept=".json,application/json"
        hidden
        onChange={importAll}
      />
      <Dialog
        open={dialog !== null}
        onOpenChange={(open) => !open && setDialog(null)}
      >
        <DialogContent>
          <DialogTitle>
            {dialog === 'new' ? 'New program' : 'Rename program'}
          </DialogTitle>
          <DialogDescription>
            Give your C program a name. It will be saved on this device.
          </DialogDescription>
          <form onSubmit={submitName} className="name-form">
            <label htmlFor="program-name">File name</label>
            <input
              id="program-name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              required
            />
            <button className="button primary" type="submit">
              {dialog === 'new' ? 'Create program' : 'Save name'}
            </button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={palette !== null}
        onOpenChange={(open) => {
          if (!open) setPalette(null);
        }}
      >
        <DialogContent className="palette-dialog">
          <DialogTitle>
            {palette === 'files' ? 'Quick Open' : 'Command Palette'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Search, use arrow keys, then Enter to select.
          </DialogDescription>
          <Command key={palette}>
            <CommandInput
              autoFocus
              placeholder={
                palette === 'files' ? 'Search programs…' : 'Type a command…'
              }
            />
            <CommandList>
              <CommandEmpty>No results.</CommandEmpty>
              {palette === 'files'
                ? programs.map((p) => (
                    <CommandItem
                      key={p.id}
                      value={p.name}
                      onSelect={() => {
                        select(p);
                        setPalette(null);
                      }}
                    >
                      {p.name}
                    </CommandItem>
                  ))
                : [
                    ['Run Program', () => void run(), !active || running],
                    ['Format Document (Shift+Alt+F)', formatDocument, !active],
                    ['Stop Program', () => void terminal.stop(), !running],
                    ['New Program', openNew, !ready],
                    [
                      'Rename Program',
                      () => {
                        setName(active?.name || '');
                        setDialog('rename');
                      },
                      !active,
                    ],
                    ['Duplicate Program', () => void duplicate(), !active],
                    ['Delete Program', () => setDeleteOpen(true), !active],
                    [
                      'Download .c',
                      () => active && download(active.name, active.code),
                      !active,
                    ],
                    ['Close Tab', () => closeTab(), !active],
                    [
                      'Close Other Tabs',
                      () => setTabs(active ? [active.id] : []),
                      !active,
                    ],
                    ['Toggle Sidebar', toggleSidebar, false],
                    ['Clear Terminal', terminal.clear, false],
                    [
                      'Toggle Theme',
                      () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
                      false,
                    ],
                  ].map(([label, action, disabled]) => (
                    <CommandItem
                      key={String(label)}
                      disabled={Boolean(disabled)}
                      onSelect={() => {
                        setPalette(null);
                        (action as () => void)();
                      }}
                    >
                      {String(label)}
                    </CommandItem>
                  ))}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete {active?.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the program from this browser. Download it first if you
            need a copy.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={async () => {
                if (!active) return;
                try {
                  await savePrograms([], active.id);
                  const rest = programs.filter((p) => p.id !== active.id);
                  setPrograms(rest);
                  closeTab(active.id);

                  setDeleteOpen(false);
                } catch {
                  setNotice('Could not delete the program. Try again.');
                }
              }}
            >
              Delete program
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {notice && (
        <div className="notice" role="status">
          {notice}
          <button
            className="icon-button"
            onClick={() => setNotice('')}
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
