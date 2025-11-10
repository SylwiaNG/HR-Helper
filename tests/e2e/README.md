# Playwright E2E Tests

Ten folder zawiera testy End-to-End dla aplikacji HR Helper.

## Struktura

```
tests/e2e/
├── auth/           # Testy autentykacji (logowanie, rejestracja, reset hasła)
├── offers/         # Testy ofert pracy (CRUD, dashboard)
├── cvs/            # Testy zarządzania CV (wyświetlanie, zmiana statusu)
├── stats/          # Testy statystyk
└── fixtures/       # Wspólne fixtures i helpery
```

## Uruchomienie testów

```bash
# Wszystkie przeglądarki
npm run test:e2e

# Tylko Chrome
npm run test:e2e -- --project=chromium

# Tryb UI
npm run test:e2e:ui

# Tryb debug
npm run test:e2e:debug
```

## Przykładowe scenariusze testowe

Zgodnie z `.ai/test-plan.md`:
- **SC-001**: Pełny cykl życia oferty pracy
- **SC-002**: Zarządzanie CV dla oferty
- **SC-003**: Bezpieczeństwo i autoryzacja
- **SC-004**: Obsługa błędów

## Testowane przeglądarki

- Chromium (priorytet dla MVP)
- Firefox
- WebKit (Safari)
