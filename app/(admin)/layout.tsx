import Link from 'next/link';
import NavLinks, { type NavItem } from '@/components/NavLinks';
import { WARD_NAME } from '@/lib/labels';

const adminLinks: NavItem[] = [
  { href: '/admin/meetings', label: 'Meetings', exact: true },
  { href: '/admin/meetings/new', label: 'New meeting' },
  { href: '/meetings', label: 'View site', exact: true },
];

// Layout for the bishopric's admin pages (create, edit, delete meetings).
// (admin) is a route group: it gives these pages their own header without
// adding "(admin)" to the URL. The pages themselves live under /admin.
export default function AdminLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <header className="border-t-4 border-brown bg-card">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
          <Link href="/admin/meetings" className="group inline-block">
            <span className="block text-xs tracking-[0.25em] text-olive uppercase">
              Admin
            </span>
            <span className="block text-xl text-brown group-hover:text-ink">
              {WARD_NAME}
            </span>
          </Link>
          <NavLinks links={adminLinks} label="Admin" />
        </div>
        <div className="h-px bg-rule" />
      </header>
      <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        {children}
      </main>
    </>
  );
}
