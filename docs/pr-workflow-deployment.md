# 🚀 Instrukcje wdrożenia PR Validation Workflow

## Szybkie wdrożenie (5 kroków)

### Krok 1: Commit i Push workflow

```bash
git add .github/workflows/pr-validation.yml
git add .github/workflows/README.md
git add eslint.config.mjs
git add docs/pr-workflow*.md
git add docs/github-actions-guide.md
git add README.md

git commit -m "feat: add PR validation workflow with CI/CD pipeline"
git push origin main
```

### Krok 2: Skonfiguruj Branch Protection (opcjonalne, ale zalecane)

1. Przejdź do: **Settings** → **Branches**
2. Kliknij **Add rule**
3. Konfiguracja:
   - **Branch name pattern**: `master` (lub `main`)
   - ✅ **Require status checks to pass before merging**
   - ✅ **Require branches to be up to date before merging**
   - W polu "Status checks" wybierz:
     - `Code Quality Check`
     - `Unit Tests`
     - `Validation Summary`
4. Kliknij **Create**

### Krok 3: Dodaj Secrets dla E2E (opcjonalne)

Jeśli chcesz używać testów E2E:

1. Przejdź do: **Settings** → **Secrets and variables** → **Actions**
2. Kliknij **New repository secret**
3. Dodaj następujące secrets:
   - **Name**: `TEST_SUPABASE_URL`
     - **Value**: URL Twojej testowej bazy Supabase
   - **Name**: `TEST_SUPABASE_ANON_KEY`
     - **Value**: Anon key z Supabase
   - **Name**: `TEST_SUPABASE_SERVICE_KEY`
     - **Value**: Service role key z Supabase

### Krok 4: Przetestuj workflow

Utwórz testowy Pull Request:

```bash
# Utwórz nowy branch
git checkout -b test/workflow-validation

# Zrób małą zmianę (np. aktualizuj README)
echo "Test PR workflow" >> README.md

# Commit i push
git add README.md
git commit -m "test: verify PR workflow"
git push origin test/workflow-validation
```

Następnie:
1. Przejdź do GitHub
2. Utwórz Pull Request z `test/workflow-validation` do `master`
3. Obserwuj zakładkę **Checks**
4. Sprawdź czy workflow się uruchomił
5. Zweryfikuj komentarze na PR

### Krok 5: Przeszkol zespół

Udostępnij dokumentację zespołowi:
- 🚀 [Quick Start](./pr-workflow-quickstart.md) - dla wszystkich
- 📖 [Full Guide](./pr-workflow-guide.md) - dla zainteresowanych szczegółami
- 🧪 [Testing Scenarios](./pr-workflow-testing-scenarios.md) - dla testerów

---

## Checklist wdrożenia

### Przed wdrożeniem:
- [x] Workflow file utworzony (`.github/workflows/pr-validation.yml`)
- [x] YAML syntax zwalidowany
- [x] ESLint config zaktualizowany
- [x] Dokumentacja kompletna
- [x] README zaktualizowany

### Po wdrożeniu:
- [ ] Workflow scommitowany do `master`/`main`
- [ ] Branch Protection skonfigurowany
- [ ] Secrets dodane (jeśli używasz E2E)
- [ ] Testowy PR utworzony i zweryfikowany
- [ ] Zespół przeszkolony

### Weryfikacja:
- [ ] Workflow uruchamia się automatycznie przy PR
- [ ] Code Quality job działa
- [ ] Unit Tests job działa
- [ ] Coverage report pojawia się jako komentarz
- [ ] E2E tests uruchamiają się warunkowo (jeśli skonfigurowane)
- [ ] Validation Summary podsumowuje wyniki

---

## Troubleshooting wdrożenia

### Problem: Workflow nie uruchamia się

**Możliwe przyczyny:**
1. Plik workflow nie jest w folderze `.github/workflows/`
2. Nazwa pliku nie kończy się na `.yml` lub `.yaml`
3. PR nie jest do brancha `master` lub `main`
4. Workflow nie został scommitowany do default branch

**Rozwiązanie:**
```bash
# Sprawdź czy plik istnieje
ls -la .github/workflows/pr-validation.yml

# Sprawdź default branch
git branch --show-current

# Upewnij się że workflow jest w repozytorium
git log --oneline --all --grep="PR validation"
```

### Problem: E2E tests zawsze failed

**Możliwe przyczyny:**
1. Brak secrets w repozytorium
2. Nieprawidłowe wartości secrets
3. Baza testowa nie jest dostępna

