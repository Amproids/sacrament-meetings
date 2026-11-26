/*
  Reads the meeting list's URL search params: ?q=…&page=…&limit=…
  Bad values fall back to the defaults instead of erroring, since anyone
  can type anything into the address bar.
*/

export const DEFAULT_PAGE_SIZE = 6;
export const MAX_PAGE_SIZE = 50;
/** Longest search we bother sending to the database. */
const MAX_QUERY_LENGTH = 100;

export interface ListParams {
  query: string;
  page: number;
  limit: number;
}

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? '';
}

/** A whole number in [min, max], or null. Six digits keeps OFFSET sane. */
export function parseWholeNumber(value: string, min: number, max: number): number | null {
  if (!/^\d{1,6}$/.test(value)) return null;
  const n = Number(value);
  return n >= min && n <= max ? n : null;
}

export function parseListParams(params: SearchParams): ListParams {
  return {
    query: first(params.q).trim().slice(0, MAX_QUERY_LENGTH),
    page: parseWholeNumber(first(params.page), 1, 999_999) ?? 1,
    limit: parseWholeNumber(first(params.limit), 1, MAX_PAGE_SIZE) ?? DEFAULT_PAGE_SIZE,
  };
}

/** Builds a list URL, leaving out params that are at their defaults. */
export function listHref(basePath: string, { query, page, limit }: ListParams): string {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (page > 1) params.set('page', String(page));
  if (limit !== DEFAULT_PAGE_SIZE) params.set('limit', String(limit));
  const search = params.toString();
  return search ? `${basePath}?${search}` : basePath;
}
