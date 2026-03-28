import type { Metadata } from "next";
import { getListings } from "@/core/api/listings";

export const metadata: Metadata = {
  title: "Beskidzku.pl — Planner Beskidów",
  description: "Zaplanuj Beskidy w 30 sekund. Wybierz miejsce, termin i styl — dostaniesz gotowy plan, noclegi i atrakcje.",
};

const QUICK_OPTIONS = [
  { label: "👨‍👩‍👧‍👦 z dziećmi", value: "rodzina" },
  { label: "🥾 trekking", value: "trekking" },
  { label: "🧘 chill", value: "relaks" },
  { label: "🚴 aktywnie", value: "aktywnie" },
];

const QUICK_START = [
  { title: "Weekend w Beskidach", params: "q=weekend&style=aktywnie", meta: "2 dni · top trasy + nocleg" },
  { title: "Dla rodzin", params: "q=rodzina&style=z-dziecmi", meta: "spokojne szlaki + atrakcje dla dzieci" },
  { title: "Najlepsze szlaki", params: "q=szlaki&style=trekking", meta: "widokowe + parking startowy" },
  { title: "Jeziora", params: "q=jeziora&style=chill", meta: "plaże, pomosty, rowerki" },
];

const PLANNER_POINTS = [
  { label: "Parking start", detail: "Szczyrk — 180 miejsc · darmowy", meta: "Nawigacja 09:00" },
  { label: "Szlak / trasa", detail: "Skrzyczne via Małe Skrzyczne", meta: "9.2 km · 4h · +640 m" },
  { label: "Atrakcja", detail: "Kolej gondolowa, punkt widokowy", meta: "widoki + foto spot" },
  { label: "Nocleg", detail: "Hotel Szczyrk Mountain Resort ★★★★", meta: "SPA · śniadanie · 9.2/10" },
];

const STAYS = [
  { name: "Hotel Szczyrk Mountain Resort", town: "Szczyrk", rating: "9.2", badge: "PREMIUM+", price: "od 420 zł" },
  { name: "Regionalka Apart", town: "Wisła", rating: "8.8", badge: "PREMIUM", price: "od 320 zł" },
  { name: "Zamek Sucha Beskidzka", town: "Sucha Beskidzka", rating: "9.0", badge: "FREE", price: "kontakt" },
];

const READY_PLANS = [
  { title: "1 dzień w Beskidach", desc: "parking → szlak → atrakcja → obiad", tag: "szybko" },
  { title: "Weekend dla par", desc: "widoki + nocleg z SPA + kolacja", tag: "romantycznie" },
  { title: "Top atrakcje Wisła", desc: "skocznia, deptak, browar", tag: "family" },
  { title: "Beskidy z dziećmi", desc: "łatwe trasy + place zabaw + jezioro", tag: "kids" },
];

const WEATHER = {
  temp: "21°C",
  status: "dobre warunki",
  alert: "Możliwe burze po południu — zaplanuj start wcześniej",
};

const PARKINGS = [
  { name: "Szczyrk Gondola", spots: "180 miejsc", type: "płatny", distance: "50 m do kolejki" },
  { name: "Wisła Centrum", spots: "120 miejsc", type: "darmowy 2h", distance: "300 m deptak" },
];

