import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';

const root = resolve(process.argv[2] || 'out');
const port = Number(process.argv[3] || 3002);
const testMode = process.argv.includes('--test');
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.wasm': 'application/wasm',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};
createServer(async (request, response) => {
  response.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  response.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  response.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  response.setHeader('Cache-Control', 'no-cache');
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, 'http://localhost').pathname,
    );
    const test = testMode && pathname.startsWith('/__tests/');
    const base = test ? resolve('tests/browser') : root;
    let file = resolve(
      base,
      '.' + (test ? pathname.slice('/__tests'.length) : pathname),
    );
    if (file !== base && !file.startsWith(base + sep))
      throw new Error('Invalid path');
    // Match Pages' extensionless static HTML URLs for exported trust pages.
    let fileStat;
    try {
      fileStat = await stat(file);
    } catch {
      if (extname(file)) throw new Error('Not found');
      file += '.html';
      fileStat = await stat(file);
    }
    if (fileStat.isDirectory()) {
      const index = resolve(file, 'index.html');
      try { await stat(index); file = index; }
      catch { file += '.html'; }
    }
    const bytes = await readFile(file);
    response.setHeader(
      'Content-Type',
      types[extname(file)] || 'application/octet-stream',
    );
    response.setHeader('Content-Length', bytes.length);
    response.end(request.method === 'HEAD' ? undefined : bytes);
  } catch {
    try {
      const page = await readFile(resolve(root, '404.html'));
      response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }).end(request.method === 'HEAD' ? undefined : page);
    } catch {
      response.writeHead(404).end('Not found');
    }
  }
}).listen(port, '127.0.0.1', () =>
  console.log(`Static preview: http://localhost:${port}/`),
);
