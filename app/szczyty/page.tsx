import type { Metadata } from "next";
import { getPeaks } from "@/core/api/peaks";
import PeakCard from "@/app/components/PeakCard";

export const metadata: Metadata = {
  title: "Szczyty Beskidów — Przewodnik · Beskidzku.pl",
  description: "Kompletny przewodnik po szczytach Beskidów. Skrzyczne, Babia Góra, Pilsko i inne szczyty z opisami, mapami i danymi o trudności.",
};

interface SearchParams {
  range?: string;
  difficulty?: string;
}

export default async function PeaksPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;

  const { items: peaks } = getPeaks({
    range: params.range,
    difficulty: params.difficulty as "easy" | "moderate" | "hard" | "very_hard" | undefined,
  });

  const ranges = Array.from(new Set(peaks.map((p) => p.range))).sort();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold">⛰️ Szczyty Beskidów</h1>
        <p className="text-[var(--color-muted)] mt-2">
          Odkryj najpiękniejsze szczyty w Beskidach — od łatwych rodzinnych wędrówek po trudne górskie wyzwania.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <a
          href="/szczyty"
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            !params.range && !params.difficulty
              ? "bg-[var(--color-primary)] text-white"
              : "bg-white border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]"
          }`}
        >
          Wszystkie
        </a>

        {ranges.map((range) => (
          <a
            key={range}
            href={`/szczyty?range=${encodeURIComponent(range)}`}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              params.range === range
                ? "bg-[var(--color-primary)] text-white"
                : "bg-white border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]"
            }`}
          >
            {range}
          </a>
        ))}

        <div className="w-full sm:w-auto flex gap-2">
          <a
            href={`/szczyty?difficulty=easy${params.range ? `&range=${params.range}` : ""}`}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              params.difficulty === "easy"
                ? "bg-green-500 text-white"
                : "bg-white border border-[var(--color-border)] text-[var(--color-text)] hover:border-green-500"
            }`}
          >
            Łatwy
          </a>
          <a
            href={`/szczyty?difficulty=moderate${params.range ? `&range=${params.range}` : ""}`}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              params.difficulty === "moderate"
                ? "bg-yellow-500 text-white"
                : "bg-white border border-[var(--color-border)] text-[var(--color-text)] hover:border-yellow-500"
            }`}
          >
            Umiarkowany
          </a>
          <a
            href={`/szczyty?difficulty=hard${params.range ? `&range=${params.range}` : ""}`}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              params.difficulty === "hard"
                ? "bg-orange-500 text-white"
                : "bg-white border border-[var(--color-border)] text-[var(--color-text)] hover:border-orange-500"
            }`}
          >
            Trudny
          </a>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-[var(--color-muted)] mb-4">
        Znaleziono <strong>{peaks.length}</strong> {peaks.length === 1 ? "szczyt" : "szczytów"}
      </p>

      {/* Peaks grid */}
      {peaks.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {peaks.map((peak) => (
            <PeakCard key={peak.id} peak={peak} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-[var(--color-muted)] text-lg">Nie znaleziono szczytów spełniających wybrane kryteria.</p>
          <a href="/szczyty" className="text-[var(--color-primary)] font-semibold hover:underline mt-2 inline-block">
            Wyczyść filtry →
          </a>
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 bg-[var(--color-primary-soft)] border border-[var(--color-primary)] rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-2">Zaplanuj swoją wycieczkę</h2>
        <p className="text-[var(--color-muted)] mb-4">
          Użyj plannera, aby stworzyć idealną trasę górską z kilkoma szczytami.
        </p>
        <a
          href="/planner"
          className="inline-block px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          🗺️ Otwórz planner
        </a>
      </div>
    </div>
  );
}
