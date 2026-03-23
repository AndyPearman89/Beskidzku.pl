import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog firm — Beskidzku.pl",
  description: "Przeglądaj firmy, noclegi, restauracje i atrakcje w Beskidach.",
};

const TYPES = [
  { value: "", label: "Wszystkie" },
  { value: "hotel", label: "🏨 Noclegi" },
  { value: "restaurant", label: "🍽️ Restauracje" },
  { value: "attraction", label: "🎿 Atrakcje" },
  { value: "spa", label: "💆 SPA" },
  { value: "shop", label: "🛒 Sklepy" },
];

const TOWNS = [
  { value: "", label: "Cały region" },
  { value: "szczyrk", label: "Szczyrk" },
  { value: "wisla", label: "Wisła" },
  { value: "zywiec", label: "Żywiec" },
  { value: "bielsko-biala", label: "Bielsko-Biała" },
  { value: "ustron", label: "Ustroń" },
  { value: "sucha", label: "Sucha Beskidzka" },
];

export default function ListingsPage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string; town?: string };
}) {
  const { q = "", type = "", town = "" } = searchParams;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Katalog firm w Beskidach</h1>

      {/* Filters */}
      <form method="get" className="flex flex-wrap gap-3 mb-8 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Szukaj po nazwie lub opisie..."
          className="flex-1 min-w-48 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          name="type"
          defaultValue={type}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <select
          name="town"
          defaultValue={town}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {TOWNS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-800 transition-colors"
        >
          Szukaj
        </button>
      </form>

      {/* Results info */}
      <p className="text-sm text-gray-500 mb-6">
        {q || type || town ? (
          <>Wyniki dla: {[q, type, town].filter(Boolean).join(", ")}</>
        ) : (
          "Wszystkie wpisy"
        )}
      </p>

      {/* Listings grid — populated client-side via API */}
      <div id="listings-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder cards */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-full mb-1" />
            <div className="h-3 bg-gray-100 rounded w-5/6" />
          </div>
        ))}
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
(async function() {
  const params = new URLSearchParams(window.location.search);
  const url = '/api/listings?' + params.toString();
  try {
    const res = await fetch(url);
    const json = await res.json();
    const grid = document.getElementById('listings-grid');
    if (!grid) return;
    if (!json.data || json.data.length === 0) {
      grid.innerHTML = '<p class="col-span-3 text-center text-gray-400 py-10">Brak wyników.</p>';
      return;
    }
    grid.innerHTML = json.data.map(l => \`
      <a href="/listings/\${l.id}" class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-300 p-6 transition-all block">
        <div class="flex items-start justify-between mb-2">
          <h3 class="font-semibold text-gray-800 text-base">\${l.title}</h3>
          <span class="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full ml-2 whitespace-nowrap">\${l.type}</span>
        </div>
        <p class="text-xs text-gray-400 mb-2">📍 \${l.town}\${l.address ? ' · ' + l.address : ''}</p>
        <p class="text-sm text-gray-600 line-clamp-2">\${l.description}</p>
        \${l.phone ? '<p class="text-xs text-gray-400 mt-2">📞 ' + l.phone + '</p>' : ''}
      </a>
    \`).join('');
  } catch(e) {
    console.error(e);
  }
})();
          `,
        }}
      />
    </div>
  );
}
