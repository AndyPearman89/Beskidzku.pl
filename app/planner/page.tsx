"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PlannerForm from "@/components/PlannerForm";
import dynamic from "next/dynamic";
import type { Listing } from "@/core/api/listings";

const ListingsMap = dynamic(() => import("@/app/components/ListingsMap"), { ssr: false });

interface PlanStop {
  id: string;
  listingId?: string;
  label: string;
  detail: string;
  lat?: number;
  lng?: number;
  type: string;
}

const STORAGE_KEY = "beskidzku_planner_stops";

// Helper function for haversine distance
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function totalDistance(stops: PlanStop[]): number {
  let dist = 0;
  for (let i = 1; i < stops.length; i++) {
    const prev = stops[i - 1];
    const curr = stops[i];
    if (prev.lat && prev.lng && curr.lat && curr.lng) {
      dist += haversine(prev.lat, prev.lng, curr.lat, curr.lng);
    }
  }
  return dist;
}

function buildGoogleMapsUrl(stops: PlanStop[]): string {
  const validStops = stops.filter((s) => s.lat && s.lng);
  if (validStops.length === 0) return "https://maps.google.com";
  if (validStops.length === 1) {
    return `https://www.google.com/maps/search/?api=1&query=${validStops[0].lat},${validStops[0].lng}`;
  }
  const origin = `${validStops[0].lat},${validStops[0].lng}`;
  const destination = `${validStops[validStops.length - 1].lat},${validStops[validStops.length - 1].lng}`;
  const waypoints = validStops
    .slice(1, -1)
    .map((s) => `${s.lat},${s.lng}`)
    .join("|");
  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
  if (waypoints) url += `&waypoints=${encodeURIComponent(waypoints)}`;
  return url;
}

