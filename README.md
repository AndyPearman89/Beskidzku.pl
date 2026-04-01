# Beskidzku.pl

Lokalny katalog firm i atrakcji regionu Beskidów — Żywiec, Sucha Beskidzka, Wisła, Szczyrk, Bielsko-Biała.

## Stack

- **Next.js 16** (App Router, standalone output)
- **TypeScript 5**
- **Tailwind CSS 4**
- **Leaflet** (mapy OSM)

## Uruchomienie

```bash
npm install
npm run dev
```

## Struktura

```
app/
  layout.tsx           # Root layout (nagłówek, stopka, meta)
  page.tsx             # Strona główna z kategoriami i miastami
  globals.css          # Style globalne (Tailwind)
  listings/
    page.tsx           # Strona katalogu firm z filtrowaniem
  api/
    listings/
      route.ts         # GET/POST dla kolekcji listings
      [id]/
        route.ts       # GET/PUT/DELETE dla pojedynczego listing
core/
  api/
    listings.ts        # Logika biznesowa i walidacja
    listingAccess.ts   # Autoryzacja zapisu (klucz admin)
public/
  # Statyczne zasoby (katalog jeszcze nie utworzony)
```

## Specyfikacja systemu

Kanoniczny opis produktu i architektury znajduje się w następujących plikach:

- **`SYSTEM_SPECIFICATION.txt`** — pełna specyfikacja systemu (EN)
- **`public/system-specyfikacja.txt`** — specyfikacja w języku polskim (dostępna pod `/system-specyfikacja.txt` po uruchomieniu aplikacji)
- **`FRONTPAGE_V3_IMPLEMENTATION.md`** — szczegółowa checklista implementacji strony głównej v3.0 z analizą luk

### Frontpage v3.0 (Issue #12)

Strona główna została zaimplementowana zgodnie z Issue #12 i zawiera:

- ✅ Hero z formularzem planowania (gdzie, kiedy, z kim)
- ✅ Quick start — gotowe scenariusze wycieczek
- ✅ Mapa + lista — discovery engine z filtrowaniem
- ✅ Interaktywny planner z Haversine distance
- ✅ Bloki noclegów z CTAs (Zobacz, Zapytaj)
- ✅ Integracja pogody na żywo (Open-Meteo API)
- ✅ Moduł parkingów
- ✅ Gotowe plany (SEO landing pages)
- ✅ Final CTA (konwersja)
- ⏳ Bottom sheet mobile (pending)
- ⏳ Różnicowanie markerów według pakietu (pending)
- ⏳ AdSense (pending)

Szczegóły: zobacz `FRONTPAGE_V3_IMPLEMENTATION.md`

## Zmienne środowiskowe

Skopiuj `.env.example` do `.env.local` i uzupełnij wartości:

```env
LISTINGS_ADMIN_KEY=<wygenerowany_klucz>
NEXT_PUBLIC_SITE_URL=https://beskidzku.pl
NEXT_PUBLIC_SITE_NAME=Beskidzku.pl
```

## API

### Endpointy

**GET /api/listings** — Pobierz listę firm
Query params: `q` (wyszukiwanie), `type` (kategoria), `town` (miejscowość)

**POST /api/listings** — Dodaj nową firmę
Wymaga nagłówka: `X-Admin-Key: <LISTINGS_ADMIN_KEY>`

**GET /api/listings/[id]** — Pobierz szczegóły firmy

**PUT /api/listings/[id]** — Aktualizuj firmę
Wymaga nagłówka: `X-Admin-Key: <LISTINGS_ADMIN_KEY>`

**DELETE /api/listings/[id]** — Usuń firmę
Wymaga nagłówka: `X-Admin-Key: <LISTINGS_ADMIN_KEY>`

## Wdrożenie

```bash
npm run build
pm2 start npm --name "beskidzku-app" -- start -- -p 3003
```
