import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://pico-humanoid.github.io',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
