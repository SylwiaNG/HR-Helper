# Plan Testów - HR Helper MVP

## 1. Wprowadzenie i Cele Testowania

### 1.1 Cel dokumentu
Niniejszy dokument przedstawia kompleksowy plan testów dla aplikacji HR Helper w fazie MVP. Celem testowania jest zapewnienie wysokiej jakości, bezpieczeństwa i niezawodności systemu wspierającego rekruterów w procesie selekcji CV.

### 1.2 Cele testowania
- Weryfikacja poprawności działania wszystkich funkcjonalności MVP
- Zapewnienie bezpieczeństwa danych rekruterów i kandydatów (RLS, autoryzacja)
- Walidacja integracji z Supabase (Auth, Database, RLS policies)
- Potwierdzenie poprawności obliczeń dopasowania CV do ofert pracy
- Wykrycie i eliminacja błędów krytycznych przed wdrożeniem
- Sprawdzenie wydajności aplikacji przy założonym obciążeniu (5 CV/ofertę, 3 oferty/rekruter)

### 1.3 Zakres MVP
- Dashboard z max. 3 ofertami pracy
- Zarządzanie ofertami pracy (CRUD)
- Automatyczna analiza CV na podstawie słów kluczowych
- Manualna zmiana statusu CV (zakwalifikowane/odrzucone)
- Podstawowe statystyki (wszystkie/zakwalifikowane/odrzucone)
- Autentykacja i autoryzacja rekruterów

## 2. Zakres Testów

### 2.1 Funkcjonalności objęte testami

#### 2.1.1 Moduł Autentykacji i Autoryzacji
- Rejestracja nowego rekrutera
- Logowanie użytkownika
- Wylogowanie
- Resetowanie hasła
- Aktualizacja hasła
- Ochrona tras wymagających uwierzytelnienia
- Middleware - przekierowania dla zalogowanych/niezalogowanych

#### 2.1.2 Moduł Ofert Pracy
- Tworzenie nowej oferty pracy
- Edycja istniejącej oferty (tytuł, opis, słowa kluczowe)
- Usuwanie oferty
- Wyświetlanie listy ofert na dashboardzie
- Wyświetlanie szczegółów oferty
- Zarządzanie słowami kluczowymi oferty

#### 2.1.3 Moduł CV
- Wyświetlanie listy CV już przesłanych przez kandydatów
- Wyświetlanie automatycznie obliczonego dopasowania CV (procent, liczba dopasowanych słów)
- Wyświetlanie listy CV (zakwalifikowane/odrzucone)
- Zmiana statusu CV (new → accepted/rejected)
- Przenoszenie karty CV między sekcjami po zmianie statusu
- Wyświetlanie dopasowanych słów kluczowych (zielone)
- Wyświetlanie brakujących słów kluczowych (czerwone)

> **Uwaga MVP:** Dodawanie CV przez rekruterów nie jest w zakresie MVP. CV są przesyłane przez kandydatów za pomocą zewnętrznego formularza i automatycznie trafiają do systemu z już obliczonym dopasowaniem.

#### 2.1.4 Moduł Statystyk
- Wyświetlanie liczby wszystkich CV dla oferty
- Wyświetlanie liczby zakwalifikowanych CV
- Wyświetlanie liczby odrzuconych CV
- Aktualizacja statystyk po zmianie statusu CV

#### 2.1.5 API REST
- Endpoint GET /job_offers
- Endpoint POST /job_offers
- Endpoint PUT /job_offers/{id}
- Endpoint DELETE /job_offers/{id}
- Endpoint GET /job_offers/{job_offer_id}/stats
- Endpoint GET /job_offers/{job_offer_id}/cvs (wyświetlanie CV)
- Endpoint PUT /job_offers/{job_offer_id}/cvs/{id} (zmiana statusu CV)

> **Uwaga MVP:** Endpoint POST /cvs (dodawanie CV) nie jest testowany w MVP dla rekruterów. CV są dodawane przez zewnętrzny system aplikacyjny dla kandydatów.

### 2.2 Funkcjonalności wyłączone z testów MVP
- Responsywność zaawansowana (RWD)
- Pobieranie plików CV
- Sortowanie i filtrowanie list CV
- Paginacja (max 5 CV/ofertę w MVP)
- Porównywanie kandydatów
- Automatyczne emaile do kandydatów
- Zaawansowane raportowanie

### 2.3 Testowane platformy i przeglądarki
- **Desktop**: Chrome (wersja latest), Firefox (wersja latest), Edge (wersja latest)
- **System operacyjny**: Windows 11, macOS (najnowsza wersja)
- **Rozdzielczość**: 1920x1080 (priorytet dla MVP)

## 3. Typy Testów do Przeprowadzenia

### 3.1 Testy Jednostkowe (Unit Tests)
**Cel**: Weryfikacja poprawności działania pojedynczych funkcji i komponentów

#### 3.1.1 Serwisy
- `jobOfferService.ts`: wszystkie metody CRUD
- `openrouter.service.ts`: analiza CV i dopasowanie słów kluczowych
- Funkcje pomocnicze w `utils.ts`

#### 3.1.2 Server Actions
- `signIn`, `signUp`, `signOut` w `auth/actions.ts`
- Walidacja danych wejściowych
- Obsługa błędów

#### 3.1.3 Komponenty React
- `LoginForm`, `RegisterForm` - walidacja pól
- `CVCard` - renderowanie danych CV
- `StatCard` - wyświetlanie liczb
- `Badge` - stylowanie i kolory

**Narzędzia**: Jest (wbudowany w Next.js), React Testing Library
**Pokrycie kodu**: minimum 70% dla warstwy logiki biznesowej

### 3.2 Testy Integracyjne (Integration Tests)
**Cel**: Weryfikacja współpracy między komponentami i warstwami aplikacji

