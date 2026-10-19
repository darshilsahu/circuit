import test from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';
import {
  loadPrograms,
  savePrograms,
  normalizeName,
  duplicateName,
  parseBackup,
  importPrograms,
} from '../lib/programs';
import { validateSubmission, readLimitedJson } from '../lib/submission.mjs';

test('program library persists edits, imports atomically, and keeps an intentionally empty library', async () => {
  const initial = await loadPrograms();
  assert.equal(initial.length, 1);
  assert.equal(initial[0].name, 'hello_world.c');
  const p = {
    ...initial[0],
    code: 'int main() { return 42; }',
    input: '12 30',
  };
  await savePrograms([p]);
  assert.equal(
    (await loadPrograms()).find((item) => item.id === p.id)?.code,
    p.code,
  );
  const imported = parseBackup({
    format: 'circuit-backup',
    version: 1,
    programs: [p],
  });
  assert.notEqual(imported[0].id, p.id);
  imported[0].name = 'imported-copy.c';
  await savePrograms(imported);
  assert.equal((await loadPrograms()).length, 2);
  const rapid = [1, 2, 3, 4, 5].map((i) =>
    savePrograms([{ ...p, code: String(i) }]),
  );
  await Promise.all(rapid);
  assert.equal(
    (await loadPrograms()).find((item) => item.id === p.id)?.code,
    '5',
  );
  for (const item of await loadPrograms()) await savePrograms([], item.id);
  assert.equal((await loadPrograms()).length, 0);
});
test('backup rejects malformed entries and preserves valid programs without trusting imported IDs', () => {
  assert.throws(() => parseBackup({ programs: [] }));
  assert.throws(() =>
    parseBackup({
      format: 'circuit-backup',
      version: 1,
      programs: [{ name: 'bad.c', code: 42, input: '' }],
    }),
  );
  assert.throws(() => normalizeName('  '));
  assert.equal(normalizeName('../hello'), '.._hello.c');
  assert.equal(normalizeName('hello'), 'hello.c');
  assert.equal(normalizeName('hello.C'), 'hello.c');
  assert.throws(() => normalizeName('.C'));
  assert.equal(normalizeName('a'.repeat(100)).length, 100);
  assert.equal(duplicateName('hello.c', ['HELLO_COPY.c']), 'hello_copy2.c');
  const longCopy = duplicateName('a'.repeat(98) + '.c', []);
  assert.equal(longCopy.length, 100);
  assert.ok(longCopy.endsWith('_copy.c'));
});
test('submission validation bounds input and code and rejects non-string values', () => {
  assert.deepEqual(validateSubmission({ code: 'int main(){}', input: '1 2' }), {
    code: 'int main(){}',
    input: '1 2',
  });
  assert.throws(() => validateSubmission({ code: ' ', input: '' }));
  assert.throws(() =>
    validateSubmission({ code: 'x'.repeat(100001), input: '' }),
  );
  assert.throws(() =>
    validateSubmission({ code: 'x', input: 'x'.repeat(16001) }),
  );
  assert.throws(() => validateSubmission({ code: 42, input: '' }));
});
test('stream reader enforces body limit without trusting Content-Length', async () => {
  const stream = new ReadableStream({
    start(c) {
      c.enqueue(new Uint8Array(11));
      c.close();
    },
  });
  await assert.rejects(readLimitedJson(stream, 10), /too large/);
  assert.deepEqual(await readLimitedJson(new Response('{"ok":true}').body), {
    ok: true,
  });
});
test('backups preserve saved source and input even when they exceed execution limits', () => {
  const code = 'x'.repeat(100001),
    input = 'y'.repeat(16001);
  const imported = parseBackup({
    format: 'circuit-backup',
    version: 1,
    programs: [{ name: 'large.c', code, input }],
  });
  assert.equal(imported[0].code, code);
  assert.equal(imported[0].input, input);
});

// IDs and contents survive collision resolution. Import transactions serialize across tabs.
test('imports assign free names atomically without overwriting records', async () => {
  const { importPrograms } = await import('../lib/programs');
  const backup = {
    format: 'circuit-backup',
    version: 1,
    programs: [
      { name: 'arrays.c', code: 'original', input: '' },
      { name: 'arrays.c', code: 'second', input: '' },
    ],
  };
  const one = await importPrograms(backup);
  assert.deepEqual(
    one.map((p) => p.name),
    ['arrays.c', 'arrays-2.c'],
  );
  const [two, three] = await Promise.all([
    importPrograms(backup),
    importPrograms(backup),
  ]);
  const all = [...one, ...two, ...three];
  assert.equal(new Set(all.map((p) => p.name)).size, 6);
  assert.equal(new Set(all.map((p) => p.id)).size, 6);
  assert.equal(
    (await loadPrograms()).find((p) => p.id === one[0].id)?.code,
    'original',
  );
});

test('concurrent normal creates cannot introduce duplicate filenames', async () => {
  const make = () => ({
    id: crypto.randomUUID(),
    name: 'race.c',
    code: 'int main(void){}',
    input: '',
    updatedAt: Date.now(),
    openedAt: Date.now(),
  });
  const attempts = await Promise.allSettled([
    savePrograms([make()]),
    savePrograms([make()]),
  ]);
  assert.equal(attempts.filter((r) => r.status === 'fulfilled').length, 1);
  assert.equal(attempts.filter((r) => r.status === 'rejected').length, 1);
});
