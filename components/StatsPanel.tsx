"use client";

interface StatsPanelProps {
  distance: number; // km
  duration: number; // hours
  elevation: number; // meters
  difficulty: 'easy' | 'moderate' | 'hard';
}

const DIFFICULTY_CONFIG = {
  easy: {
    label: 'Łatwy',
    color: 'text-green-600',
    bg: 'bg-green-50',
    icon: '✓',
  },
  moderate: {
    label: 'Średni',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    icon: '⚡',
  },
  hard: {
    label: 'Trudny',
    color: 'text-red-600',
    bg: 'bg-red-50',
    icon: '⚠',
  },
};

export default function StatsPanel({ distance, duration, elevation, difficulty }: StatsPanelProps) {
  const difficultyInfo = DIFFICULTY_CONFIG[difficulty];

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-5">
      <h3 className="text-lg font-bold mb-4">Statystyki trasy</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Distance */}
        <div className="rounded-xl bg-[var(--color-bg)] p-4">
          <div className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-1">
            Dystans
          </div>
          <div className="text-2xl font-bold text-[var(--color-text)]">
            {distance.toFixed(1)} <span className="text-sm font-normal">km</span>
          </div>
        </div>

        {/* Duration */}
        <div className="rounded-xl bg-[var(--color-bg)] p-4">
          <div className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-1">
            Czas
          </div>
          <div className="text-2xl font-bold text-[var(--color-text)]">
            {duration.toFixed(1)} <span className="text-sm font-normal">h</span>
          </div>
        </div>

        {/* Elevation */}
        <div className="rounded-xl bg-[var(--color-bg)] p-4">
          <div className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-1">
            Przewyższenie
          </div>
          <div className="text-2xl font-bold text-[var(--color-text)]">
            {elevation} <span className="text-sm font-normal">m</span>
          </div>
        </div>

        {/* Difficulty */}
        <div className={`rounded-xl ${difficultyInfo.bg} p-4`}>
          <div className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-1">
            Trudność
          </div>
          <div className={`text-lg font-bold ${difficultyInfo.color} flex items-center gap-1`}>
            <span>{difficultyInfo.icon}</span>
            {difficultyInfo.label}
          </div>
        </div>
      </div>

      {/* Additional info */}
      <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
        <div className="text-sm text-[var(--color-muted)] space-y-1">
          <div className="flex items-center justify-between">
            <span>Średnia prędkość:</span>
            <span className="font-semibold">{duration > 0 ? (distance / duration).toFixed(1) : 0} km/h</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Wzniesienie na km:</span>
            <span className="font-semibold">{distance > 0 ? (elevation / distance).toFixed(0) : 0} m/km</span>
          </div>
        </div>
      </div>
    </div>
  );
}
