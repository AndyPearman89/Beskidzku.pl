import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const manrope = localFont({
  src: [
    { path: "../node_modules/@fontsource/manrope/files/manrope-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../node_modules/@fontsource/manrope/files/manrope-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../node_modules/@fontsource/manrope/files/manrope-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../node_modules/@fontsource/manrope/files/manrope-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../node_modules/@fontsource/manrope/files/manrope-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Beskidzku.pl — Zaplanuj Beskidy w 30 sekund",
  description:
    "Zaplanuj Beskidy: noclegi, atrakcje, szlaki i gotowe plany dnia w jednym miejscu. Najszybszy sposób na wyjazd w góry.",
  keywords: ["Beskidy", "planner", "noclegi Beskidy", "szlaki Beskidy", "atrakcje Wisła", "Szczyrk"],
  openGraph: {
    title: "Beskidzku.pl — Planner Beskidów",
    description: "Zaplanuj Beskidy w 30 sekund — planner, noclegi, atrakcje, szlaki.",
    locale: "pl_PL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className={`${manrope.className} bg-[var(--color-bg)] text-[var(--color-text)] antialiased`}>
        <header className="bg-white border-b border-[var(--color-border)] sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <a href="/" className="text-xl font-extrabold text-[var(--color-text)] tracking-tight flex items-center gap-2">
              <span className="text-[var(--color-primary)]">▲</span> BESKIDZKU.PL
            </a>
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
              <a href="/listings?type=hotel" className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">
                Noclegi
              </a>
              <a href="/listings?type=attraction" className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">
                Atrakcje
              </a>
              <a href="/szczyty" className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">
                Szczyty
              </a>
              <a href="/listings" className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">
                Katalog
              </a>
              <a href="/planner" className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">
                Planner
              </a>
              <a
                href="/planner"
                className="text-[var(--color-primary)] border border-[var(--color-primary)] px-3 py-1.5 rounded-full hover:bg-[var(--color-primary)] hover:text-white transition-colors"
              >
                Zaplanuj trasę
              </a>
            </nav>
            <div className="flex items-center gap-2">
              <a
                href="/dodaj-firme"
                className="hidden sm:inline-flex text-[var(--color-primary)] border border-[var(--color-border)] px-3 py-2 rounded-lg hover:border-[var(--color-primary)] transition-colors text-sm font-semibold"
              >
                Dodaj firmę
              </a>
              <a
                href="/planner"
                className="inline-flex bg-[var(--color-primary)] text-white text-sm px-4 py-2 rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors font-semibold shadow-[0_10px_30px_rgba(227,6,19,0.15)]"
              >
                Zaplanuj wycieczkę
              </a>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-[#0f0f10] text-gray-300 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm space-y-3">
            <p className="font-bold text-white text-lg tracking-tight">BESKIDZKU.PL</p>
            <p className="text-gray-400">Planner Beskidów — decyzja w 30 sekund</p>
            <div className="flex justify-center gap-6 text-gray-500">
              <a href="/listings?type=hotel" className="hover:text-white transition-colors">Noclegi</a>
              <a href="/listings?type=attraction" className="hover:text-white transition-colors">Atrakcje</a>
              <a href="/listings" className="hover:text-white transition-colors">Katalog</a>
              <a href="/planner" className="hover:text-white transition-colors">Planner</a>
              <a href="/dodaj-firme" className="hover:text-white transition-colors">Dodaj firmę</a>
            </div>
            <p className="mt-2 text-gray-500">
              © {new Date().getFullYear()} Beskidzku.pl · zbudowane na PearTree
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
