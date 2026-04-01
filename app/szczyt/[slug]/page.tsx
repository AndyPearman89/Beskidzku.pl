import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPeakBySlug, getNearbyPeaks, getPeaks } from "@/core/api/peaks";
import {
  createMountainSchema,
  createBreadcrumbSchema,
  createFAQSchema,
  renderJsonLd
} from "@/core/seo/schemas";
import { generatePeakMetadata } from "@/core/seo/metadata";
import { generatePeakIntro, generatePeakFAQ } from "@/core/seo/content";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const peak = getPeakBySlug(slug);
  if (!peak) return {};
  return generatePeakMetadata(peak);
}

export async function generateStaticParams() {
  const peaks = getPeaks({});
  return peaks.map((peak) => ({
    slug: peak.slug,
  }));
}

export default async function PeakDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const peak = getPeakBySlug(slug);
  if (!peak) notFound();

  const nearby = getNearbyPeaks(peak.lat, peak.lng, 30).filter((p) => p.id !== peak.id).slice(0, 3);

  const difficultyLabels: Record<string, string> = {
    easy: "Łatwy",
    moderate: "Umiarkowany",
    hard: "Trudny",
    very_hard: "Bardzo trudny",
  };

  const difficultyColors: Record<string, string> = {
    easy: "bg-green-100 text-green-700 border-green-300",
    moderate: "bg-yellow-100 text-yellow-700 border-yellow-300",
    hard: "bg-orange-100 text-orange-700 border-orange-300",
    very_hard: "bg-red-100 text-red-700 border-red-300",
  };

  const hoursMinutes = Math.floor(peak.hiking_time / 60) + "h " + (peak.hiking_time % 60) + "min";

  // Generate JSON-LD schemas
  const mountainSchema = createMountainSchema({
    name: peak.name,
    description: peak.description || `Szczyt ${peak.name} w paśmie ${peak.range} o wysokości ${peak.elevation}m n.p.m.`,
    latitude: peak.lat,
    longitude: peak.lng,
    elevation: peak.elevation,
    url: `https://beskidzku.pl/szczyt/${peak.slug}`,
  });

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Strona główna", url: "https://beskidzku.pl" },
    { name: "Szczyty", url: "https://beskidzku.pl/szczyty" },
    { name: peak.name, url: `https://beskidzku.pl/szczyt/${peak.slug}` },
  ]);

  const faqItems = generatePeakFAQ(peak);
  const faqSchema = createFAQSchema(faqItems);

  const seoIntro = generatePeakIntro(peak);

  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(mountainSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(faqSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-[var(--color-muted)] mb-6">
        <a href="/" className="hover:text-[var(--color-primary)]">Strona główna</a>
        {" / "}
        <span>Szczyty</span>
        {" / "}
        <span>{peak.name}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">
                  {peak.range}
                </p>
                <h1 className="text-3xl font-extrabold mt-1">{peak.name}</h1>
                <p className="text-[var(--color-primary)] font-bold text-2xl mt-2">⛰️ {peak.elevation}m n.p.m.</p>
              </div>
              <span className={`text-xs px-3 py-1.5 rounded-full font-bold border flex-shrink-0 ${difficultyColors[peak.difficulty] ?? ""}`}>
                {difficultyLabels[peak.difficulty]}
              </span>
            </div>

            {peak.description && (
              <p className="text-[var(--color-text)] leading-relaxed mb-4">{peak.description}</p>
            )}

            {/* SEO intro */}
            {!peak.description && (
              <p className="text-[var(--color-text)] leading-relaxed mb-4">{seoIntro}</p>
            )}

            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="bg-[var(--color-bg)] rounded-xl p-4 border border-[var(--color-border)]">
                <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">Czas podejścia</p>
                <p className="text-lg font-bold mt-1">🥾 {hoursMinutes}</p>
              </div>
              <div className="bg-[var(--color-bg)] rounded-xl p-4 border border-[var(--color-border)]">
                <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">Trudność</p>
                <p className="text-lg font-bold mt-1">{difficultyLabels[peak.difficulty]}</p>
              </div>
            </div>

            {peak.viewpoints && peak.viewpoints.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-2">Widoki</p>
                <div className="flex flex-wrap gap-2">
                  {peak.viewpoints.map((v) => (
                    <span key={v} className="px-3 py-1 bg-[var(--color-primary-soft)] text-[var(--color-primary)] border border-[var(--color-primary)] rounded-full text-xs font-semibold">
                      📷 {v}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Map */}
          <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-5">
            <h2 className="text-base font-semibold mb-3">Lokalizacja szczytu</h2>
            <div className="rounded-xl overflow-hidden">
              <iframe
                title={`Mapa - ${peak.name}`}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${peak.lng - 0.02},${peak.lat - 0.01},${peak.lng + 0.02},${peak.lat + 0.01}&layer=mapnik&marker=${peak.lat},${peak.lng}`}
                style={{ width: "100%", height: "280px", border: 0, borderRadius: "12px" }}
                loading="lazy"
              />
            </div>
            <a
              href={`https://www.openstreetmap.org/?mlat=${peak.lat}&mlon=${peak.lng}#map=15/${peak.lat}/${peak.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[var(--color-primary)] font-semibold mt-2 hover:underline"
            >
              Otwórz na OpenStreetMap →
            </a>
          </div>

          {/* Parking */}
          {peak.parking_lat && peak.parking_lng && (
            <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-5">
              <h2 className="text-base font-semibold mb-3">🅿️ Parking</h2>
              <div className="rounded-xl overflow-hidden">
                <iframe
                  title={`Parking - ${peak.name}`}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${peak.parking_lng - 0.02},${peak.parking_lat - 0.01},${peak.parking_lng + 0.02},${peak.parking_lat + 0.01}&layer=mapnik&marker=${peak.parking_lat},${peak.parking_lng}`}
                  style={{ width: "100%", height: "280px", border: 0, borderRadius: "12px" }}
                  loading="lazy"
                />
              </div>
              <a
                href={`https://www.openstreetmap.org/?mlat=${peak.parking_lat}&mlon=${peak.parking_lng}#map=15/${peak.parking_lat}/${peak.parking_lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[var(--color-primary)] font-semibold mt-2 hover:underline"
              >
                Otwórz na OpenStreetMap →
              </a>
            </div>
          )}

          {/* Nearby peaks */}
          {nearby.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Szczyty w pobliżu</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {nearby.map((p) => (
                  <a
                    key={p.id}
                    href={`/szczyt/${p.slug}`}
                    className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md p-4 transition-all block"
                  >
                    <p className="text-xs text-[var(--color-muted)] uppercase">{p.range}</p>
                    <p className="font-semibold text-sm mt-1">{p.name}</p>
                    <p className="text-[var(--color-primary)] font-bold text-sm mt-1">⛰️ {p.elevation}m</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Section */}
          {faqItems.length > 0 && (
            <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6 mt-6">
              <h2 className="text-xl font-bold mb-4">Najczęściej zadawane pytania</h2>
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="border-b border-[var(--color-border)] last:border-0 pb-4 last:pb-0">
                    <h3 className="font-semibold text-sm mb-2">{item.question}</h3>
                    <p className="text-sm text-[var(--color-muted)]">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Weather widget */}
          <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-5">
            <h2 className="text-base font-semibold mb-3">🌤️ Pogoda</h2>
            <p className="text-xs text-[var(--color-muted)]">Sprawdź aktualną pogodę na szczycie</p>
            <a
              href={`/api/weather?lat=${peak.lat}&lng=${peak.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[var(--color-primary)] font-semibold mt-2 hover:underline"
            >
              Zobacz prognozę →
            </a>
          </div>

          {/* Add to planner */}
          <a
            href={`/planner?lat=${peak.lat}&lng=${peak.lng}&name=${encodeURIComponent(peak.name)}`}
            className="block text-center px-4 py-3 rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary)] text-white hover:opacity-90 font-semibold text-sm transition-opacity"
          >
            🗺️ Dodaj do plannera
          </a>

          {/* Stats */}
          <div className="bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border)] p-4">
            <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-2">Szczegóły</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Wysokość:</span>
                <span className="font-semibold">{peak.elevation}m n.p.m.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Pasmo:</span>
                <span className="font-semibold">{peak.range}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Trudność:</span>
                <span className="font-semibold">{difficultyLabels[peak.difficulty]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Czas podejścia:</span>
                <span className="font-semibold">{hoursMinutes}</span>
              </div>
            </div>
          </div>

          {/* Noclegi */}
          <a
            href="/listings?type=hotel"
            className="block text-center px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] font-semibold text-sm transition-colors"
          >
            🏨 Szukaj noclegu
          </a>
        </div>
      </div>
    </div>
    </>
  );
}
