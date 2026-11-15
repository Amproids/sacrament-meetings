import { WARD_NAME } from '@/lib/labels';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-rule bg-card print:hidden">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 px-6 py-6 text-sm text-muted sm:flex-row sm:justify-between">
        <p>{WARD_NAME} · Sacrament Meeting Planner</p>
        <p>Prepared by the bishopric</p>
      </div>
    </footer>
  );
}
