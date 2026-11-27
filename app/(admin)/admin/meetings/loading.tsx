// Shown automatically (via React Suspense) while an admin meetings page loads.
export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="animate-pulse">
      <span className="sr-only">Loading…</span>
      <div className="h-8 w-64 bg-rule" />
      <div className="mt-8 h-64 border border-rule bg-card" />
    </div>
  );
}