#### 3.2.1 Integracja Frontend - Backend
- Wysyłanie danych z formularza LoginForm → Server Action signIn → Supabase Auth
- Tworzenie oferty: formularz → API POST /job_offers → baza danych
- Zmiana statusu CV: CVCard onClick → API PUT → aktualizacja bazy → rerenderowanie UI

#### 3.2.2 Integracja z Supabase
- Supabase Client (browser) - operacje read
- Supabase Server Client - operacje write, auth
- Row Level Security policies - izolacja danych między rekruterami

#### 3.2.3 Middleware i Routing
- Przekierowanie "/" → "/login" (niezalogowany)
- Przekierowanie "/" → "/dashboard" (zalogowany)
- Blokada dostępu do "/dashboard" dla niezalogowanych
- Przekierowanie "/login" → "/dashboard" dla zalogowanych

**Narzędzia**: Playwright Component Testing, Supabase Test Helpers

### 3.3 Testy End-to-End (E2E)
**Cel**: Weryfikacja pełnych przepływów użytkownika w rzeczywistym środowisku

#### 3.3.1 Scenariusze krytyczne
**SC-001: Pełny cykl życia oferty pracy**
1. Rejestracja nowego rekrutera
2. Logowanie
3. Przekierowanie do pustego dashboardu (ekran powitalny)
4. Kliknięcie "Dodaj swoją pierwszą ofertę pracy"
5. Wypełnienie formularza (tytuł, opis, 5 słów kluczowych)
6. Zapisanie oferty
7. Weryfikacja pojawienia się oferty na dashboardzie
8. Kliknięcie oferty → przekierowanie do szczegółów
9. Edycja słów kluczowych (dodanie 2, usunięcie 1)
10. Zapisanie zmian
11. Weryfikacja aktualizacji słów kluczowych
12. Wylogowanie

**SC-002: Zarządzanie CV dla oferty**
1. Logowanie istniejącego rekrutera
2. Wybór oferty z dashboardu (która ma już przesłane CV)
3. Wyświetlenie listy 3 CV z różnym stopniem dopasowania:
   - CV1: 5/5 słów kluczowych (100%) - status: new
   - CV2: 3/5 słów kluczowych (60%) - status: new
   - CV3: 1/5 słów kluczowych (20%) - status: new
4. Weryfikacja poprawności automatycznego obliczenia procentów dopasowania
5. Weryfikacja wyświetlenia dopasowanych słów (zielone) i brakujących (czerwone)
6. Zaakceptowanie CV1 → przeniesienie do sekcji "Zakwalifikowane"
7. Odrzucenie CV3 → przeniesienie do sekcji "Odrzucone"
8. Weryfikacja aktualizacji statystyk:
   - Wszystkie: 3
   - Zakwalifikowane: 1
   - Odrzucone: 1
9. Komunikat toast "Operacja wykonana"

> **Uwaga:** CV są już w systemie - zostały przesłane przez kandydatów. Rekruter tylko ocenia istniejące aplikacje.

**SC-003: Bezpieczeństwo i autoryzacja**
1. Zalogowanie jako Rekruter A
2. Utworzenie Oferty X
3. Skopiowanie URL oferty X
4. Wylogowanie
5. Zalogowanie jako Rekruter B
6. Próba bezpośredniego dostępu do URL oferty X
7. Weryfikacja: brak dostępu / błąd 403 / przekierowanie do dashboardu
8. Weryfikacja w konsoli developerskiej: brak danych oferty X w odpowiedzi API

**SC-004: Obsługa błędów**
1. Próba logowania z nieprawidłowym hasłem → komunikat "Nieprawidłowy e-mail lub hasło"
2. Próba rejestracji z istniejącym emailem → komunikat o błędzie
3. Próba utworzenia oferty z pustym tytułem → walidacja formularza
4. Symulacja błędu sieciowego podczas zapisywania → komunikat "Przepraszamy, wystąpił błąd. Spróbuj później"
5. Weryfikacja braku utraty danych w formularzu po błędzie

**Narzędzia**: Playwright
**Częstotliwość**: Przed każdym wdrożeniem, w CI/CD

### 3.4 Testy Bezpieczeństwa
**Cel**: Weryfikacja ochrony danych i odporności na ataki

#### 3.4.1 Testy Row Level Security (RLS)
- Izolacja ofert pracy między rekruterami
- Izolacja CV między ofertami różnych rekruterów
- Blokada dostępu dla użytkowników anonymous
- Weryfikacja polityk SELECT, INSERT, UPDATE, DELETE

#### 3.4.2 Testy Autentykacji i Autoryzacji
- Brak dostępu do API bez tokena JWT
- Wygasanie sesji i wymuszenie ponownego logowania
- Ochrona przed CSRF (weryfikacja tokenów Supabase)
- Bezpieczne przekierowywanie (brak open redirect)

#### 3.4.3 Testy Walidacji i Sanityzacji Danych
- SQL Injection - próby wstrzyknięcia kodu SQL w polach tekstowych
- XSS - próby wstrzyknięcia skryptów w nazwach, opisach
- Validacja długości stringów (tytuł max 255 znaków)
- Validacja limitu słów kluczowych (max 10)

**Narzędzia**: Supabase Dashboard (testy RLS), OWASP ZAP (skanowanie), manualne testy penetracyjne

### 3.5 Testy Wydajnościowe
**Cel**: Weryfikacja responsywności aplikacji przy oczekiwanym obciążeniu

#### 3.5.1 Testy Obciążenia
- **Scenariusz 1**: 10 jednoczesnych użytkowników, każdy z 3 ofertami (30 ofert)
- **Scenariusz 2**: 50 jednoczesnych zapytań do GET /job_offers
- **Scenariusz 3**: Ładowanie dashboardu z 3 ofertami w < 2 sekundy

#### 3.5.2 Metryki
- Time to First Byte (TTFB) < 500ms
- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s
- API response time < 300ms dla 95% zapytań

**Narzędzia**: Lighthouse, Chrome DevTools, k6 (load testing)

