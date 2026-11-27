import Link from 'next/link';

// Shown inside the admin layout when a page calls notFound(),
// e.g. /admin/meetings/999/edit.
export default function AdminNotFound() {
  return (
    <div className="mx-auto max-w-xl border border-rule bg-card p-8 text-center">
      <h1 className="text-2xl text-brown">Meeting not found</h1>
      <p className="mt-3 text-muted">It may have been deleted.</p>
      <Link href="/admin/meetings" className="mt-6 inline-block text-olive underline">
        Back to manage meetings
      </Link>
    </div>
  );
}
