# Workflow dla Pull Requestów - Dokumentacja

## Przegląd

Workflow `pr-validation.yml` automatycznie weryfikuje każdy Pull Request (PR) do brancha `master` lub `main`, zapewniając wysoką jakość kodu przed jego połączeniem.

## Ścieżka pliku

`.github/workflows/pr-validation.yml`

## Kiedy się uruchamia?

Workflow aktywuje się automatycznie gdy:
- Tworzony jest nowy Pull Request do brancha `master` lub `main`
- Aktualizowany jest istniejący Pull Request (nowe commity)

## Struktura workflow

### Job 1: Code Quality Check ✅

**Cel:** Sprawdzenie jakości kodu

**Kroki:**
1. **ESLint** - Statyczna analiza kodu JavaScript/TypeScript
2. **TypeScript Compilation** - Weryfikacja typów bez budowania projektu

**Konfiguracja:**
- Node.js: wersja 20
- Cache npm dla szybszych instalacji
- `npm ci` - czysty install zależności

**Komendy:**
```bash
npm run lint              # ESLint
npx tsc --noEmit         # TypeScript check
```

### Job 2: Unit Tests 🧪

**Cel:** Uruchomienie testów jednostkowych

**Wymaga:** Pomyślnego przejścia `code-quality`

**Kroki:**
1. Uruchomienie testów w trybie CI
2. Generowanie raportów pokrycia kodu
3. Upload artefaktów z raportami
4. Dodanie komentarza z podsumowaniem pokrycia do PR

**Komendy:**
```bash
npm run test:ci          # Jest z coverage (maxWorkers=2)
```

**Artefakty:**
- Raporty pokrycia (coverage/) - dostępne przez 7 dni
- Automatyczny komentarz na PR z metrykami pokrycia

### Job 3: E2E Tests (Opcjonalny) 🎭

**Cel:** Testy end-to-end z Playwright

**Wymaga:** Pomyślnego przejścia `unit-tests`

**Warunek uruchomienia:**
- Tylko gdy zmienione pliki w folderach:
  - `src/`
  - `tests/e2e/`

**Kroki:**
1. Instalacja przeglądarki Chromium
2. Konfiguracja zmiennych środowiskowych testowych
3. Build aplikacji Next.js
4. Uruchomienie testów E2E

**Komendy:**
```bash
npx playwright install --with-deps chromium
npm run build
npm run test:e2e
```

**Artefakty:**
- Playwright report (playwright-report/)
- Test results (test-results/)
- Dostępne przez 7 dni

**⚠️ Uwaga:** Testy E2E wymagają secrets w GitHub:
- `TEST_SUPABASE_URL`
- `TEST_SUPABASE_ANON_KEY`
- `TEST_SUPABASE_SERVICE_KEY`

### Job 4: Validation Summary 📊

**Cel:** Podsumowanie wszystkich sprawdzeń

**Wymaga:** `code-quality`, `unit-tests`

**Działa:** Zawsze (nawet gdy poprzednie joby się nie powiodły)

**Kroki:**
1. Sprawdzenie statusów wszystkich jobów
2. Dodanie komentarza z podsumowaniem do PR
3. Fail workflow jeśli jakikolwiek wymagany job się nie powiódł

## Wymagania wstępne

### 1. Secrets w GitHub Repository

Dla testów E2E (opcjonalne):

```
Settings → Secrets and variables → Actions → New repository secret
```

Dodaj:
- `TEST_SUPABASE_URL` - URL bazy testowej Supabase
- `TEST_SUPABASE_ANON_KEY` - Klucz publiczny Supabase
- `TEST_SUPABASE_SERVICE_KEY` - Klucz service role Supabase

### 2. Branch Protection Rules

Aby wymusić przejście workflow przed merge:

```
Settings → Branches → Add rule
```

Konfiguracja:
- **Branch name pattern:** `master` (lub `main`)
- ✅ **Require status checks to pass before merging**
- ✅ **Require branches to be up to date before merging**
- Wybierz status checks:
  - `Code Quality Check`
  - `Unit Tests`
  - (opcjonalnie) `E2E Tests`
  - `Validation Summary`

