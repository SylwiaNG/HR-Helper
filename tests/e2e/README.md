# Playwright E2E Tests

Ten folder zawiera testy End-to-End dla aplikacji HR Helper.

## Struktura

```
tests/e2e/
├── page-objects/             # Page Object Model - encapsulation stron
│   └── LoginPage.ts         # Przykład POM dla strony logowania
├── auth.spec.ts             # Testy autentykacji
├── offers-cleanup.spec.ts   # Przykład testów z cleanup
├── example.spec.ts          # Przykładowe testy
├── helpers.ts               # Funkcje pomocnicze (login, cleanup)
├── teardown.ts              # Funkcje czyszczące bazę
├── global-setup.ts          # Setup przed wszystkimi testami
├── global-teardown.ts       # Cleanup po wszystkich testach
├── cleanup-script.ts        # Skrypt do ręcznego czyszczenia
├── HOW-TO-TEST.md          # Przewodnik tworzenia testów
├── TEARDOWN.md             # Dokumentacja systemu czyszczenia
└── playwright-e2e-testing.mdc  # Wytyczne dla testów E2E
```

## Konfiguracja

Testy E2E używają zmiennych środowiskowych z pliku `.env.test`:
- `NEXT_PUBLIC_SUPABASE_URL` - URL do bazy testowej
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Klucz publiczny
- `SUPABASE_SERVICE_ROLE_KEY` - Klucz service role (do czyszczenia bazy)
- `E2E_USERNAME` - Email użytkownika testowego
- `E2E_PASSWORD` - Hasło użytkownika testowego
- `E2E_USERNAME_ID` - ID użytkownika w bazie

## Uruchomienie testów

```bash
# Wszystkie testy E2E (z automatycznym cleanup po testach)
npm run test:e2e

# Tylko Chromium (zalecane)
npm run test:e2e -- --project=chromium

# Tryb UI (interaktywny)
npm run test:e2e:ui

# Tryb debug (krok po kroku)
npm run test:e2e:debug

# Wygenerowanie raportu
npm run test:e2e:report

# Ręczne czyszczenie bazy testowej
npm run test:e2e:cleanup
```

## Wytyczne Playwright

Zgodnie z `playwright-e2e-testing.mdc`:

### 1. Page Object Model (POM)
Wszystkie strony powinny mieć swoje Page Objects w `./page-objects`:
```typescript
export class LoginPage {
  readonly page: Page
  readonly emailInput: Locator
  
  constructor(page: Page) {
    this.page = page
    this.emailInput = page.getByTestId('email-input')
  }
  
  async login(email: string, password: string) {
    await this.emailInput.fill(email)
    // ...
  }
}
```

### 2. Selektory testowe
Używaj `data-testid` dla stabilnych selektorów:
```typescript
// W komponencie React
<button data-testid="submit-button">Submit</button>

// W teście
await page.getByTestId('submit-button').click()
```

### 3. Struktura testu (AAA Pattern)
```typescript
test('should do something', async ({ page }) => {
  // Arrange - przygotuj dane i stan
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  
  // Act - wykonaj akcję
  await loginPage.login(email, password)
  
  // Assert - sprawdź wynik
  await expect(page).toHaveURL(/.*dashboard/)
})
```

### 4. Browser Context
Używaj kontekstów dla izolacji testów:
```typescript
test('isolated test', async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()
  // test...
  await context.close()
})
```

### 5. Visual Testing
```typescript
await expect(page).toHaveScreenshot('dashboard.png')
```

## Testowane przeglądarki

- ✅ Chromium (Desktop Chrome) - GŁÓWNY
- ❌ Firefox - wyłączony dla MVP
- ❌ WebKit - wyłączony dla MVP

## Debugowanie

### Trace Viewer
```bash
npx playwright show-trace trace.zip
```

### Codegen (nagrywanie testów)
```bash
npx playwright codegen http://localhost:3000
```

### Screenshots i Video
- Screenshots: tylko przy błędach
- Video: zachowywane przy błędach
- Trace: przy pierwszym retry

## Czyszczenie danych testowych (Teardown)

System automatycznego czyszczenia danych z bazy po testach.

### Automatyczne czyszczenie
Skonfigurowane w `playwright.config.ts` - uruchamia się po wszystkich testach:
```bash
npm run test:e2e
# ... testy ...
# 🧹 Running global teardown...
# ✅ Database clean!
```

### Ręczne czyszczenie
Jeśli potrzebujesz wyczyścić bazę ręcznie:
```bash
npm run test:e2e:cleanup
```

### W testach
```typescript
import { clearTestUserData } from './helpers'

test.afterAll(async () => {
  await clearTestUserData()
})
```

📖 **Pełna dokumentacja**: Zobacz `TEARDOWN.md`

## Dokumentacja

- 📘 **README.md** (ten plik) - przegląd testów E2E
- 📗 **HOW-TO-TEST.md** - przewodnik tworzenia nowych testów
- 📕 **TEARDOWN.md** - system czyszczenia danych
- 📙 **playwright-e2e-testing.mdc** - wytyczne Playwright
