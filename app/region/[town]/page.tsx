import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getListings } from "@/core/api/listings";
import DynamicMap from "@/app/components/DynamicMap";
import {
  createLocalBusinessSchema,
  createBreadcrumbSchema,
  createFAQSchema,
  renderJsonLd
} from "@/core/seo/schemas";
import { generateTownMetadata } from "@/core/seo/metadata";
import { generateLocationIntro, generateLocationFAQ } from "@/core/seo/content";

// Known towns with their coordinates for weather
const TOWNS: Record<string, { name: string; lat: number; lng: number; desc: string }> = {
  szczyrk: {
    name: "Szczyrk",
    lat: 49.7156,
    lng: 19.0343,
    desc: "Najbardziej popularne centrum sportów zimowych w Polsce. Skrzyczne, kolej gondolowa, stoki narciarskie.",
  },
  wisla: {
    name: "Wisła",
    lat: 49.6504,
    lng: 18.8565,
    desc: "Uzdrowisko i miasto sportowe w Beskidach Śląskich. Skocznia Adama Małysza, rzeka Wisła, deptak.",
  },
  ustron: {
    name: "Ustroń",
    lat: 49.7197,
    lng: 18.809,
    desc: "Uzdrowisko w Beskidach Śląskich z tradycjami leczniczymi. SPA, wody mineralne, szlaki piesze.",
  },
  zywiec: {
    name: "Żywiec",
    lat: 49.6888,
    lng: 19.1979,
    desc: "Miasto przy Jeziorze Żywieckim. Słynny browar Żywiec, zamek, stare miasto i panorama Beskidów.",
  },
  "bielsko-biala": {
    name: "Bielsko-Biała",
    lat: 49.822,
    lng: 19.044,
    desc: "Największe miasto Podbeskidzia. Zamek Sułkowskich, Stare Miasto, brama do Beskidów.",
  },
  sucha: {
    name: "Sucha Beskidzka",
    lat: 49.7399,
    lng: 19.5974,
    desc: "Miasto z renesansowym zamkiem zwanym Małym Wawelem. Brama do Beskidu Makowskiego.",
  },
};

type Params = { town: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { town } = await params;
  const townData = TOWNS[town.toLowerCase()];
  if (!townData) return {};

  return generateTownMetadata({
    name: townData.name,
    description: townData.desc,
    slug: town,
  });
}

export function generateStaticParams() {
  return Object.keys(TOWNS).map((town) => ({ town }));
}

