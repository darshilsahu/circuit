'use client';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function InfoTheme() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    try {
      const enabled = localStorage.getItem('circuit-theme') !== 'light';
      setDark(enabled);
      document.documentElement.classList.toggle('dark', enabled);
    } catch {}
  }, []);
  function toggle() {
    document.documentElement.classList.toggle('dark', !dark);
    try { localStorage.setItem('circuit-theme', dark ? 'light' : 'dark'); } catch {}
    setDark(!dark);
  }
  return <button type="button" className="icon-button" onClick={toggle} aria-label={dark ? 'Use light theme' : 'Use dark theme'}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>;
}
