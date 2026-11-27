import { useCallback, useEffect, useState } from 'react';

export function useLoad(fn, deps) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let live = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    fn()
      .then((data) => { if (live) setState({ data, error: null, loading: false }); })
      .catch((error) => { if (live) setState({ data: null, error, loading: false }); });
    return () => { live = false; };
  }, [...deps, tick]);
  const retry = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, retry };
}
