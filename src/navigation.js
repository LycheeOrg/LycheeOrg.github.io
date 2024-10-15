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
          text: 'The future of lychee',
          href: getPermalink('2024-06-29-future-of-lychee', 'post'),
        },
        {
          text: 'About Version 6',
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
          { text: 'Get Lychee <span class="text-sky-500">SE</span>', href: 'https://lycheeorg.github.io/get-supporter-edition' },
          { text: 'GitHub sponsor', href: 'https://github.com/sponsors/LycheeOrg' },
          { text: 'Open Collective', href: 'https://opencollective.com/LycheeOrg' },
        ],
      },
  ],
  secondaryLinks: [
    { text: 'License', href: getPermalink('/license') },
  ],
  socialLinks: [
      { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
      { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/LycheeOrg/Lychee' },
  ],
  footNote: `Maintained by <a class="text-sky-500" href="https://github.com/LycheeOrg">LycheeOrg</a> &mdash; Built with <a class="text-sky-500" href="https://astro.build">Astro</a> & <a class="text-sky-500" href="https://tailwindcss.com">Tailwind CSS</a>`,
};
