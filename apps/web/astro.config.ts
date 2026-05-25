import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
export default defineConfig({
  output: 'static',
  integrations: [tailwind()],
  i18n: { defaultLocale: 'uz', locales: ['uz', 'ru', 'en'], routing: { prefixDefaultLocale: true } },
});
