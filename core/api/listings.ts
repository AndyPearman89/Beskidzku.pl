
export type PackageLevel = "FREE" | "PREMIUM" | "PREMIUM+";

export interface Listing {
  id: string;
  title: string;
  type: string;
  category: string;
  town: string;
  lat?: number;
  lng?: number;
  address: string;
  description: string;
  phone?: string;
  website?: string;
  email?: string;
  amenities?: string[];
  packageLevel: PackageLevel;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
}

// Runtime in-memory store (resets on restart — use DB in production)
export const runtimeListingsStore = new Map<string, Listing>();

// --- Seed demo data ---
function seedIfEmpty() {
  if (runtimeListingsStore.size > 0) return;

  const seed: Omit<Listing, "id" | "createdAt" | "updatedAt">[] = [
    {
      title: "Hotel Szczyrk Mountain Resort",
      type: "hotel",
      category: "nocleg",
      town: "Szczyrk",
      lat: 49.7156,
      lng: 19.0343,
      address: "ul. Myśliwska 2, 43-370 Szczyrk",
      description: "Czterogwiazdkowy hotel u podnóża Skrzycznego z aquaparkiem i SPA. Idealne miejsce dla rodzin i par szukających komfortu w górach.",
      phone: "+48 33 829 80 00",
      website: "https://szczyrk-mountain-resort.pl",
      amenities: ["aquapark", "SPA", "restaurant", "parking", "wifi"],
      packageLevel: "PREMIUM+",
    },
    {
      title: "Restauracja Regionalka",
      type: "restaurant",
      category: "gastronomia",
      town: "Wisła",
      lat: 49.6504,
      lng: 18.8565,
      address: "ul. 1 Maja 10, 43-460 Wisła",
      description: "Tradycyjna kuchnia beskidzka — żurek, gołąbki, oscypek. Serwujemy regionalne potrawy z lokalnych składników.",
      phone: "+48 33 855 12 34",
      amenities: ["parking", "wifi", "outdoor seating"],
      packageLevel: "PREMIUM",
    },
    {
      title: "Browar Żywiec",
      type: "attraction",
      category: "atrakcja",
      town: "Żywiec",
      lat: 49.6888,
      lng: 19.1979,
      address: "ul. Browarna 88, 34-300 Żywiec",
      description: "Muzeum browaru z degustacją i zwiedzaniem. Jeden z najstarszych browarów w Polsce — historia sięgająca 1856 roku.",
      phone: "+48 33 861 22 00",
      website: "https://zywieckibrowar.pl",
      amenities: ["guided tours", "tasting"],
      packageLevel: "PREMIUM+",
    },
    {
      title: "Zamek Sucha Beskidzka",
      type: "attraction",
      category: "atrakcja",
      town: "Sucha Beskidzka",
      lat: 49.7399,
      lng: 19.5974,
      address: "ul. Zamkowa 1, 34-200 Sucha Beskidzka",
      description: "Renesansowy zamek z XVI w. — ekspozycje historyczne i widok na Beskid Makowski. Idealne miejsce na rodzinną wycieczkę.",
      amenities: ["guided tours", "parking"],
      packageLevel: "FREE",
    },
    {
      title: "SPA Ustroń Health Resort",
      type: "spa",
      category: "zdrowie",
      town: "Ustroń",
      lat: 49.7197,
      lng: 18.8090,
      address: "ul. Zdrojowa 14, 43-450 Ustroń",
      description: "Uzdrowiskowy ośrodek SPA z basenami termalnymi i zabiegami leczniczymi. Najlepsze SPA w Beskidach Śląskich.",
      phone: "+48 33 854 31 00",
      amenities: ["thermal pools", "massage", "sauna", "restaurant"],
      packageLevel: "PREMIUM",
    },
    {
      title: "Pensjonat Górski Widok",
      type: "hotel",
      category: "nocleg",
      town: "Wisła",
      lat: 49.6590,
      lng: 18.8620,
      address: "ul. Górska 5, 43-460 Wisła",
      description: "Rodzinny pensjonat z widokiem na Baranią Górę. Domowa atmosfera, śniadania, parking.",
      phone: "+48 33 855 44 22",
      amenities: ["breakfast", "parking", "wifi", "terrace"],
      packageLevel: "PREMIUM",
    },
    {
      title: "Kolej Gondolowa Szczyrk",
      type: "attraction",
      category: "atrakcja",
      town: "Szczyrk",
      lat: 49.7120,
      lng: 19.0300,
      address: "ul. Gondolowa 1, 43-370 Szczyrk",
      description: "Nowoczesna kolej gondolowa na Skrzyczne (1257 m n.p.m.). Panoramiczne widoki na Beskidy. Czynna całorocznie.",
      phone: "+48 33 829 85 00",
      website: "https://gondola.szczyrk.pl",
      amenities: ["parking", "restaurant at top", "wifi"],
      packageLevel: "PREMIUM+",
    },
    {
      title: "Hostel Trekker Bielsko-Biała",
      type: "hotel",
      category: "nocleg",
      town: "Bielsko-Biała",
      lat: 49.8220,
      lng: 19.0440,
      address: "ul. Wzgórze 8, 43-300 Bielsko-Biała",
      description: "Budżetowy hostel w centrum Bielska-Białej. Doskonały punkt startowy do Beskidów. Pokoje wieloosobowe i prywatne.",
      phone: "+48 33 812 10 10",
      amenities: ["wifi", "kitchen", "lockers"],
      packageLevel: "FREE",
    },
    {
      title: "Restauracja Pod Skrzycznem",
      type: "restaurant",
      category: "gastronomia",
      town: "Szczyrk",
      lat: 49.7180,
      lng: 19.0370,
      address: "ul. Myśliwska 44, 43-370 Szczyrk",
      description: "Restauracja serwująca dania kuchni góralskiej i europejskiej. Polecamy żeberka po góralsku i oscypek z żurawiną.",
      phone: "+48 33 829 90 10",
      amenities: ["parking", "outdoor seating", "wifi"],
      packageLevel: "PREMIUM",
    },
    {
      title: "Skocznia Wisła Adam Małysz",
      type: "attraction",
      category: "atrakcja",
      town: "Wisła",
      lat: 49.6730,
      lng: 18.8680,
      address: "ul. Kopiec 4, 43-460 Wisła",
      description: "Kompleks skoczni narciarskich im. Adama Małysza. Centrum wydarzeń Pucharu Świata w skokach narciarskich.",
      phone: "+48 33 855 25 25",
      website: "https://wisla.pl/skocznia",
      amenities: ["parking", "guided tours"],
      packageLevel: "PREMIUM",
    },
  ];

  for (const item of seed) {
    const now = new Date().toISOString();
    const id = `listing_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    runtimeListingsStore.set(id, { ...item, id, createdAt: now, updatedAt: now });
  }
}

// --- CRUD helpers ---

export function getListings(filters?: {
  type?: string;
  town?: string;
  q?: string;
  page?: number;
  perPage?: number;
}): { items: Listing[]; total: number; page: number; perPage: number } {
  seedIfEmpty();

  let items = [...runtimeListingsStore.values()];

  if (filters?.type) {
    items = items.filter((l) => l.type === filters.type);
  }
  if (filters?.town) {
    const t = filters.town.toLowerCase();
    items = items.filter((l) => l.town.toLowerCase().includes(t));
  }
  if (filters?.q) {
    const q = filters.q.toLowerCase();
    items = items.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.town.toLowerCase().includes(q)
    );
  }

  const PACKAGE_PRIORITY: Record<PackageLevel, number> = { "PREMIUM+": 0, "PREMIUM": 1, "FREE": 2 };

  const total = items.length;
  const page = filters?.page ?? 1;
  const perPage = filters?.perPage ?? 20;
  const start = (page - 1) * perPage;

  // Sort by package level priority (PREMIUM+ first)
  items.sort((a, b) => PACKAGE_PRIORITY[a.packageLevel] - PACKAGE_PRIORITY[b.packageLevel]);

  return { items: items.slice(start, start + perPage), total, page, perPage };
}

export function getListing(id: string): Listing | null {
  seedIfEmpty();
  return runtimeListingsStore.get(id) ?? null;
}

export function createListing(data: Omit<Listing, "id" | "createdAt" | "updatedAt">): Listing {
  const now = new Date().toISOString();
  const id = `listing_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const listing: Listing = { ...data, id, createdAt: now, updatedAt: now };
  runtimeListingsStore.set(id, listing);
  return listing;
}

export function updateListing(id: string, data: Partial<Omit<Listing, "id" | "createdAt">>): Listing | null {
  const existing = runtimeListingsStore.get(id);
  if (!existing) return null;
  const updated: Listing = { ...existing, ...data, id, updatedAt: new Date().toISOString() };
  runtimeListingsStore.set(id, updated);
  return updated;
}

export function deleteListing(id: string): boolean {
  return runtimeListingsStore.delete(id);
}