### 3.6 Testy Bazy Danych
**Cel**: Weryfikacja poprawności schematu, migracji i zapytań

#### 3.6.1 Testy Migracji
- Wykonanie migracji `20251020120000_initial_schema.sql` na czystej bazie
- Wykonanie migracji `20251020120100_disable_rls.sql`
- Weryfikacja utworzenia tabel, indeksów, typów enum
- Rollback migracji i ponowne wykonanie (idempotentność)

#### 3.6.2 Testy Integralności Danych
- Kaskadowe usuwanie: usunięcie job_offer usuwa wszystkie powiązane CVs
- Ograniczenie foreign key: brak możliwości dodania CV do nieistniejącej oferty
- Constraint na keywords: brak możliwości dodania > 10 słów kluczowych do CV
- Poprawność typów enum (cv_status, user_role)

#### 3.6.3 Testy Indeksów
- Weryfikacja wykorzystania indeksu `job_offers_user_id_idx` w zapytaniach filtrujących po user_id
- Weryfikacja wykorzystania GIN index `job_offers_keywords_idx` w wyszukiwaniu po słowach kluczowych
- Analiza query planów za pomocą EXPLAIN ANALYZE

**Narzędzia**: pgAdmin, Supabase SQL Editor, pg_stat_statements

### 3.7 Testy Regresji
**Cel**: Weryfikacja, że nowe zmiany nie zepsuły istniejących funkcjonalności

- Automatyczne uruchomienie pełnego zestawu testów E2E po każdym merge do main
- Porównanie snapshots UI komponentów (Visual Regression)
- Monitoring błędów JavaScript w Sentry/Vercel Analytics

**Narzędzia**: Playwright (E2E regression), Percy/Chromatic (visual regression)

## 4. Scenariusze Testowe dla Kluczowych Funkcjonalności

### 4.1 Moduł Autentykacji

| ID | Scenariusz | Kroki | Oczekiwany Rezultat | Priorytet |
|----|------------|-------|---------------------|-----------|
| AUTH-001 | Rejestracja nowego użytkownika - dane poprawne | 1. Przejdź do /register<br>2. Wprowadź email: test@example.com<br>3. Wprowadź hasło: Test123!<br>4. Potwierdź hasło: Test123!<br>5. Kliknij "Zarejestruj się" | Konto utworzone, email weryfikacyjny wysłany, przekierowanie do dashboardu | Krytyczny |
| AUTH-002 | Rejestracja - hasło za krótkie | 1. Przejdź do /register<br>2. Wprowadź email: test@example.com<br>3. Wprowadź hasło: 123<br>4. Kliknij "Zarejestruj się" | Komunikat błędu "Hasło musi mieć co najmniej 6 znaków" | Wysoki |
| AUTH-003 | Rejestracja - email już istnieje | 1. Przejdź do /register<br>2. Wprowadź email istniejącego użytkownika<br>3. Wypełnij pozostałe pola<br>4. Kliknij "Zarejestruj się" | Komunikat "Ten adres email jest już zarejestrowany" | Wysoki |
| AUTH-004 | Logowanie - dane poprawne | 1. Przejdź do /login<br>2. Wprowadź email: test@example.com<br>3. Wprowadź hasło: Test123!<br>4. Kliknij "Zaloguj się" | Przekierowanie do /dashboard, wyświetlenie ofert użytkownika | Krytyczny |
| AUTH-005 | Logowanie - nieprawidłowe hasło | 1. Przejdź do /login<br>2. Wprowadź poprawny email<br>3. Wprowadź błędne hasło<br>4. Kliknij "Zaloguj się" | Komunikat "Nieprawidłowy e-mail lub hasło", brak logowania | Krytyczny |
| AUTH-006 | Wylogowanie | 1. Zaloguj się<br>2. Przejdź do dashboardu<br>3. Kliknij przycisk "Wyloguj"<br>4. Spróbuj dostać się do /dashboard | Przekierowanie do /login, brak dostępu do chronionych tras | Krytyczny |
| AUTH-007 | Reset hasła | 1. Przejdź do /reset-password<br>2. Wprowadź email: test@example.com<br>3. Kliknij "Wyślij link resetujący" | Email z linkiem resetującym wysłany, komunikat potwierdzający | Średni |
| AUTH-008 | Ochrona tras - dostęp bez logowania | 1. Będąc niezalogowanym, spróbuj dostać się do /dashboard | Przekierowanie do /login | Krytyczny |
| AUTH-009 | Ochrona tras - dostęp zalogowanego do /login | 1. Będąc zalogowanym, spróbuj dostać się do /login | Przekierowanie do /dashboard | Wysoki |

### 4.2 Moduł Ofert Pracy

