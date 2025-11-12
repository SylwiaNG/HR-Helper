# Teardown - Czyszczenie danych testowych

System automatycznego czyszczenia danych po testach E2E.

## 📚 Co to jest?

**Teardown** to mechanizm usuwania danych testowych z bazy po zakończeniu testów, aby:
- Każde uruchomienie testów zaczynało się w czystym stanie
- Dane nie kumulowały się po kolejnych uruchomieniach
- Testy były stabilne i powtarzalne

## 🏗️ Architektura

```
tests/e2e/
├── teardown.ts           # Funkcje czyszczące (deleteTestUserJobOffers, etc.)
├── global-setup.ts       # Weryfikacja stanu przed testami
├── global-teardown.ts    # Czyszczenie po wszystkich testach
├── cleanup-script.ts     # Skrypt do ręcznego czyszczenia
└── helpers.ts            # clearTestUserData() dla użycia w testach
```

## 🚀 Jak to działa?

### 1. Automatyczne czyszczenie (Global Teardown)

Skonfigurowane w `playwright.config.ts`:
```typescript
globalTeardown: require.resolve('./tests/e2e/global-teardown')
```

**Uruchamia się automatycznie** po zakończeniu wszystkich testów:
```bash
npm run test:e2e
# ... testy się wykonują ...
# 🧹 Running global teardown...
# ✅ Deleted 3 job offers
# ✅ Deleted 5 CVs
# ✨ Database clean - teardown complete!
```

### 2. Czyszczenie w pojedynczych testach

Możesz czyścić dane w konkretnych miejscach testu:

```typescript
import { clearTestUserData } from './helpers'

test.describe('My Tests', () => {
  // Przed każdym testem
  test.beforeEach(async () => {
    await clearTestUserData()
  })

  // Po każdym teście
  test.afterEach(async () => {
    await clearTestUserData()
  })

  // Po całym suite'ie
  test.afterAll(async () => {
    await clearTestUserData()
  })

  test('my test', async ({ page }) => {
    // test...
  })
})
```

### 3. Ręczne czyszczenie

Jeśli chcesz wyczyścić bazę ręcznie:

```bash
npm run test:e2e:cleanup
```

Output:
```
🧹 Manual E2E Data Cleanup
==================================================

📝 Test User ID: 5d1f4865-cd97-4672-bf1b-d342b14759de

📊 Checking current state...
🗑️  Found data to clean:
   - Job Offers: 3
   - CVs: 5

⚠️  Press Ctrl+C to cancel, or wait 3 seconds to continue...

🧹 Starting cleanup...
✅ Deleted 5 CVs
✅ Deleted 3 job offers

✨ Cleanup successful! Database is clean.
```

## 🔧 Konfiguracja

### Wymagane zmienne środowiskowe (.env.test)

```bash
# URL do bazy (lokalna lub cloud)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321

# Service Role Key (ma pełne uprawnienia)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ID użytkownika testowego
E2E_USERNAME_ID=5d1f4865-cd97-4672-bf1b-d342b14759de
```

### Przełączanie między lokalna a cloud bazą

**Dla lokalnej bazy:**
```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_ROLE_KEY=sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz
```

**Dla cloud bazy:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-cloud-service-role-key
```

> ⚠️ **Service Role Key z cloud** znajdziesz w:
> Supabase Dashboard → Project Settings → API → service_role (secret)

## 📋 Co jest czyszczone?

System czyści dane dla użytkownika testowego (`E2E_USERNAME_ID`):

1. **CVs** - wszystkie CV powiązane z ofertami użytkownika
2. **Job Offers** - wszystkie oferty pracy użytkownika

Dzięki `CASCADE` w bazie danych, usunięcie oferty automatycznie usuwa powiązane CV.

## 🎯 Kiedy używać?

### ✅ Używaj Global Teardown gdy:
- Testujesz na cloud bazie (Supabase Cloud)
- Uruchamiasz testy na CI/CD
- Chcesz, aby baza była zawsze czysta po testach

### ✅ Używaj czyszczenia w testach (afterEach) gdy:
- Każdy test musi zaczynać się w czystym stanie
- Testy zakładają konkretną liczbę rekordów (np. 0)
- Maksymalna izolacja testów

### ✅ Używaj ręcznego czyszczenia gdy:
- Testy zostały przerwane i dane zostały w bazie
- Debugujesz testy i chcesz zacząć od czystego stanu
- Przed ważnym uruchomieniem testów

### ❌ NIE używaj gdy:
- Testujesz tylko lokalnie i restartujesz bazę: `npx supabase db reset`
- To prosty proof-of-concept
- Dane testowe nie przeszkadzają

## 🔍 Debugowanie

### Sprawdzenie stanu bazy

```typescript
import { verifyCleanState } from './teardown'

const state = await verifyCleanState('user-id')
console.log(state)
// { jobOffersCount: 3, cvsCount: 5, isClean: false }
```

### Testowanie teardown

```bash
# Dodaj dane testowe (uruchom testy)
npm run test:e2e

# Sprawdź czy zostały wyczyszczone (powinno być czysto)
npm run test:e2e:cleanup
# Should show: "Database is already clean!"
```

## 💡 Best Practices

1. **Lokalna baza** - użyj `npx supabase db reset` zamiast teardown
2. **Cloud baza** - włącz global teardown
3. **CI/CD** - zawsze używaj teardown
4. **Izolowane testy** - użyj `afterEach` dla maksymalnej izolacji
5. **Service Role Key** - NIGDY nie commituj do repo, tylko w .env.test (jest w .gitignore)

## 🚨 Bezpieczeństwo

⚠️ **Service Role Key** ma pełne uprawnienia do bazy!
- Jest w `.gitignore` - nie trafi do repo
- Używany tylko w testach
- Nigdy nie używaj w production code
- Nigdy nie udostępniaj publicznie

## 📚 Przykłady

Zobacz:
- `tests/e2e/offers-cleanup.spec.ts` - przykład użycia w testach
- `tests/e2e/global-teardown.ts` - implementacja globalnego czyszczenia
- `tests/e2e/teardown.ts` - niskopoziomowe funkcje czyszczące
