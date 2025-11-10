# API Endpoint Implementation Plan: POST /job_offers

## 1. Przegląd punktu końcowego
Endpoint POST /job_offers służy do tworzenia nowej oferty pracy. Jego głównym celem jest przyjęcie danych wejściowych, walidacja oraz zapis nowej oferty, a następnie zwrócenie utworzonego obiektu wraz z automatycznie wygenerowanym identyfikatorem i znacznikiem czasu utworzenia.

## 2. Szczegóły żądania
- **Metoda HTTP:** POST
- **Struktura URL:** `/job_offers`
- **Parametry:**
  - **Wymagane w Body:**
    - `user_id` (string, UUID) – identyfikator rekrutera
    - `title` (string) – tytuł oferty pracy
  - **Opcjonalne w Body:**
    - `description` (string lub null) – opis oferty
    - `keywords` (array of string) – lista słów kluczowych
- **Request Body:** struktura zgodna z typem `JobOfferCreateCommand`.

## 3. Wykorzystywane typy
- `JobOfferCreateCommand` – definiuje strukturę danych wejściowych dla tworzenia oferty.
- `JobOfferDTO` – struktura danych oferty pracy, zwracana jako odpowiedź.

## 4. Szczegóły odpowiedzi
- **Sukces:** Zwraca stworzony obiekt oferty pracy z kodem statusu **201 Created**. Struktura odpowiedzi zgodna z typem `JobOfferDTO`.
- **Błędy:**
  - 400 – Błąd walidacji wejścia (niepoprawne lub brakujące pola).
  - 401/403 – Błąd autoryzacji (przy braku lub niewłaściwym tokenie JWT, zależnie od implementacji middleware).
  - 500 – Błąd po stronie serwera (np. wyjątki podczas przetwarzania lub komunikacji z bazą danych).

## 5. Przepływ danych
1. Odbieranie żądania i odczyt ciała requestu w formacie JSON.
2. Walidacja wymaganych pól: `user_id` oraz `title`, oraz opcjonalnych: `description` i `keywords`.
3. Przetwarzanie danych – symulacja zapisu do bazy (lub rzeczywista integracja z bazą Supabase przy późniejszej implementacji).
4. Generacja identyfikatora oferty oraz przypisanie bieżącego znacznika czasu.
5. Zwrócenie poprawnie sformatowanej odpowiedzi z kodem 201 lub obsługa błędów zgodnie z przypadkami.

## 6. Względy bezpieczeństwa
- **Autoryzacja:** Sprawdzanie tokenów JWT przy użyciu Supabase Auth; endpoint powinien być chroniony middlewarem weryfikującym autentyczność użytkownika.
- **RLS:** Wykorzystanie polityk RLS w bazie danych, aby rekruter mógł tworzyć oferty tylko dla własnego konta.
- **Walidacja:** Skrupulatna walidacja danych wejściowych, aby zapobiec wstrzykiwaniu danych i atakom typu injection.

## 7. Obsługa błędów
- Walidacja wejścia – zwracanie błędów 400 z opisem problemu (np. brak `user_id` lub `title`).
- Błędy autoryzacji – zwracanie 401 lub 403 dla nieautoryzowanych użytkowników.
- Nieprzewidziane wyjątki – zwracanie 500 z komunikatem "Server error".

## 8. Rozważania dotyczące wydajności
- Synchronizacja operacji wejścia/wyjścia, optymalizacja parsowania JSON.
- Przy integracji z bazą danych – zastosowanie odpowiednich strategii indeksowania (np. indeksy na polach `user_id` i `keywords`) oraz RLS, aby ograniczyć niepotrzebne odczyty.
- Możliwość wdrożenia cache'owania w przyszłości, jeśli będzie to konieczne przy dużej liczbie ofert.

## 9. Etapy wdrożenia
1. **Konfiguracja podstawowego endpointu:**
   - Utworzenie funkcji obsługującej metodę POST i podstawowej logiki walidacji wejścia oraz symulowanego zapisu oferty.
   - Testowanie poprawności działania za pomocą narzędzi do wysyłania żądań (np. Postman).

2. **Integracja z bazą danych:**
   - Dodanie warstwy serwisowej do obsługi faktycznych operacji CRUD z wykorzystaniem Supabase lub innej bazy PostgreSQL.
   - Zapewnienie, że polityki RLS są aktywne i poprawnie ograniczają dostęp.

3. **Rozszerzenie obsługi błędów i logowanie:**
   - Implementacja szczegółowego logowania błędów (opcjonalne zapisywanie błędów do osobnej tabeli) oraz integracja z systemem monitorowania.
   - Testy jednostkowe i integracyjne obejmujące wszystkie scenariusze błędów.

4. **Wdrożenie pełnej dokumentacji oraz testów:**
   - Utworzenie dokumentacji API oraz zestawu testów automatycznych (np. Playwright) obejmujących edge case’y.
   - Przeprowadzenie przeglądu kodu i optymalizacji na podstawie wyników testów.