| ID | Scenariusz | Kroki | Oczekiwany Rezultat | Priorytet |
|----|------------|-------|---------------------|-----------|
| OFFER-001 | Tworzenie oferty - dane kompletne | 1. Zaloguj się<br>2. Kliknij "+ Dodaj nową ofertę"<br>3. Wprowadź tytuł: "Frontend Developer"<br>4. Wprowadź opis<br>5. Dodaj słowa kluczowe: react, typescript, nextjs<br>6. Kliknij "Utwórz ofertę" | Oferta utworzona, widoczna na dashboardzie, przekierowanie do szczegółów oferty | Krytyczny |
| OFFER-002 | Tworzenie oferty - pusty tytuł | 1. Zaloguj się<br>2. Kliknij "+ Dodaj nową ofertę"<br>3. Pozostaw tytuł pusty<br>4. Wprowadź opis<br>5. Kliknij "Utwórz ofertę" | Walidacja formularza, komunikat "Tytuł jest wymagany", oferta nie utworzona | Wysoki |
| OFFER-003 | Edycja oferty - zmiana słów kluczowych | 1. Zaloguj się<br>2. Wybierz istniejącą ofertę<br>3. Kliknij "Edytuj" przy słowach kluczowych<br>4. Usuń jedno słowo<br>5. Dodaj dwa nowe<br>6. Kliknij "Zapisz" | Słowa kluczowe zaktualizowane, widoczne w panelu, komunikat "Operacja wykonana" | Krytyczny |
| OFFER-004 | Edycja oferty - zmiana tytułu i opisu | 1. Wybierz ofertę<br>2. Kliknij "Edytuj ofertę"<br>3. Zmień tytuł na "Senior Frontend Developer"<br>4. Zaktualizuj opis<br>5. Kliknij "Zapisz" | Tytuł i opis zaktualizowane na dashboardzie i w szczegółach | Wysoki |
| OFFER-005 | Usuwanie oferty | 1. Wybierz ofertę<br>2. Kliknij "Usuń ofertę"<br>3. Potwierdź usunięcie w modalu | Oferta usunięta, zniknęła z dashboardu, wszystkie powiązane CV usunięte (kaskadowo) | Krytyczny |
| OFFER-006 | Dashboard - ekran powitalny (brak ofert) | 1. Zaloguj się jako nowy użytkownik<br>2. Przejdź do dashboardu | Wyświetlony ekran powitalny z komunikatem i przyciskiem "Dodaj swoją pierwszą ofertę pracy, aby rozpocząć" | Średni |
| OFFER-007 | Dashboard - wyświetlanie 3 ofert | 1. Zaloguj się jako użytkownik z 3 ofertami<br>2. Przejdź do dashboardu | Wszystkie 3 oferty widoczne, każda z tytułem, statystykami i słowami kluczowymi | Krytyczny |
| OFFER-008 | Dashboard - brak izolacji danych | 1. Zaloguj się jako Rekruter A<br>2. Sprawdź dashboard | Wyświetlone tylko oferty Rekrutera A, brak ofert innych użytkowników | Krytyczny |

### 4.3 Moduł CV

| ID | Scenariusz | Kroki | Oczekiwany Rezultat | Priorytet |
|----|------------|-------|---------------------|-----------|
| CV-001 | Wyświetlanie CV - 100% dopasowanie | 1. Otwórz ofertę ze słowami: react, typescript, nextjs<br>2. Sprawdź CV kandydata z tymi samymi słowami kluczowymi | Procent dopasowania: 100%, liczba dopasowanych słów: 3, wszystkie słowa zielone | Krytyczny |
| CV-002 | Wyświetlanie CV - częściowe dopasowanie | 1. Otwórz ofertę ze słowami: react, typescript, nextjs, nodejs, graphql<br>2. Sprawdź CV ze słowami: react, nodejs, python | Procent dopasowania: 40% (2/5), dopasowane (zielone): react, nodejs; brakujące (czerwone): typescript, nextjs, graphql | Krytyczny |
| CV-003 | Wyświetlanie CV - brak dopasowania | 1. Otwórz ofertę ze słowami: react, typescript<br>2. Sprawdź CV ze słowami: python, java | Procent dopasowania: 0%, wszystkie słowa oferty czerwone | Wysoki |
| CV-004 | Zmiana statusu CV: new → accepted | 1. Otwórz ofertę z CV o statusie "new"<br>2. Kliknij przycisk "Akceptuj" na karcie CV | CV przeniesione do sekcji "Zakwalifikowane" (zielone tło), status zmieniony na "accepted", statystyki zaktualizowane (+1 Zakwalifikowane), toast "Operacja wykonana" | Krytyczny |
| CV-005 | Zmiana statusu CV: new → rejected | 1. Otwórz ofertę z CV o statusie "new"<br>2. Kliknij przycisk "Odrzuć" | CV przeniesione do sekcji "Odrzucone" (czerwone tło), status "rejected", statystyki zaktualizowane (+1 Odrzucone), toast "Operacja wykonana" | Krytyczny |
| CV-006 | Zmiana statusu CV: accepted → rejected | 1. Otwórz ofertę z CV o statusie "accepted"<br>2. Kliknij "Odrzuć" | CV przeniesione z sekcji "Zakwalifikowane" do "Odrzucone", statystyki: -1 Zakwalifikowane, +1 Odrzucone | Wysoki |
| CV-007 | Blokada przycisku podczas zmiany statusu | 1. Kliknij "Akceptuj" na karcie CV<br>2. Natychmiast spróbuj kliknąć ponownie | Przycisk zablokowany (disabled), wyświetlony tekst "...", brak wielokrotnych zapytań API | Wysoki |
| CV-008 | Wyświetlanie listy CV - podział na sekcje | 1. Otwórz ofertę z 5 CV: 2 accepted, 2 rejected, 1 new<br>2. Sprawdź układ | Sekcja "Zakwalifikowane": 2 CV (zielone tło)<br>Sekcja "Odrzucone": 2 CV (czerwone tło)<br>CV o statusie "new" w obu sekcjach ma przyciski Akceptuj/Odrzuć | Krytyczny |
| CV-009 | Poprawność algorytmu dopasowania | 1. Sprawdź CV z różnymi kombinacjami słów kluczowych<br>2. Zweryfikuj obliczenia procentowe | Procent dopasowania = (liczba dopasowanych słów / liczba słów w ofercie) × 100, zaokrąglone do 2 miejsc po przecinku | Krytyczny |

> **Uwaga MVP:** Scenariusze dodawania CV nie są testowane, ponieważ w MVP rekruterzy jedynie oceniają CV przesłane przez kandydatów za pomocą zewnętrznego formularza.

### 4.4 Moduł Statystyk

