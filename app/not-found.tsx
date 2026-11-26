import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// URLs that match no route only get the root layout (the route group
// layouts don't apply), so this page adds the public header and footer.
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="mx-auto w-full max-w-xl flex-1 px-6 py-16 text-center">
        <h1 className="text-3xl text-brown">Page not found</h1>
        <p className="mt-3 text-muted">We couldn&rsquo;t find the page you were looking for.</p>
        <Link href="/meetings" className="mt-6 inline-block text-olive underline">
          View all meetings
        </Link>
      </main>
      <Footer />
    </>
  );
}