**Rozwiązanie:**
1. Sprawdź secrets: Settings → Secrets and variables → Actions
2. Zweryfikuj czy secrets mają poprawne wartości
3. Tymczasowo wyłącz E2E: zmień w workflow `if: false`

### Problem: Linting fails z wieloma błędami

**Przyczyna:** Niezaktualizowany ESLint config

**Rozwiązanie:**
Upewnij się że `eslint.config.mjs` zawiera:
```javascript
ignores: [
  "node_modules/**",
  ".next/**",
  "coverage/**",
  "playwright-report/**",
  "test-results/**",
  ".github/**",
  "hr-helper/**",
]
```

---

## Konfiguracja zaawansowana

### Wyłączenie E2E tests

Jeśli nie chcesz używać E2E tests, w pliku `pr-validation.yml`:

```yaml
e2e-tests:
  if: false  # Wyłącza job
```

### Zmiana Node.js version

W sekcji `env`:
```yaml
env:
  NODE_VERSION: '20'  # Zmień na inną wersję
```

### Parallel jobs (szybsze wykonanie)

Usuń dependencies między jobami:
```yaml
unit-tests:
  needs: []  # Zamiast needs: code-quality
```

⚠️ **Uwaga:** To może zwiększyć zużycie GitHub Actions minutes

### Custom coverage thresholds

W `jest.config.ts` możesz dodać:
```typescript
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70
  }
}
```

---

## Monitoring i utrzymanie

### Sprawdzanie workflow runs

1. Przejdź do: **Actions** tab w GitHub
2. Wybierz **PR Validation**
3. Zobacz listę wszystkich uruchomień

### Pobieranie artifacts

1. Wejdź w konkretne uruchomienie workflow
2. Przewiń do sekcji **Artifacts**
3. Pobierz:
   - `coverage-report`
   - `playwright-report`
   - `test-results`

### Metryki do monitorowania

- **Success rate**: % udanych workflow runs
- **Average duration**: średni czas wykonania
- **Minutes usage**: zużycie GitHub Actions minutes
- **Failure reasons**: dlaczego workflow failuje

### Optymalizacja kosztów

GitHub Actions free tier: **2000 minutes/month**

Szacunki:
- PR bez E2E: ~5 min
- PR z E2E: ~11 min

Jeśli przekraczasz limit:
1. Wyłącz E2E dla niektórych PRs
2. Użyj self-hosted runners
3. Optymalizuj cache strategy
4. Rozważ parallel jobs z ograniczeniami

---

## FAQ wdrożenia

**Q: Czy workflow działa od razu po commit?**
A: Tak, ale tylko dla nowych PRs utworzonych po dodaniu workflow.

**Q: Czy mogę edytować workflow później?**
A: Tak, każda zmiana w `.github/workflows/pr-validation.yml` zostanie automatycznie zastosowana.

**Q: Co jeśli chcę testować workflow na innym branchu?**
A: Zmień w workflow:
```yaml
on:
  pull_request:
    branches:
      - master
      - main
      - develop  # dodaj dodatkowe branche
```

**Q: Czy workflow działa dla fork PRs?**
A: Tak, ale secrets nie są dostępne dla PRs z forków (security). E2E tests będą skipped.

**Q: Jak mogę wymusić ponowne uruchomienie workflow?**
A: 
1. Zamknij i otwórz PR ponownie
2. Push nowy commit do brancha PR
3. Lub kliknij "Re-run jobs" w Actions tab

---

## Support i dokumentacja

### Dokumentacja projektu:
- 📖 [PR Workflow Guide](./pr-workflow-guide.md)
- 🚀 [Quick Start](./pr-workflow-quickstart.md)
- 🧪 [Testing Scenarios](./pr-workflow-testing-scenarios.md)
- 📊 [Diagrams](./pr-workflow-diagram.md)
- 📝 [Implementation Summary](./pr-workflow-implementation-summary.md)

### GitHub Actions docs:
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Events that trigger workflows](https://docs.github.com/en/actions/reference/events-that-trigger-workflows)

---

## 🎉 Gratulacje!

Jeśli dotarłeś tutaj, Twój PR Validation Workflow jest gotowy do użycia!

**Następne kroki:**
1. ✅ Commit workflow do repository
2. ✅ Skonfiguruj Branch Protection
3. ✅ Dodaj secrets (opcjonalnie)
4. ✅ Utwórz testowy PR
5. ✅ Przeszkol zespół

**Happy coding! 🚀**
