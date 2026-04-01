import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  createArticleSchema,
  createBreadcrumbSchema,
  renderJsonLd
} from "@/core/seo/schemas";
import { generatePlannerMetadata } from "@/core/seo/metadata";

type Params = { slug: string };

// Demo saved planner data - in production, this would come from a database
const SAVED_PLANNERS: Record<string, {
  title: string;
  description: string;
  duration: string;
  stops: Array<{
    name: string;
    type: "peak" | "hotel" | "attraction" | "restaurant";
    town?: string;
  }>;
  author: string;
  createdAt: string;
}> = {
  "weekend-w-szczyrku": {
    title: "Weekend w Szczyrku - klasyka Beskidu Śląskiego",
    description: "Dwudniowy plan wycieczki po Szczyrku z wejściem na Skrzyczne, noclegiem w centrum i odwiedzeniem lokalnych atrakcji.",
    duration: "2 dni",
    stops: [
      { name: "Skrzyczne", type: "peak" },
      { name: "Hotel Szczyrk Mountain Resort", type: "hotel", town: "Szczyrk" },
      { name: "Kolej gondolowa", type: "attraction", town: "Szczyrk" },
      { name: "Restauracja Góralska", type: "restaurant", town: "Szczyrk" },
    ],
    author: "Beskidzku.pl",
    createdAt: "2025-12-01",
  },
  "babia-gora-ekspedycja": {
    title: "Babia Góra - ekspedycja na Królową Beskidów",
    description: "Jednodniowa wyprawa na najwyższy szczyt Beskidów z noclegiem w Zawoi. Plan obejmuje wejście, zejście i odpoczynek.",
    duration: "1 dzień",
    stops: [
      { name: "Diablak (Babia Góra)", type: "peak" },
      { name: "Schronisko na Markowych Szczawinach", type: "hotel", town: "Zawoja" },
    ],
    author: "Beskidzku.pl",
    createdAt: "2025-11-15",
  },
  "rodzinny-wypad-wisla": {
    title: "Rodzinny wypad do Wisły - spokojnie i aktywnie",
    description: "Trzy dni w Wiśle z atrakcjami dla całej rodziny: spacery, deptak, skocznia Adama Małysza i lokalne smakołyki.",
    duration: "3 dni",
    stops: [
      { name: "Skocznia Adama Małysza", type: "attraction", town: "Wisła" },
      { name: "Deptak w Wiśle", type: "attraction", town: "Wisła" },
      { name: "Regionalka Apart", type: "hotel", town: "Wisła" },
      { name: "Mała Czantoria", type: "peak" },
    ],
    author: "Beskidzku.pl",
    createdAt: "2026-01-10",
  },
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const planner = SAVED_PLANNERS[slug];

  if (!planner) return {};

  return generatePlannerMetadata({
    title: planner.title,
    slug: slug,
  });
}

export async function generateStaticParams() {
  return Object.keys(SAVED_PLANNERS).map((slug) => ({ slug }));
}

export default async function SavedPlannerPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const planner = SAVED_PLANNERS[slug];

  if (!planner) notFound();

  // Generate JSON-LD schemas
  const articleSchema = createArticleSchema({
    headline: planner.title,
    description: planner.description,
    datePublished: planner.createdAt,
    dateModified: planner.createdAt,
    url: `https://beskidzku.pl/planer/${slug}`,
  });

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Strona główna", url: "https://beskidzku.pl" },
    { name: "Planner", url: "https://beskidzku.pl/planner" },
    { name: planner.title, url: `https://beskidzku.pl/planer/${slug}` },
  ]);

  const typeIcons: Record<string, string> = {
    peak: "⛰️",
    hotel: "🏨",
    attraction: "🎯",
    restaurant: "🍽️",
  };

  const typeLabels: Record<string, string> = {
    peak: "Szczyt",
    hotel: "Nocleg",
    attraction: "Atrakcja",
    restaurant: "Restauracja",
  };

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
          <a href="/planner" className="hover:text-[var(--color-primary)]">Planner</a>
          {" / "}
          <span>{planner.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">
                    Gotowy plan wycieczki
                  </p>
                  <h1 className="text-3xl font-extrabold mt-1">{planner.title}</h1>
                  <p className="text-[var(--color-primary)] font-bold text-lg mt-2">
                    📅 {planner.duration}
                  </p>
                </div>
              </div>

              <p className="text-[var(--color-text)] leading-relaxed mb-4">{planner.description}</p>

              <div className="flex items-center gap-4 text-xs text-[var(--color-muted)] mt-4">
                <span>✍️ {planner.author}</span>
                <span>📅 {new Date(planner.createdAt).toLocaleDateString("pl-PL")}</span>
              </div>
            </div>

            {/* Stops/Timeline */}
            <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Plan wycieczki</h2>
              <div className="space-y-3">
                {planner.stops.map((stop, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{typeIcons[stop.type]}</span>
                        <p className="font-semibold text-sm">{stop.name}</p>
                      </div>
                      <p className="text-xs text-[var(--color-muted)]">
                        {typeLabels[stop.type]}
                        {stop.town && ` · ${stop.town}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA - Use this plan */}
            <div className="bg-gradient-to-br from-[var(--color-primary-soft)] to-white rounded-2xl border border-[var(--color-primary)] p-6">
              <h3 className="text-xl font-bold mb-2">Chcesz użyć tego planu?</h3>
              <p className="text-sm text-[var(--color-muted)] mb-4">
                Otwórz ten plan w plannerze, dostosuj go do swoich potrzeb i ruszaj w drogę!
              </p>
              <a
                href="/planner"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:opacity-90 transition-opacity"
              >
                🗺️ Otwórz w plannerze →
              </a>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick stats */}
            <div className="bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border)] p-4">
              <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-2">Informacje</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">Czas trwania:</span>
                  <span className="font-semibold">{planner.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">Liczba punktów:</span>
                  <span className="font-semibold">{planner.stops.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">Autor:</span>
                  <span className="font-semibold">{planner.author}</span>
                </div>
              </div>
            </div>

            {/* Create your own */}
            <a
              href="/planner"
              className="block text-center px-4 py-3 rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary)] text-white hover:opacity-90 font-semibold text-sm transition-opacity"
            >
              🗺️ Stwórz własny plan
            </a>

            {/* Browse more */}
            <a
              href="/szczyty"
              className="block text-center px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] font-semibold text-sm transition-colors"
            >
              📍 Szczyty Beskidów
            </a>

            <a
              href="/listings?type=hotel"
              className="block text-center px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] font-semibold text-sm transition-colors"
            >
              🏨 Noclegi w Beskidach
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
