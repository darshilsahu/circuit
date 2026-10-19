import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

// Packaging only: Clang and the user's program both execute in the browser.
const root = new URL('../', import.meta.url);
const upstream = new URL('node_modules/@yowasp/clang/gen/', root);
const destination = new URL('public/compiler/toolchain/', root);
await mkdir(destination, { recursive: true });
await copyFile(
  new URL('bundle.js', upstream),
  new URL('bundle.js', destination),
);
const manifest = {};
for (const name of [
  'llvm.core.wasm',
  'llvm.core2.wasm',
  'llvm.core3.wasm',
  'llvm.core4.wasm',
  'llvm-resources.tar',
]) {
  const bytes = await readFile(new URL(name, upstream));
  const compressed = gzipSync(bytes, { level: 9 });
  const parts = [];
  // Keep individual assets below Cloudflare Pages' 25 MiB limit.
  for (let offset = 0; offset < compressed.length; offset += 20 * 1024 * 1024) {
    const part = `${name}.${parts.length}.gzpart`;
    await writeFile(
      new URL(part, destination),
      compressed.subarray(offset, offset + 20 * 1024 * 1024),
    );
    parts.push(part);
  }
  manifest[name] = {
    parts,
    length: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  };
  console.log(
    `${name}: ${(compressed.length / 1048576).toFixed(1)} MiB compressed`,
  );
}
await writeFile(new URL('assets.json', destination), JSON.stringify(manifest));
await build({
  entryPoints: [
    fileURLToPath(new URL('lib/compiler/compiler-worker.ts', root)),
  ],
  outfile: fileURLToPath(new URL('public/compiler/worker.js', root)),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  legalComments: 'linked',
});
