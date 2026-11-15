'use client';

// Client Component because window.print() only exists in the browser.
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="border border-olive bg-olive px-5 py-2 text-sm tracking-[0.15em] text-card uppercase transition-colors hover:bg-olive-dark print:hidden"
    >
      Print program
    </button>
  );
}
