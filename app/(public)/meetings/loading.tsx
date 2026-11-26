// Shown automatically (via React Suspense) while a /meetings page loads.
export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="animate-pulse">
      <span className="sr-only">Loading meetings…</span>
      <div className="h-8 w-48 bg-rule" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-32 border border-rule bg-card" />
        ))}
      </div>
    </div>
  );
}
