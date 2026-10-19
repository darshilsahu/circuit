'use client';

import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const links = [
  ['Compiler', '/'],
  ['Examples', '/examples'],
  ['Learn C', '/learn'],
  ['Blog', '/blog'],
  ['Docs', '/docs'],
  ['About', '/about'],
] as const;

export function SiteNavigation() {
  const pathname = usePathname();
  const current = (href: string) => pathname === href || (href !== '/' && pathname?.startsWith(href + '/'));
  return (
    <nav className="site-navigation" aria-label="Main navigation">
      <div className="site-navigation-links">
        {links.map(([label, href]) => (
          <a key={href} href={href} aria-current={current(href) ? 'page' : undefined}>
            {label}
          </a>
        ))}
      </div>
      <div className="site-navigation-menu">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="icon-button"
            aria-label="Site navigation"
            title="Site navigation"
          >
            <Menu size={18} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-40">
            {links.map(([label, href]) => (
              <DropdownMenuItem key={href} render={<a href={href} aria-current={current(href) ? 'page' : undefined} />}>
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
