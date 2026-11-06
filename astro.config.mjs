import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.connect-affaires.fr',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'file' }
});
