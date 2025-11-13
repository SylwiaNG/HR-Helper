# Testowanie PR Workflow - Scenariusze

Ten dokument opisuje różne scenariusze testowania workflow `pr-validation.yml`.

## 🧪 Scenariusz 1: Poprawny PR (Happy Path)

### Cel
Sprawdzenie czy workflow przechodzi pomyślnie dla poprawnego kodu.

### Kroki

1. **Przygotowanie**
   ```bash
   git checkout -b test/happy-path
   ```

2. **Zmiany** (przykład)
   ```typescript
   // src/lib/test-utils.ts
   export function add(a: number, b: number): number {
     return a + b;
   }
   ```

3. **Test**
   ```typescript
   // src/lib/__tests__/test-utils.test.ts
   import { add } from '../test-utils';

   describe('add', () => {
     it('should add two numbers', () => {
       expect(add(2, 3)).toBe(5);
     });
   });
   ```

4. **Weryfikacja lokalna**
   ```bash
   npm run lint
   npx tsc --noEmit
   npm run test
   ```

5. **Push i PR**
   ```bash
   git add .
   git commit -m "test: add utility function"
   git push origin test/happy-path
   ```

6. **Utwórz PR** przez GitHub UI

### Oczekiwany rezultat
✅ Wszystkie joby przechodzą  
✅ Komentarz z coverage  
✅ Zielony status check

---

## 🔴 Scenariusz 2: Błąd ESLint

### Cel
Sprawdzenie reakcji workflow na błędy lintingu.

### Kroki

1. **Przygotowanie**
   ```bash
   git checkout -b test/eslint-error
   ```

2. **Wprowadź błąd ESLint**
   ```typescript
   // src/lib/bad-code.ts
   export function unused() {
     const x: any = 5;  // eslint error: no-explicit-any
     console.log('test')
     // missing semicolon
   }
   ```

3. **Push i PR**
   ```bash
   git add .
   git commit -m "test: intentional eslint error"
   git push origin test/eslint-error
   ```

### Oczekiwany rezultat
❌ Code Quality job fails  
❌ Unit Tests skipped (dependency)  
❌ Validation Summary fails  
💬 Komentarz z informacją o błędach

---

## 🧪 Scenariusz 3: Nieprzechodzące testy

### Cel
Sprawdzenie obsługi failing tests.

### Kroki

1. **Przygotowanie**
   ```bash
   git checkout -b test/failing-tests
   ```

2. **Zmiany w funkcji**
   ```typescript
   // src/lib/calculator.ts
   export function multiply(a: number, b: number): number {
     return a + b;  // ❌ błąd: dodawanie zamiast mnożenia
   }
   ```

3. **Test**
   ```typescript
   // src/lib/__tests__/calculator.test.ts
   import { multiply } from '../calculator';

   describe('multiply', () => {
     it('should multiply two numbers', () => {
       expect(multiply(2, 3)).toBe(6);  // będzie fail
     });
   });
   ```

4. **Push i PR**
   ```bash
   git add .
   git commit -m "test: failing test scenario"
   git push origin test/failing-tests
   ```

### Oczekiwany rezultat
✅ Code Quality passes  
❌ Unit Tests fail  
❌ Validation Summary fails  
📊 Coverage report (partial)

---

## ⏭️ Scenariusz 4: E2E Tests Trigger

### Cel
Sprawdzenie warunkowego uruchamiania E2E tests.

### Kroki A: Zmiany w `src/` (uruchomi E2E)

1. **Przygotowanie**
   ```bash
   git checkout -b test/e2e-trigger
   ```