| ID | Scenariusz | Kroki | Oczekiwany Rezultat | Priorytet |
|----|------------|-------|---------------------|-----------|
| STAT-001 | Statystyki - stan początkowy | 1. Utwórz nową ofertę<br>2. Otwórz szczegóły oferty | Wszystkie: 0, Zakwalifikowane: 0, Odrzucone: 0 | Wysoki |
| STAT-002 | Statystyki - oferta z istniejącymi CV | 1. Otwórz ofertę z 3 CV (już przesłanymi przez kandydatów) | Wszystkie: 3, Zakwalifikowane: 0 (jeśli wszystkie new), Odrzucone: 0 | Krytyczny |
| STAT-003 | Statystyki - po zmianie statusu | 1. Mając 3 CV (status new)<br>2. Zaakceptuj 2 CV<br>3. Odrzuć 1 CV | Wszystkie: 3, Zakwalifikowane: 2, Odrzucone: 1 | Krytyczny |
| STAT-004 | Statystyki - aktualizacja w czasie rzeczywistym | 1. Otwórz ofertę<br>2. Kliknij "Akceptuj" na CV<br>3. Obserwuj liczniki | Liczniki zaktualizowane natychmiast bez odświeżania strony | Wysoki |
| STAT-005 | Statystyki na dashboardzie | 1. Przejdź do dashboardu<br>2. Sprawdź każdą kartę oferty | Każda karta wyświetla liczbę zakwalifikowanych i odrzuconych CV | Średni |

### 4.5 Moduł API

| ID | Scenariusz | Kroki | Oczekiwany Rezultat | Priorytet |
|----|------------|-------|---------------------|-----------|
| API-001 | GET /job_offers - użytkownik zalogowany | 1. Zaloguj się<br>2. Wyślij GET /job_offers z tokenem JWT | Status 200, JSON z tablicą ofert użytkownika | Krytyczny |
| API-002 | GET /job_offers - brak tokena | 1. Wyślij GET /job_offers bez tokena | Status 401 Unauthorized | Krytyczny |
| API-003 | POST /job_offers - dane poprawne | 1. Wyślij POST z body:<br>`{"user_id": "uuid", "title": "Test", "keywords": ["react"]}` | Status 201 Created, JSON z utworzoną ofertą (z id, created_at) | Krytyczny |
| API-004 | POST /job_offers - brakujący user_id | 1. Wyślij POST bez user_id | Status 400 Bad Request, komunikat błędu walidacji | Wysoki |
| API-005 | PUT /job_offers/{id} - edycja tytułu | 1. Wyślij PUT z body: `{"title": "New Title"}` | Status 200, JSON z zaktualizowaną ofertą | Krytyczny |
| API-006 | PUT /job_offers/{id} - edycja cudzej oferty | 1. Zaloguj się jako Rekruter A<br>2. Spróbuj edytować ofertę Rekrutera B | Status 403 Forbidden lub 404 Not Found (RLS) | Krytyczny |
| API-007 | DELETE /job_offers/{id} - usunięcie własnej oferty | 1. Wyślij DELETE /job_offers/{id} | Status 204 No Content, oferta usunięta, CV kaskadowo usunięte | Krytyczny |
| API-008 | GET /job_offers/{id}/stats | 1. Wyślij GET do endpointu stats | Status 200, JSON: `{"total_cvs": 5, "accepted": 2, "rejected": 3}` | Wysoki |
| API-009 | GET /job_offers/{id}/cvs - filtrowanie po statusie | 1. Wyślij GET /job_offers/{id}/cvs?status=accepted | Status 200, JSON z tablicą tylko zaakceptowanych CV | Średni |
| API-010 | PUT /cvs/{id} - zmiana statusu | 1. Wyślij PUT z body: `{"status": "accepted"}` | Status 200, CV zaktualizowane | Krytyczny |

> **Uwaga MVP:** Endpoint POST /job_offers/{id}/cvs (dodawanie CV) nie jest w zakresie MVP dla rekruterów. CV dodawane są przez zewnętrzny system aplikacyjny dla kandydatów.

## 5. Środowisko Testowe

### 5.1 Środowiska

| Środowisko | Cel | URL | Baza Danych | Auth |
|------------|-----|-----|-------------|------|
| Development | Testy manualne, debugging | http://localhost:3000 | Supabase Local (Docker) | Supabase Auth Local |
| Staging | Testy integracyjne, E2E | https://staging.hr-helper.vercel.app | Supabase (dedykowany projekt staging) | Supabase Auth Staging |
| Production | Testy smoke po wdrożeniu | https://hr-helper.vercel.app | Supabase (produkcja) | Supabase Auth Production |

### 5.2 Dane Testowe

#### 5.2.1 Użytkownicy Testowi
- **Rekruter A**: rekruterA@test.com / Test123!
- **Rekruter B**: rekruterB@test.com / Test123!
- **Rekruter bez ofert**: newuser@test.com / Test123!

#### 5.2.2 Oferty Pracy (Seedowanie)
- **Oferta 1**: "Frontend Developer" | Keywords: react, typescript, nextjs, css, html
- **Oferta 2**: "Backend Developer" | Keywords: nodejs, express, postgresql, typescript
- **Oferta 3**: "Full Stack Developer" | Keywords: react, nodejs, typescript, docker

#### 5.2.3 CV (Seedowanie)
- **CV dla Oferty 1** (5 sztuk - przesłane przez kandydatów):
  - Jan Kowalski: 100% dopasowanie (5/5), status: new
  - Anna Nowak: 80% dopasowanie (4/5), status: new
  - Piotr Wiśniewski: 60% dopasowanie (3/5), status: new
  - Maria Dąbrowska: 40% dopasowanie (2/5), status: new
  - Tomasz Lewandowski: 0% dopasowanie (0/5), status: new

> **Uwaga:** CV są seedowane jako już przesłane przez kandydatów z automatycznie obliczonym dopasowaniem. Rekruterzy nie dodają CV ręcznie.

### 5.3 Konfiguracja Supabase Local
```bash
npx supabase start
npx supabase db reset --db-url postgresql://postgres:postgres@localhost:54322/postgres
npx supabase migration up
npx supabase seed
```

