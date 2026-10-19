import { build } from 'esbuild';
await build({
  entryPoints: ['tests/browser/runner.ts'],
  outfile: 'tests/browser/runner.js',
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
});