2. **Zmiany w src/**
   ```typescript
   // src/components/TestComponent.tsx
   export function TestComponent() {
     return <div>Test</div>;
   }
   ```

3. **Push i PR**

### Oczekiwany rezultat A
✅ Code Quality passes  
✅ Unit Tests pass  
🎭 E2E Tests run  
✅ Validation Summary passes

---

### Kroki B: Zmiany poza `src/` (skipuje E2E)

1. **Przygotowanie**
   ```bash
   git checkout -b test/no-e2e
   ```

2. **Zmiany w docs/**
   ```markdown
   # README.md
   Zaktualizowana dokumentacja...
   ```

3. **Push i PR**

### Oczekiwany rezultat B
✅ Code Quality passes  
✅ Unit Tests pass  
⏭️ E2E Tests skipped  
✅ Validation Summary passes

---

## 🔧 Scenariusz 5: TypeScript Errors

### Cel
Sprawdzenie wykrywania błędów TypeScript.

### Kroki

1. **Przygotowanie**
   ```bash
   git checkout -b test/typescript-error
   ```

2. **Wprowadź błąd TypeScript**
   ```typescript
   // src/lib/type-error.ts
   interface User {
     name: string;
     age: number;
   }

   export function createUser(): User {
     return {
       name: "John",
       // ❌ brak pola 'age'
     };
   }
   ```

3. **Push i PR**

### Oczekiwany rezultat
❌ Code Quality fails (TypeScript check)  
❌ Unit Tests skipped  
❌ Validation Summary fails

---

## 📊 Scenariusz 6: Coverage Report

### Cel
Sprawdzenie generowania raportów coverage.

### Kroki

1. **Przygotowanie**
   ```bash
   git checkout -b test/coverage-report
   ```

2. **Dodaj funkcję z testami**
   ```typescript
   // src/lib/math.ts
   export function divide(a: number, b: number): number {
     if (b === 0) throw new Error('Division by zero');
     return a / b;
   }
   ```

3. **Testy**
   ```typescript
   // src/lib/__tests__/math.test.ts
   import { divide } from '../math';

   describe('divide', () => {
     it('should divide numbers', () => {
       expect(divide(10, 2)).toBe(5);
     });

     it('should throw on division by zero', () => {
       expect(() => divide(10, 0)).toThrow('Division by zero');
     });
   });
   ```

4. **Push i PR**

### Oczekiwany rezultat
✅ Wszystkie joby pass  
📊 Komentarz z coverage metrics  
📦 Artifact z coverage-report

---

## 🔄 Scenariusz 7: Poprawki po Review

### Cel
Sprawdzenie ponownego uruchomienia workflow.

### Kroki

1. **Pierwszy PR z błędami**
   ```bash
   git checkout -b test/review-fixes
   # ... wprowadź błędy
   git push
   ```

2. **PR fails** ❌

3. **Napraw błędy**
   ```bash
   # popraw kod
   git add .
   git commit -m "fix: address review comments"
   git push
   ```

4. **Workflow uruchomi się ponownie automatycznie**

### Oczekiwany rezultat
🔄 Workflow re-runs  
✅ Poprawki są zweryfikowane  
✅ Wszystkie checks pass

---

## 🎯 Checklist testowania

Przed wdrożeniem na produkcję, przetestuj:

- [ ] Scenariusz 1: Happy path
- [ ] Scenariusz 2: ESLint errors
- [ ] Scenariusz 3: Failing tests
- [ ] Scenariusz 4: E2E trigger logic
- [ ] Scenariusz 5: TypeScript errors
- [ ] Scenariusz 6: Coverage reports
- [ ] Scenariusz 7: Re-runs after fixes

---

## 💡 Tips

1. **Testuj lokalnie najpierw** - szybszy feedback
2. **Małe PRy** - łatwiej debug workflow
3. **Monitoruj logi** - GitHub Actions → konkretny run
4. **Artefakty** - sprawdzaj coverage reports
5. **Cache** - przyspiesza kolejne uruchomienia

---

## 🐛 Debug workflow

Jeśli coś nie działa:

```bash
# 1. Sprawdź lokalnie
npm ci
npm run lint
npm run test:ci

# 2. Sprawdź YAML syntax
npx js-yaml .github/workflows/pr-validation.yml

# 3. Zobacz logi w GitHub
# Actions → PR Validation → konkretny run → Job → Step

# 4. Sprawdź secrets (dla E2E)
# Settings → Secrets and variables → Actions
```

---

**Happy Testing! 🚀**
