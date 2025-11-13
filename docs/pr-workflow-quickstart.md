# Quick Start - PR Workflow

## 🚀 Jak używać workflow w praktyce

### Krok 1: Utwórz branch dla swojej funkcjonalności

```bash
git checkout -b feature/moja-nowa-funkcja
```

### Krok 2: Wprowadź zmiany i testuj lokalnie

```bash
# Sprawdź kod przed commitem
npm run lint
npx tsc --noEmit
npm run test

# Jeśli wszystko OK, commit
git add .
git commit -m "feat: dodanie nowej funkcjonalności"
```

### Krok 3: Push do repozytorium

```bash
git push origin feature/moja-nowa-funkcja
```

### Krok 4: Utwórz Pull Request

1. Przejdź do GitHub
2. Kliknij "Compare & pull request"
3. Wypełnij opis PR
4. Wybierz `master` jako base branch
5. Kliknij "Create pull request"

### Krok 5: Obserwuj workflow

✅ Workflow automatycznie się uruchomi!

```
Checks → PR Validation
```

Sprawdzane będą:
- ✅ Code Quality (ESLint + TypeScript)
- ✅ Unit Tests (Jest)
- ⏭️ E2E Tests (jeśli zmieniłeś src/ lub tests/e2e/)

### Krok 6: Napraw błędy (jeśli wystąpią)

Jeśli workflow wykryje problemy:

```bash
# Napraw błędy lokalnie
npm run lint
npm run test

# Push poprawek
git add .
git commit -m "fix: poprawki po code review"
git push
```

**Workflow uruchomi się ponownie automatycznie!**

### Krok 7: Merge po aprobacie

Gdy wszystkie sprawdzenia przejdą ✅:
1. Poczekaj na code review od team
2. Merge do master przez GitHub UI

---

## 📋 Checklist przed PR

- [ ] `npm run lint` - bez błędów
- [ ] `npx tsc --noEmit` - bez błędów TypeScript
- [ ] `npm run test` - wszystkie testy przeszły
- [ ] Kod jest sformatowany i czysty
- [ ] Dodane/zaktualizowane testy dla nowego kodu
- [ ] Opis PR jest jasny i kompletny

---

## 🔧 Komendy pomocnicze

```bash
# Szybki pre-commit check
npm run lint && npm run test

# Pełna weryfikacja (jak w CI)
npm ci && npm run lint && npm run test:ci

# Tylko testy związane ze zmianami
npm run test:watch

# E2E tests
npm run test:e2e
```

---

## 💡 Tips

1. **Testuj lokalnie przed push** - zaoszczędzisz czas
2. **Małe PRy** - łatwiejsze do review i szybszy feedback
3. **Opisowe commit messages** - pomaga w historii zmian
4. **Reaguj szybko na feedback** - utrzymuj momentum

---

## ❓ FAQ

**Q: Workflow się nie uruchamia?**
A: Sprawdź czy target branch to `master` lub `main`

**Q: E2E tests są skipped?**
A: To normalne - uruchamiają się tylko gdy zmieniasz `src/` lub `tests/e2e/`

**Q: Jak dodać secrets dla E2E?**
A: Settings → Secrets and variables → Actions → New repository secret

**Q: Workflow trwa długo?**
A: Normalne 5-10 min. Optymalizacje: cache npm, parallel jobs

---

## 🎯 Następne kroki

Po skonfigurowaniu workflow warto:

1. ✅ Dodać Branch Protection Rules
2. ✅ Skonfigurować secrets dla E2E
3. ✅ Przeszkolić zespół z używania workflow
4. ✅ Monitorować czas wykonania i optymalizować

Powodzenia! 🚀