### 5.4 Zmienne Środowiskowe
```
NEXT_PUBLIC_SUPABASE_URL=<url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>
SUPABASE_SERVICE_ROLE_KEY=<key> # tylko dla testów integracyjnych
```

## 6. Narzędzia do Testowania

### 6.1 Testy Automatyczne

| Narzędzie | Wersja | Przeznaczenie | Konfiguracja |
|-----------|--------|---------------|--------------|
| **Playwright** | ^1.40.0 | Testy E2E, component testing | playwright.config.ts |
| **Jest** | ^29.0.0 | Testy jednostkowe | jest.config.js (Next.js) |
| **React Testing Library** | ^14.0.0 | Testy komponentów React | Wbudowane w Next.js |
| **Supabase Test Helpers** | latest | Mockowanie Supabase Client | Import w testach |
| **MSW (Mock Service Worker)** | ^2.0.0 | Mockowanie API w testach | handlers.ts |

### 6.2 Testy Manualne i Eksploracyjne

| Narzędzie | Przeznaczenie |
|-----------|---------------|
| **Chrome DevTools** | Analiza wydajności, network, console errors |
| **React Developer Tools** | Debugowanie komponentów, props, state |
| **Postman** | Testowanie API REST endpoints |
| **Supabase Dashboard** | Weryfikacja danych w bazie, testowanie RLS |
| **pgAdmin** | Analiza query planów, indeksów |

### 6.3 Monitoring i CI/CD

| Narzędzie | Przeznaczenie |
|-----------|---------------|
| **GitHub Actions** | Uruchamianie testów w pipeline CI/CD |
| **Vercel Analytics** | Monitoring błędów JavaScript w produkcji |
| **Lighthouse CI** | Automatyczne testy wydajności |
| **Sentry** (opcjonalnie) | Error tracking, performance monitoring |

### 6.4 Struktura Plików Testowych
```
/tests
  /e2e
    auth.spec.ts
    job-offers.spec.ts
    cvs.spec.ts
    security.spec.ts
  /integration
    supabase-rls.test.ts
    api-routes.test.ts
  /unit
    services/
      jobOfferService.test.ts
    components/
      LoginForm.test.tsx
      CVCard.test.tsx
```

## 7. Harmonogram Testów

### 7.1 Faza 1: Testy Jednostkowe (Tydzień 1)
- **Dzień 1-2**: Setup środowiska testowego (Jest, RTL, Playwright)
- **Dzień 3-4**: Testy serwisów (jobOfferService, openrouter.service)
- **Dzień 5**: Testy Server Actions (auth/actions.ts)
- **Rezultat**: 70%+ pokrycie kodu warstwy logiki

### 7.2 Faza 2: Testy Integracyjne (Tydzień 2)
- **Dzień 1-2**: Testy integracji z Supabase (Client, Server, Auth)
- **Dzień 3**: Testy middleware i routingu
- **Dzień 4**: Testy RLS policies (bezpieczeństwo)
- **Dzień 5**: Testy API endpoints
- **Rezultat**: Wszystkie krytyczne integracje przetestowane

### 7.3 Faza 3: Testy E2E (Tydzień 3)
- **Dzień 1**: Scenariusze autentykacji (AUTH-001 do AUTH-009)
- **Dzień 2**: Scenariusze ofert pracy (OFFER-001 do OFFER-008)
- **Dzień 3**: Scenariusze CV (CV-001 do CV-009)
- **Dzień 4**: Scenariusze statystyk i edge cases
- **Dzień 5**: Testy bezpieczeństwa (SC-003)
- **Rezultat**: Pełny happy path i critical paths przetestowane

### 7.4 Faza 4: Testy Wydajnościowe i Regresji (Tydzień 4)
- **Dzień 1-2**: Testy obciążenia (k6), analiza wydajności (Lighthouse)
- **Dzień 3**: Testy bazy danych (migracje, indeksy)
- **Dzień 4**: Testy regresji (full E2E suite)
- **Dzień 5**: Dokumentacja, raport z testów
- **Rezultat**: Aplikacja gotowa do wdrożenia

### 7.5 Testy Ciągłe (CI/CD)
- **Każdy commit**: Linting (ESLint), unit tests (Jest)
- **Każdy PR**: Unit tests + integration tests + testy wydajności
- **Przed merge do main**: Full E2E suite (Playwright)
- **Po wdrożeniu na staging**: Smoke tests
- **Po wdrożeniu na production**: Smoke tests + monitoring

## 8. Kryteria Akceptacji Testów

### 8.1 Kryteria Wejścia do Testowania
- ✅ Kod zaimplementowany zgodnie z wymaganiami MVP
- ✅ Środowisko testowe skonfigurowane i dostępne
- ✅ Dane testowe przygotowane (seedowanie)
- ✅ Dokumentacja API dostępna (api-plan.md)
- ✅ Build aplikacji przechodzi bez błędów

### 8.2 Kryteria Akceptacji MVP

#### 8.2.1 Funkcjonalne
- ✅ Wszystkie scenariusze o priorytecie "Krytyczny" przechodzą (100%)
- ✅ Min. 90% scenariuszy o priorytecie "Wysoki" przechodzą
- ✅ Brak błędów blokujących (severity: blocker)
- ✅ Max. 3 błędy krytyczne (severity: critical), wszystkie z planem naprawy

#### 8.2.2 Bezpieczeństwo
- ✅ Wszystkie testy RLS przechodzą (izolacja danych między użytkownikami)
- ✅ Brak luk XSS, SQL Injection w testach penetracyjnych
- ✅ Wszystkie chronione trasy wymagają autentykacji

#### 8.2.3 Wydajność
- ✅ Lighthouse Score: Performance > 85, Accessibility > 90
- ✅ API response time < 500ms dla 95% zapytań
- ✅ Ładowanie dashboardu < 3 sekundy

