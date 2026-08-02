import {useSyncExternalStore} from 'react';

export type TocItem = {
  id: string;
  value: string;
  level: number;
  children?: TocItem[];
};

export type DocTocState = {
  docId: string;
  toc: readonly TocItem[];
  hidden: boolean;
} | null;

let state: DocTocState = null;

const listeners = new Set<() => void>();

export function setDocToc(next: DocTocState): void {
  state = next;
  listeners.forEach((listener) => listener());
}

function getSnapshot(): DocTocState {
  return state;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useDocTocStore(): DocTocState {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
