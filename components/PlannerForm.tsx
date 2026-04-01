"use client";

import { useState, useCallback, useEffect } from 'react';
import type { Listing } from '@/core/api/listings';

interface PlannerFormProps {
  onSubmit: (data: {
    location: string;
    duration: number;
    type: 'trekking' | 'family' | 'bike' | 'relaks' | 'aktywnie';
  }) => void;
  loading?: boolean;
}

const ACTIVITY_TYPES = [
  { label: '👨‍👩‍👧‍👦 Rodzina / z dziećmi', value: 'family' as const },
  { label: '🥾 Trekking górski', value: 'trekking' as const },
  { label: '🧘 Relaks i odpoczynek', value: 'relaks' as const },
  { label: '🚴 Aktywnie (rower/bieganie)', value: 'aktywnie' as const },
  { label: '🚴 Rowerem', value: 'bike' as const },
];

export default function PlannerForm({ onSubmit, loading = false }: PlannerFormProps) {
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState(1);
  const [type, setType] = useState<'trekking' | 'family' | 'bike' | 'relaks' | 'aktywnie'>('family');

  // Autocomplete state
  const [locationSuggestions, setLocationSuggestions] = useState<Listing[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced location search
  const searchLocations = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setLocationSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/listings?q=${encodeURIComponent(query)}&perPage=5`);
      const json = await res.json() as { data: Listing[] };
      setLocationSuggestions(json.data ?? []);
    } catch {
      setLocationSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => void searchLocations(location), 300);
    return () => clearTimeout(timer);
  }, [location, searchLocations]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) {
      alert('Proszę podać lokalizację');
      return;
    }
    onSubmit({ location, duration, type });
  };

  const selectLocation = (listing: Listing) => {
    setLocation(listing.town);
    setShowSuggestions(false);
    setLocationSuggestions([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Location input with autocomplete */}
      <div className="space-y-2">
        <label htmlFor="location" className="block text-sm font-semibold text-[var(--color-text)]">
          Gdzie chcesz jechać?
        </label>
        <div className="relative">
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="np. Szczyrk, Wisła, Ustroń..."
            className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            disabled={loading}
            required
          />
          {isSearching && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] text-xs">
              Szukam...
            </span>
          )}

          {/* Autocomplete dropdown */}
          {showSuggestions && locationSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-[var(--color-border)] rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {locationSuggestions.map((listing) => (
                <button
                  key={listing.id}
                  type="button"
                  onClick={() => selectLocation(listing)}
                  className="w-full text-left px-4 py-3 hover:bg-[var(--color-primary-soft)] transition-colors border-b border-[var(--color-border)] last:border-0"
                >
                  <div className="font-semibold text-sm">{listing.town}</div>
                  <div className="text-xs text-[var(--color-muted)]">{listing.title}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Duration input */}
      <div className="space-y-2">
        <label htmlFor="duration" className="block text-sm font-semibold text-[var(--color-text)]">
          Ile dni? ({duration} {duration === 1 ? 'dzień' : duration < 5 ? 'dni' : 'dni'})
        </label>
        <input
          id="duration"
          type="range"
          min="1"
          max="7"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value, 10))}
          className="w-full"
          disabled={loading}
        />
        <div className="flex justify-between text-xs text-[var(--color-muted)]">
          <span>1 dzień</span>
          <span>7 dni</span>
        </div>
      </div>

      {/* Activity type selection */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-[var(--color-text)]">
          Jaki styl wyprawy?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ACTIVITY_TYPES.map((activity) => (
            <button
              key={activity.value}
              type="button"
              onClick={() => setType(activity.value)}
              disabled={loading}
              className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all ${
                type === activity.value
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
                  : 'border-[var(--color-border)] bg-white text-[var(--color-text)] hover:border-[var(--color-primary)]'
              }`}
            >
              {activity.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[var(--color-primary)] text-white font-bold py-4 rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_15px_35px_rgba(227,6,19,0.18)]"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span>
            Generuję plan...
          </span>
        ) : (
          '🗺️ Wygeneruj plan podróży'
        )}
      </button>

      {/* Info text */}
      <p className="text-xs text-center text-[var(--color-muted)]">
        Plan zostanie wygenerowany w kilka sekund. Zawiera trasę, punkty widokowe, noclegi i pogodę.
      </p>
    </form>
  );
}
