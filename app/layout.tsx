import type { Metadata } from 'next';
import { Gelasio } from 'next/font/google';
import { WARD_NAME } from '@/lib/labels';
import './globals.css';

// Gelasio is a Google Font designed to match Georgia's proportions.
// next/font self-hosts it and exposes it as a CSS variable, which
// globals.css uses in --font-serif (with Georgia as the fallback).
const gelasio = Gelasio({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-gelasio',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${WARD_NAME}`,
    default: `Sacrament Meeting Planner | ${WARD_NAME}`,
  },
  description: `Plan, view, and print sacrament meeting programs for the ${WARD_NAME}.`,
};

// Root layout: the <html>/<body> shell shared by both route groups.
// app/(public)/layout.tsx and app/(admin)/layout.tsx add each section's
// header, <main id="main">, and footer.
export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${gelasio.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {/* Lets keyboard users jump past the header navigation. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-10 focus:bg-card focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
