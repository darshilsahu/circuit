import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { download } from '../lib/programs';
test('downloads preserve filenames, UTF-8 source and backup contents', async () => {
  const links: { href: string; download: string }[] = [];
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'document');
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: {
      body: { appendChild() {} },
      createElement() {
        return {
          href: '',
          download: '',
          hidden: false,
          remove() {},
          click() {
            links.push({ href: this.href, download: this.download });
          },
        };
      },
    },
  });
  const timer = mock.method(
    globalThis,
    'setTimeout',
    (() => 0) as unknown as typeof setTimeout,
  );
  try {
    const code = '#include <stdio.h>\n// café\nint main(){return 0;}\n';
    const backup = JSON.stringify({
      format: 'circuit-backup',
      version: 1,
      programs: [{ code }],
    });
    download('example.c', code);
    download('circuit-backup.json', backup, 'application/json');
    assert.deepEqual(
      links.map((link) => link.download),
      ['example.c', 'circuit-backup.json'],
    );
    assert.equal(await (await fetch(links[0].href)).text(), code);
    const response = await fetch(links[1].href);
    assert.equal(response.headers.get('content-type'), 'application/json');
    assert.equal(await response.text(), backup);
  } finally {
    timer.mock.restore();
    for (const link of links) URL.revokeObjectURL(link.href);
    if (previous) Object.defineProperty(globalThis, 'document', previous);
    else Reflect.deleteProperty(globalThis, 'document');
  }
});
