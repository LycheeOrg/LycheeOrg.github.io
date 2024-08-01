import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    // {
    //   text: 'Homes',
    //   links: [
    //     {
    //       text: 'SaaS',
    //       href: getPermalink('/homes/saas'),
    //     },
    //     {
    //       text: 'Startup',
    //       href: getPermalink('/homes/startup'),
    //     },
    //     {
    //       text: 'Mobile App',
    //       href: getPermalink('/homes/mobile-app'),
    //     },
    //     {
    //       text: 'Personal',
    //       href: getPermalink('/homes/personal'),
    //     },
    //   ],
    // },
    // {
    //   text: 'Pages',
    //   links: [
    //     {
    //       text: 'Features (Anchor Link)',
    //       href: getPermalink('/#features'),
    //     },
    //     {
    //       text: 'Services',
    //       href: getPermalink('/services'),
    //     },
    //     {
    //       text: 'Pricing',
    //       href: getPermalink('/pricing'),
    //     },
    //     {
    //       text: 'About us',
    //       href: getPermalink('/about'),
    //     },
    //     {
    //       text: 'Contact',
    //       href: getPermalink('/contact'),
    //     },
    //     {
    //       text: 'Terms',
    //       href: getPermalink('/terms'),
    //     },
    //     {
    //       text: 'Privacy policy',
    //       href: getPermalink('/privacy'),
    //     },
    //   ],
    // },
    // {
    //   text: 'Landing',
    //   links: [
    //     {
    //       text: 'Lead Generation',
    //       href: getPermalink('/landing/lead-generation'),
    //     },
    //     {
    //       text: 'Long-form Sales',
    //       href: getPermalink('/landing/sales'),
    //     },
    //     {
    //       text: 'Click-Through',
    //       href: getPermalink('/landing/click-through'),
    //     },
    //     {
    //       text: 'Product Details (or Services)',
    //       href: getPermalink('/landing/product'),
    //     },
    //     {
    //       text: 'Coming Soon or Pre-Launch',
    //       href: getPermalink('/landing/pre-launch'),
    //     },
    //     {
    //       text: 'Subscription',
    //       href: getPermalink('/landing/subscription'),
    //     },
    //   ],
    // },
    {
      text: 'Blog',
      links: [
        {
          text: 'Blog List',
          href: getBlogPermalink(),
        },
        {
          text: 'Future of lychee',
          href: getPermalink('future-of-lychee', 'post'),
        },
        {
          text: 'Article (with MDX)',
          href: getPermalink('markdown-elements-demo-post', 'post'),
        },
        // {
        //   text: 'Category Page',
        //   href: getPermalink('tutorials', 'category'),
        // },
        // {
        //   text: 'Tag Page',
        //   href: getPermalink('astro', 'tag'),
        // },
      ],
    },
    {
      text: 'Documentation',
      href: '/docs',
    },
  ],
  position: 'right',
  actions: [{ text: 'Download', href: 'https://github.com/LycheeOrg/Lychee', target: '_blank' }],
};

export const footerData = {
  links: [
    // {
    //   title: 'Product',
    //   links: [
    //     { text: 'Features', href: '#' },
    //     { text: 'Security', href: '#' },
    //     { text: 'Team', href: '#' },
    //     { text: 'Enterprise', href: '#' },
    //     { text: 'Customer stories', href: '#' },
    //     { text: 'Pricing', href: '#' },
    //     { text: 'Resources', href: '#' },
    //   ],
    // },
    // {
    //   title: 'Platform',
    //   links: [
    //     { text: 'Developer API', href: '#' },
    //     { text: 'Partners', href: '#' },
    //     { text: 'Atom', href: '#' },
    //     { text: 'Electron', href: '#' },
    //     { text: 'AstroWind Desktop', href: '#' },
    //   ],
    // },
    {
      title: 'Need help?',
      links: [
        { text: 'Read the Docs', href: '/docs' },
        { text: 'Community Forum', href: 'https://github.com/LycheeOrg/Lychee/discussions' },
        // { text: 'Professional Services', href: '#' },
        // { text: 'Skills', href: '#' },
        // { text: 'Status', href: '#' },
      ],
    },
      {
        title: 'Support  Lychee',
        links: [
          { text: 'GitHub sponsor', href: 'https://github.com/sponsors/LycheeOrg' },
          { text: 'Open Collective', href: 'https://opencollective.com/LycheeOrg' },
          // { text: 'Careers', href: '#' },
          // { text: 'Press', href: '#' },
          // { text: 'Inclusion', href: '#' },
          // { text: 'Social Impact', href: '#' },
          // { text: 'Shop', href: '#' },
        ],
      },
  ],
  secondaryLinks: [
    { text: 'License', href: getPermalink('/license') },
    // { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    //   { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
    //   { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
    //   { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
    //   { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    //   { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/onwidget/astrowind' },
  ],
  footNote: `Maintained by <a class="text-sky-500" href="https://github.com/LycheeOrg">LycheeOrg</a> &mdash; Built with <a class="text-sky-500" href="https://astro.build">Astro</a> & <a class="text-sky-500" href="https://tailwindcss.com">Tailwind CSS</a>`,
};
