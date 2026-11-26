import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Layout for the member-facing pages: home, the meeting list, and each
// meeting's program. The (public) folder is a route group, so it doesn't
// appear in the URL (/meetings, not /public/meetings).
export default function PublicLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
