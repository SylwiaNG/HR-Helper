# Pierwsze kroki z GitHub Actions

## Spis treści
1. [Wprowadzenie](#wprowadzenie)
2. [Podstawowe pojęcia](#podstawowe-pojęcia)
3. [Struktura workflow](#struktura-workflow)
4. [Implementacja w HR-Helper](#implementacja-w-hr-helper)
5. [Najlepsze praktyki](#najlepsze-praktyki)
6. [Przykłady dla HR-Helper](#przykłady-dla-hr-helper)
7. [Troubleshooting](#troubleshooting)

---

## Wprowadzenie

GitHub Actions to platforma CI/CD (Continuous Integration/Continuous Deployment) zintegrowana z GitHub, która automatyzuje workflow związane z kodem.

### Dlaczego warto używać GitHub Actions?

✅ **Automatyzacja** - testy, buildy, deployments bez ręcznej pracy  
✅ **Integracja** - bezpośrednio w repozytorium GitHub  
✅ **Darmowe minuty** - 2000 minut/miesiąc dla repozytoriów prywatnych  
✅ **Łatwa konfiguracja** - pliki YAML w `.github/workflows/`  
✅ **Bogaty ekosystem** - tysiące gotowych akcji w marketplace  

---

## Podstawowe pojęcia

### Workflow
Automatyczny proces zdefiniowany w pliku YAML (`.github/workflows/*.yml`)

### Event (Zdarzenie)
Wyzwalacz workflow, np.:
- `push` - po pushu do repo
- `pull_request` - przy tworzeniu/aktualizacji PR
- `schedule` - cron job (zaplanowane)
- `workflow_dispatch` - ręczne uruchomienie

### Job
Zestaw kroków wykonywanych na tym samym runnerze

### Step
Pojedyncze zadanie w job (komenda lub akcja)

### Runner
Serwer, który wykonuje workflow (Linux, Windows, macOS)

### Action
Reużywalny komponent (z marketplace lub własny)

---

## Implementacja w HR-Helper

### 🎯 Aktywne Workflow

#### 1. PR Validation Workflow

**Plik:** `.github/workflows/pr-validation.yml`

**Cel:** Automatyczna weryfikacja Pull Requestów przed merge do `master`/`main`

**Szczegóły:**
- 📄 [Pełna dokumentacja](./pr-workflow-guide.md)
- 🚀 [Quick Start Guide](./pr-workflow-quickstart.md)

**Uruchamia się:** Przy każdym PR do `master`/`main`

**Sprawdza:**
- ✅ Code Quality (ESLint + TypeScript)
- ✅ Unit Tests (Jest)
- ⏭️ E2E Tests (opcjonalnie, gdy zmienione `src/` lub `tests/e2e/`)
- 📊 Coverage Reports

**Status:** ✅ Aktywny

---

## Struktura workflow

### Podstawowy szablon

```yaml
name: Nazwa Workflow

# Kiedy uruchomić workflow
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

# Zmienne środowiskowe dostępne we wszystkich jobs
env:
  NODE_VERSION: '20.x'

# Definicje jobów
jobs:
  build:
    name: Build and Test
    runs-on: ubuntu-latest  # System operacyjny
    
    steps:
      # Checkout kodu z repo
      - name: Checkout code
        uses: actions/checkout@v4
      
      # Setup Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      # Instalacja zależności
      - name: Install dependencies
        run: npm ci
      
      # Uruchomienie testów
      - name: Run tests
        run: npm test
```

---

## Najlepsze praktyki

### 1. **Nazewnictwo i organizacja**

```yaml
# ✅ DOBRZE - opisowa nazwa
name: CI - Build, Test & Lint

# ❌ ŹLE - niejasna nazwa
name: Build
```

**Organizacja plików:**
```
.github/
  workflows/
    ci.yml           # Continuous Integration
    deploy.yml       # Deployment
    cron-jobs.yml    # Zaplanowane zadania
```

### 2. **Optymalizacja czasu wykonania**

#### Cache dependencies
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20.x'
    cache: 'npm'  # ✅ Cache npm packages

- name: Cache dependencies
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

#### Równoległe wykonanie
```yaml
jobs:
  test:
    strategy:
      matrix:
        node-version: [18.x, 20.x]  # Testy na różnych wersjach
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Test on Node ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
```

### 3. **Bezpieczeństwo**

#### Używaj secrets dla wrażliwych danych
```yaml
# ✅ DOBRZE - secrets nie są widoczne w logach
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  API_KEY: ${{ secrets.API_KEY }}

# ❌ ŹLE - hardcoded credentials
env:
  DATABASE_URL: "postgresql://user:password@localhost"
```

**Jak dodać secrets:**
1. Settings → Secrets and variables → Actions
2. New repository secret
3. Użyj w workflow: `${{ secrets.SECRET_NAME }}`

#### Pinuj wersje akcji
```yaml
# ✅ DOBRZE - pinned do SHA (najbezpieczniejsze)
- uses: actions/checkout@8ade135a41bc03ea155e62e844d188df1ea18608

# ✅ OK - pinned do major version
- uses: actions/checkout@v4

# ❌ ŹLE - floating latest
- uses: actions/checkout@latest
```

### 4. **Warunkowe wykonanie**

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    # Tylko na main branch i po sukcesie testów
    if: github.ref == 'refs/heads/main' && success()
    needs: [test, lint]  # Czeka na ukończenie tych jobów
    steps:
      - name: Deploy to production
        run: npm run deploy
```

### 5. **Error handling**

```yaml
steps:
  - name: Run tests
    run: npm test
    continue-on-error: false  # Default - zatrzyma workflow przy błędzie
  
  - name: Upload coverage (optional)
    if: always()  # Wykona się nawet jeśli poprzednie kroki zawiodły
    uses: actions/upload-artifact@v4
    with:
      name: coverage
      path: coverage/
```

### 6. **Timeouts i limits**

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 10  # ✅ Zapobiega wiszącym jobom
    steps:
      - name: Run slow tests
        run: npm test
        timeout-minutes: 5  # Timeout dla pojedynczego stepu
```

---

## Przykłady dla HR-Helper

### CI Workflow - Testy i Linting

```yaml
name: CI - Test & Lint

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20.x'

jobs:
  # Job 1: Instalacja i cache
  setup:
    name: Setup Dependencies
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      # Cache node_modules dla innych jobów
      - name: Cache node_modules
        uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}

  # Job 2: Testy jednostkowe (Jest)
  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    needs: setup
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
      
      - name: Restore cache
        uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
      
      - name: Run Jest tests
        run: npm test -- --coverage
      
      - name: Upload coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/
          retention-days: 7

  # Job 3: Testy E2E (Playwright)
  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: setup
    services:
      # Supabase local (opcjonalnie, jeśli potrzebny w CI)
      postgres:
        image: supabase/postgres:15.1.0.117
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
      
      - name: Restore cache
        uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
      
      - name: Run Playwright tests
        run: npm run test:e2e
        env:
          # Secrets dla testów
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_TEST_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_TEST_ANON_KEY }}
          E2E_USERNAME: ${{ secrets.E2E_USERNAME }}
          E2E_PASSWORD: ${{ secrets.E2E_PASSWORD }}
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7

  # Job 4: Linting
  lint:
    name: Lint Code
    runs-on: ubuntu-latest
    needs: setup
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
      
      - name: Restore cache
        uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
      
      - name: Run ESLint
        run: npm run lint

  # Job 5: Type checking
  typecheck:
    name: TypeScript Check
    runs-on: ubuntu-latest
    needs: setup
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
      
      - name: Restore cache
        uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
      
      - name: Check types
        run: npx tsc --noEmit

  # Job 6: Build check
  build:
    name: Build Check
    runs-on: ubuntu-latest
    needs: [unit-tests, e2e-tests, lint, typecheck]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
      
      - name: Restore cache
        uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
      
      - name: Build Next.js
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

### Deploy Workflow - Deployment do Vercel

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:  # Możliwość ręcznego uruchomienia

jobs:
  deploy:
    name: Deploy to Vercel
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://hr-helper.vercel.app
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
      
      - name: Notify deployment
        if: success()
        run: echo "✅ Deployment successful!"
```

### Scheduled Workflow - Automatyczne czyszczenie

```yaml
name: Cleanup Old Test Data

on:
  schedule:
    # Codziennie o 2:00 AM UTC
    - cron: '0 2 * * *'
  workflow_dispatch:  # Możliwość ręcznego uruchomienia

jobs:
  cleanup:
    name: Clean Test Database
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run cleanup script
        run: npm run test:e2e:cleanup
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_TEST_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
```

---

## Troubleshooting

### Problem: Workflow nie uruchamia się

**Rozwiązanie:**
1. Sprawdź czy plik jest w `.github/workflows/`
2. Sprawdź składnię YAML (użyj validatora)
3. Sprawdź czy event trigger jest poprawny
4. Sprawdź czy masz uprawnienia w repo

### Problem: Testy przechodzą lokalnie, ale nie w CI

**Rozwiązanie:**
```yaml
# Dodaj debug output
- name: Debug environment
  run: |
    echo "Node version: $(node -v)"
    echo "NPM version: $(npm -v)"
    echo "Working directory: $(pwd)"
    ls -la

# Użyj tych samych wersji co lokalnie
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20.x'  # Dopasuj do lokalnej wersji
```

### Problem: Przekroczony limit czasu

**Rozwiązanie:**
```yaml
# Zwiększ timeout
jobs:
  test:
    timeout-minutes: 30  # Domyślnie 360
    
# Lub zoptymalizuj testy
- name: Run tests in parallel
  run: npm test -- --maxWorkers=4
```

### Problem: Cache nie działa

**Rozwiązanie:**
```yaml
# Upewnij się że klucz cache jest unikalny
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

---

## Przydatne linki

- [GitHub Actions Dokumentacja](https://docs.github.com/en/actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Awesome Actions](https://github.com/sdras/awesome-actions)
- [Actions Toolkit](https://github.com/actions/toolkit)

---

## Następne kroki

1. ✅ Utwórz pierwszy workflow CI dla HR-Helper
2. ✅ Skonfiguruj secrets w Settings
3. ✅ Przetestuj workflow na nowym branchu
4. ✅ Dodaj badge statusu do README.md
5. ✅ Rozważ dodanie deployment workflow

**Badge dla README:**
```markdown
![CI Status](https://github.com/SylwiaNG/HR-Helper/workflows/CI/badge.svg)
```

---

*Dokument utworzony: 2025-11-13*  
*Projekt: HR-Helper*