export default async function TownPage({ params }: { params: Promise<Params> }) {
  const { town } = await params;
  const townData = TOWNS[town.toLowerCase()];
  if (!townData) notFound();

  const { items: allListings, total } = getListings({ town: townData.name, perPage: 50 });

  const hotels = allListings.filter((l) => l.type === "hotel");
  const attractions = allListings.filter((l) => l.type === "attraction");
  const restaurants = allListings.filter((l) => l.type === "restaurant");
  const other = allListings.filter((l) => !["hotel", "attraction", "restaurant"].includes(l.type));

  // Generate JSON-LD schemas
  const localBusinessSchema = createLocalBusinessSchema({
    name: townData.name,
    description: townData.desc,
    url: `https://beskidzku.pl/region/${town}`,
    addressLocality: townData.name,
    latitude: townData.lat,
    longitude: townData.lng,
  });

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Strona główna", url: "https://beskidzku.pl" },
    { name: townData.name, url: `https://beskidzku.pl/region/${town}` },
  ]);

  const faqItems = generateLocationFAQ({
    name: townData.name,
    hotelsCount: hotels.length,
    attractionsCount: attractions.length,
  });
  const faqSchema = createFAQSchema(faqItems);

  const seoIntro = generateLocationIntro({
    name: townData.name,
    description: townData.desc,
    hotelsCount: hotels.length,
    attractionsCount: attractions.length,
    restaurantsCount: restaurants.length,
  });

  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(faqSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Town hero */}
      <div className="rounded-[28px] bg-white border border-[var(--color-border)] shadow-sm p-8 mb-10">
        <nav className="text-xs text-[var(--color-muted)] mb-4">
          <a href="/" className="hover:text-[var(--color-primary)]">Strona główna</a>
          {" / "}
          <span>{townData.name}</span>
        </nav>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold">{townData.name}</h1>
            <p className="text-[var(--color-muted)] mt-3 text-base max-w-2xl">{townData.desc}</p>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-[var(--color-muted)]">
              <span className="flex items-center gap-1">🏨 {hotels.length} noclegów</span>
              <span className="flex items-center gap-1">🎯 {attractions.length} atrakcji</span>
              <span className="flex items-center gap-1">🍽️ {restaurants.length} restauracji</span>
              {total > 0 && (
                <span className="flex items-center gap-1">📋 {total} wpisów łącznie</span>
              )}
            </div>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a
              href={`/listings?town=${town}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold text-sm hover:bg-[var(--color-primary-hover)] transition-colors shadow-[0_10px_25px_rgba(227,6,19,0.18)]"
            >
              Wszystkie wpisy →
            </a>
            <a
              href="/planner"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[var(--color-border)] bg-white font-semibold text-sm hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
            >
              Planner
            </a>
          </div>
        </div>
      </div>

      {/* Map */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Mapa — {townData.name}</h2>
        </div>
        <div className="rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-sm">
          <DynamicMap
            listings={allListings}
            height="360px"
            center={[townData.lat, townData.lng]}
            zoom={13}
          />
        </div>
      </section>

      {/* SEO Content */}
      <section className="mb-10">
        <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">O {townData.name}</h2>
          <p className="text-[var(--color-text)] leading-relaxed">{seoIntro}</p>
        </div>
      </section>

      {/* Accommodations */}
      {hotels.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">🏨 Noclegi w {townData.name}</h2>
            <a href={`/listings?type=hotel&town=${town}`} className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
              Wszystkie →
            </a>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotels.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}

      {/* Attractions */}
      {attractions.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">🎯 Atrakcje w {townData.name}</h2>
            <a href={`/listings?type=attraction&town=${town}`} className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
              Wszystkie →
            </a>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {attractions.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}

      {/* Restaurants */}
      {restaurants.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">🍽️ Restauracje w {townData.name}</h2>
            <a href={`/listings?type=restaurant&town=${town}`} className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
              Wszystkie →
            </a>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}

      {/* Other */}
      {other.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Inne w {townData.name}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {other.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}

      {total === 0 && (
        <div className="text-center py-20 text-[var(--color-muted)]">
          <p className="text-4xl mb-4">🏔️</p>
          <p className="text-lg font-semibold">Brak wpisów dla {townData.name}</p>
          <p className="text-sm mt-2">Jesteś właścicielem firmy? <a href="/dodaj-firme" className="text-[var(--color-primary)] hover:underline font-semibold">Dodaj swój obiekt →</a></p>
        </div>
      )}

      {/* CTA */}
      <section className="rounded-[28px] bg-[var(--color-primary)] text-white p-8 mt-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold">Prowadzisz obiekt w {townData.name}?</h3>
            <p className="text-white/80 text-sm mt-1">Dodaj swój wpis i docieraj do tysięcy turystów planujących wizytę.</p>
          </div>
          <a
            href="/dodaj-firme"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[var(--color-primary)] font-bold text-sm hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            Dodaj firmę →
          </a>
        </div>
      </section>

      {/* FAQ Section */}
      {faqItems.length > 0 && (
        <section className="mt-10">
          <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Najczęściej zadawane pytania o {townData.name}</h2>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b border-[var(--color-border)] last:border-0 pb-4 last:pb-0">
                  <h3 className="font-semibold text-sm mb-2">{item.question}</h3>
                  <p className="text-sm text-[var(--color-muted)]">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
    </>
  );
}

function ListingCard({ listing }: { listing: ReturnType<typeof getListings>["items"][number] }) {
  const packageColors: Record<string, string> = {
    "PREMIUM+": "bg-[var(--color-primary-soft)] text-[var(--color-primary)] border border-[var(--color-primary)]",
    "PREMIUM": "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
    "FREE": "bg-gray-100 text-gray-500",
  };

  return (
    <a
      href={`/listings/${listing.id}`}
      className="group bg-white rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md hover:border-[var(--color-primary)] p-5 transition-all block"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-sm leading-tight group-hover:text-[var(--color-primary)] transition-colors">
          {listing.title}
        </h3>
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${packageColors[listing.packageLevel] ?? ""}`}>
          {listing.packageLevel}
        </span>
      </div>
      <p className="text-xs text-[var(--color-muted)] mb-2">📍 {listing.town} · {listing.type}</p>
      <p className="text-sm text-[var(--color-muted)] line-clamp-2">{listing.description}</p>
      {listing.phone && listing.packageLevel !== "FREE" && (
        <p className="text-xs text-[var(--color-muted)] mt-2">📞 {listing.phone}</p>
      )}
    </a>
  );
}
