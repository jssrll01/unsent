import { Route, Routes } from 'react-router-dom';
import Shell from './components/Shell.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import Home from './pages/Home.jsx';
import Chapter from './pages/Chapter.jsx';
import Entry from './pages/Entry.jsx';
import NotFound from './pages/NotFound.jsx';
import InstallPrompt from './components/InstallPrompt.jsx';

export default function App() {
  return (
    <Shell>
      <InstallPrompt />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chapter/:chapter" element={<Chapter />} />
          <Route path="/chapter/:chapter/entry/:num" element={<Entry />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </Shell>
  );
}
