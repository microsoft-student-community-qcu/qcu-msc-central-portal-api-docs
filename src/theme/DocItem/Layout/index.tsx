import React, {useEffect, type ReactNode} from 'react';
import Layout from '@theme-original/DocItem/Layout';
import type LayoutType from '@theme/DocItem/Layout';
import type {WrapperProps} from '@docusaurus/types';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {setDocToc} from '../../DocTocStore';

type Props = WrapperProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props): ReactNode {
  const {metadata, toc, frontMatter} = useDoc();

  useEffect(() => {
    setDocToc({
      docId: metadata.id,
      toc,
      hidden: Boolean(frontMatter.hide_table_of_contents),
    });
  }, [metadata.id, toc, frontMatter.hide_table_of_contents]);

  return (
    <>
      <Layout {...props} />
    </>
  );
}
