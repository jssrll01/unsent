import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BookOpen, Bookmark, Clock, Moon, Search, Settings, Sun } from 'lucide-react';
import { CHAPTERS, NOVEL_TITLE } from '../lib/chapters.js';
import { setTheme } from '../lib/theme.js';

const NAV = [
  { to: `/chapter/${CHAPTERS[0].id}`, label: 'Chapter', Icon: BookOpen },
  { to: '/timeline', label: 'Timeline', Icon: Clock },
  { to: '/moments', label: 'Moments', Icon: Bookmark },
  { to: '/search', label: 'Search', Icon: Search },
  { to: '/settings', label: 'Settings', Icon: Settings },
];

export default function Shell({ children }) {
  const { pathname } = useLocation();
  const [theme, setT] = useState(document.documentElement.dataset.theme);
  const writing = pathname.endsWith('/write');
  const flip = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    setT(next);
  };
  return (
    <div className={writing ? 'shell writing' : 'shell'}>
      {!writing && (
        <>
          <header className="top">
            <Link to="/" className="brand">{NOVEL_TITLE}</Link>
            <button className="icon-btn" onClick={flip} aria-label="Switch light and dark mode">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </header>
          <nav className="tabs" aria-label="Main">
            {NAV.map(({ to, label, Icon }) => (
              <NavLink key={to} to={to}>
                <Icon size={20} />
                {label}
              </NavLink>
            ))}
          </nav>
        </>
      )}
      <main className="main">{children}</main>
    </div>
  );
}
