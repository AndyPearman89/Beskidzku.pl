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
  layout.tsx        # Root layout
  page.tsx          # Strona główna
  listings/
    page.tsx        # Katalog firm
  api/
    listings/
      route.ts      # CRUD API dla listings
core/
  api/
    listings.ts     # Logika biznesowa
    listingAccess.ts # Autoryzacja
public/
  # Statyczne zasoby
```

## Zmienne środowiskowe

```env
LISTINGS_ADMIN_KEY=<wygenerowany_klucz>
NEXT_PUBLIC_SITE_URL=https://beskidzku.pl
```

## Wdrożenie

```bash
npm run build
pm2 start npm --name "beskidzku-app" -- start -- -p 3003
```
