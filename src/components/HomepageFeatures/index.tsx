import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Always In Sync',
    description: (
      <>
        Docs are pulled straight from the backend repo on every build — no manual
        copying, no stale documentation.
      </>
    ),
  },
  {
    title: 'Versioned API Reference',
    description: (
      <>
        Endpoint docs for <code>v1</code> (stable) and <code>v2</code> (next),
        plus the API versioning and deprecation policies.
      </>
    ),
  },
  {
    title: 'Workflows & Data Models',
    description: (
      <>
        Guides for the applicant pipeline, auth flows, RBAC, email notifications —
        and the Prisma-backed data models behind every endpoint.
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
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
