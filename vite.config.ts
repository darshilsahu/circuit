import { sites } from '@openai/sites-vite-plugin';
import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig } from 'vite';

const isolation = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
};
export default defineConfig({
  css: { postcss: { plugins: [tailwindcss()] } },
  server: { headers: isolation },
  plugins: [
    {
      name: 'circuit-isolation',
      configureServer(server) {
        server.middlewares.use((_request, response, next) => {
          for (const [name, value] of Object.entries(isolation))
            response.setHeader(name, value);
          next();
        });
      },
    },
    vinext(),
    sites(),
  ],
});
