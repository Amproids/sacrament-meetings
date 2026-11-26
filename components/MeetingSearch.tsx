import Form from 'next/form';
import Link from 'next/link';
import { DEFAULT_PAGE_SIZE, type ListParams } from '@/lib/list-params';

interface MeetingSearchProps {
  /** Page the form submits to, e.g. '/meetings'. */
  basePath: string;
  params: ListParams;
}

// A plain GET form: submitting it navigates to ?q=… (page resets to 1).
// next/form turns that into a client-side navigation when JS is loaded.
export default function MeetingSearch({ basePath, params }: MeetingSearchProps) {
  return (
    <Form action={basePath} role="search" className="flex flex-wrap items-end gap-3">
      <div className="min-w-60 flex-1">
        <label htmlFor="meeting-search" className="block text-sm text-muted">
          Search by speaker, topic, or hymn title
        </label>
        <input
          id="meeting-search"
          type="search"
          name="q"
          defaultValue={params.query}
          placeholder="e.g. Ellison, temple, Redeemer"
          className="mt-1 block w-full border border-rule bg-card px-3 py-2 text-ink"
        />
      </div>
      {params.limit !== DEFAULT_PAGE_SIZE && (
        <input type="hidden" name="limit" value={params.limit} />
      )}
      <button
        type="submit"
        className="border border-olive bg-olive px-5 py-2 text-sm tracking-[0.15em] text-card uppercase transition-colors hover:bg-olive-dark"
      >
        Search
      </button>
      {params.query && (
        <Link href={basePath} className="py-2 text-sm text-muted hover:text-ink hover:underline">
          Clear
        </Link>
      )}
    </Form>
  );
}
