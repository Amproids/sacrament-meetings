import Link from 'next/link';
import { Suspense } from 'react';
import { connection } from 'next/server';
import NavLinks, { type NavItem } from './NavLinks';
import { formatMeetingDate, todayISO } from '@/lib/dates';
import { WARD_NAME } from '@/lib/labels';

const mainLinks: NavItem[] = [
  { href: '/', label: 'Home', exact: true },
  { href: '/meetings', label: 'Meetings' },
];

// The current date must be computed per request, not once at build time.
// connection() tells Next.js to wait for a real request; the Suspense
// boundary below lets the rest of the header render immediately.
async function CurrentDate() {
  await connection();
  const today = todayISO();
  return <time dateTime={today}>{formatMeetingDate(today)}</time>;
}

export default function Header() {
  return (
    <header className="border-t-4 border-olive bg-card print:hidden">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/" className="group inline-block">
            <span className="block text-2xl text-brown group-hover:text-ink">
              {WARD_NAME}
            </span>
            <span className="block text-xs tracking-[0.25em] text-muted uppercase">
              Sacrament Meeting Planner
            </span>
          </Link>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <p className="text-sm text-muted italic">
            <Suspense fallback={<span>&nbsp;</span>}>
              <CurrentDate />
            </Suspense>
          </p>
          <NavLinks links={mainLinks} label="Main" />
        </div>
      </div>
      <div className="h-px bg-rule" />
    </header>
  );
}
