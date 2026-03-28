# Smoke Test Report — 2026-03-26

Repo: `AndyPearman89/Beskidzku.pl`
Stack: Next.js 16 + TypeScript + Tailwind CSS 4

## Zakres
- Dostępność: strona główna, katalog firm, REST API
- Testowane warianty: HTTPS (pierwotny) i HTTP (fallback)
- Aplikacja: Next.js App Router

## Wyniki
### HTTPS
- `https://beskidzku.pl/` => błąd połączenia (żądanie nie zostało wysłane)
- `https://beskidzku.pl/listings` => błąd połączenia
- `https://beskidzku.pl/api/listings` => błąd połączenia
- `https://www.beskidzku.pl/` => błąd połączenia

### HTTP
- `http://beskidzku.pl/` => `200`
- `http://beskidzku.pl/listings` => wymaga weryfikacji po wdrożeniu
- `http://beskidzku.pl/api/listings` => wymaga weryfikacji po wdrożeniu

## Wniosek
- Serwis jest osiągalny po HTTP i zwraca poprawne odpowiedzi.
- HTTPS obecnie niedostępny z perspektywy testu klienta; wymaga weryfikacji TLS/certyfikatu lub konfiguracji reverse proxy.
- Aplikacja Next.js wymaga pełnego wdrożenia aby przetestować wszystkie endpointy.
