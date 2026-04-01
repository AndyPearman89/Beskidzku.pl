"use client";

import type { Peak } from "@/core/api/peaks";

interface PeakCardProps {
  peak: Peak;
}

export default function PeakCard({ peak }: PeakCardProps) {
  const difficultyLabels: Record<Peak["difficulty"], string> = {
    easy: "Łatwy",
    moderate: "Umiarkowany",
    hard: "Trudny",
    very_hard: "Bardzo trudny",
  };

  const difficultyColors: Record<Peak["difficulty"], string> = {
    easy: "bg-green-100 text-green-700",
    moderate: "bg-yellow-100 text-yellow-700",
    hard: "bg-orange-100 text-orange-700",
    very_hard: "bg-red-100 text-red-700",
  };

  const hoursMinutes = Math.floor(peak.hiking_time / 60) + "h " + (peak.hiking_time % 60) + "min";

  return (
    <a
      href={`/szczyt/${peak.slug}`}
      className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md p-5 transition-all block"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="text-xs text-[var(--color-muted)] uppercase font-semibold">{peak.range}</p>
          <h3 className="font-bold text-lg mt-1">{peak.name}</h3>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-bold flex-shrink-0 ${difficultyColors[peak.difficulty]}`}>
          {difficultyLabels[peak.difficulty]}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-[var(--color-primary)] font-bold text-lg">⛰️ {peak.elevation}m</span>
        </div>

        <div className="flex items-center gap-2 text-[var(--color-muted)]">
          <span>🥾 {hoursMinutes}</span>
        </div>
      </div>

      {peak.description && (
        <p className="text-xs text-[var(--color-muted)] mt-3 line-clamp-2">{peak.description}</p>
      )}
    </a>
  );
}
