"use client";

import { exportGPX, downloadGPX, buildGoogleMapsUrl } from '@/lib/api/planner';

interface RouteStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  description?: string;
}

interface ExportButtonsProps {
  route?: [number, number][];
  stops: RouteStop[];
  planName?: string;
}

export default function ExportButtons({ route = [], stops, planName = 'Plan Beskidów' }: ExportButtonsProps) {
  const handleGPXDownload = () => {
    if (stops.length === 0) {
      alert('Brak punktów do eksportu');
      return;
    }

    try {
      const gpxContent = exportGPX({ path: route, stops }, planName);
      const filename = `${planName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.gpx`;
      downloadGPX(gpxContent, filename);

      // Track export event
      if (typeof window !== 'undefined') {
        console.log('GPX exported:', filename);
      }
    } catch (error) {
      console.error('Failed to export GPX:', error);
      alert('Wystąpił błąd podczas eksportu GPX');
    }
  };

  const handleGoogleMapsOpen = () => {
    if (stops.length === 0) {
      alert('Brak punktów do wyświetlenia');
      return;
    }

    try {
      const url = buildGoogleMapsUrl(stops);
      window.open(url, '_blank', 'noopener,noreferrer');

      // Track export event
      if (typeof window !== 'undefined') {
        console.log('Google Maps opened');
      }
    } catch (error) {
      console.error('Failed to open Google Maps:', error);
      alert('Wystąpił błąd podczas otwierania Google Maps');
    }
  };

  const hasStops = stops.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-5">
      <h3 className="text-lg font-bold mb-4">Eksportuj plan</h3>

      <div className="space-y-3">
        {/* Google Maps */}
        <button
          onClick={handleGoogleMapsOpen}
          disabled={!hasStops}
          className="w-full flex items-center justify-between gap-3 rounded-xl border-2 border-[var(--color-border)] bg-white px-5 py-4 text-left hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl">🗺️</div>
            <div>
              <div className="font-semibold text-sm text-[var(--color-text)]">
                Otwórz w Google Maps
              </div>
              <div className="text-xs text-[var(--color-muted)]">
                Nawigacja krok po kroku
              </div>
            </div>
          </div>
          <div className="text-[var(--color-primary)] group-hover:translate-x-1 transition-transform">
            →
          </div>
        </button>

        {/* GPX Download */}
        <button
          onClick={handleGPXDownload}
          disabled={!hasStops}
          className="w-full flex items-center justify-between gap-3 rounded-xl border-2 border-[var(--color-border)] bg-white px-5 py-4 text-left hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl">📥</div>
            <div>
              <div className="font-semibold text-sm text-[var(--color-text)]">
                Pobierz GPX
              </div>
              <div className="text-xs text-[var(--color-muted)]">
                Dla urządzeń GPS i aplikacji
              </div>
            </div>
          </div>
          <div className="text-[var(--color-primary)] group-hover:translate-x-1 transition-transform">
            ↓
          </div>
        </button>

        {/* Share button (future feature) */}
        <button
          disabled
          className="w-full flex items-center justify-between gap-3 rounded-xl border-2 border-[var(--color-border)] bg-gray-50 px-5 py-4 text-left opacity-50 cursor-not-allowed"
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl">🔗</div>
            <div>
              <div className="font-semibold text-sm text-gray-500">
                Udostępnij link
              </div>
              <div className="text-xs text-gray-400">
                Wkrótce dostępne
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Info */}
      <div className="mt-4 pt-4 border-t border-[var(--color-border)] text-xs text-[var(--color-muted)]">
        💡 Pliki GPX działają w aplikacjach: Komoot, Strava, Garmin Connect i innych
      </div>
    </div>
  );
}