#### 8.2.4 Automatyzacja
- ✅ Min. 70% pokrycia kodu testami jednostkowymi
- ✅ Wszystkie scenariusze krytyczne zautomatyzowane w Playwright
- ✅ CI/CD pipeline uruchamia testy i blokuje merge przy błędach

### 8.3 Kryteria Wyjścia z Testowania
- ✅ Wszystkie kryteria akceptacji MVP spełnione
- ✅ Raport z testów zatwierdzony przez Product Ownera
- ✅ Smoke tests na staging przechodzą
- ✅ Plan rollbacku przygotowany

## 9. Role i Odpowiedzialności w Procesie Testowania

### 9.1 QA Engineer (Tester)
**Odpowiedzialności:**
- Tworzenie i aktualizacja planu testów
- Implementacja testów automatycznych (unit, integration, E2E)
- Wykonywanie testów manualnych i eksploracyjnych
- Raportowanie błędów w systemie (GitHub Issues)
- Weryfikacja poprawek (regression testing)
- Przegląd kodu testowego (test code review)
- Monitoring wyników testów w CI/CD

### 9.2 Developer (Frontend/Backend)
**Odpowiedzialności:**
- Pisanie testów jednostkowych dla nowego kodu
- Naprawa błędów znalezionych przez testery
- Code review (w tym przegląd testów)
- Wsparcie w debugowaniu złożonych problemów
- Utrzymanie pokrycia kodu testami na min. 70%

### 9.3 DevOps Engineer
**Odpowiedzialności:**
- Konfiguracja środowisk testowych (staging, CI/CD)
- Setup i utrzymanie Supabase (local, staging, production)
- Konfiguracja GitHub Actions dla testów
- Monitoring infrastruktury (Vercel, Supabase)
- Zarządzanie zmiennymi środowiskowymi

### 9.4 Product Owner
**Odpowiedzialności:**
- Zatwierdzanie kryteriów akceptacji
- Priorytetyzacja naprawy błędów
- Podejmowanie decyzji o wdrożeniu (go/no-go)
- Weryfikacja spełnienia wymagań biznesowych

### 9.5 Macierz RACI

| Aktywność | QA Engineer | Developer | DevOps | Product Owner |
|-----------|-------------|-----------|--------|---------------|
| Tworzenie planu testów | **R** | C | I | **A** |
| Implementacja testów unit | C | **R** | I | I |
| Implementacja testów E2E | **R** | C | I | I |
| Wykonywanie testów manualnych | **R** | I | I | C |
| Raportowanie błędów | **R** | I | I | I |
| Naprawa błędów | C | **R** | I | **A** |
| Setup środowisk | I | C | **R** | I |
| Zatwierdzenie wdrożenia | C | C | I | **A** |

**Legenda:** R - Responsible (Wykonawca), A - Accountable (Odpowiedzialny), C - Consulted (Konsultowany), I - Informed (Informowany)

## 10. Procedury Raportowania Błędów

### 10.1 Narzędzie do Raportowania
**Główne narzędzie:** GitHub Issues w repozytorium HR-Helper

**Alternatywy:**
- Jira (jeśli organizacja używa)
- Linear (dla małych zespołów)

### 10.2 Szablon Raportu Błędu (GitHub Issue)

```markdown
## 🐛 Opis Błędu
[Krótki, jasny opis problemu]

## 📋 Kroki Reprodukcji
1. Przejdź do...
2. Kliknij...
3. Wprowadź...
4. Zaobserwuj...

## ✅ Oczekiwane Zachowanie
[Co powinno się wydarzyć]

## ❌ Aktualne Zachowanie
[Co się rzeczywiście dzieje]

## 🖼️ Zrzuty Ekranu / Nagrania
[Załącz screenshoty lub video]

## 🌐 Środowisko
- **Browser:** Chrome 120.0.0
- **OS:** Windows 11
- **Środowisko:** Staging
- **URL:** https://staging.hr-helper.vercel.app/dashboard
- **User:** rekruterA@test.com

## 📊 Logi / Błędy Konsoli
```
[Wklej logi z konsoli developerskiej]
```

## 🏷️ Dodatkowe Informacje
- **Częstotliwość:** Zawsze / Czasami / Raz
- **Workaround:** [Czy istnieje obejście?]
- **Related Issues:** #123, #456
```

### 10.3 Klasyfikacja Błędów

#### 10.3.1 Severity (Dotkliwość)

| Poziom | Opis | Przykład | SLA Naprawy |
|--------|------|----------|-------------|
| **Blocker** | Aplikacja nie działa, brak możliwości testowania | Nie można uruchomić aplikacji, całkowity crash | Natychmiast (w ciągu 4h) |
| **Critical** | Funkcjonalność krytyczna nie działa, brak workaround | Niemożność logowania, utrata danych | 24 godziny |
| **Major** | Funkcjonalność ważna nie działa, istnieje workaround | Błąd w obliczeniu dopasowania CV, ale można ręcznie sprawdzić | 3 dni |
| **Minor** | Drobny błąd, niewielki wpływ na użytkownika | Literówka w komunikacie, nieoptymalne UX | 1 tydzień |
| **Trivial** | Kosmetyczny błąd | Źle wyrównany tekst, niepoprawny padding | Backlog |

#### 10.3.2 Priority (Priorytet)

| Poziom | Opis | Kiedy naprawić |
|--------|------|----------------|
| **P0** | Must fix przed wdrożeniem | Przed merge do main |
| **P1** | Powinno być naprawione szybko | W bieżącym sprincie |
| **P2** | Można naprawić później | W następnym sprincie |
| **P3** | Nice to have | Backlog, może nigdy |

### 10.4 Labels w GitHub Issues

**Typ błędu:**
- `bug` - ogólny błąd
- `security` - luka bezpieczeństwa
- `performance` - problem z wydajnością
- `regression` - błąd wprowadzony przez ostatnią zmianę

