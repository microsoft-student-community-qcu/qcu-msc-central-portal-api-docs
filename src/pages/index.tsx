import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const BACKEND_REPO =
  'https://github.com/microsoft-student-community-qcu/qcu-msc-central-portal-backend';

type LinkCard = {title: string; desc: string; to: string};

type EndpointCard = {
  title: string;
  path: string;
  methods: string;
  desc: string;
  to: string;
};

const START_HERE: LinkCard[] = [
  {
    title: 'Quickstart',
    desc: 'Make your first API call in minutes — no account required.',
    to: '/docs/getting-started/quickstart',
  },
  {
    title: 'Authentication',
    desc: 'Sessions via Better Auth, role guards, and the account lifecycle.',
    to: '/docs/getting-started/authentication',
  },
  {
    title: 'Introduction',
    desc: 'Base URL, response envelope, status codes, rate limits, and conventions.',
    to: '/docs/intro',
  },
];

const ENDPOINTS: EndpointCard[] = [
  {
    title: 'Applicant Tracking',
    path: '/api/v1/applicants',
    methods: 'POST · GET · PATCH',
    desc: 'Applicant records, documents, and the multi-step application flow.',
    to: '/docs/api/v1/applicants',
  },
  {
    title: 'User Management',
    path: '/api/v1/users',
    methods: 'POST · GET · PATCH',
    desc: 'Account activation, profiles, and role management.',
    to: '/docs/api/v1/users',
  },
  {
    title: 'Events & Registration',
    path: '/api/v1/events',
    methods: 'POST · GET',
    desc: 'Event listings, registration, and participation.',
    to: '/docs/api/v1/events',
  },
  {
    title: 'OCR Verification',
    path: '/api/v1/ocr',
    methods: 'POST',
    desc: 'Public student-ID verification with session-based lookup.',
    to: '/docs/api/v1/ocr',
  },
  {
    title: 'Setup Tokens',
    path: '/api/v1/setup-token',
    methods: 'POST',
    desc: 'Managed-device authentication for kiosks and setup flows.',
    to: '/docs/api/v1/setup-token',
  },
  {
    title: 'Versioning',
    path: '/api/versioning',
    methods: '',
    desc: 'How breaking changes move between v1 and v2.',
    to: '/docs/api/versioning',
  },
  {
    title: 'Deprecation Policy',
    path: '/api/deprecation-template',
    methods: '',
    desc: 'The lifecycle and communication of deprecated endpoints.',
    to: '/docs/api/deprecation-template',
  },
];

const GUIDES: LinkCard[] = [
  {
    title: 'Core Workflows',
    desc: 'The multi-step flows that span several API calls.',
    to: '/docs/guides/workflows',
  },
  {
    title: 'Applicant Pipeline',
    desc: 'Submission, OCR, drafts, and account activation.',
    to: '/docs/guides/workflows/applicant-tracking',
  },
  {
    title: 'Authentication',
    desc: 'Better Auth sessions, guards, and account lifecycle.',
    to: '/docs/guides/workflows/auth-workflow',
  },
  {
    title: 'RBAC & Authorization',
    desc: 'The four-role model and how endpoints are guarded.',
    to: '/docs/guides/workflows/rbac',
  },
  {
    title: 'Event Management',
    desc: 'Events, registration, and guest handling.',
    to: '/docs/guides/workflows/event-management',
  },
  {
    title: 'Email Notifications',
    desc: 'Transactional emails and their templates.',
    to: '/docs/guides/workflows/email-notifications',
  },
];

