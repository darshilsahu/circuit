'use client';

export type Program = {
  id: string;
  name: string;
  code: string;
  input: string;
  updatedAt: number;
  openedAt: number;
};
export const starter = `#include <stdio.h>\n\nint main() {\n    // Your next great idea starts here.\n    printf("Hello, world!\\n");\n\n    return 0;\n}\n`;
export const examples = [{ name: 'hello_world.c', code: starter, input: '' }];
let database: Promise<IDBDatabase> | undefined;
function db() {
  return (database ??= new Promise((resolve, reject) => {
    const request = indexedDB.open('circuit-programs', 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore('programs', { keyPath: 'id' });
      request.result.createObjectStore('settings');
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      database = undefined;
      reject(request.error);
    };
    request.onblocked = () =>
      reject(new Error('Close other Circuit tabs to finish updating storage.'));
  }));
}
export async function loadPrograms(): Promise<Program[]> {
  const database = await db();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(['programs', 'settings'], 'readwrite');
    const store = tx.objectStore('programs');
    const all = store.getAll();
    const initialized = tx.objectStore('settings').get('initialized');
    let programs: Program[] = [];
    initialized.onsuccess = () => {
      programs = all.result;
      if (!initialized.result) {
        programs = examples.map((p, i) => ({
          ...p,
          id: crypto.randomUUID(),
          updatedAt: Date.now() - i,
          openedAt: Date.now() - i,
        }));
        programs.forEach((p) => store.put(p));
        tx.objectStore('settings').put(true, 'initialized');
      }
    };
    all.onsuccess = () => {
      const seen = new Set<string>();
      const reserved = new Set<string>(
        (all.result as Program[]).map((p) => p.name.toLocaleLowerCase()),
      );
      for (const p of all.result as Program[]) {
        if (seen.has(p.name.toLocaleLowerCase())) {
          p.name = uniqueName(p.name, reserved);
          store.put(p);
        }
        seen.add(p.name.toLocaleLowerCase());
      }
    };
    tx.oncomplete = () => resolve(programs);
    tx.onabort = () => reject(tx.error);
    tx.onerror = () => reject(tx.error);
  });
}
export async function readWorkspace(): Promise<unknown> {
  const database = await db();
  return new Promise((resolve, reject) => {
    const request = database
      .transaction('settings')
      .objectStore('settings')
      .get('workspace');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
export async function writeWorkspace(value: unknown): Promise<void> {
  const database = await db();
  return new Promise((resolve, reject) => {
    const tx = database.transaction('settings', 'readwrite');
    tx.objectStore('settings').put(value, 'workspace');
    tx.oncomplete = () => resolve();
    tx.onabort = () => reject(tx.error);
  });
}
export async function savePrograms(programs: Program[], deleteId?: string) {
  const database = await db();
  return new Promise<void>((resolve, reject) => {
    const tx = database.transaction('programs', 'readwrite'),
      store = tx.objectStore('programs');
    let error: Error | null = null,
      remaining = programs.length,
      needsNames = false;
    const commit = () => {
      for (const p of programs) store.put(p);
      if (deleteId) store.delete(deleteId);
    };
    const validateNames = () => {
      if (!needsNames) {
        commit();
        return;
      }
      const all = store.getAll();
      all.onsuccess = () => {
        const ids = new Set(programs.map((p) => p.id));
        const names = new Set(
          (all.result as Program[])
            .filter((p) => !ids.has(p.id) && p.id !== deleteId)
            .map((p) => p.name.toLocaleLowerCase()),
        );
        for (const p of programs) {
          const key = p.name.toLocaleLowerCase();
          if (names.has(key)) {
            error = new Error('A program with this name already exists.');
            tx.abort();
            return;
          }
          names.add(key);
        }
        commit();
      };
    };
    if (!remaining) commit();
    for (const p of programs) {
      const request = store.get(p.id);
      request.onsuccess = () => {
        if (!request.result || request.result.name !== p.name)
          needsNames = true;
        if (--remaining === 0) validateNames();
      };
    }
    tx.oncomplete = () => resolve();
    tx.onabort = () =>
      reject(error || tx.error || new Error('Could not save program.'));
    tx.onerror = () => reject(tx.error);
  });
}
export function normalizeName(value: string) {
  const name = value
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_')
    .slice(0, 100);
  if (!name || name.toLowerCase() === '.c')
    throw new Error('Enter a program name.');
  return /\.c$/i.test(name)
    ? name.slice(0, -2) + '.c'
    : name.slice(0, 98) + '.c';
}
export function duplicateName(value: string, existing: string[]) {
  const used = new Set(existing.map((name) => name.toLocaleLowerCase()));
  const stem = normalizeName(value).slice(0, -2);
  for (let n = 1; ; n++) {
    const suffix = `_copy${n === 1 ? '' : n}.c`;
    const name = stem.slice(0, 100 - suffix.length) + suffix;
    if (!used.has(name.toLocaleLowerCase())) return name;
  }
}
export function parseBackup(value: unknown): Program[] {
  const data = value as {
    format?: string;
    version?: number;
    programs?: unknown[];
  };
  if (
    !data ||
    data.format !== 'circuit-backup' ||
    data.version !== 1 ||
    !Array.isArray(data.programs)
  )
    throw new Error('Choose a valid Circuit backup JSON file.');
  return data.programs.map((value) => {
    const p = value as Program;
    if (
      !p ||
      typeof p.name !== 'string' ||
      typeof p.code !== 'string' ||
      typeof p.input !== 'string'
    )
      throw new Error('Backup contains an invalid program.');
    return {
      id: crypto.randomUUID(),
      name: normalizeName(p.name),
      code: p.code,
      input: p.input,
      updatedAt: Date.now(),
      openedAt: Date.now(),
    };
  });
}
export function download(name: string, content: string, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.hidden = true;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

export function uniqueName(value: string, used: Set<string>) {
  const normalized = normalizeName(value);
  let name = normalized,
    suffix = 2;
  while (used.has(name.toLocaleLowerCase())) {
    const ending = `-${suffix++}.c`;
    name = normalized.slice(0, -2).slice(0, 100 - ending.length) + ending;
  }
  used.add(name.toLocaleLowerCase());
  return name;
}
// One read-write transaction resolves both existing-library and within-backup collisions.
// IndexedDB serializes these transactions across tabs; no schema reset is necessary.
export async function importPrograms(value: unknown): Promise<Program[]> {
  const imported = parseBackup(value);
  const database = await db();
  return new Promise((resolve, reject) => {
    const tx = database.transaction('programs', 'readwrite'),
      store = tx.objectStore('programs');
    const request = store.getAll();
    request.onsuccess = () => {
      const used = new Set<string>(
        (request.result as Program[]).map((p) => p.name.toLocaleLowerCase()),
      );
      for (const p of imported) {
        p.name = uniqueName(p.name, used);
        store.add(p);
      }
    };
    tx.oncomplete = () => resolve(imported);
    tx.onabort = () => reject(tx.error || new Error('Import failed.'));
    tx.onerror = () => reject(tx.error);
  });
}
