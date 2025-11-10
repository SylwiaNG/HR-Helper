# Testing Guide - HR Helper

## 🧪 Uruchamianie Testów

## Uruchamianie testów

### Testy jednostkowe (Jest)

```bash
# Uruchom wszystkie testy
npm run test

# Tryb watch (automatyczne uruchamianie przy zmianach)
npm run test:watch

# Z pokryciem kodu
npm run test:coverage

# W trybie CI (dla GitHub Actions)
npm run test:ci
```

### Testy E2E (Playwright)

```bash
# Wszystkie przeglądarki
npm run test:e2e

# Tylko Chrome
npm run test:e2e -- --project=chromium

# Tryb UI (interaktywny)
npm run test:e2e:ui

# Tryb debug
npm run test:e2e:debug

# Raport HTML
npm run test:e2e:report
```
## 📁 Struktura Testów

```
src/
├── components/
│   └── auth/
│       ├── LoginForm.tsx
│       └── __tests__/
│           └── LoginForm.test.tsx
├── services/
│   ├── jobOfferService.ts
│   └── __tests__/
│       └── jobOfferService.test.ts
tests/
├── unit/           # Dodatkowe testy jednostkowe
├── integration/    # Testy integracyjne
└── e2e/           # Testy E2E (Playwright)
```

## 🎯 Konwencje Nazewnicze

- Pliki testowe: `*.test.ts` lub `*.test.tsx`
- Folder testów: `__tests__/` (obok testowanych plików)
- Describe blocks: nazwa komponentu/funkcji
- Test cases: "should [oczekiwane zachowanie]"

## 📊 Pokrycie Kodu (Coverage)

Minimalne wymagane pokrycie: **70%**

```bash
npm run test:coverage
```

Raport zostanie wygenerowany w katalogu `coverage/`

### Sprawdzanie pokrycia w przeglądarce:
```bash
open coverage/lcov-report/index.html  # macOS
start coverage/lcov-report/index.html # Windows
```

## 🔧 Konfiguracja

### Pliki Konfiguracyjne:
- `jest.config.ts` - główna konfiguracja Jest
- `jest.setup.ts` - mockowanie Supabase, Next.js router, itp.

### Mockowane Moduły:
- `@/lib/supabase/client` - Supabase client
- `@/lib/supabase/server` - Supabase server client
- `next/navigation` - Next.js router
- `sonner` - Toast notifications

## 📝 Przykłady Testów

### Test Serwisu (jobOfferService.test.ts)
```typescript
describe('jobOfferService', () => {
  describe('getJobOffers', () => {
    it('should return list of job offers', async () => {
      // Arrange
      const mockOffers = [...]
      
      // Act
      const result = await jobOfferService.getJobOffers()
      
      // Assert
      expect(result).toEqual(mockOffers)
    })
  })
})
```

### Test Komponentu (LoginForm.test.tsx)
```typescript
describe('LoginForm', () => {
  it('should render login form with all fields', () => {
    // Arrange & Act
    render(<LoginForm />)
    
    // Assert
    expect(screen.getByText('Logowanie')).toBeInTheDocument()
    expect(screen.getByLabelText('Adres e-mail')).toBeInTheDocument()
  })
})
```

## 🚀 Best Practices

1. **AAA Pattern**: Arrange, Act, Assert
2. **Czyszczenie mocków**: `jest.clearAllMocks()` w `beforeEach`
3. **Izolacja testów**: każdy test powinien być niezależny
4. **Opisowe nazwy**: jasno opisuj co test sprawdza
5. **User-centric testing**: testuj z perspektywy użytkownika
6. **Unikaj implementacji details**: testuj publiczne API, nie wewnętrzne szczegóły

## 🐛 Debugging Testów

### Debug pojedynczy test:
```typescript
it.only('should test specific behavior', () => {
  // Ten test zostanie uruchomiony jako jedyny
})
```

### Skip testu:
```typescript
it.skip('should test something', () => {
  // Ten test zostanie pominięty
})
```

### Verbose output:
```bash
npm run test -- --verbose
```

### Debug w VS Code:
1. Ustaw breakpoint w pliku testowym
2. Uruchom "Debug Jest Tests" z palety komend (Ctrl+Shift+P)

## 📚 Dodatkowe Zasoby

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Next.js Applications](https://nextjs.org/docs/testing)
- [Test Plan](/.ai/test-plan.md) - kompletny plan testów dla projektu

## 🔍 Troubleshooting

### Problem: "Cannot find module '@/...'"
**Rozwiązanie**: Sprawdź `moduleNameMapper` w `jest.config.ts`

### Problem: "ReferenceError: fetch is not defined"
**Rozwiązanie**: Dodaj `whatwg-fetch` do `jest.setup.ts`

### Problem: Testy Supabase nie działają
**Rozwiązanie**: Upewnij się, że mocki są zdefiniowane w `jest.setup.ts`

---

**Pytania?** Sprawdź [test-plan.md](./.ai/test-plan.md) lub otwórz issue na GitHub.
