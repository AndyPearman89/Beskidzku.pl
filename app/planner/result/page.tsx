"use client";

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { PlannerResponse, AIPlanResponse } from '@/lib/api/planner';
import { generatePlan, fetchAIPlan } from '@/lib/api/planner';
import StatsPanel from '@/components/StatsPanel';
import PlanTimeline from '@/components/PlanTimeline';
import WeatherPanel from '@/components/WeatherPanel';
import ListingCard from '@/components/ListingCard';
import ExportButtons from '@/components/ExportButtons';
import type { Listing } from '@/core/api/listings';

// Dynamic imports for client-only components
const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

function PlannerResultContent() {
  const searchParams = useSearchParams();
  const [planData, setPlanData] = useState<PlannerResponse | null>(null);
  const [aiPlan, setAiPlan] = useState<AIPlanResponse | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiPlanLoading, setAiPlanLoading] = useState(false);

  // Get params from URL
  const location = searchParams.get('location') || '';
  const duration = parseInt(searchParams.get('duration') || '1', 10);
  const type = (searchParams.get('type') || 'family') as 'trekking' | 'family' | 'bike' | 'relaks' | 'aktywnie';

  useEffect(() => {
    const fetchPlan = async () => {
      if (!location) {
        setError('Brak lokalizacji. Wróć do formularza.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Generate plan via API
        const plan = await generatePlan({ location, duration, type });
        setPlanData(plan);

        // Fetch related listings
        if (plan.listings.accommodations.length > 0 || plan.listings.restaurants.length > 0) {
          const listingRes = await fetch(`/api/listings?perPage=6&town=${encodeURIComponent(location)}`);
          const listingData = await listingRes.json() as { data: Listing[] };
          setListings(listingData.data ?? []);
        }

        // Poll for AI plan if not ready
        if (!plan.aiPlanReady && plan.aiPlanId) {
          setAiPlanLoading(true);
          pollAIPlan(plan.aiPlanId);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Nie udało się wygenerować planu');
      } finally {
        setLoading(false);
      }
    };

    void fetchPlan();
  }, [location, duration, type]);

  // Poll AI plan endpoint
  const pollAIPlan = async (planId: string) => {
    let attempts = 0;
    const maxAttempts = 10;
    const interval = 3000; // 3 seconds

    const poll = async () => {
      if (attempts >= maxAttempts) {
        setAiPlanLoading(false);
        return;
      }

      try {
        const ai = await fetchAIPlan(planId);
        if (ai) {
          setAiPlan(ai);
          setAiPlanLoading(false);
        } else {
          attempts++;
          setTimeout(poll, interval);
        }
      } catch {
        setAiPlanLoading(false);
      }
    };

    void poll();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center py-20">
          <div className="text-6xl mb-4 animate-bounce">🗺️</div>
          <h2 className="text-2xl font-bold mb-2">Generuję Twój plan...</h2>
          <p className="text-[var(--color-muted)]">To potrwa tylko chwilę</p>
          <div className="mt-6 flex justify-center gap-2">
            <span className="h-3 w-3 bg-[var(--color-primary)] rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <span className="h-3 w-3 bg-[var(--color-primary)] rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <span className="h-3 w-3 bg-[var(--color-primary)] rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2">Wystąpił błąd</h2>
          <p className="text-[var(--color-muted)] mb-6">{error}</p>
          <a
            href="/planner"
            className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            ← Wróć do plannera
          </a>
        </div>
      </div>
    );
  }

  if (!planData) {
    return null;
  }

  // Transform plan data for components
  const mapStops = planData.route.stops.map(stop => ({
    id: stop.id,
    name: stop.name,
    lat: stop.lat,
    lng: stop.lng,
    type: stop.type,
  }));

  const timeline = aiPlan?.timeline || planData.route.stops.map((stop, idx) => ({
    time: stop.time || `${9 + idx * 2}:00`,
    activity: stop.name,
    location: stop.description || stop.name,
    notes: stop.duration ? `~${stop.duration} min` : undefined,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[var(--color-muted)] mb-2">
          <a href="/planner" className="hover:text-[var(--color-primary)]">Planner</a>
          <span>→</span>
          <span>Wyniki</span>
        </div>
        <h1 className="text-3xl font-bold">
          Plan: {location} · {duration} {duration === 1 ? 'dzień' : 'dni'}
        </h1>
        <p className="text-[var(--color-muted)] mt-2">
          {type === 'family' && '👨‍👩‍👧‍👦 Rodzinnie'}
          {type === 'trekking' && '🥾 Trekking'}
          {type === 'bike' && '🚴 Rowerem'}
          {type === 'relaks' && '🧘 Relaks'}
          {type === 'aktywnie' && '🚴 Aktywnie'}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column - Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map */}
          <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-5">
            <h2 className="text-lg font-bold mb-4">Mapa trasy</h2>
            <MapView
              route={planData.route.path}
              stops={mapStops}
              height="400px"
              showRoute={true}
            />
          </div>

          {/* Stats */}
          <StatsPanel
            distance={planData.stats.distance}
            duration={planData.stats.duration}
            elevation={planData.stats.elevation}
            difficulty={planData.stats.difficulty}
          />

          {/* Timeline */}
          <PlanTimeline timeline={timeline} loading={aiPlanLoading} />

          {/* Recommended Listings */}
          {listings.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-4">Polecane noclegi i atrakcje</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {listings.slice(0, 4).map(listing => (
                  <ListingCard
                    key={listing.id}
                    id={listing.id}
                    title={listing.title}
                    type={listing.type}
                    town={listing.town}
                    description={listing.description}
                    packageLevel={listing.packageLevel}
                    website={listing.website}
                    phone={listing.phone}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column - Sidebar */}
        <div className="space-y-6">
          {/* Export buttons */}
          <ExportButtons
            route={planData.route.path}
            stops={mapStops}
            planName={`${location} ${duration}d`}
          />

          {/* Weather */}
          <WeatherPanel
            lat={mapStops[0]?.lat}
            lng={mapStops[0]?.lng}
            locationName={location}
          />

          {/* CTA Box */}
          <div className="bg-gradient-to-br from-[var(--color-primary)] to-red-700 rounded-2xl p-6 text-white shadow-[0_20px_50px_rgba(227,6,19,0.3)]">
            <h3 className="text-xl font-bold mb-2">Podobał Ci się plan?</h3>
            <p className="text-sm text-white/90 mb-4">
              Zarezerwuj nocleg teraz lub wyślij zapytanie.
            </p>
            <a
              href="/listings?type=hotel"
              className="block w-full bg-white text-[var(--color-primary)] text-center font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              🏨 Znajdź nocleg
            </a>
          </div>
        </div>
      </div>

      {/* AI recommendations */}
      {aiPlan && aiPlan.tips.length > 0 && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-3 text-blue-900">💡 Wskazówki AI</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            {aiPlan.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="flex-shrink-0">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function PlannerResultPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-[var(--color-muted)]">Ładowanie...</p>
        </div>
      </div>
    }>
      <PlannerResultContent />
    </Suspense>
  );
}
