import { notFound } from "next/navigation";

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
      title: "Hotel Ośrodek Szczyrk Mountain Resort",
      type: "hotel",
      category: "nocleg",
      town: "Szczyrk",
      lat: 49.7156,
      lng: 19.0343,
      address: "ul. Myśliwska 2, 43-370 Szczyrk",
      description: "Czterogwiazdkowy hotel u podnóża Skrzycznego z aquaparkiem i SPA.",
      phone: "+48 33 829 80 00",
      website: "https://szczyrk-mountain-resort.pl",
    },
    {
      title: "Restauracja Regionalka",
      type: "restaurant",
      category: "gastronomia",
      town: "Wisła",
      lat: 49.6504,
      lng: 18.8565,
      address: "ul. 1 Maja 10, 43-460 Wisła",
      description: "Tradycyjna kuchnia beskidzka — żurek, gołąbki, oscypek.",
      phone: "+48 33 855 12 34",
    },
    {
      title: "Browar Żywiec",
      type: "attraction",
      category: "atrakcja",
      town: "Żywiec",
      lat: 49.6888,
      lng: 19.1979,
      address: "ul. Browarna 88, 34-300 Żywiec",
      description: "Muzeum browaru z degustacją i zwiedzaniem. Jeden z najstarszych browarów w Polsce.",
      phone: "+48 33 861 22 00",
      website: "https://zywieckibrowar.pl",
    },
    {
      title: "Zamek Sucha Beskidzka",
      type: "attraction",
      category: "atrakcja",
      town: "Sucha Beskidzka",
      lat: 49.7399,
      lng: 19.5974,
      address: "ul. Zamkowa 1, 34-200 Sucha Beskidzka",
      description: "Renesansowy zamek z XVI w. — ekspozycje historyczne i widok na Beskid Makowski.",
    },
    {
      title: "SPA Ustroń Health Resort",
      type: "spa",
      category: "zdrowie",
      town: "Ustroń",
      lat: 49.7197,
      lng: 18.8090,
      address: "ul. Zdrojowa 14, 43-450 Ustroń",
      description: "Uzdrowiskowy ośrodek SPA z basenami termalnymi i zabiegami leczniczymi.",
      phone: "+48 33 854 31 00",
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

  const total = items.length;
  const page = filters?.page ?? 1;
  const perPage = filters?.perPage ?? 20;
  const start = (page - 1) * perPage;

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
