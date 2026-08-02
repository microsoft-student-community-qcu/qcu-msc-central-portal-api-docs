import {useEffect, useRef, type CSSProperties, type ReactNode} from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {
  ArrowRight,
  BookOpen,
  Database,
  Fingerprint,
  GitBranch,
  RefreshCw,
  Zap,
} from 'lucide-react';
import styles from './index.module.css';

const BACKEND_REPO =
  'https://github.com/microsoft-student-community-qcu/qcu-msc-central-portal-backend';
const PORTAL_REPO =
  'https://github.com/microsoft-student-community-qcu/qcu-msc-central-portal';

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add(styles.revealVisible);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add(styles.revealVisible);
            io.disconnect();
          }
        }
      },
      {threshold: 0.15, rootMargin: '0px 0px -40px 0px'},
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style: CSSProperties | undefined =
    delay > 0 ? {transitionDelay: `${delay}ms`} : undefined;

  return (
    <div ref={ref} className={clsx(styles.reveal, className)} style={style}>
      {children}
    </div>
  );
}

const ENDPOINTS = [
  {
    method: 'POST',
    path: '/api/v1/ocr/verify',
    to: '/docs/api/v1/ocr',
    title: 'Verify a student ID',
    desc: 'Public. Upload a QCU ID image and get the recognized student record back.',
  },
  {
    method: 'POST',
    path: '/api/v1/applicants',
    to: '/docs/api/v1/applicants',
    title: 'Submit an application',
    desc: 'Create the applicant record — personal details, documents, and COR.',
  },
  {
    method: 'GET',
    path: '/api/v1/applicants',
    to: '/docs/api/v1/applicants',
    title: 'List applicants',
    desc: 'Paged listing with role-based filters for members and admins.',
  },
  {
    method: 'GET',
    path: '/api/v1/applicants/{id}',
    to: '/docs/api/v1/applicants',
    title: 'Fetch an applicant',
    desc: 'Full profile, document status, and participation for one applicant.',
  },
  {
    method: 'POST',
    path: '/api/v1/setup-token',
    to: '/docs/api/v1/setup-token',
    title: 'Issue a setup token',
    desc: 'Managed-device authentication for kiosks and setup flows.',
  },
] as const;

