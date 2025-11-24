'use client';

import { useRef, useCallback, useEffect } from 'react';

/**
 * Hook to create and cache handlers by key
 * Automatically cleans up handlers for keys that no longer exist
 */
export function useCachedHandler<T extends string>(
  createHandler: (key: T) => () => void,
  validKeys: T[]
) {
  const handlersRef = useRef(new Map<T, () => void>());

  const getHandler = useCallback(
    (key: T) => {
      if (!handlersRef.current.has(key)) {
        handlersRef.current.set(key, createHandler(key));
      }
      return handlersRef.current.get(key)!;
    },
    [createHandler]
  );

  useEffect(() => {
    const validKeysSet = new Set(validKeys);
    handlersRef.current.forEach((_, key) => {
      if (!validKeysSet.has(key)) {
        handlersRef.current.delete(key);
      }
    });
  }, [validKeys]);

  return getHandler;
}

