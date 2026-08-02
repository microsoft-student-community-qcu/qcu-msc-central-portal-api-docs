import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const ORG_NAME = 'microsoft-student-community-qcu';
const PROJECT_NAME = 'qcu-msc-central-portal-api-docs';
const BACKEND_REPO = 'https://github.com/microsoft-student-community-qcu/qcu-msc-central-portal-backend';
const BACKEND_DOCS_ROOT = `${BACKEND_REPO}/tree/main/docs/`;

const config: Config = {
  title: 'QCU MSC Central Portal — API Docs',
  tagline: 'API reference for the QCU Microsoft Student Community Central Portal backend',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  // Served from GitHub Pages: https://<org>.github.io/<repo>/
  url: `https://${ORG_NAME}.github.io`,
  baseUrl: `/${PROJECT_NAME}/`,

  organizationName: ORG_NAME,
  projectName: PROJECT_NAME,

  onBrokenLinks: 'throw',

  // Brand fonts used by the navbar logo, matching the portal frontend.
  headTags: [
    {
      tagName: 'link',
      attributes: {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
    },
    {
      tagName: 'link',
      attributes: {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous'},
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&family=Sora:wght@400;600;700;800&display=swap',
      },
    },
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          // "Edit this page" links point to the source of truth (backend repo docs).
          editUrl: BACKEND_DOCS_ROOT,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        docsRouteBasePath: '/docs',
        indexBlog: false,
      },
    ],
  ],

  themeConfig: {
    metadata: [
      {
        name: 'description',
        content:
          'API reference, workflows, and data models for the QCU Microsoft Student Community Central Portal backend.',
      },
    ],
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: BACKEND_REPO,
          label: 'Backend Repo',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'API Basics', to: '/docs/intro'},
            {label: 'API v1 Reference', to: '/docs/api/v1/applicants'},
            {label: 'Workflows', to: '/docs/guides/workflows/overview'},
            {label: 'Data Models', to: '/docs/specs/data-models/overview'},
          ],
        },
        {
          title: 'Projects',
          items: [
            {
              label: 'Backend',
              href: BACKEND_REPO,
            },
            {
              label: 'Main Portal',
              href: 'https://github.com/microsoft-student-community-qcu/qcu-msc-central-portal',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Org',
              href: `https://github.com/${ORG_NAME}`,
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} QCU Microsoft Student Community. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['http', 'json', 'bash'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