export default function PlannerPage() {
  const router = useRouter();
  const [showAdvancedPlanner, setShowAdvancedPlanner] = useState(false);

  // Quick planner state
  const [generatingPlan, setGeneratingPlan] = useState(false);

  // Advanced planner state (existing functionality)
  const [stops, setStops] = useState<PlanStop[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Listing[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [saved, setSaved] = useState(false);

  // Handle quick planner submission
  const handleQuickPlanSubmit = async (data: {
    location: string;
    duration: number;
    type: string;
  }) => {
    setGeneratingPlan(true);

    // Redirect to results page with parameters
    const params = new URLSearchParams({
      location: data.location,
      duration: data.duration.toString(),
      type: data.type,
    });

    router.push(`/planner/result?${params.toString()}`);
  };

  // Advanced planner functions (from original code)
  const searchListings = async (q: string) => {
    if (q.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/listings?q=${encodeURIComponent(q)}&perPage=6`);
      const json = (await res.json()) as { data: Listing[] };
      setSearchResults(json.data ?? []);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  function addStop(listing: Listing) {
    if (stops.some((s) => s.listingId === listing.id)) return;
    const stop: PlanStop = {
      id: `stop_${Date.now()}`,
      listingId: listing.id,
      label: listing.title,
      detail: `${listing.town} · ${listing.type}`,
      lat: listing.lat,
      lng: listing.lng,
      type: listing.type,
    };
    setStops((prev) => [...prev, stop]);
    setSearchQuery("");
    setSearchResults([]);
  }

  function removeStop(id: string) {
    setStops((prev) => prev.filter((s) => s.id !== id));
  }

  function moveStop(idx: number, dir: -1 | 1) {
    const newStops = [...stops];
    const target = idx + dir;
    if (target < 0 || target >= newStops.length) return;
    [newStops[idx], newStops[target]] = [newStops[target], newStops[idx]];
    setStops(newStops);
  }

  function savePlan() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stops));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      /* ignore */
    }
  }

  function clearPlan() {
    if (confirm("Czy na pewno chcesz wyczyścić cały plan?")) {
      setStops([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  const dist = totalDistance(stops);
  const estimatedHours = dist > 0 ? (dist / 30 + stops.length * 0.75).toFixed(1) : null;
  const mapsUrl = buildGoogleMapsUrl(stops);

  const mapListings = stops
    .filter((s) => s.lat && s.lng)
    .map((s) => ({
      id: s.id,
      title: s.label,
      town: s.detail.split(" · ")[0] ?? "",
      type: s.type,
      lat: s.lat,
      lng: s.lng,
      address: "",
      packageLevel: "PREMIUM" as const,
    }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">
          Planner Beskidów
        </p>
        <h1 className="text-4xl font-bold mt-1">Zaplanuj wycieczkę</h1>
        <p className="text-[var(--color-muted)] mt-2 text-lg max-w-2xl mx-auto">
          Wybierz miejsce, termin i styl. Wygenerujemy gotowy plan z trasą, mapą i noclegami.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="mb-8 flex justify-center gap-3">
        <button
          onClick={() => setShowAdvancedPlanner(false)}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            !showAdvancedPlanner
              ? "bg-[var(--color-primary)] text-white shadow-[0_10px_25px_rgba(227,6,19,0.18)]"
              : "bg-white border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]"
          }`}
        >
          🚀 Szybki planner (AI)
        </button>
        <button
          onClick={() => setShowAdvancedPlanner(true)}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            showAdvancedPlanner
              ? "bg-[var(--color-primary)] text-white shadow-[0_10px_25px_rgba(227,6,19,0.18)]"
              : "bg-white border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]"
          }`}
        >
          ✏️ Ręczny planner
        </button>
      </div>

      {/* Quick Planner (AI-powered) */}
      {!showAdvancedPlanner && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-lg p-8">
            <PlannerForm onSubmit={handleQuickPlanSubmit} loading={generatingPlan} />
          </div>

          {/* Info section */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-4">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-semibold text-sm">Spersonalizowany plan</div>
              <div className="text-xs text-[var(--color-muted)] mt-1">
                Dopasowany do stylu wyprawy
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-4">
              <div className="text-3xl mb-2">🗺️</div>
              <div className="font-semibold text-sm">Mapa + nawigacja</div>
              <div className="text-xs text-[var(--color-muted)] mt-1">
                Export do Google Maps i GPX
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-4">
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-semibold text-sm">Gotowe w 30 sekund</div>
              <div className="text-xs text-[var(--color-muted)] mt-1">
                AI generuje plan błyskawicznie
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Manual Planner (existing functionality) */}
      {showAdvancedPlanner && (
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left column — plan */}
          <div className="lg:col-span-3 space-y-4">
            {/* Search box */}
            <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-4">
              <label className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide block mb-2">
                Dodaj miejsce do planu
              </label>
              <div className="relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    void searchListings(e.target.value);
                  }}
                  placeholder="Szukaj: nocleg, atrakcja, restauracja…"
                  className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] pr-10"
                />
                {isSearching && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] text-xs animate-pulse">
                    …
                  </span>
                )}
              </div>
              {searchResults.length > 0 && (
                <ul className="mt-2 border border-[var(--color-border)] rounded-xl overflow-hidden bg-white shadow-md">
                  {searchResults.map((r) => (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => addStop(r)}
                        disabled={stops.some((s) => s.listingId === r.id)}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed border-b border-[var(--color-border)] last:border-0"
                      >
                        <span className="font-semibold">{r.title}</span>{" "}
                        <span className="text-[var(--color-muted)]">
                          · {r.town} · {r.type}
                        </span>
                        {stops.some((s) => s.listingId === r.id) && (
                          <span className="ml-2 text-xs text-green-600">✓ w planie</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Plan list */}
            <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold">
                    Twój plan
                    {stops.length > 0 && (
                      <span className="ml-2 text-sm font-normal text-[var(--color-muted)]">
                        · {stops.length} {stops.length === 1 ? "punkt" : stops.length < 5 ? "punkty" : "punktów"}
                      </span>
                    )}
                  </h2>
                  {dist > 0 && (
                    <p className="text-sm text-[var(--color-muted)] mt-0.5">
                      ~{dist.toFixed(1)} km · szacowany czas: {estimatedHours}h
                    </p>
                  )}
                </div>
                {stops.length > 0 && (
                  <button
                    type="button"
                    onClick={clearPlan}
                    className="text-xs text-[var(--color-muted)] hover:text-red-600 transition-colors font-semibold"
                  >
                    Wyczyść
                  </button>
                )}
              </div>

              {stops.length === 0 ? (
                <div className="text-center py-10 text-[var(--color-muted)]">
                  <p className="text-4xl mb-3">🗺️</p>
                  <p className="font-semibold">Plan jest pusty</p>
                  <p className="text-sm mt-1">Wyszukaj miejsce powyżej i dodaj je do planu.</p>
                </div>
              ) : (
                <ol className="space-y-3">
                  {stops.map((stop, idx) => (
                    <li
                      key={stop.id}
                      className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] px-4 py-3 bg-[var(--color-bg)]"
                    >
                      <div className="h-9 w-9 rounded-full bg-[var(--color-primary)] text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{stop.label}</p>
                        <p className="text-xs text-[var(--color-muted)]">{stop.detail}</p>
                        {idx > 0 && stops[idx - 1].lat && stops[idx - 1].lng && stop.lat && stop.lng && (
                          <p className="text-xs text-[var(--color-primary)] font-semibold mt-0.5">
                            ~{haversine(stops[idx - 1].lat!, stops[idx - 1].lng!, stop.lat, stop.lng!).toFixed(1)} km od poprzedniego
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveStop(idx, -1)}
                          disabled={idx === 0}
                          aria-label="Przesuń wyżej"
                          className="p-1.5 rounded-lg hover:bg-white border border-transparent hover:border-[var(--color-border)] text-[var(--color-muted)] disabled:opacity-25 transition-all"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveStop(idx, 1)}
                          disabled={idx === stops.length - 1}
                          aria-label="Przesuń niżej"
                          className="p-1.5 rounded-lg hover:bg-white border border-transparent hover:border-[var(--color-border)] text-[var(--color-muted)] disabled:opacity-25 transition-all"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => removeStop(stop.id)}
                          aria-label="Usuń z planu"
                          className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 text-[var(--color-muted)] transition-all"
                        >
                          ✕
                        </button>
                      </div>
                    </li>
                  ))}
                </ol>
              )}

              {stops.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={savePlan}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-semibold text-sm hover:bg-[var(--color-primary-hover)] transition-colors shadow-[0_10px_25px_rgba(227,6,19,0.18)]"
                  >
                    {saved ? "✓ Zapisano!" : "Zapisz plan"}
                  </button>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-white font-semibold text-sm hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    🗺️ Otwórz w Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right column — map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-4 sticky top-20">
              <h2 className="text-base font-semibold mb-3">Mapa trasy</h2>
              <ListingsMap listings={mapListings} height="460px" />
              {mapListings.length === 0 && (
                <p className="text-xs text-center text-[var(--color-muted)] mt-2">
                  Dodaj miejsca z koordynatami, aby zobaczyć je na mapie.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
