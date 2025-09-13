import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Blog',
      links: [
        {
          text: 'Read the blog',
          href: getBlogPermalink(),
        },
        {
          text: 'AI-assisted reviews, one month later...',
          href: getPermalink('2025-09-13-code-rabbit', 'post'),
        },
        {
          text: 'Open Source, processes problems, and moving forward',
          href: getPermalink('2025-08-13-opensource-processes-documentation', 'post'),
        },
        {
          text: 'Current developments',
          href: getPermalink('v6', 'tag'),
        },
      ],
    },
    {
      text: 'About us',
      href: '/support',
    },
    {
      text: 'Lychee <span class="text-sky-500 ml-1">SE</span>',
      href: '/get-supporter-edition',
    },
    {
      text: 'Docs',
      href: '/docs',
    },
  ],
  position: 'right',
  actions: [{ text: 'Download', href: 'https://github.com/LycheeOrg/Lychee', target: '_blank' }],
};

export const footerData = {
  links: [
    {
      title: 'About',
      links: [
        { text: 'Code of Conduct', href: getPermalink('/code-of-conduct') },
        { text: 'Release Notes', href: getPermalink('/docs/releases.html') },
        { text: 'PR Dashboard', href: 'https://pr.lycheeorg.dev/' },
        { text: 'Issue trakcer', href: 'https://github.com/LycheeOrg/Lychee/issues' },
      ]
    },
    {
      title: 'Need help?',
      links: [
        { text: 'Read the Docs', href: '/docs' },
        { text: 'Community Forum', href: 'https://github.com/LycheeOrg/Lychee/discussions' },
        { text: 'Join our discord', href: 'https://discord.gg/JMPvuRQcTf' },
      ],
    },
    {
      title: 'Support  Lychee',
      links: [
        { text: 'Get Lychee <span class="text-sky-500">SE</span>', href: 'https://lycheeorg.dev/get-supporter-edition' },
        { text: 'GitHub sponsor', href: 'https://github.com/sponsors/LycheeOrg' },
        { text: 'Open Collective', href: 'https://opencollective.com/LycheeOrg' },
        { text: 'Translations', href: 'https://weblate.lycheeorg.dev' },
      ],
    },
    {
      title: 'Security',
      links: [
        { text: 'Cosign key', href: getPermalink('lychee-cosign.pub') },
      ]
    }
  ],
  secondaryLinks: [
    { text: 'License', href: getPermalink('/license') },
    { text: 'Privacy Policy', href: getPermalink('/privacy-policy') },
  ],
  socialLinks: [
      { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
      { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/LycheeOrg/Lychee' },
  ],
  footNote: `Maintained by <a class="text-sky-500" href="https://github.com/LycheeOrg">LycheeOrg</a> &mdash; Built with <a class="text-sky-500" href="https://astro.build">Astro</a> & <a class="text-sky-500" href="https://tailwindcss.com">Tailwind CSS</a>`,
};
