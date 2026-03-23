import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beskidzku.pl — Katalog firm i atrakcji Beskidów",
  description:
    "Znajdź najlepsze firmy, restauracje, noclegi i atrakcje w Beskidach. Żywiec, Sucha Beskidzka, Wisła, Szczyrk, Bielsko-Biała.",
  keywords: ["Beskidy", "katalog firm", "Żywiec", "Szczyrk", "Wisła", "noclegi Beskidy"],
  openGraph: {
    title: "Beskidzku.pl — Katalog Beskidów",
    description: "Lokalny katalog firm i atrakcji regionu Beskidów",
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
      <body className="bg-gray-50 text-gray-900 antialiased">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-green-700">
              🏔️ Beskidzku.pl
            </a>
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <a href="/listings" className="text-gray-600 hover:text-green-700 transition-colors">
                Katalog firm
              </a>
              <a href="/listings?type=hotel" className="text-gray-600 hover:text-green-700 transition-colors">
                Noclegi
              </a>
              <a href="/listings?type=restaurant" className="text-gray-600 hover:text-green-700 transition-colors">
                Restauracje
              </a>
              <a href="/listings?type=attraction" className="text-gray-600 hover:text-green-700 transition-colors">
                Atrakcje
              </a>
            </nav>
            <a
              href="/dodaj-firme"
              className="bg-green-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
            >
              Dodaj firmę
            </a>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-gray-800 text-gray-300 py-10 mt-16">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm">
            <p className="font-semibold text-white mb-2">🏔️ Beskidzku.pl</p>
            <p>Lokalny katalog firm i atrakcji Beskidów</p>
            <p className="mt-4 text-gray-500">
              © {new Date().getFullYear()} Beskidzku.pl · Zbudowany na PearTree
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