const MODELS: LinkCard[] = [
  {
    title: 'Overview',
    desc: 'Entities, relations, and conventions.',
    to: '/docs/specs/data-models/overview',
  },
  {
    title: 'User',
    desc: 'Accounts, sessions, and roles.',
    to: '/docs/specs/data-models/user',
  },
  {
    title: 'Applicant',
    desc: 'Application records and documents.',
    to: '/docs/specs/data-models/applicant',
  },
  {
    title: 'Event',
    desc: 'Events and their configuration.',
    to: '/docs/specs/data-models/event',
  },
  {
    title: 'Registration',
    desc: 'Event participation and status.',
    to: '/docs/specs/data-models/registration',
  },
  {
    title: 'Sponsorship Inquiry',
    desc: 'Sponsorship contact records.',
    to: '/docs/specs/data-models/sponsorship-inquiry',
  },
];

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      <div className={styles.heroSky} aria-hidden="true" />
      <div className={styles.starfield} aria-hidden="true" />
      <div className={styles.starfieldTwo} aria-hidden="true" />
      <div className="container">
        <img
          src={useBaseUrl('img/banner.svg')}
          alt="QCU MSC banner"
          className={styles.heroBannerImg}
        />
        <Heading as="h1" className={styles.title}>
          QCU MSC Central Portal
          <span className={styles.titleAccent}>API Docs</span>
        </Heading>
        <p className={styles.tagline}>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/intro">
            Read the Introduction
          </Link>
        </div>
      </div>
    </header>
  );
}

function SectionHeader({kicker, title}: {kicker: string; title: string}) {
  return (
    <>
      <p className={styles.kicker}>{kicker}</p>
      <h2 className={styles.sectionTitle}>{title}</h2>
    </>
  );
}

function LinkCardView({item}: {item: LinkCard}) {
  return (
    <Link className={styles.card} to={item.to}>
      <h3 className={styles.cardTitle}>{item.title}</h3>
      <p className={styles.cardDesc}>{item.desc}</p>
      <span className={styles.cardLink}>Open →</span>
    </Link>
  );
}

function EndpointCardView({endpoint}: {endpoint: EndpointCard}) {
  return (
    <Link className={styles.card} to={endpoint.to}>
      <div className={styles.cardTop}>
        <code className={styles.cardPath}>{endpoint.path}</code>
        {endpoint.methods && (
          <span className={styles.cardMethods}>{endpoint.methods}</span>
        )}
      </div>
      <h3 className={styles.cardTitle}>{endpoint.title}</h3>
      <p className={styles.cardDesc}>{endpoint.desc}</p>
      <span className={styles.cardLink}>Open reference →</span>
    </Link>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="API reference, workflows, and data models for the QCU Microsoft Student Community Central Portal backend.">
      <HomepageHeader />
      <main>
        <section className={styles.section}>
          <SectionHeader kicker="Getting started" title="Start here" />
          <div className={styles.grid}>
            {START_HERE.map((item) => (
              <LinkCardView key={item.to} item={item} />
            ))}
          </div>
        </section>

        <section className={clsx(styles.section, styles.tinted)}>
          <SectionHeader kicker="API reference" title="Every endpoint" />
          <div className={styles.grid}>
            {ENDPOINTS.map((endpoint) => (
              <EndpointCardView key={endpoint.to} endpoint={endpoint} />
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <SectionHeader kicker="Guides" title="Workflows end to end" />
          <div className={styles.grid}>
            {GUIDES.map((item) => (
              <LinkCardView key={item.to} item={item} />
            ))}
          </div>
        </section>

        <section className={clsx(styles.section, styles.tinted)}>
          <SectionHeader kicker="Data models" title="Behind every endpoint" />
          <div className={styles.grid}>
            {MODELS.map((item) => (
              <LinkCardView key={item.to} item={item} />
            ))}
          </div>
        </section>

        <section className={styles.syncNote}>
          <div className={styles.syncInner}>
            <span className={styles.syncIcon} aria-hidden="true">
              ↻
            </span>
            <p>
              Pages under <strong>API Reference</strong>,{' '}
              <strong>Guides</strong>, and <strong>Data Models</strong> are
              pulled straight from the{' '}
              <a href={BACKEND_REPO} target="_blank" rel="noopener noreferrer">
                backend repository
              </a>{' '}
              on every build — no manual copying.
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
