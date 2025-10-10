import { useEffect, useState, useSyncExternalStore } from 'react';

const useMediaQuery = (query: string) => {
  const getMatch = () =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false;

  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);

    const abortCtrl = new AbortController();
    mediaQuery.addEventListener(
      'change',
      (event) => {
        setMatches(event.matches);
      },
      { signal: abortCtrl.signal },
    );

    return () => {
      abortCtrl.abort();
    };
  }, [query]);

  return matches;
};

const useIsClient = () => {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
};

export { useIsClient, useMediaQuery };
