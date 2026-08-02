import React, {
  useLayoutEffect,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import TOC from '@theme/TOC';

type PanelEntry = {
  id: string;
  label: string;
  request: HTMLElement | null;
  response: HTMLElement | null;
};

const ENDPOINT_PAGE_PATTERN = /\/api\/v\d+\//;

const REQUEST_PATTERN = /\bRequest\b/i;
const RESPONSE_PATTERN = /\bResponse\b/i;
const EXAMPLE_PATTERN = /\bExample\b/i;

function scanEntries(): PanelEntry[] {
  const article = document.querySelector('article');
  if (!article) {
    return [];
  }

  const nodes = Array.from(
    article.querySelectorAll('h2, h3, h4, h5, strong'),
  ) as HTMLElement[];

  const map = new Map<string, PanelEntry>();
  const order: string[] = [];
  let currentId: string | null = null;

  for (const node of nodes) {
    const tag = node.tagName;
    if (/^H[2345]$/.test(tag)) {
      const id = node.getAttribute('id');
      currentId = id && id.length > 0 ? id : null;
      if (currentId) {
        order.push(currentId);
        map.set(currentId, {
          id: currentId,
          label: (node.textContent ?? '').trim(),
          request: null,
          response: null,
        });
      }
      continue;
    }

    if (!currentId || node.closest('pre, code')) {
      continue;
    }

    const text = node.textContent ?? '';
    const entry = map.get(currentId)!;
    const isExample = EXAMPLE_PATTERN.test(text);
    const preferExample = (current: HTMLElement | null) =>
      current === null || (isExample && !EXAMPLE_PATTERN.test(current.textContent ?? ''));

    if (REQUEST_PATTERN.test(text) && preferExample(entry.request)) {
      entry.request = node;
    } else if (RESPONSE_PATTERN.test(text) && preferExample(entry.response)) {
      entry.response = node;
    }
  }

  return order
    .map((id) => map.get(id)!)
    .filter((entry) => entry.request !== null || entry.response !== null);
}

function useEntries(permalink: string): PanelEntry[] {
  const [entries, setEntries] = useState<PanelEntry[]>([]);

  useLayoutEffect(() => {
    setEntries(scanEntries());
  }, [permalink]);

  return entries;
}

export default function DocItemTOCDesktop(): ReactNode {
  const {metadata, toc, frontMatter} = useDoc();

  if (!ENDPOINT_PAGE_PATTERN.test(metadata.permalink)) {
    return (
      <TOC
        toc={toc}
        minHeadingLevel={frontMatter.toc_min_heading_level}
        maxHeadingLevel={frontMatter.toc_max_heading_level}
        className={ThemeClassNames.docs.docTocDesktop}
      />
    );
  }

  return <RequestResponsePanel />;
}

function RequestResponsePanel(): ReactNode {
  const {metadata} = useDoc();
  const entries = useEntries(metadata.permalink);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeKind, setActiveKind] = useState<'request' | 'response' | null>(null);

  useLayoutEffect(() => {
    setActiveId(null);
    setActiveKind(null);
  }, [metadata.permalink]);

  useLayoutEffect(() => {
    if (entries.length === 0) {
      return undefined;
    }
    const observer = new IntersectionObserver(
      (intersections) => {
        for (const intersection of intersections) {
          if (intersection.isIntersecting) {
            setActiveId(intersection.target.id);
          }
        }
      },
      {rootMargin: '-96px 0px -60% 0px'},
    );
    for (const entry of entries) {
      const el = document.getElementById(entry.id);
      if (el) {
        observer.observe(el);
      }
    }
    return () => observer.disconnect();
  }, [entries]);

  const jumpTo = (event: MouseEvent, entry: PanelEntry) => {
    event.preventDefault();
    setActiveId(entry.id);
    const el = document.getElementById(entry.id);
    if (el) {
      el.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  };

  const jumpToPart = (entry: PanelEntry, kind: 'request' | 'response') => {
    const el = entry[kind];
    if (el) {
      setActiveId(entry.id);
      setActiveKind(kind);
      el.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  };

  return (
    <div className={ThemeClassNames.docs.docTocDesktop}>
      <div className="rr-panel">
        <div className="rr-panel__title">Request &amp; Response</div>
        {entries.length === 0 ? (
          <p className="rr-panel__empty">No request or response examples on this page.</p>
        ) : (
          <ul className="rr-panel__list">
            {entries.map((entry) => (
              <li
                className={clsx(
                  'rr-panel__group',
                  activeId === entry.id && 'rr-panel__group--active',
                )}
                key={entry.id}>
                <a
                  className="rr-panel__endpoint"
                  href={`#${entry.id}`}
                  onClick={(event) => jumpTo(event, entry)}>
                  {entry.label}
                </a>
                {(entry.request || entry.response) && (
                  <div className="rr-panel__subs">
                    {entry.request && (
                      <button
                        className={clsx(
                          'rr-panel__sub',
                          activeKind === 'request' &&
                            activeId === entry.id &&
                            'rr-panel__sub--active',
                        )}
                        type="button"
                        onClick={() => jumpToPart(entry, 'request')}>
                        Request
                      </button>
                    )}
                    {entry.response && (
                      <button
                        className={clsx(
                          'rr-panel__sub',
                          activeKind === 'response' &&
                            activeId === entry.id &&
                            'rr-panel__sub--active',
                        )}
                        type="button"
                        onClick={() => jumpToPart(entry, 'response')}>
                        Response
                      </button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
