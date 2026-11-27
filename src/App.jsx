import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Shell from './components/Shell.jsx';
import Alert from './components/Alert.jsx';
import { ensureSeed } from './lib/db.js';
import Home from './pages/Home.jsx';
import Chapter from './pages/Chapter.jsx';
import Entry from './pages/Entry.jsx';
import Write from './pages/Write.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  const [err, setErr] = useState(null);
  const [ready, setReady] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setErr(null);
    ensureSeed().then(() => setReady(true)).catch((e) => setErr(e));
  }, [tick]);

  if (err) {
    return (
      <div className="boot">
        <Alert message="Storage could not be opened. Private browsing may block it." onRetry={() => setTick((t) => t + 1)} />
      </div>
    );
  }
  if (!ready) return <div className="boot" aria-busy="true" />;
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chapter/:chapter" element={<Chapter />} />
        <Route path="/chapter/:chapter/entry/:num" element={<Entry />} />
        <Route path="/chapter/:chapter/entry/:num/write" element={<Write />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Shell>
  );
}