export default function HomePage() {
  const banner = useBaseUrl('/img/banner.svg');

  return (
    <Layout
      title="QCU MSC Central Portal — API Docs"
      description="API reference, workflows, and data models for the QCU Microsoft Student Community Central Portal backend."
    >
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <p className={clsx(styles.kicker, styles.heroIn, styles.d1)}>
              QCU MSC Central Portal · API Docs
            </p>
            <h1 className={clsx(styles.title, styles.heroIn, styles.d2)}>
              Read.
              <br />
              <span className={styles.gradientText}>Build.</span>
              <br />
              Ship.
            </h1>
            <p className={clsx(styles.lead, styles.heroIn, styles.d3)}>
              The complete reference for the Central Portal backend — Azure
              Functions, Better Auth, Prisma. Every route, workflow, and data
              model, generated from the backend repo on each build.
            </p>
            <div className={clsx(styles.pills, styles.heroIn, styles.d4)}>
              <span className={clsx(styles.pill, styles.pillAccent)}>
                Azure Functions
              </span>
              <span className={styles.pill}>Better Auth</span>
              <span className={styles.pill}>Prisma</span>
              <span className={styles.pill}>v1 · v2</span>
            </div>
            <div className={clsx(styles.ctas, styles.heroIn, styles.d4)}>
              <Link className={styles.ctaPrimary} to="/docs/">
                Read the Docs <ArrowRight size={18} />
              </Link>
              <Link className={styles.ctaOutline} to="/docs/api/">
                Browse API Reference
              </Link>
            </div>
            <p className={clsx(styles.heroMeta, styles.heroIn, styles.d5)}>
              No API key needed — the OCR endpoint is fully public.
            </p>
          </div>

          <div className={clsx(styles.media, styles.heroIn, styles.d4)}>
            <div className={clsx(styles.mediaPrimary, styles.frameIn)}>
              <img src={banner} alt="QCU MSC Central Portal banner" />
            </div>
            <div className={clsx(styles.mediaCode, styles.frameIn2)}>
              <div className={styles.codeBar}>
                <span />
                <span />
                <span />
              </div>
              <pre className={styles.pre}>
                <span className={styles.tok1}>curl</span>{' '}
                <span className={styles.tok2}>-X POST</span>{' '}
                https://api.msc-qcu.tech/api/v1/ocr/verify{' '}
                <span className={styles.tok5}>\</span>
                {'\n'}
                {'  '}
                <span className={styles.tok2}>-F</span>{' '}
                <span className={styles.tok4}>"image=@student-id.jpg"</span>
              </pre>
            </div>
          </div>
        </div>
      </header>

      <section className={styles.section}>
        <Reveal>
          <p className={styles.kicker}>Get started</p>
          <h2 className={styles.h2}>Make your first call in minutes</h2>
        </Reveal>
        <Reveal delay={100}>
          <div className={styles.panel}>
            <div className={styles.panelInner}>
              <ol className={styles.steps}>
                <li className={styles.step}>
                  <span className={styles.stepIcon}>
                    <Zap size={20} />
                  </span>
                  <div>
                    <h3 className={styles.stepTitle}>Point at the base URL</h3>
                    <p className={styles.stepText}>
                      Every route is versioned under{' '}
                      <code className={styles.stepCode}>/api/v1</code>;
                      breaking changes move to{' '}
                      <code className={styles.stepCode}>/api/v2</code>.
                    </p>
                  </div>
                </li>
                <li className={styles.step}>
                  <span className={styles.stepIcon}>
                    <Fingerprint size={20} />
                  </span>
                  <div>
                    <h3 className={styles.stepTitle}>
                      Try a public endpoint
                    </h3>
                    <p className={styles.stepText}>
                      Verify a QCU Student ID with one POST to{' '}
                      <code className={styles.stepCode}>/ocr/verify</code> —
                      no account required.
                    </p>
                  </div>
                </li>
                <li className={styles.step}>
                  <span className={styles.stepIcon}>
                    <BookOpen size={20} />
                  </span>
                  <div>
                    <h3 className={styles.stepTitle}>Read the envelope</h3>
                    <p className={styles.stepText}>
                      Every response follows the same{' '}
                      <code className={styles.stepCode}>
                        {'{ success, data, message }'}
                      </code>{' '}
                      contract.
                    </p>
                  </div>
                </li>
              </ol>
              <div className={styles.panelCode}>
                <pre className={styles.pre}>
                  <span className={styles.tok1}>curl</span>{' '}
                  <span className={styles.tok2}>-X POST</span>{' '}
                  https://api.msc-qcu.tech/api/v1/ocr/verify{' '}
                  <span className={styles.tok5}>\</span>
                  {'\n'}
                  {'  '}
                  <span className={styles.tok2}>-F</span>{' '}
                  <span className={styles.tok4}>"image=@student-id.jpg"</span>
                </pre>
              </div>
            </div>
            <Link
              className={styles.panelCta}
              to="/docs/getting-started/quickstart"
            >
              Follow the Quickstart <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </section>

      <section className={styles.tinted}>
        <div className={styles.section}>
          <Reveal>
            <p className={styles.kicker}>API reference</p>
            <h2 className={styles.h2}>Every v1 endpoint, one grid away</h2>
          </Reveal>
          <div className={styles.grid}>
            {ENDPOINTS.map((endpoint, i) => (
              <Reveal key={endpoint.path} delay={i * 60}>
                <Link className={styles.endpointCard} to={endpoint.to}>
                  <span
                    className={clsx(
                      styles.method,
                      endpoint.method === 'POST'
                        ? styles.methodPost
                        : styles.methodGet,
                    )}
                  >
                    {endpoint.method}
                  </span>
                  <code className={styles.path}>{endpoint.path}</code>
                  <h3 className={styles.cardTitle}>{endpoint.title}</h3>
                  <p className={styles.cardDesc}>{endpoint.desc}</p>
                  <span className={styles.cardLink}>
                    Open reference <ArrowRight size={14} />
                  </span>
                </Link>
              </Reveal>
            ))}
            <Reveal delay={300}>
              <Link
                className={clsx(styles.endpointCard, styles.viewAll)}
                to="/docs/api/"
              >
                <span className={styles.viewAllIcon}>
                  <ArrowRight size={22} />
                </span>
                <h3 className={styles.cardTitle}>
                  Browse the full reference
                </h3>
                <p className={styles.cardDesc}>
                  Every route, guard, and field — v1 today, v2 on the way.
                </p>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <Reveal>
          <p className={styles.kicker}>Guides &amp; models</p>
          <h2 className={styles.h2}>Explore the docs</h2>
        </Reveal>
        <div className={styles.guides}>
          <Reveal delay={0}>
            <Link className={styles.guideCard} to="/docs/guides/workflows">
              <span className={styles.iconChip}>
                <GitBranch size={20} />
              </span>
              <h3 className={styles.cardTitle}>Guides &amp; Workflows</h3>
              <p className={styles.cardDesc}>
                Multi-step flows end to end: the applicant pipeline, account
                activation, and RBAC design.
              </p>
              <span className={styles.cardLink}>
                Explore guides <ArrowRight size={14} />
              </span>
            </Link>
          </Reveal>
          <Reveal delay={80}>
            <Link
              className={styles.guideCard}
              to="/docs/specs/data-models/overview"
            >
              <span className={styles.iconChip}>
                <Database size={20} />
              </span>
              <h3 className={styles.cardTitle}>Data Models</h3>
              <p className={styles.cardDesc}>
                The Prisma schemas behind every endpoint — Applicant, User,
                Session, Event, and more.
              </p>
              <span className={styles.cardLink}>
                View schemas <ArrowRight size={14} />
              </span>
            </Link>
          </Reveal>
          <Reveal delay={160}>
            <Link className={styles.guideCard} to="/docs/intro">
              <span className={styles.iconChip}>
                <RefreshCw size={20} />
              </span>
              <h3 className={styles.cardTitle}>Always in Sync</h3>
              <p className={styles.cardDesc}>
                Generated from the backend repo on every build — reference,
                metadata, and patches from one source of truth.
              </p>
              <span className={styles.cardLink}>
                Read the overview <ArrowRight size={14} />
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className={styles.ctaBand}>
        <div className={styles.section}>
          <Reveal>
            <div className={styles.ctaPanel}>
              <p className={clsx(styles.kicker, styles.ctaKicker)}>
                Start building
              </p>
              <h2 className={clsx(styles.h2, styles.ctaTitle)}>
                Ship your first integration today.
              </h2>
              <div className={styles.ctaCols}>
                <div>
                  <p className={styles.ctaLabel}>For frontend devs</p>
                  <Link
                    className={styles.ctaLink}
                    to="/docs/getting-started/quickstart"
                  >
                    Read the Quickstart <ArrowRight size={18} />
                  </Link>
                  <p className={styles.ctaSub}>
                    Your first API call in a few minutes.
                  </p>
                </div>
                <div>
                  <p className={styles.ctaLabel}>For contributors</p>
                  <a
                    className={styles.ctaLink}
                    href={BACKEND_REPO}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open the Backend Repo <ArrowRight size={18} />
                  </a>
                  <p className={styles.ctaSub}>
                    These docs are generated from this repository.
                  </p>
                </div>
                <div>
                  <p className={styles.ctaLabel}>For the curious</p>
                  <a
                    className={styles.ctaLink}
                    href={PORTAL_REPO}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    See the Portal Project <ArrowRight size={18} />
                  </a>
                  <p className={styles.ctaSub}>
                    The full product — frontend, vision, and roadmap.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
