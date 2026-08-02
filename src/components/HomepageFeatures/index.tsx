import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
  icon: ReactNode;
  accent: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Always In Sync',
    accent: 'var(--brand-green)',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true">
        <path d="M21 12a9 9 0 0 0-15.5-6.4L3 8" />
        <path d="M3 3v5h5" />
        <path d="M3 12a9 9 0 0 0 15.5 6.4L21 16" />
        <path d="M21 21v-5h-5" />
      </svg>
    ),
    description: (
      <>
        Docs are pulled straight from the backend repo on every build — no manual
        copying, no stale documentation.
      </>
    ),
  },
  {
    title: 'Versioned API Reference',
    accent: 'var(--brand-blue)',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true">
        <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
        <circle cx="7.5" cy="7.5" r="0.5" fill="currentColor" />
      </svg>
    ),
    description: (
      <>
        Endpoint docs for <code>v1</code> (stable) and <code>v2</code> (next),
        plus the API versioning and deprecation policies.
      </>
    ),
  },
  {
    title: 'Workflows & Data Models',
    accent: 'var(--brand-orange)',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14a9 3 0 0 0 18 0V5" />
        <path d="M3 12a9 3 0 0 0 18 0" />
      </svg>
    ),
    description: (
      <>
        Guides for the applicant pipeline, auth flows, RBAC, email notifications —
        and the Prisma-backed data models behind every endpoint.
      </>
    ),
  },
];

function Feature({title, description, icon, accent}: FeatureItem) {
  return (
    <div className="col col--4">
      <div className={clsx('card', styles.featureCard)}>
        <div className={styles.featureIcon} style={{background: accent}}>
          {icon}
        </div>
        <Heading as="h3">{title}</Heading>
        <p className={styles.featureBody}>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
