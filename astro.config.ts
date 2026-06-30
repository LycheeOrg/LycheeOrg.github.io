import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import starlight from '@astrojs/starlight';
import type { AstroIntegration } from 'astro';

import astrowind from './vendor/integration';

import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin } from './src/utils/frontmatter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
  site: 'https://lycheeorg.dev',
  output: 'static',

  redirects: {
    '/docs/': '/docs/getting-started/installation/',
  },

  integrations: [
    starlight({
      title: 'Lychee',
      logo: {
        src: './src/assets/images/logo.png',
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/LycheeOrg/Lychee' },
        { icon: 'discord', label: 'Discord', href: 'https://discord.gg/JMPvuRQcTf' },
      ],
      editLink: {
        baseUrl: 'https://github.com/LycheeOrg/LycheeOrg.github.io/edit/master/',
      },
      customCss: ['./src/styles/starlight.css'],
      disable404Route: true,
      sidebar: [
        {
          label: 'Getting Started',
          items: [{ autogenerate: { directory: 'docs/getting-started' } }],
        },
        {
          label: 'Usage',
          items: [{ autogenerate: { directory: 'docs/usage' } }],
        },
        {
          label: 'Features',
          items: [{ autogenerate: { directory: 'docs/features' } }],
        },
        {
          label: 'Supporter Edition',
          badge: { text: 'SE', variant: 'tip' },
          items: [{ autogenerate: { directory: 'docs/se' } }],
        },
        {
          label: 'Webshop',
          badge: { text: 'Pro', variant: 'caution' },
          items: [{ autogenerate: { directory: 'docs/webshop' } }],
        },
        {
          label: 'Administration',
          items: [{ autogenerate: { directory: 'docs/administration' } }],
        },
        {
          label: 'FAQ',
          items: [{ autogenerate: { directory: 'docs/faq' } }],
        },
      ],
    }),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    compress({
      // csso doesn't understand Tailwind v4's `@media (width >= ...)` range
      // syntax and silently drops those blocks, breaking all responsive
      // styles in the production build. lightningcss handles it correctly.
      CSS: { csso: false, lightningcss: {} },
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),

    astrowind({
      config: './src/config.yaml',
    }),
  ],

  image: {
    // Astro's default Sharp service handles local images.
    //
    // Most remote CDN images (Unsplash, Cloudinary, Imgix…) are routed by
    // src/components/common/Image.astro through `unpic`, which rewrites the
    // URL with CDN-side query parameters and serves it straight from the
    // provider — Astro never downloads it, so they don't need to be listed.
    //
    // `domains` only matters for remote URLs that fall through to Astro's
    // native <Image /> (i.e. providers Unpic can't detect, like Pixabay).
    // Listed entries are authorized to be processed by Sharp.
    // domains: ['cdn.pixabay.com'],
  },

  markdown: {
    processor: unified({
      remarkPlugins: [readingTimeRemarkPlugin],
      rehypePlugins: [responsiveTablesRehypePlugin],
    }),
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
