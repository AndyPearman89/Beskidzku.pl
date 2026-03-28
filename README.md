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

Kanoniczny opis produktu i architektury znajduje się w pliku `public/system-specyfikacja.txt` (dostępny pod `/system-specyfikacja.txt` po uruchomieniu aplikacji).

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
