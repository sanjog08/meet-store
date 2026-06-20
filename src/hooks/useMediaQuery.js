import { useState, useEffect } from 'react';

/**
 * Returns true if the window matches the given CSS media query.
 *
 * @param {string} query - A CSS media query string, e.g. '(max-width: 768px)'
 * @returns {boolean}
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 */
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

export default useMediaQuery;
