import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  createArticleSchema,
  createBreadcrumbSchema,
  renderJsonLd
} from "@/core/seo/schemas";
import { generateRouteMetadata } from "@/core/seo/metadata";
import { generateRouteDescription } from "@/core/seo/content";

type Params = { slug: string };

// Demo route data - in production, this would come from a database
const ROUTES: Record<string, {
  name: string;
  description: string;
  distance: number;
  duration: number;
  elevationGain: number;
  difficulty: string;
  startPoint: { name: string; lat: number; lng: number };
  endPoint: { name: string; lat: number; lng: number };
  highlights: string[];
}> = {
  "skrzyczne-z-doliny-mietusiej": {
    name: "Skrzyczne z Doliny Miętusiej",
    description: "Klasyczna trasa na najwyższy szczyt Beskidu Śląskiego. Czerwony szlak prowadzi przez las bukowy, następnie przez górskie hale z pięknymi widokami.",
    distance: 9.2,
    duration: 240, // minutes
    elevationGain: 640,
    difficulty: "moderate",
    startPoint: { name: "Dolina Miętusia - parking", lat: 49.6842, lng: 19.0123 },
    endPoint: { name: "Skrzyczne (1257m)", lat: 49.6850, lng: 19.0300 },
    highlights: ["Punkt widokowy Hala Skrzyczańska", "Kolej gondolowa (opcja powrotu)", "Widok na Tatry"],
  },
  "babia-gora-petla": {
    name: "Babia Góra - pętla przez Markowe Szczawiny",
    description: "Wymagająca pętla na Królową Beskidów. Wspinaczka przez rezerwat przyrody z unikalnymi ekosystemami.",
    distance: 14.5,
    duration: 420,
    elevationGain: 1230,
    difficulty: "hard",
    startPoint: { name: "Zawoja - parking", lat: 49.6342, lng: 19.5456 },
    endPoint: { name: "Diablak (1725m)", lat: 49.5734, lng: 19.5296 },
    highlights: ["Najwyższy szczyt Beskidów", "Rezerwat Babia Góra", "Panorama 360°"],
  },
  "pilsko-z-korbielowa": {
    name: "Pilsko z Korbielowa",
    description: "Przepiękna trasa na drugi szczyt Beskidu Żywieckiego. Zejście przez rezerwat Dolina Żarnówki.",
    distance: 11.8,
    duration: 300,
    elevationGain: 720,
    difficulty: "moderate",
    startPoint: { name: "Korbielów - parking", lat: 49.4234, lng: 19.0823 },
    endPoint: { name: "Pilsko (1557m)", lat: 49.4156, lng: 19.0934 },
    highlights: ["Widok na Tatry i Babią Górę", "Dolina Żarnówki", "Leśne ostępy"],
  },
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const route = ROUTES[slug];

  if (!route) return {};

  return generateRouteMetadata({
    name: route.name,
    description: route.description,
    slug: slug,
    distance: route.distance,
    duration: route.duration,
  });
}

export async function generateStaticParams() {
  return Object.keys(ROUTES).map((slug) => ({ slug }));
}

