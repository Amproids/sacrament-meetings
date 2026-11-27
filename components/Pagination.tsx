import Link from 'next/link';
import { listHref, type ListParams } from '@/lib/list-params';

interface PaginationProps {
  basePath: string;
  params: ListParams;
  /** Total matching meetings across all pages. */
  total: number;
}

/** "Showing 7–12 of 14 meetings" for the current page. */
export function ResultSummary({ params, total }: Omit<PaginationProps, 'basePath'>) {
  const noun = total === 1 ? 'meeting' : 'meetings';
  const matching = params.query ? (
    <>
      {' '}matching <q className="text-ink">{params.query}</q>
    </>
  ) : null;

  const first = (params.page - 1) * params.limit + 1;
  const last = Math.min(params.page * params.limit, total);

  return (
    <p className="text-sm text-muted" aria-live="polite">
      {total === 0 || first > total ? (
        <>
          {total} {noun}
          {matching}
        </>
      ) : (
        <>
          Showing {first}–{last} of {total} {noun}
          {matching}
        </>
      )}
    </p>
  );
}

const linkClass =
  'border border-brown px-4 py-2 text-sm tracking-[0.15em] text-brown uppercase transition-colors hover:bg-card';
const disabledClass =
  'border border-rule px-4 py-2 text-sm tracking-[0.15em] text-muted uppercase opacity-60';

/** Previous / Next links that keep the search and page size in the URL. */
export default function Pagination({ basePath, params, total }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / params.limit));
  if (totalPages === 1 && params.page === 1) return null;

  // Clamp so "Previous" from an out-of-range page lands on the last real page.
  const previous = Math.min(params.page - 1, totalPages);
  const next = params.page + 1;

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-between gap-4">
      {previous >= 1 ? (
        <Link href={listHref(basePath, { ...params, page: previous })} rel="prev" className={linkClass}>
          ← Previous
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClass}>
          ← Previous
        </span>
      )}

      <p className="text-sm text-muted">
        Page {params.page} of {totalPages}
      </p>

      {next <= totalPages ? (
        <Link href={listHref(basePath, { ...params, page: next })} rel="next" className={linkClass}>
          Next →
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClass}>
          Next →
        </span>
      )}
    </nav>
  );
}
