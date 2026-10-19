import { readFile, writeFile } from 'node:fs/promises';
import { initWasm, Resvg } from '@resvg/resvg-wasm';
import { ImageResponse } from '@vercel/og';
import { createElement as h } from 'react';
import { brandSvg, brandSymbol } from '../lib/brand';

await initWasm(await readFile('node_modules/@resvg/resvg-wasm/index_bg.wasm'));
await writeFile('public/favicon.svg', brandSvg + '\n');
for (const [name, size, maskable] of [
  ['apple-touch-icon.png', 180, true],
  ['icon-512.png', 512, false],
  ['icon-512-maskable.png', 512, true],
] as const) {
  const svg = maskable
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="#75aff2"/><g transform="translate(8 8) scale(.75)">${brandSymbol}</g></svg>`
    : brandSvg;
  const renderer = new Resvg(svg, { fitTo: { mode: 'width', value: size } });
  const rendered = renderer.render();
  await writeFile('public/' + name, rendered.asPng());
  rendered.free();
  renderer.free();
}
const image = new ImageResponse(h('div', {
  style: { display: 'flex', width: '100%', height: '100%', background: '#101510', alignItems: 'center', padding: '120px', gap: '80px', color: '#f4f7f0' },
}, h('img', { src: 'data:image/svg+xml;base64,' + Buffer.from(brandSvg).toString('base64'), width: 260, height: 260 }),
h('div', { style: { display: 'flex', flexDirection: 'column' } },
  h('div', { style: { fontSize: 100, fontWeight: 700 } }, 'Circuit'),
  h('div', { style: { fontSize: 40, color: '#75aff2' } }, 'ONLINE C COMPILER'),
  h('div', { style: { fontSize: 24, color: '#a3ae9b', marginTop: 22 } }, 'Compile and run C code in your browser'),
)), { width: 1200, height: 630 });
await writeFile('public/og-image.png', Buffer.from(await image.arrayBuffer()));
console.log('Generated Circuit favicon, app icons, and social image.');