export default async function RouteDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const route = ROUTES[slug];

  if (!route) notFound();

  const hoursMinutes = Math.floor(route.duration / 60) + "h " + (route.duration % 60) + "min";

  const difficultyLabels: Record<string, string> = {
    easy: "Łatwa",
    moderate: "Umiarkowana",
    hard: "Trudna",
    very_hard: "Bardzo trudna",
  };

  const difficultyColors: Record<string, string> = {
    easy: "bg-green-100 text-green-700 border-green-300",
    moderate: "bg-yellow-100 text-yellow-700 border-yellow-300",
    hard: "bg-orange-100 text-orange-700 border-orange-300",
    very_hard: "bg-red-100 text-red-700 border-red-300",
  };

  // Generate JSON-LD schemas
  const articleSchema = createArticleSchema({
    headline: route.name,
    description: route.description,
    datePublished: "2025-01-01", // In production, use actual dates
    dateModified: "2026-01-01",
    url: `https://beskidzku.pl/trasy/${slug}`,
  });

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Strona główna", url: "https://beskidzku.pl" },
    { name: "Trasy", url: "https://beskidzku.pl/szczyty" },
    { name: route.name, url: `https://beskidzku.pl/trasy/${slug}` },
  ]);

  const seoDescription = generateRouteDescription({
    name: route.name,
    distance: route.distance,
    duration: route.duration,
    elevationGain: route.elevationGain,
  });

  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(breadcrumbSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-[var(--color-muted)] mb-6">
          <a href="/" className="hover:text-[var(--color-primary)]">Strona główna</a>
          {" / "}
          <a href="/szczyty" className="hover:text-[var(--color-primary)]">Trasy</a>
          {" / "}
          <span>{route.name}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">
                    Trasa górska
                  </p>
                  <h1 className="text-3xl font-extrabold mt-1">{route.name}</h1>
                  <p className="text-[var(--color-primary)] font-bold text-2xl mt-2">
                    🥾 {route.distance} km · {hoursMinutes}
                  </p>
                </div>
                <span className={`text-xs px-3 py-1.5 rounded-full font-bold border flex-shrink-0 ${difficultyColors[route.difficulty] ?? ""}`}>
                  {difficultyLabels[route.difficulty]}
                </span>
              </div>

              <p className="text-[var(--color-text)] leading-relaxed mb-4">{route.description}</p>
              <p className="text-sm text-[var(--color-muted)] mb-4">{seoDescription}</p>

              <div className="grid sm:grid-cols-3 gap-4 mt-4">
                <div className="bg-[var(--color-bg)] rounded-xl p-4 border border-[var(--color-border)]">
                  <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">Dystans</p>
                  <p className="text-lg font-bold mt-1">📏 {route.distance} km</p>
                </div>
                <div className="bg-[var(--color-bg)] rounded-xl p-4 border border-[var(--color-border)]">
                  <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">Czas</p>
                  <p className="text-lg font-bold mt-1">⏱️ {hoursMinutes}</p>
                </div>
                <div className="bg-[var(--color-bg)] rounded-xl p-4 border border-[var(--color-border)]">
                  <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">Suma podejść</p>
                  <p className="text-lg font-bold mt-1">📈 {route.elevationGain}m</p>
                </div>
              </div>

              {route.highlights && route.highlights.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-2">Najważniejsze punkty</p>
                  <div className="flex flex-wrap gap-2">
                    {route.highlights.map((h) => (
                      <span key={h} className="px-3 py-1 bg-[var(--color-primary-soft)] text-[var(--color-primary)] border border-[var(--color-primary)] rounded-full text-xs font-semibold">
                        ✨ {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-5">
              <h2 className="text-base font-semibold mb-3">Mapa trasy</h2>
              <div className="rounded-xl overflow-hidden">
                <iframe
                  title={`Mapa - ${route.name}`}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${route.startPoint.lng - 0.05},${route.startPoint.lat - 0.03},${route.endPoint.lng + 0.05},${route.endPoint.lat + 0.03}&layer=mapnik&marker=${route.startPoint.lat},${route.startPoint.lng}`}
                  style={{ width: "100%", height: "360px", border: 0, borderRadius: "12px" }}
                  loading="lazy"
                />
              </div>
            </div>

            {/* Start and End Points */}
            <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-5">
              <h2 className="text-base font-semibold mb-3">Punkt startowy i końcowy</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    A
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{route.startPoint.name}</p>
                    <p className="text-xs text-[var(--color-muted)]">
                      {route.startPoint.lat.toFixed(4)}, {route.startPoint.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    B
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{route.endPoint.name}</p>
                    <p className="text-xs text-[var(--color-muted)]">
                      {route.endPoint.lat.toFixed(4)}, {route.endPoint.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Add to planner */}
            <a
              href={`/planner?lat=${route.startPoint.lat}&lng=${route.startPoint.lng}&name=${encodeURIComponent(route.name)}`}
              className="block text-center px-4 py-3 rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary)] text-white hover:opacity-90 font-semibold text-sm transition-opacity"
            >
              🗺️ Dodaj do plannera
            </a>

            {/* Stats */}
            <div className="bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border)] p-4">
              <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-2">Parametry trasy</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">Dystans:</span>
                  <span className="font-semibold">{route.distance} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">Czas:</span>
                  <span className="font-semibold">{hoursMinutes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">Suma podejść:</span>
                  <span className="font-semibold">{route.elevationGain}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">Trudność:</span>
                  <span className="font-semibold">{difficultyLabels[route.difficulty]}</span>
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

            {/* Other routes */}
            <a
              href="/szczyty"
              className="block text-center px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] font-semibold text-sm transition-colors"
            >
              📍 Inne szczyty i trasy
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
