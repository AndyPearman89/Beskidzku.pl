
export interface Peak {
  id: string;
  name: string;
  slug: string;
  lat: number;
  lng: number;
  elevation: number;
  range: string;
  difficulty: "easy" | "moderate" | "hard" | "very_hard";
  hiking_time: number; // in minutes
  parking_lat?: number;
  parking_lng?: number;
  viewpoints?: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Runtime in-memory store (resets on restart — use DB in production)
export const runtimePeaksStore = new Map<string, Peak>();

// --- Seed demo data ---
function seedIfEmpty() {
  if (runtimePeaksStore.size > 0) return;

  const seed: Omit<Peak, "id" | "createdAt" | "updatedAt">[] = [
    {
      name: "Skrzyczne",
      slug: "skrzyczne",
      lat: 49.6850,
      lng: 19.0294,
      elevation: 1257,
      range: "Beskid Śląski",
      difficulty: "moderate",
      hiking_time: 180,
      parking_lat: 49.7120,
      parking_lng: 19.0300,
      viewpoints: ["Szczyrk", "Wisła", "Tatry"],
      description: "Najwyższy szczyt Beskidu Śląskiego z panoramicznym widokiem na Tatry. Dostępna kolej gondolowa lub szlaki piesze.",
    },
    {
      name: "Babia Góra",
      slug: "babia-gora",
      lat: 49.5736,
      lng: 19.5294,
      elevation: 1725,
      range: "Beskid Żywiecki",
      difficulty: "hard",
      hiking_time: 300,
      parking_lat: 49.5950,
      parking_lng: 19.5150,
      viewpoints: ["Tatry", "Beskidy", "Pieniny"],
      description: "Królowa Beskidów — najwyższy szczyt Beskidów z surowym klimatem górskim. Park Narodowy Babiogórski.",
    },
    {
      name: "Pilsko",
      slug: "pilsko",
      lat: 49.5531,
      lng: 19.3311,
      elevation: 1557,
      range: "Beskid Żywiecki",
      difficulty: "moderate",
      hiking_time: 240,
      parking_lat: 49.5650,
      parking_lng: 19.3200,
      viewpoints: ["Babia Góra", "Tatry", "Kotlina Żywiecka"],
      description: "Drugi szczyt Beskidów Żywieckich z obserwatorium meteorologicznym na szczycie.",
    },
    {
      name: "Barania Góra",
      slug: "barania-gora",
      lat: 49.6194,
      lng: 18.9142,
      elevation: 1220,
      range: "Beskid Śląski",
      difficulty: "easy",
      hiking_time: 150,
      parking_lat: 49.6400,
      parking_lng: 18.9000,
      viewpoints: ["Wisła", "Ustroń", "Beskidy"],
      description: "Łagodny szczyt na granicy polsko-czeskiej. Łatwe szlaki i rodzinne wycieczki.",
    },
    {
      name: "Wielka Racza",
      slug: "wielka-racza",
      lat: 49.5092,
      lng: 19.1906,
      elevation: 1236,
      range: "Beskid Żywiecki",
      difficulty: "moderate",
      hiking_time: 210,
      parking_lat: 49.5200,
      parking_lng: 19.1800,
      viewpoints: ["Pilsko", "Babia Góra", "Tatry"],
      description: "Szczyt na granicy polsko-słowackiej z pięknymi widokami na Tatry. Część Korony Gór Polski.",
    },
    {
      name: "Równica",
      slug: "rownica",
      lat: 49.6869,
      lng: 19.0742,
      elevation: 1061,
      range: "Beskid Śląski",
      difficulty: "easy",
      hiking_time: 120,
      parking_lat: 49.7100,
      parking_lng: 19.0700,
      viewpoints: ["Szczyrk", "Skrzyczne", "Beskidy"],
      description: "Popularny szczyt w Szczyrku z licznymi szlakami i wyciągami narciarskimi.",
    },
    {
      name: "Czantoria Wielka",
      slug: "czantoria-wielka",
      lat: 49.7031,
      lng: 18.7753,
      elevation: 995,
      range: "Beskid Śląski",
      difficulty: "easy",
      hiking_time: 90,
      parking_lat: 49.7200,
      parking_lng: 18.7900,
      viewpoints: ["Ustroń", "Wisła", "Beskidy"],
      description: "Dostępny szczyt z Ustronia z licznymi szlakami turystycznymi i rowerowymi.",
    },
    {
      name: "Klimczok",
      slug: "klimczok",
      lat: 49.7181,
      lng: 19.0925,
      elevation: 1117,
      range: "Beskid Śląski",
      difficulty: "moderate",
      hiking_time: 150,
      parking_lat: 49.7300,
      parking_lng: 19.1000,
      viewpoints: ["Bielsko-Biała", "Szczyrk", "Beskidy"],
      description: "Szczyt nad Szczyrkiem z kamiennymi formacjami na grzbiecie.",
    },
  ];

  for (const item of seed) {
    const now = new Date().toISOString();
    const id = `peak_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    runtimePeaksStore.set(id, { ...item, id, createdAt: now, updatedAt: now });
  }
}

// --- CRUD helpers ---

export function getPeaks(filters?: {
  range?: string;
  difficulty?: Peak["difficulty"];
  minElevation?: number;
  maxElevation?: number;
  page?: number;
  perPage?: number;
}): { items: Peak[]; total: number; page: number; perPage: number } {
  seedIfEmpty();

  let items = [...runtimePeaksStore.values()];

  if (filters?.range) {
    const r = filters.range.toLowerCase();
    items = items.filter((p) => p.range.toLowerCase().includes(r));
  }
  if (filters?.difficulty) {
    items = items.filter((p) => p.difficulty === filters.difficulty);
  }
  if (filters?.minElevation !== undefined) {
    items = items.filter((p) => p.elevation >= filters.minElevation!);
  }
  if (filters?.maxElevation !== undefined) {
    items = items.filter((p) => p.elevation <= filters.maxElevation!);
  }

  const total = items.length;
  const page = filters?.page ?? 1;
  const perPage = filters?.perPage ?? 20;
  const start = (page - 1) * perPage;

  // Sort by elevation (highest first)
  items.sort((a, b) => b.elevation - a.elevation);

  return { items: items.slice(start, start + perPage), total, page, perPage };
}

export function getPeak(id: string): Peak | null {
  seedIfEmpty();
  return runtimePeaksStore.get(id) ?? null;
}

export function getPeakBySlug(slug: string): Peak | null {
  seedIfEmpty();
  for (const peak of runtimePeaksStore.values()) {
    if (peak.slug === slug) return peak;
  }
  return null;
}

export function getNearbyPeaks(lat: number, lng: number, radiusKm: number = 20): Peak[] {
  seedIfEmpty();

  const peaks = [...runtimePeaksStore.values()];

  // Haversine formula to calculate distance
  function distance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  return peaks
    .map((peak) => ({
      peak,
      distance: distance(lat, lng, peak.lat, peak.lng),
    }))
    .filter((item) => item.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance)
    .map((item) => item.peak);
}

export function createPeak(data: Omit<Peak, "id" | "createdAt" | "updatedAt">): Peak {
  const now = new Date().toISOString();
  const id = `peak_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const peak: Peak = { ...data, id, createdAt: now, updatedAt: now };
  runtimePeaksStore.set(id, peak);
  return peak;
}

export function updatePeak(id: string, data: Partial<Omit<Peak, "id" | "createdAt">>): Peak | null {
  const existing = runtimePeaksStore.get(id);
  if (!existing) return null;
  const updated: Peak = { ...existing, ...data, id, updatedAt: new Date().toISOString() };
  runtimePeaksStore.set(id, updated);
  return updated;
}

export function deletePeak(id: string): boolean {
  return runtimePeaksStore.delete(id);
}