## Testowanie lokalne

### Przed utworzeniem PR

```bash
# 1. Linting
npm run lint

# 2. TypeScript check
npx tsc --noEmit

# 3. Unit tests
npm run test:ci

# 4. E2E tests (opcjonalnie)
npm run test:e2e
```

### Symulacja środowiska CI

```bash
# Czysty install (jak w CI)
npm ci

# Testy w trybie CI
npm run test:ci
```

## Przykładowy przebieg workflow

### ✅ Pomyślny PR

```
1. Code Quality Check ✅ (2 min)
   ├── ESLint: 15 warnings, 0 errors
   └── TypeScript: OK

2. Unit Tests ✅ (3 min)
   ├── Tests: 61/61 passed
   └── Coverage: 31.36%

3. E2E Tests ⏭️ (skipped - no changes in src/)

4. Validation Summary ✅
   └── Comment: "All required checks passed! ✅"
```

### ❌ Nieudany PR

```
1. Code Quality Check ✅

2. Unit Tests ❌ (FAILED)
   └── 3 tests failed

3. E2E Tests ⏭️ (skipped)

4. Validation Summary ❌
   └── Comment: "Some checks failed ❌"
```

## Optymalizacje

### Cache

Workflow wykorzystuje cache npm:
```yaml
cache: 'npm'
```

### Parallel Jobs

Jobs `code-quality` i `unit-tests` nie działają równolegle (dependencies), ale można to zmienić dla szybszych rezultatów:

```yaml
unit-tests:
  needs: []  # Usuń zależność, aby uruchomić równolegle
```

### Limits

```yaml
maxWorkers=2  # Dla testów jednostkowych w CI
--with-deps chromium  # Tylko Chromium dla E2E
```

## Monitorowanie

### Logi workflow

```
GitHub → Actions → PR Validation → Wybierz run
```

### Artefakty

```
Actions → Konkretny run → Artifacts
```

Dostępne:
- `coverage-report` (coverage/)
- `playwright-report` (playwright-report/)
- `test-results` (test-results/)

## Rozwiązywanie problemów

### Problem: Linting fails z wieloma błędami

**Rozwiązanie:** Zaktualizuj `.eslintignore` lub `eslint.config.mjs`:

```javascript
ignores: [
  "coverage/**",
  "playwright-report/**",
  "test-results/**",
  ".next/**",
  "hr-helper/**",
]
```

### Problem: E2E testy zawsze skipped

**Przyczyna:** Brak zmian w `src/` lub `tests/e2e/`

**Rozwiązanie:** Zmień warunek w workflow:
```yaml
if: |
  contains(github.event.pull_request.changed_files, 'src/') ||
  contains(github.event.pull_request.changed_files, 'tests/e2e/')
```

### Problem: Missing secrets dla E2E

**Rozwiązanie:** Dodaj secrets w ustawieniach repo lub wyłącz E2E:

```yaml
e2e-tests:
  if: false  # Wyłącza job
```

## Dalsza rozbudowa

### Dodatkowe sprawdzenia

Możliwe rozszerzenia:
- **Security scanning** (npm audit, Snyk)
- **Dependency review** (GitHub native)
- **Performance tests** (Lighthouse CI)
- **Bundle size check**

### Przykład: Bundle size check

```yaml
- name: Check bundle size
  run: |
    npm run build
    npx bundlesize
```

### Przykład: Security audit

```yaml
- name: Security audit
  run: npm audit --audit-level=moderate
```

## Podsumowanie

✅ **Co robi workflow:**
- Automatyczna weryfikacja PR przed merge
- ESLint + TypeScript compilation
- Testy jednostkowe z raportami coverage
- (Opcjonalnie) Testy E2E
- Komentarze na PR z wynikami

✅ **Korzyści:**
- Zapobieganie wprowadzeniu bugów do master
- Spójna jakość kodu
- Automatyczne raporty
- Przejrzystość dla reviewers

✅ **Best practices:**
- Testuj lokalnie przed push
- Utrzymuj dobry coverage
- Regularnie aktualizuj dependencies
- Monitoruj czas wykonania workflow
