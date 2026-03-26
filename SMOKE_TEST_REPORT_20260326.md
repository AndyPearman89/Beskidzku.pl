# Smoke Test Report — 2026-03-26

Repo: `Beskidzku.pl_repo`

## Zakres
- Dostępność: home, admin, REST index
- Testowane warianty: HTTPS (pierwotny) i HTTP (fallback)

## Wyniki
### HTTPS
- `https://beskidzku.pl/` => błąd połączenia (żądanie nie zostało wysłane)
- `https://beskidzku.pl/wp-admin/` => błąd połączenia
- `https://beskidzku.pl/wp-json/` => błąd połączenia
- `https://www.beskidzku.pl/` => błąd połączenia

### HTTP
- `http://beskidzku.pl/` => `200`
- `http://beskidzku.pl/wp-admin/` => `308`
- `http://beskidzku.pl/wp-json/` => `200`

## Wniosek
- Serwis jest osiągalny po HTTP i zwraca poprawne odpowiedzi.
- HTTPS obecnie niedostępny z perspektywy testu klienta; wymaga weryfikacji TLS/certyfikatu lub konfiguracji reverse proxy.