**Moduł:**
- `auth` - autentykacja/autoryzacja
- `job-offers` - oferty pracy
- `cvs` - zarządzanie CV
- `api` - backend, REST API
- `database` - baza danych, Supabase
- `ui` - interfejs użytkownika

**Severity:**
- `severity:blocker`
- `severity:critical`
- `severity:major`
- `severity:minor`

**Priority:**
- `priority:P0`
- `priority:P1`
- `priority:P2`
- `priority:P3`

**Status:**
- `status:to-reproduce` - wymaga potwierdzenia
- `status:confirmed` - potwierdzony
- `status:in-progress` - w trakcie naprawy
- `status:fixed` - naprawiony, czeka na weryfikację
- `status:verified` - zweryfikowany przez QA
- `status:wont-fix` - nie będzie naprawiony

### 10.5 Przepływ Pracy z Błędem

1. **QA znajduje błąd** → Tworzy GitHub Issue
2. **Klasyfikacja**: Określenie severity i priority
3. **Triage**: Daily meeting - potwierdzenie i przypisanie
4. **Developer naprawia** → Tworzy PR z naprawą
5. **Code Review** → Zatwierdzenie i merge
6. **Deploy na staging** → QA weryfikuje poprawkę
7. **Weryfikacja**:
   - ✅ Naprawione → Zamknięcie issue
   - ❌ Nie naprawione → Reopen issue, powrót do kroku 4

### 10.6 Daily Bug Triage Meeting
- **Częstotliwość:** Codziennie o 10:00 (15 min)
- **Uczestnicy:** QA Lead, Tech Lead, Product Owner
- **Agenda:**
  1. Przegląd nowych błędów (status:to-reproduce)
  2. Potwierdzenie severity i priority
  3. Przypisanie do developerów
  4. Przegląd blokerów i critical issues
  5. Decyzje o priorytetyzacji

### 10.7 Metryki Śledzenia Błędów
- **Defect Detection Percentage (DDP)**: liczba błędów znalezionych przed produkcją / liczba wszystkich błędów
- **Defect Removal Efficiency (DRE)**: liczba błędów naprawionych przed produkcją / liczba wszystkich znalezionych błędów
- **Mean Time to Resolution (MTTR)**: średni czas naprawy błędu (od zgłoszenia do weryfikacji)
- **Bug Leakage Rate**: liczba błędów znalezionych w produkcji / liczba błędów znalezionych w testach

**Cel dla MVP:**
- DDP > 95% (max 5% błędów uciekło do produkcji)
- DRE > 98%
- MTTR: Blocker < 4h, Critical < 24h, Major < 72h
- Bug Leakage Rate < 5%

## 11. Załączniki

### 11.1 Checklisty Testowe

#### 11.1.1 Checklist przed Wdrożeniem na Staging
- [ ] Wszystkie testy jednostkowe przechodzą
- [ ] Wszystkie testy integracyjne przechodzą
- [ ] Testy E2E scenariuszy krytycznych przechodzą
- [ ] Brak błędów severity:blocker i severity:critical
- [ ] Code review zakończony (min. 1 approve)
- [ ] Migracje bazy danych przetestowane na lokalnej bazie
- [ ] Zmienne środowiskowe dla staging skonfigurowane
- [ ] Build Vercel przechodzi bez błędów
- [ ] Supabase staging project jest dostępny

#### 11.1.2 Checklist przed Wdrożeniem na Production
- [ ] Wszystkie kryteria akceptacji MVP spełnione
- [ ] Smoke tests na staging przechodzą (100%)
- [ ] Testy wydajności (Lighthouse) > 85 points
- [ ] Testy bezpieczeństwa (RLS, auth) przechodzą
- [ ] Brak błędów P0 i P1
- [ ] Dokumentacja API zaktualizowana
- [ ] Plan rollbacku przygotowany i przetestowany
- [ ] Monitoring (Vercel Analytics) skonfigurowany
- [ ] Backup bazy danych wykonany
- [ ] Zatwierdzenie Product Ownera uzyskane

### 11.2 Przykładowy Raport z Testów

**Data raportu:** 2025-11-15
**Wersja aplikacji:** v0.1.0-MVP
**Środowisko:** Staging
**Tester:** Jan Kowalski

#### Podsumowanie Wykonania
- **Scenariusze testowe wykonane:** 87 / 95 (92%)
- **Scenariusze przeszły:** 81 / 87 (93%)
- **Scenariusze nie przeszły:** 6 / 87 (7%)
- **Zablokowane:** 8 (przez błąd OFFER-005)

#### Znalezione Błędy
- **Blocker:** 0
- **Critical:** 2 (#123: Utrata danych przy edycji oferty, #125: RLS nie działa dla CV)
- **Major:** 4
- **Minor:** 7
- **Trivial:** 3
**Łącznie:** 16 błędów

#### Rekomendacja
❌ **NIE WDRAŻAĆ** - 2 błędy critical muszą być naprawione przed wdrożeniem.

**Następne kroki:**
1. Naprawa #123 i #125 (ETA: 2 dni)
2. Ponowne testy regresji
3. Kolejny raport za 3 dni

### 11.3 Kontakty i Zasoby

#### Zespół
- **QA Lead:** qa-lead@company.com
- **Tech Lead:** tech-lead@company.com
- **Product Owner:** po@company.com
- **DevOps:** devops@company.com

#### Zasoby
- **Dokumentacja projektu:** [README.md](../README.md)
- **Plan API:** [api-plan.md](../api-plan.md)
- **Architektura UI:** [ui-architecture.md](../ui-architecture.md)
- **Repozytorium:** https://github.com/SylwiaNG/HR-Helper
- **Staging:** https://staging.hr-helper.vercel.app
- **Supabase Dashboard:** https://app.supabase.com/project/[project-id]

---

**Wersja dokumentu:** 1.0  
**Data ostatniej aktualizacji:** 2025-11-10  
**Autor:** GitHub Copilot (QA Engineer)  
**Zatwierdził:** [Product Owner]
