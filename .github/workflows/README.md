# GitHub Actions Workflows

Ten folder zawiera automatyczne workflow dla projektu HR-Helper.

## 📁 Aktywne Workflow

### `pull-request.yml` - Pull Request Validation

Automatyczna weryfikacja Pull Requestów do `master`/`main`.

**Triggers:** Pull Request to `master` lub `main`

**Jobs:**
1. **Lint** - ESLint + TypeScript check
2. **Unit Tests** (równolegle) - Jest tests + coverage
3. **E2E Tests** (równolegle) - Playwright tests w środowisku integration
4. **Status Comment** - Komentarz z podsumowaniem (tylko gdy wszystkie przeszły)

**Dokumentacja:**
- 📖 [Pełny przewodnik](../../docs/pr-workflow-guide.md)
- 🚀 [Quick Start](../../docs/pr-workflow-quickstart.md)

**Status:** ✅ Active

---

## 🔧 Konfiguracja

### Wymagane Secrets

```
Settings → Secrets and variables → Actions
```

Dla E2E tests (środowisko `integration`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PLAYWRIGHT_TEST_BASE_URL` (opcjonalny, domyślnie http://localhost:3000)

### Environment Setup

Workflow używa GitHub Environment `integration` dla E2E tests.

Konfiguracja:
```
Settings → Environments → New environment
Name: integration
```

### Branch Protection (zalecane)

```
Settings → Branches → Add rule
```

- Pattern: `master`
- ✅ Require status checks before merging
- Wybierz: Lint Code, Unit Tests, E2E Tests, Status Comment

---

## 📊 Monitoring

**Logi:** GitHub → Actions → Pull Request Validation

**Artefakty:**
- `unit-test-coverage` (7 dni)
- `playwright-report` (7 dni)
- `e2e-test-results` (7 dni)

---

## 🚀 Quick Commands

```bash
# Testuj lokalnie przed PR
npm run lint
npx tsc --noEmit
npm run test:ci
npm run test:e2e

# Full CI simulation
npm ci && npm run lint && npm run test:ci
```

---

## 📚 Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Główny przewodnik GitHub Actions](../../docs/github-actions-guide.md)
- [Dokumentacja HR-Helper](../../README.md)

---

**Last Updated:** 2025-11-13
