import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beskidzku.pl — Odkryj Beskidy",
  description:
    "Największy katalog firm, noclegów i atrakcji w Beskidach. Żywiec, Sucha Beskidzka, Wisła, Szczyrk, Bielsko-Biała i okolice.",
};

const CATEGORIES = [
  { icon: "🏨", label: "Noclegi", type: "hotel", count: 120 },
  { icon: "🍽️", label: "Restauracje", type: "restaurant", count: 85 },
  { icon: "🎿", label: "Sporty zimowe", type: "ski", count: 42 },
  { icon: "🥾", label: "Turystyka", type: "attraction", count: 67 },
  { icon: "💆", label: "SPA & Wellness", type: "spa", count: 34 },
  { icon: "🛒", label: "Sklepy", type: "shop", count: 156 },
];

const TOWNS = [
  { name: "Szczyrk", slug: "szczyrk", icon: "⛷️", desc: "Stolica narciarstwa w Beskidach" },
  { name: "Wisła", slug: "wisla", icon: "🏔️", desc: "Miasto u stóp Baraniej Góry" },
  { name: "Żywiec", slug: "zywiec", icon: "🍺", desc: "Miasto piwa i zamku" },
  { name: "Bielsko-Biała", slug: "bielsko-biala", icon: "🏙️", desc: "Stolica Podbeskidzia" },
  { name: "Sucha Beskidzka", slug: "sucha-beskidzka", icon: "🏰", desc: "Miasto zamku Kanclerza" },
  { name: "Ustroń", slug: "ustron", icon: "💧", desc: "Uzdrowisko nad Wisłą" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-800 to-green-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Odkryj Beskidy z <span className="text-yellow-300">Beskidzku.pl</span>
          </h1>
          <p className="text-xl text-green-100 mb-8">
            Hotele, restauracje, atrakcje i firmy — wszystko w jednym miejscu
          </p>
          <form action="/listings" method="get" className="flex gap-3 max-w-xl mx-auto">
            <input
              type="search"
              name="q"
              placeholder="Szukaj np. 'noclegi Szczyrk'..."
              className="flex-1 px-5 py-3 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              className="bg-yellow-400 text-green-900 font-semibold px-6 py-3 rounded-xl hover:bg-yellow-300 transition-colors"
            >
              Szukaj
            </button>
          </form>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Przeglądaj według kategorii</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.type}
              href={`/listings?type=${cat.type}`}
              className="flex flex-col items-center gap-2 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-300 transition-all text-center"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="font-semibold text-gray-800">{cat.label}</span>
              <span className="text-xs text-gray-400">{cat.count} miejsc</span>
            </a>
          ))}
        </div>
      </section>

      {/* Towns */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Popularne miejscowości</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {TOWNS.map((town) => (
              <a
                key={town.slug}
                href={`/listings?town=${town.slug}`}
                className="group flex flex-col items-center gap-2 p-5 rounded-2xl border border-gray-100 hover:border-green-400 hover:bg-green-50 transition-all text-center"
              >
                <span className="text-2xl">{town.icon}</span>
                <span className="font-semibold text-gray-800 group-hover:text-green-700">{town.name}</span>
                <span className="text-xs text-gray-500 line-clamp-2">{town.desc}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Masz firmę w Beskidach?</h2>
        <p className="text-gray-500 mb-8 text-lg">
          Dodaj swój biznes za darmo i dotrzyj do tysięcy turystów i lokalnych mieszkańców.
        </p>
        <a
          href="/dodaj-firme"
          className="inline-block bg-green-700 text-white font-semibold text-lg px-8 py-4 rounded-xl hover:bg-green-800 transition-colors"
        >
          Dodaj firmę bezpłatnie →
        </a>
      </section>
    </>
  );
}
