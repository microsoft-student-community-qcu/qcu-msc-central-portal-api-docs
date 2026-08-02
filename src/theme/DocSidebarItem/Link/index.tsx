import React, {type ReactNode} from 'react';
import Link from '@theme-original/DocSidebarItem/Link';
import type LinkType from '@theme/DocSidebarItem/Link';
import type {WrapperProps} from '@docusaurus/types';
import type {PropSidebarItemLink} from '@docusaurus/plugin-content-docs';
import {useDocTocStore, type TocItem} from '../../DocTocStore';

type Props = WrapperProps<typeof LinkType>;

function TocMenu({items}: {items: readonly TocItem[]}): ReactNode {
  return (
    <ul className="menu__list menu__list--on-page">
      {items.map((item) => (
        <li className="menu__list-item" key={item.id}>
          <a className="menu__link menu__link--on-page" href={`#${item.id}`}>
            {item.value}
          </a>
          {item.children && item.children.length > 0 && (
            <TocMenu items={item.children} />
          )}
        </li>
      ))}
    </ul>
  );
}

export default function LinkWrapper(props: Props): ReactNode {
  const {item} = props as Props & {item: PropSidebarItemLink};
  const state = useDocTocStore();

  const isCurrentDoc =
    state !== null && item.docId !== undefined && item.docId === state.docId;

  return (
    <>
      <Link {...props} />
      {isCurrentDoc && !state.hidden && state.toc.length > 0 && (
        <TocMenu items={state.toc} />
      )}
    </>
  );
}
