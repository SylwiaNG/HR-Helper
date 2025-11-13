# GitHub Actions Workflows

Ten folder zawiera automatyczne workflow dla projektu HR-Helper.

## 📁 Aktywne Workflow

### `pr-validation.yml` - Pull Request Validation

Automatyczna weryfikacja Pull Requestów do `master`/`main`.

**Triggers:** Pull Request to `master` lub `main`

**Jobs:**
1. **Code Quality** - ESLint + TypeScript check
2. **Unit Tests** - Jest tests + coverage
3. **E2E Tests** (optional) - Playwright tests
4. **Summary** - Agregacja wyników

**Dokumentacja:**
- 📖 [Pełny przewodnik](../../docs/pr-workflow-guide.md)
- 🚀 [Quick Start](../../docs/pr-workflow-quickstart.md)

**Status:** ✅ Active

---

## 🔧 Konfiguracja

### Wymagane Secrets (dla E2E tests)

```
Settings → Secrets and variables → Actions
```

- `TEST_SUPABASE_URL`
- `TEST_SUPABASE_ANON_KEY`
- `TEST_SUPABASE_SERVICE_KEY`

### Branch Protection (zalecane)

```
Settings → Branches → Add rule
```

- Pattern: `master`
- ✅ Require status checks before merging
- Wybierz: Code Quality Check, Unit Tests, Validation Summary

---

## 📊 Monitoring

**Logi:** GitHub → Actions → PR Validation

**Artefakty:**
- `coverage-report` (7 dni)
- `playwright-report` (7 dni)
- `test-results` (7 dni)

---

## 🚀 Quick Commands

```bash
# Testuj lokalnie przed PR
npm run lint
npx tsc --noEmit
npm run test:ci

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
