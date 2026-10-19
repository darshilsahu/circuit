import init, { format } from '@wasm-fmt/clang-format/vite';
import { formatStyle } from './style';

self.onmessage = async (event: MessageEvent<string>) => {
  try {
    await init();
    self.postMessage({ code: format(event.data, 'main.c', formatStyle) });
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : 'Formatting failed.' });
  }
};
