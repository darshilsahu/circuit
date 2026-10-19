'use client';
import { useEffect, useState } from 'react';

export function CopyrightYear({ year }: { year: number }) {
  const [current, setCurrent] = useState(year);
  useEffect(() => {
    const update = () => setCurrent(new Date().getFullYear());
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, []);
  return <>{current}</>;
}
