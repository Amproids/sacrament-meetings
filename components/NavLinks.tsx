'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';

export interface NavItem {
  href: string;
  label: string;
  /** Only active on an exact match (use for '/', which every path starts with). */
  exact?: boolean;
}

interface NavLinksProps {
  links: NavItem[];
  /** Accessible name for the <nav>, so screen readers can tell navs apart. */
  label: string;
}

function isActiveLink({ href, exact }: NavItem, pathname: string | null): boolean {
  if (pathname === null) return false;
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

/** Renders the list. pathname is null while the URL isn't known yet. */
function NavList({ links, pathname }: { links: NavItem[]; pathname: string | null }) {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2">
      {links.map((link) => {
        const isActive = isActiveLink(link, pathname);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={isActive ? 'page' : undefined}
              className={`border-b-2 pb-1 text-sm tracking-[0.15em] uppercase transition-colors ${
                isActive
                  ? 'border-olive text-olive'
                  : 'border-transparent text-muted hover:border-rule hover:text-ink'
              }`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function ActiveNavList({ links }: { links: NavItem[] }) {
  // usePathname() reads the current URL, which only exists at request time.
  const pathname = usePathname();
  return <NavList links={links} pathname={pathname} />;
}

// Client Component because usePathname() is a React hook that reads the URL.
// With Cache Components on, URL-reading hooks must sit inside <Suspense>:
// the fallback (same links, no active style) goes into the prerendered page,
// then the active highlight streams in once the URL is known.
export default function NavLinks({ links, label }: NavLinksProps) {
  return (
    <nav aria-label={label}>
      <Suspense fallback={<NavList links={links} pathname={null} />}>
        <ActiveNavList links={links} />
      </Suspense>
    </nav>
  );
}
