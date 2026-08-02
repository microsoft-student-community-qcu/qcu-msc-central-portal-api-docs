import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

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
            Read the Docs
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/api/v1/applicants">
            Browse API Reference
          </Link>
        </div>
      </div>
    </header>
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
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
