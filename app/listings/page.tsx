import type { Metadata } from "next";
import { getListings } from "@/core/api/listings";
import DynamicMap from "@/app/components/DynamicMap";

export const metadata: Metadata = {
  title: "Katalog firm — Beskidzku.pl",
  description: "Przeglądaj firmy, noclegi, restauracje i atrakcje w Beskidach.",
};

const TYPES = [
  { value: "", label: "Wszystkie" },
  { value: "hotel", label: "🏨 Noclegi" },
  { value: "restaurant", label: "🍽️ Restauracje" },
  { value: "attraction", label: "🎯 Atrakcje" },
  { value: "spa", label: "💆 SPA" },
  { value: "shop", label: "🛒 Sklepy" },
];

const TOWNS = [
  { value: "", label: "Cały region" },
  { value: "Szczyrk", label: "Szczyrk" },
  { value: "Wisła", label: "Wisła" },
  { value: "Żywiec", label: "Żywiec" },
  { value: "Bielsko-Biała", label: "Bielsko-Biała" },
  { value: "Ustroń", label: "Ustroń" },
  { value: "Sucha Beskidzka", label: "Sucha Beskidzka" },
];

const PACKAGE_COLORS: Record<string, string> = {
  "PREMIUM+": "bg-[var(--color-primary-soft)] text-[var(--color-primary)] border border-[var(--color-primary)]",
  "PREMIUM": "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  "FREE": "bg-gray-100 text-gray-500",
};

type SearchParams = { q?: string; type?: string; town?: string; page?: string };

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q = "", type = "", town = "", page: pageStr = "1" } = await searchParams;
  const page = Math.max(1, parseInt(pageStr, 10) || 1);
  const perPage = 12;

  const { items: listings, total } = await getListings({ q, type, town, page, perPage });
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  function pageUrl(p: number) {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (type) sp.set("type", type);
    if (town) sp.set("town", town);
    sp.set("page", String(p));
    return `/listings?${sp.toString()}`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">Katalog</p>
        <h1 className="text-3xl font-bold mt-1">Firmy i obiekty w Beskidach</h1>
      </div>

      {/* Filters */}
      <form
        method="get"
        className="flex flex-wrap gap-3 mb-8 bg-white p-4 rounded-2xl border border-[var(--color-border)] shadow-sm"
      >
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Szukaj po nazwie lub opisie…"
          className="flex-1 min-w-48 border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
        <select
          name="type"
          defaultValue={type}
          className="border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <select
          name="town"
          defaultValue={town}
          className="border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          {TOWNS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          Szukaj
        </button>
      </form>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Listings grid */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-[var(--color-muted)]">
              {total > 0 ? (
                <>Znaleziono: <strong className="text-[var(--color-text)]">{total}</strong>{" "}
                {total === 1 ? "wpis" : total < 5 ? "wpisy" : "wpisów"}</>
              ) : (
                "Brak wyników"
              )}
              {(q || type || town) && (
                <> dla: <em>{[q, type, town].filter(Boolean).join(", ")}</em></>
              )}
            </p>
            {(q || type || town) && (
              <a href="/listings" className="text-xs text-[var(--color-muted)] hover:text-[var(--color-primary)] underline">
                Wyczyść filtry
              </a>
            )}
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[var(--color-border)]">
              <p className="text-4xl mb-4">🔍</p>
              <p className="font-semibold text-lg">Brak wyników</p>
              <p className="text-sm text-[var(--color-muted)] mt-2">Spróbuj innych słów kluczowych lub filtrów.</p>
              <a href="/listings" className="inline-block mt-4 text-sm font-semibold text-[var(--color-primary)] hover:underline">
                Pokaż wszystkie wpisy →
              </a>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {listings.map((listing) => (
                <a
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="group bg-white rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md hover:border-[var(--color-primary)] p-5 transition-all block"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <p className="text-xs text-[var(--color-muted)] uppercase tracking-wide">{listing.type}</p>
                      <h2 className="font-semibold text-base leading-tight mt-0.5 group-hover:text-[var(--color-primary)] transition-colors truncate">
                        {listing.title}
                      </h2>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${PACKAGE_COLORS[listing.packageLevel] ?? ""}`}>
                      {listing.packageLevel}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-muted)] mb-2">
                    📍 {listing.town}{listing.address ? ` · ${listing.address}` : ""}
                  </p>
                  <p className="text-sm text-[var(--color-muted)] line-clamp-2">{listing.description}</p>
                  {listing.phone && listing.packageLevel !== "FREE" && (
                    <p className="text-xs text-[var(--color-muted)] mt-2">📞 {listing.phone}</p>
                  )}
                  {listing.amenities && listing.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {listing.amenities.slice(0, 3).map((a) => (
                        <span key={a} className="text-xs bg-[var(--color-bg)] border border-[var(--color-border)] px-2 py-0.5 rounded-full">
                          {a}
                        </span>
                      ))}
                    </div>
                  )}
                </a>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 mt-8" aria-label="Paginacja">
              {page > 1 && (
                <a href={pageUrl(page - 1)} className="px-4 py-2 rounded-xl border border-[var(--color-border)] bg-white text-sm font-semibold hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
                  ← Poprzednia
                </a>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => Math.abs(p - page) <= 2)
                .map((p) => (
                  <a
                    key={p}
                    href={pageUrl(p)}
                    className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${
                      p === page
                        ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                        : "border-[var(--color-border)] bg-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                    }`}
                  >
                    {p}
                  </a>
                ))}
              {page < totalPages && (
                <a href={pageUrl(page + 1)} className="px-4 py-2 rounded-xl border border-[var(--color-border)] bg-white text-sm font-semibold hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
                  Następna →
                </a>
              )}
            </nav>
          )}
        </div>

        {/* Sidebar — map */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-4 sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold">Mapa wyników</h2>
              <span className="text-xs text-[var(--color-muted)]">{listings.filter((l) => l.lat && l.lng).length} na mapie</span>
            </div>
            <DynamicMap listings={listings} height="420px" />
            <div className="mt-3 flex items-center gap-3 text-xs text-[var(--color-muted)]">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[var(--color-primary)] inline-block" /> PREMIUM+</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#c00511] inline-block" /> PREMIUM</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-gray-400 inline-block" /> FREE</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-[28px] bg-[var(--color-primary)] text-white p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold">Prowadzisz obiekt w Beskidach?</h3>
          <p className="text-white/80 text-sm mt-1">Dodaj swój wpis i dotrzyj do tysięcy turystów.</p>
        </div>
        <a
          href="/dodaj-firme"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[var(--color-primary)] font-bold text-sm hover:bg-gray-50 transition-colors flex-shrink-0"
        >
          Dodaj firmę →
        </a>
      </div>
    </div>
  );
}
