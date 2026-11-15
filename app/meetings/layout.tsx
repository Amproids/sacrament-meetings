import NavLinks, { type NavItem } from '@/components/NavLinks';

const meetingLinks: NavItem[] = [
  { href: '/meetings', label: 'All meetings', exact: true },
  { href: '/meetings/current', label: 'This Sunday' },
];

// Section layout: wraps every page under /meetings with its own sub-navigation.
export default function MeetingsLayout({ children }: LayoutProps<'/meetings'>) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10 print:p-0">
      <div className="mb-8 border-b border-rule pb-3 print:hidden">
        <NavLinks links={meetingLinks} label="Meetings" />
      </div>
      {children}
    </div>
  );
}
