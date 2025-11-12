# Jak tworzyć testy E2E

Przewodnik krok po kroku do tworzenia testów E2E w projekcie HR-Helper.

## Krok 1: Utwórz Page Object

Dla każdej strony utwórz Page Object w `tests/e2e/page-objects/`:

```typescript
// tests/e2e/page-objects/OffersPage.ts
import { Page, Locator } from '@playwright/test'

export class OffersPage {
  readonly page: Page
  readonly addOfferButton: Locator
  readonly offersList: Locator

  constructor(page: Page) {
    this.page = page
    this.addOfferButton = page.getByTestId('add-offer-button')
    this.offersList = page.getByTestId('offers-list')
  }

  async goto() {
    await this.page.goto('/offers')
  }

  async addNewOffer(title: string, company: string) {
    await this.addOfferButton.click()
    // Fill form...
  }
}
```

## Krok 2: Dodaj data-testid do komponentów

W komponentach React dodaj `data-testid`:

```tsx
// src/components/offers/OfferCard.tsx
export function OfferCard({ offer }: Props) {
  return (
    <div data-testid="offer-card">
      <h3 data-testid="offer-title">{offer.title}</h3>
      <button 
        data-testid="delete-offer-button"
        onClick={handleDelete}
      >
        Delete
      </button>
    </div>
  )
}
```

## Krok 3: Napisz test używając AAA Pattern

```typescript
// tests/e2e/offers.spec.ts
import { test, expect } from '@playwright/test'
import { OffersPage } from './page-objects/OffersPage'
import { loginAsTestUser } from './helpers'

test.describe('Job Offers Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await loginAsTestUser(page)
  })

  test('should create new job offer', async ({ page }) => {
    // Arrange
    const offersPage = new OffersPage(page)
    await offersPage.goto()

    // Act
    await offersPage.addNewOffer('Senior Developer', 'Tech Corp')

    // Assert
    await expect(page.getByTestId('offer-title')).toContainText('Senior Developer')
  })
})
```

## Krok 4: Uruchom testy

```bash
# Uruchom wszystkie testy
npm run test:e2e

# Uruchom konkretny plik
npm run test:e2e -- offers.spec.ts

# Tryb UI (interaktywny)
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug
```

## Best Practices

### 1. Używaj Page Object Model
✅ DO:
```typescript
const loginPage = new LoginPage(page)
await loginPage.login(email, password)
```

❌ DON'T:
```typescript
await page.fill('#email', email)
await page.fill('#password', password)
```

### 2. Używaj data-testid
✅ DO:
```typescript
await page.getByTestId('submit-button').click()
```

❌ DON'T:
```typescript
await page.locator('.btn-primary').click()
```

### 3. Struktura AAA
```typescript
test('should do something', async ({ page }) => {
  // Arrange - przygotuj
  const loginPage = new LoginPage(page)
  
  // Act - wykonaj
  await loginPage.login(email, password)
  
  // Assert - sprawdź
  await expect(page).toHaveURL('/dashboard')
})
```

### 4. Izoluj testy
Każdy test powinien być niezależny:
```typescript
test.beforeEach(async ({ page }) => {
  // Setup dla każdego testu
  await loginAsTestUser(page)
})

test.afterEach(async ({ page }) => {
  // Cleanup po każdym teście
  await clearTestUserData(page)
})
```

### 5. Użyj właściwych asercji
```typescript
// Sprawdź widoczność
await expect(page.getByTestId('element')).toBeVisible()

// Sprawdź tekst
await expect(page.getByTestId('title')).toHaveText('Expected Title')

// Sprawdź URL
await expect(page).toHaveURL(/.*dashboard/)

// Sprawdź screenshot
await expect(page).toHaveScreenshot('dashboard.png')
```

## Debugowanie

### 1. Tryb UI
```bash
npm run test:e2e:ui
```

### 2. Trace Viewer
Po nieudanym teście:
```bash
npx playwright show-trace test-results/.../trace.zip
```

### 3. Codegen (generowanie testów)
```bash
npx playwright codegen http://localhost:3000
```

### 4. Debugging w VS Code
Dodaj breakpoint i uruchom test w trybie debug:
```bash
npm run test:e2e:debug
```

## Zmienne środowiskowe

Wszystkie zmienne z `.env.test` są dostępne w testach:
```typescript
const email = process.env.E2E_USERNAME
const password = process.env.E2E_PASSWORD
const userId = process.env.E2E_USERNAME_ID
```

## Przykłady

Zobacz:
- `tests/e2e/auth.spec.ts` - testy autentykacji
- `tests/e2e/page-objects/LoginPage.ts` - przykład Page Object
- `tests/e2e/helpers.ts` - funkcje pomocnicze
