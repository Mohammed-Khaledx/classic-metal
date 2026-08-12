"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { ProductsConfig, Quote } from "./types";
import { CONFIG_KEY, QUOTES_KEY } from "./defaults";

interface LocalStore<T> {
  subscribe: (cb: () => void) => () => void;
  snapshot: () => T;
  read: () => void;
  write: (value: T) => void;
  remove: () => void;
  ready: () => boolean;
}

function createStore<T>(key: string, fallback: T): LocalStore<T> {
  let cache: T = fallback;
  let initialized = false;
  const listeners = new Set<() => void>();

  function emit() {
    for (const cb of listeners) cb();
  }

  function read() {
    initialized = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as T;
        cache = parsed;
        return cache;
      }
    } catch {
      /* ignore corrupted data */
    }
    cache = fallback;
    return cache;
  }

  function subscribe(cb: () => void) {
    listeners.add(cb);
    window.addEventListener("storage", (e) => {
      if (e.key === key) {
        read();
        emit();
      }
    });
    return () => {
      listeners.delete(cb);
    };
  }

  function snapshot() {
    return cache;
  }

  function write(value: T) {
    cache = value;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or unavailable */
    }
    emit();
  }

  function remove() {
    cache = fallback;
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    emit();
  }

  return {
    subscribe,
    snapshot,
    read: () => {
      read();
      emit();
    },
    write,
    remove,
    ready: () => initialized,
  };
}

const configStore = createStore<ProductsConfig | null>(CONFIG_KEY, null);
const quotesStore = createStore<Quote[]>(QUOTES_KEY, []);

function useHydrated<T>(store: LocalStore<T>) {
  useEffect(() => {
    store.read();
  }, [store]);
}

export function useConfig() {
  const config = useSyncExternalStore(
    configStore.subscribe,
    configStore.snapshot,
    () => null
  );
  useHydrated(configStore);
  return { config, ready: configStore.ready() };
}

export function saveConfig(next: ProductsConfig) {
  configStore.write(next);
}

export function resetConfig() {
  configStore.remove();
}

export function useQuotes() {
  const quotes = useSyncExternalStore(
    quotesStore.subscribe,
    quotesStore.snapshot,
    () => []
  );
  useHydrated(quotesStore);
  return { quotes, ready: quotesStore.ready() };
}

export function addQuote(quote: Quote) {
  const next = [quote, ...(quotesStore.snapshot() ?? [])].slice(0, 50);
  quotesStore.write(next);
}

export function removeQuote(id: string) {
  quotesStore.write(
    (quotesStore.snapshot() ?? []).filter((q) => q.id !== id)
  );
}

export function findQuote(id: string): Quote | undefined {
  return (quotesStore.snapshot() ?? []).find((q) => q.id === id);
}