export default function HomePage() {
  const featuredListings = getListings({ perPage: 4 }).items;

  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Hero / planner entry */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-16 pb-12">
        <div className="relative overflow-hidden rounded-[28px] bg-white border border-[var(--color-border)] shadow-[0_30px_80px_rgba(0,0,0,0.07)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-soft)] via-white to-white" />
          <div className="relative grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] px-4 py-2 text-xs font-semibold uppercase tracking-wide">
                Planner Beskidów
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
                Zaplanuj Beskidy w <span className="text-[var(--color-primary)]">30 sekund</span>
              </h1>
              <p className="text-lg text-[var(--color-muted)] max-w-xl">
                Wybierz miejsce, termin i styl. Dostaniesz gotowy plan dnia, mapę i noclegi do wyboru.
              </p>
              <form
                action="/listings"
                method="get"
                className="bg-white/70 backdrop-blur rounded-2xl border border-[var(--color-border)] shadow-sm p-4 grid grid-cols-1 md:grid-cols-4 gap-3"
              >
                <div className="col-span-1 md:col-span-2">
                  <label className="text-xs font-semibold text-[var(--color-muted)]">Gdzie?</label>
                  <input
                    name="q"
                    type="text"
                    placeholder="np. Szczyrk, Wisła, Żywiec"
                    className="mt-2 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--color-muted)]">Kiedy?</label>
                  <input
                    name="when"
                    type="text"
                    placeholder="Weekend / konkretny termin"
                    className="mt-2 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--color-muted)]">Z kim?</label>
                  <select
                    name="who"
                    className="mt-2 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    defaultValue=""
                  >
                    <option value="">Wybierz</option>
                    <option value="rodzina">Rodzina / dzieci</option>
                    <option value="para">Para</option>
                    <option value="friends">Znajomi</option>
                    <option value="solo">Solo</option>
                  </select>
                </div>
                <div className="md:col-span-4 flex flex-wrap items-center gap-2 pt-1">
                  {QUICK_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      name="style"
                      value={option.value}
                      type="submit"
                      className="rounded-full border border-[var(--color-border)] px-3 py-2 text-sm font-semibold text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                    >
                      {option.label}
                    </button>
                  ))}
                  <button
                    type="submit"
                    className="ml-auto inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-[var(--color-primary-hover)] transition-colors shadow-[0_15px_35px_rgba(227,6,19,0.18)]"
                  >
                    Generuj plan
                    <span aria-hidden>→</span>
                  </button>
                </div>
              </form>
              <div className="flex flex-wrap gap-4 text-sm text-[var(--color-muted)]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                  120+ noclegów
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-black" />
                  80+ atrakcji
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Pogoda i parking w planie
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-[0_20px_40px_rgba(0,0,0,0.06)] p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-[var(--color-muted)] font-semibold uppercase">Podgląd planu</p>
                  <h3 className="text-xl font-bold mt-1">Szczyrk — gotowy dzień</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] text-xs font-semibold">
                  4 kroki
                </span>
              </div>
              <div className="space-y-3">
                {PLANNER_POINTS.map((point, idx) => (
                  <div
                    key={point.label}
                    className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] px-4 py-3 bg-[var(--color-bg)]"
                  >
                    <div className="mt-1 h-8 w-8 rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-bold flex items-center justify-center">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{point.label}</p>
                      <p className="text-sm text-[var(--color-muted)]">{point.detail}</p>
                      <p className="text-xs text-[var(--color-primary)] font-semibold mt-1">{point.meta}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a
                href="#planner"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] text-white font-semibold py-3 hover:bg-[var(--color-primary-hover)] transition-colors"
              >
                Zobacz planner
                <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick start presets */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">Quick start</p>
            <h2 className="text-2xl font-bold">Gotowe wejścia do plannera</h2>
          </div>
          <a href="/listings" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
            Wszystkie scenariusze
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_START.map((preset) => (
            <a
              key={preset.title}
              href={`/listings?${preset.params}`}
              className="group rounded-2xl bg-white border border-[var(--color-border)] p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold">{preset.title}</h3>
                <span className="text-[var(--color-primary)] text-lg group-hover:translate-x-1 transition-transform">→</span>
              </div>
              <p className="text-sm text-[var(--color-muted)] mt-2">{preset.meta}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Discovery map + list */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" id="planner">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">Mapa + lista</p>
            <h2 className="text-2xl font-bold">Odkrywaj i filtruj w jednym miejscu</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <span className="h-3 w-3 rounded-full bg-gray-300" /> FREE
            <span className="h-3 w-3 rounded-full bg-[var(--color-primary)]" /> PREMIUM
            <span className="px-2 py-1 text-xs rounded-full border border-[var(--color-primary)] text-[var(--color-primary)]">
              PREMIUM+
            </span>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          <div className="rounded-2xl bg-white border border-[var(--color-border)] shadow-sm p-5 space-y-4">
            <div className="flex flex-wrap gap-2">
              {["noclegi", "atrakcje", "szlaki"].map((filter) => (
                <button
                  key={filter}
                  className="px-3 py-2 rounded-full border border-[var(--color-border)] text-sm font-semibold hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                  type="button"
                >
                  {filter}
                </button>
              ))}
              <button
                type="button"
                className="px-3 py-2 rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold shadow-[0_12px_24px_rgba(227,6,19,0.14)]"
              >
                Sortuj: popularność
              </button>
            </div>
            <div className="space-y-3">
              {featuredListings.map((listing) => (
                <a
                  key={listing.id}
                  href={`/listings?q=${encodeURIComponent(listing.title)}`}
                  className="block rounded-xl border border-[var(--color-border)] p-4 hover:border-[var(--color-primary)] hover:shadow-md transition-all bg-[var(--color-bg)]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm uppercase tracking-wide text-[var(--color-muted)]">{listing.type}</p>
                      <h3 className="text-lg font-semibold leading-tight">{listing.title}</h3>
                      <p className="text-sm text-[var(--color-muted)]">
                        📍 {listing.town} · {listing.address || "adres wkrótce"}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-semibold">
                      PREMIUM
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text)] mt-2 line-clamp-2">{listing.description}</p>
                </a>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#ffecef] via-white to-[#f6f7f9] border border-[var(--color-border)] shadow-[0_25px_50px_rgba(0,0,0,0.08)] p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">Mapa</p>
                <h3 className="text-xl font-bold">Markery premium wyróżnione</h3>
              </div>
              <span className="text-[var(--color-primary)] font-semibold text-sm bg-white border border-[var(--color-border)] px-3 py-1.5 rounded-full shadow-sm">
                Widok live
              </span>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl bg-white border border-[var(--color-border)] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(227,6,19,0.08),transparent_45%),radial-gradient(circle_at_70%_60%,rgba(0,0,0,0.05),transparent_40%)]" />
              <div className="absolute inset-0">
                {featuredListings.slice(0, 4).map((listing, idx) => {
                  const positions = [
                    { top: "18%", left: "22%" },
                    { top: "45%", left: "68%" },
                    { top: "62%", left: "30%" },
                    { top: "28%", left: "52%" },
                  ];
                  const pos = positions[idx] ?? { top: "40%", left: "50%" };
                  return (
                    <div
                      key={listing.id}
                      className="absolute flex flex-col items-center gap-1"
                      style={pos}
                    >
                      <div className="relative">
                        <span className="absolute -inset-2 rounded-full bg-[var(--color-primary-soft)] blur-sm" />
                        <span className="relative inline-flex items-center justify-center h-9 w-9 rounded-full bg-[var(--color-primary)] text-white shadow-[0_15px_30px_rgba(227,6,19,0.4)]">
                          {listing.type.slice(0, 1).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs font-semibold bg-white border border-[var(--color-border)] rounded-full px-3 py-1 shadow-sm">
                        {listing.town}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="mt-4 text-sm text-[var(--color-muted)]">
              Hover/klik = podświetlenie na mapie · PREMIUM czerwone · FREE neutralne.
            </p>
          </div>
        </div>
      </section>

      {/* Planner module */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">Planner</p>
            <h2 className="text-2xl font-bold">Lista punktów + CTA lead / booking</h2>
          </div>
          <a href="/listings?type=hotel" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
            Dodaj nocleg do planu
          </a>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-2xl bg-white border border-[var(--color-border)] shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">Trasa</p>
                <h3 className="text-lg font-bold">Plan dnia · 9.2 km · 4h</h3>
              </div>
              <span className="text-[var(--color-primary)] font-semibold text-sm bg-[var(--color-primary-soft)] px-3 py-1.5 rounded-full">
                Zapisz plan
              </span>
            </div>
            <div className="space-y-3">
              {PLANNER_POINTS.map((point, idx) => (
                <div
                  key={point.detail}
                  className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] px-4 py-3 bg-[var(--color-bg)]"
                >
                  <div className="h-10 w-10 rounded-full bg-white border border-[var(--color-border)] shadow-sm flex items-center justify-center font-bold text-[var(--color-text)]">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{point.label}</p>
                    <p className="text-sm text-[var(--color-muted)]">{point.detail}</p>
                    <p className="text-xs text-[var(--color-primary)] font-semibold mt-1">{point.meta}</p>
                  </div>
                  <button
                    type="button"
                    className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
                  >
                    Zmień
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-[var(--color-border)] shadow-sm p-5 space-y-4">
            <div className="rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-semibold px-4 py-3">
              CTA: ZAREZERWUJ / ZAPYTAJ
            </div>
            <p className="text-sm text-[var(--color-muted)]">
              Wybierz nocleg i dokończ rezerwację. Brak dostępności? Zostaw zapytanie — odpowiemy w 15 minut.
            </p>
            <div className="space-y-3">
              {STAYS.map((stay) => (
                <div key={stay.name} className="rounded-xl border border-[var(--color-border)] p-4 bg-[var(--color-bg)]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-[var(--color-muted)] uppercase">Nocleg</p>
                      <h4 className="font-semibold">{stay.name}</h4>
                      <p className="text-sm text-[var(--color-muted)]">📍 {stay.town}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full border border-[var(--color-primary)] text-[var(--color-primary)] font-semibold">
                      {stay.badge}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-sm font-semibold">
                    <span>⭐ {stay.rating}</span>
                    <span className="text-[var(--color-primary)]">{stay.price}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <a
                      href="/listings?type=hotel"
                      className="text-center rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold py-2 hover:bg-[var(--color-primary-hover)] transition-colors"
                    >
                      Zobacz
                    </a>
                    <a
                      href="/listings?type=hotel&cta=lead"
                      className="text-center rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] text-sm font-semibold py-2 hover:bg-[var(--color-primary-soft)] transition-colors"
                    >
                      Zapytaj
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Weather + parking */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-2xl bg-white border border-[var(--color-border)] shadow-sm p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">Pogoda</p>
                <h3 className="text-lg font-bold">Warunki na dziś</h3>
              </div>
              <span className="px-3 py-1.5 text-sm rounded-full bg-[#e8f5e9] text-green-700 font-semibold">
                {WEATHER.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-3xl font-extrabold">
              {WEATHER.temp}
              <span className="text-sm text-[var(--color-muted)] font-semibold">Wisła · Szczyrk · Żywiec</span>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-sm font-semibold px-4 py-3">
              ⚠ {WEATHER.alert}
            </div>
            <p className="text-sm text-[var(--color-muted)]">
              Planner automatycznie przesunie start trasy i zaproponuje indoor/jezioro jeśli pogoda się pogorszy.
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-[var(--color-border)] shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Parking</h3>
              <span className="text-xs font-semibold text-[var(--color-muted)]">live</span>
            </div>
            {PARKINGS.map((p) => (
              <div key={p.name} className="rounded-xl border border-[var(--color-border)] p-4 bg-[var(--color-bg)]">
                <p className="text-sm font-semibold">{p.name}</p>
                <p className="text-sm text-[var(--color-muted)]">{p.spots} · {p.type}</p>
                <p className="text-xs text-[var(--color-primary)] font-semibold mt-1">{p.distance}</p>
                <a
                  href="/listings?type=attraction"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] mt-2 hover:underline"
                >
                  Nawiguj
                  <span aria-hidden>→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ready plans */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">Gotowe plany</p>
            <h2 className="text-2xl font-bold">Kliknij i startuj</h2>
          </div>
          <a href="/listings?q=plan" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
            Więcej planów
          </a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {READY_PLANS.map((plan) => (
            <a
              key={plan.title}
              href={`/listings?preset=${encodeURIComponent(plan.title)}`}
              className="group rounded-2xl bg-white border border-[var(--color-border)] p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold">{plan.title}</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-semibold">
                  {plan.tag}
                </span>
              </div>
              <p className="text-sm text-[var(--color-muted)] mt-2">{plan.desc}</p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] mt-3">
                Otwórz planner <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-[28px] bg-[var(--color-primary)] text-white p-8 md:p-12 shadow-[0_30px_80px_rgba(227,6,19,0.35)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <p className="text-xs uppercase font-semibold tracking-wide text-white/80">Konwersja</p>
              <h3 className="text-3xl font-bold">Nie trać czasu — zaplanuj teraz</h3>
              <p className="text-white/85 text-sm max-w-xl">
                Planner, noclegi, mapy i pogoda w jednym miejscu. Jeden klik = gotowy plan albo zapytanie do noclegu.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="/listings?q=planner"
                className="inline-flex items-center justify-center bg-white text-[var(--color-primary)] font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Zaplanuj
              </a>
              <a
                href="/listings?type=hotel"
                className="inline-flex items-center justify-center bg-transparent border border-white text-white font-semibold px-6 py-3 rounded-xl hover:bg-white hover:text-[var(--color-primary)] transition-colors"
              >
                Znajdź nocleg
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
