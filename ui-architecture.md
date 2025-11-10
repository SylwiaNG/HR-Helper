<conversation_summary>
<decisions>
1.  Główny panel (dashboard) będzie wyświetlał maksymalnie 3 oferty pracy. Rozwiązania dla większej liczby ofert zostaną zaimplementowane w przyszłości.
2.  Zmiana statusu CV (zakwalifikowane/odrzucone) będzie natychmiastowo odzwierciedlona w interfejsie poprzez przeniesienie karty CV do odpowiedniej sekcji i aktualizację liczników statystyk. Zmianie będzie towarzyszył komunikat "Operacja wykonana".
3.  W widoku szczegółowym CV nie będzie linku do pobierania pliku CV w ramach MVP.
4.  Aplikacja będzie wyświetlać proste i zrozumiałe komunikaty o błędach, np. "Nieprawidłowy e-mail lub hasło" lub "Przepraszamy, wystąpił błąd. Spróbuj później."
5.  Zaawansowana responsywność (RWD) nie jest priorytetem dla MVP.
6.  Logowanie i rejestracja będą obsługiwane przez proste, dedykowane formularze. Nowo zarejestrowany użytkownik zobaczy ekran powitalny z przyciskiem "Dodaj swoją pierwszą ofertę pracy, aby rozpocząć".
7.  Przejście po zalogowaniu do panelu rekrutera ma być szybkie i nie wymaga wskaźnika ładowania (loadera).
8.  Na karcie kandydata, oprócz imienia i nazwiska, będą wyświetlane dopasowane słowa kluczowe (na zielono) oraz te, których brakuje (na czerwono).
9.  Paginacja na listach CV nie jest wymagana w MVP; system ma obsłużyć do 5 CV na ofertę.
10. W MVP nie będzie funkcjonalności sortowania ani filtrowania list CV.
</decisions>
<matched_recommendations>
1.  **Organizacja widoków:** Głównym widokiem po zalogowaniu jest dashboard (`/dashboard`). Kliknięcie oferty prowadzi do jej szczegółów (`/offers/{id}`). Istnieje również strona do tworzenia nowej oferty (`/offers/new`).
2.  **Układ szczegółów oferty:** Widok zawiera nagłówek z nazwą stanowiska, pod nim trzy bloczki statystyk (Wszystkie, Zakwalifikowane, Odrzucone), następnie bloczek ze słowami kluczowymi, a na końcu dwie sekcje: "Zakwalifikowane CV" i "Odrzucone CV".
3.  **Wygląd karty CV:** Karta kandydata zawiera jego imię i nazwisko, procent dopasowania (np. w formie paska postępu), liczbę dopasowanych słów oraz listę tagów z dopasowanymi (zielone) i brakującymi (czerwone) słowami kluczowymi.
4.  **Edycja słów kluczowych:** Interfejs umożliwia edycję po kliknięciu przycisku "Edytuj", a zmiany są zapisywane dopiero po kliknięciu "Zapisz".
5.  **Obsługa stanów ładowania i błędów:** Przyciski akcji (np. "Utwórz ofertę") są blokowane na czas operacji API. Błędy komunikowane są za pomocą globalnych powiadomień (toasts).
6.  **Zarządzanie stanem:** Rekomenduje się użycie biblioteki do zarządzania stanem (np. Zustand) lub wbudowanych mechanizmów React/Next.js w celu zapewnienia spójności danych między komponentami.
7.  **Dostępność (WCAG):** Należy zapewnić podstawową dostępność, w tym nawigację klawiaturą, odpowiedni kontrast kolorów (zwłaszcza dla teł i statusów) oraz teksty alternatywne dla ikon.
8.  **Formularze uwierzytelniania:** Strony logowania i rejestracji powinny być proste, wyśrodkowane, z wyraźnymi polami i przyciskami akcji oraz linkiem do przełączania się między nimi.
</matched_recommendations>
<ui_architecture_planning_summary>
Na podstawie przeprowadzonej dyskusji, architektura UI dla MVP aplikacji HR Helper została jasno zdefiniowana.

**Główne wymagania i przepływy użytkownika:**
Aplikacja będzie posiadać trzy główne obszary: uwierzytelnianie, dashboard oraz widok szczegółowy oferty.
1.  **Uwierzytelnianie:** Użytkownik (rekruter) może się zarejestrować i zalogować przez dedykowane formularze na stronach `/register` i `/login`.
2.  **Dashboard (`/dashboard`):** Po zalogowaniu użytkownik widzi panel z maksymalnie trzema ofertami pracy. Każda oferta wyświetla tytuł, statystyki zaakceptowanych/odrzuconych CV i listę słów kluczowych. Dostępny jest przycisk `+ Dodaj nową ofertę`, prowadzący do formularza `/offers/new`. Nowy użytkownik bez ofert zobaczy ekran powitalny.
3.  **Widok szczegółów oferty (`/offers/{id}`):** Po kliknięciu oferty, użytkownik widzi szczegółowy panel zawierający:
    *   Nagłówek z tytułem stanowiska.
    *   Trzy bloczki ze statystykami: "Wszystkie aplikacje", "Zakwalifikowane" (zielone tło), "Odrzucone" (czerwone tło).
    *   Panel ze słowami kluczowymi oferty, z możliwością ich edycji.
    *   Dwie sekcje: "Zakwalifikowane CV" (zielone tło) i "Odrzucone CV" (czerwone tło). Każda karta CV zawiera dane kandydata, procent dopasowania oraz listę dopasowanych i brakujących słów kluczowych. Użytkownik może ręcznie zmieniać status CV za pomocą widocznych przycisków.

**Integracja z API i zarządzanie stanem:**
*   Interfejs będzie komunikował się z API zgodnie z dostarczonym `api-plan.md`. Kluczowe endpointy to `GET /job_offers`, `POST /job_offers`, `PUT /job_offers/{id}`, `GET /job_offers/{job_offer_id}/cvs` oraz `PUT /job_offers/{job_offer_id}/cvs/{id}`.
*   Zarządzanie stanem aplikacji (np. dane o ofertach, CV) będzie realizowane za pomocą centralnego store'a (np. Zustand) lub React Context, aby zapewnić synchronizację danych między widokami.
*   Akcje użytkownika, takie jak zmiana statusu CV, wywołują żądanie do API, a po pomyślnej odpowiedzi interfejs jest natychmiast aktualizowany po stronie klienta, zapewniając płynne doświadczenie.

**Responsywność, dostępność i bezpieczeństwo:**
*   **Responsywność:** Nie jest kluczowym wymaganiem MVP, ale układ oparty na kolumnach i bloczkach będzie miał podstawową zdolność adaptacji.
*   **Dostępność:** Zapewniona zostanie podstawowa zgodność z WCAG (kontrast, nawigacja klawiaturą).
*   **Bezpieczeństwo:** Dostęp do danych ofert i CV jest chroniony i ograniczony do zalogowanego, autoryzowanego rekrutera, co jest zgodne z planem API i wymaganiami.

</ui_architecture_planning_summary>
<unresolved_issues>
Brak nierozwiązanych kwestii. Wszystkie punkty zostały wyjaśnione i uzgodnione na potrzeby MVP.
</unresolved_issues>
</conversation_summary>
