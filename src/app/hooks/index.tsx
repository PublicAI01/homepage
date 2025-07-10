import { useEffect, useState } from 'react';

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    setMatches(mediaQuery.matches);

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

export { useMediaQuery };
