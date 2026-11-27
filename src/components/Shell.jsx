import { useLayoutEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { NOVEL_TITLE } from '../lib/chapters.js';
import { setTheme } from '../lib/theme.js';

export default function Shell({ children }) {
  const { pathname } = useLocation();
  const [theme, setT] = useState(document.documentElement.dataset.theme);
  useLayoutEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, [pathname]);
  const flip = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    setT(next);
  };
  return (
    <div className="shell">
      <header className="top">
        <Link to="/" className="brand">{NOVEL_TITLE}</Link>
        <button className="icon-btn" onClick={flip} aria-label="Switch light and dark mode">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>
      <main className="main" key={pathname}>{children}</main>
    </div>
  );
}
