# Architektura UI dla HR Helper

## 1. Przegląd struktury UI

Architektura interfejsu użytkownika (UI) aplikacji HR Helper została zaprojektowana w celu zapewnienia rekruterom prostego i wydajnego narzędzia do zarządzania ofertami pracy i procesowania CV. Aplikacja jest zorientowana na zadania, minimalizując liczbę kroków potrzebnych do wykonania kluczowych akcji, takich jak ocena kandydatów czy modyfikacja słów kluczowych.

Główne założenia struktury:
- **Uwierzytelnianie:** Dostęp do aplikacji jest chroniony i wymaga od użytkownika (rekrutera) zalogowania się. Proces rejestracji i logowania jest prosty i odizolowany od reszty aplikacji.
- **Nawigacja oparta na widokach:** Interfejs składa się z kilku głównych widoków: panelu głównego, widoku szczegółów oferty oraz formularza tworzenia nowej oferty. Taka struktura ułatwia orientację i zapewnia logiczny przepływ pracy.
- **Centralizacja informacji:** Widok szczegółów oferty stanowi centrum zarządzania rekrutacją, gromadząc w jednym miejscu statystyki, słowa kluczowe oraz listy zakwalifikowanych i odrzuconych CV.
- **Komponentowość:** Architektura promuje reużywalność komponentów (np. karta oferty, karta CV), co zapewnia spójność wizualną i ułatwia rozwój aplikacji.

Struktura jest zgodna z wymaganiami PRD, planem API oraz ustaleniami z sesji planistycznej, kładąc nacisk na realizację kluczowych historyjek użytkownika w ramach MVP.

## 2. Lista widoków

### 1. Widok Logowania
- **Nazwa widoku:** Login
- **Ścieżka widoku:** `/login`
- **Główny cel:** Umożliwienie zarejestrowanemu rekruterowi bezpiecznego dostępu do aplikacji.
- **Kluczowe informacje do wyświetlenia:** Formularz z polami na e-mail i hasło.
- **Kluczowe komponenty widoku:**
    - Pole do wprowadzenia adresu e-mail.
    - Pole do wprowadzenia hasła.
    - Przycisk "Zaloguj się".
    - Link do widoku rejestracji (`/register`).
- **UX, dostępność i względy bezpieczeństwa:**
    - **UX:** Prosty, wyśrodkowany formularz. Komunikaty o błędach (np. "Nieprawidłowy e-mail lub hasło") wyświetlane w czytelny sposób. Przycisk logowania jest blokowany na czas przetwarzania żądania.
    - **Dostępność:** Zapewniona nawigacja klawiaturą po polach formularza. Etykiety pól są powiązane z odpowiednimi inputami.
    - **Bezpieczeństwo:** Komunikacja z API odbywa się przez HTTPS. Hasło jest przesyłane w sposób zabezpieczony.

### 2. Widok Rejestracji
- **Nazwa widoku:** Register
- **Ścieżka widoku:** `/register`
- **Główny cel:** Umożliwienie nowym rekruterom utworzenia konta w systemie.
- **Kluczowe informacje do wyświetlenia:** Formularz z polami na e-mail i hasło.
- **Kluczowe komponenty widoku:**
    - Pole do wprowadzenia adresu e-mail.
    - Pole do wprowadzenia hasła.
    - Przycisk "Zarejestruj się".
    - Link do widoku logowania (`/login`).
- **UX, dostępność i względy bezpieczeństwa:**
    - **UX:** Po pomyślnej rejestracji użytkownik jest automatycznie logowany i przekierowywany do panelu głównego (`/dashboard`), gdzie widzi ekran powitalny.
    - **Dostępność:** Podobne standardy jak w widoku logowania.
    - **Bezpieczeństwo:** Walidacja hasła po stronie klienta i serwera.

### 3. Panel Główny
- **Nazwa widoku:** Dashboard
- **Ścieżka widoku:** `/dashboard`
- **Główny cel:** Wyświetlenie przeglądu aktywnych ofert pracy rekrutera i umożliwienie nawigacji do szczegółów oferty lub formularza tworzenia nowej.
- **Kluczowe informacje do wyświetlenia:**
    - Lista ofert pracy (maksymalnie 3 w MVP).
    - Dla każdej oferty: tytuł, liczba zakwalifikowanych CV (kolor zielony), liczba odrzuconych CV (kolor czerwony).
    - Ekran powitalny dla nowych użytkowników bez ofert, z przyciskiem "Dodaj swoją pierwszą ofertę pracy".
- **Kluczowe komponenty widoku:**
    - Przycisk "+ Dodaj nową ofertę".
    - Komponent `JobOfferCard` dla każdej oferty na liście.
    - Komponent `WelcomeScreen` dla nowych użytkowników.
- **UX, dostępność i względy bezpieczeństwa:**
    - **UX:** Szybki dostęp do kluczowych informacji. Kliknięcie karty oferty przenosi do jej szczegółów. Przejście po zalogowaniu jest natychmiastowe, bez loadera.
    - **Dostępność:** Karty ofert są elementami klikalnymi, dostępnymi z klawiatury. Kontrast kolorów dla statystyk jest zgodny z WCAG.
    - **Bezpieczeństwo:** Widok dostępny tylko dla zalogowanych użytkowników. API zwraca tylko oferty należące do zalogowanego rekrutera.

### 4. Widok Szczegółów Oferty
- **Nazwa widoku:** Offer Details
- **Ścieżka widoku:** `/offers/{id}`
- **Główny cel:** Szczegółowe zarządzanie pojedynczą ofertą pracy, w tym przeglądanie i zmiana statusu CV oraz edycja słów kluczowych.
- **Kluczowe informacje do wyświetlenia:**
    - Tytuł stanowiska.
    - Panel statystyk: "Wszystkie aplikacje", "Zakwalifikowane", "Odrzucone".
    - Panel słów kluczowych z możliwością edycji.
    - Dwie sekcje: "Zakwalifikowane CV" (zielone tło) i "Odrzucone CV" (czerwone tło).
    - Na każdej karcie CV: imię i nazwisko kandydata, procent dopasowania, dopasowane i brakujące słowa kluczowe.
- **Kluczowe komponenty widoku:**
    - `StatisticsPanel` (z trzema bloczkami).
    - `KeywordsPanel` (z trybem edycji i zapisu).
    - `CVCard` (z przyciskami do zmiany statusu).
    - Dwie listy (`CVList`) dla zakwalifikowanych i odrzuconych.
- **UX, dostępność i względy bezpieczeństwa:**
    - **UX:** Zmiana statusu CV natychmiast przenosi kartę do odpowiedniej sekcji i aktualizuje statystyki, z komunikatem "Operacja wykonana". Edycja słów kluczowych wymaga jawnego zapisu.
    - **Dostępność:** Przyciski akcji są wyraźnie oznaczone i dostępne z klawiatury. Tła sekcji mają odpowiedni kontrast.
    - **Bezpieczeństwo:** Dostęp do widoku jest autoryzowany. Użytkownik nie może wyświetlić szczegółów oferty, która do niego nie należy.

### 5. Widok Tworzenia Nowej Oferty
- **Nazwa widoku:** New Offer
- **Ścieżka widoku:** `/offers/new`
- **Główny cel:** Umożliwienie rekruterowi dodania nowej oferty pracy do systemu.
- **Kluczowe informacje do wyświetlenia:** Formularz do wprowadzenia danych nowej oferty.
- **Kluczowe komponenty widoku:**
    - Pole tekstowe na tytuł stanowiska.
    - Pole tekstowe (textarea) na opis.
    - Pole do wprowadzania słów kluczowych (np. jako tagi).
    - Przycisk "Utwórz ofertę".
- **UX, dostępność i względy bezpieczeństwa:**
    - **UX:** Prosty formularz. Po pomyślnym utworzeniu oferty użytkownik jest przekierowywany do panelu głównego (`/dashboard`). Przycisk jest blokowany na czas operacji API.
    - **Dostępność:** Wszystkie pola formularza mają etykiety i są dostępne z klawiatury.
    - **Bezpieczeństwo:** Dane są walidowane przed wysłaniem do API.

## 3. Mapa podróży użytkownika

**Główny przypadek użycia: Przegląd i ocena kandydatów**

1.  **Logowanie:** Rekruter otwiera aplikację i ląduje na stronie `/login`. Wprowadza swoje dane i klika "Zaloguj się".
2.  **Panel Główny:** Po pomyślnym zalogowaniu zostaje przekierowany na `/dashboard`. Widzi listę swoich ofert pracy wraz z podstawowymi statystykami.
3.  **Wybór oferty:** Rekruter klika na kartę oferty, która go interesuje (np. "Frontend Developer").
4.  **Widok Szczegółów Oferty:** System przenosi go do widoku `/offers/{id}`. Użytkownik widzi pełne statystyki, listę słów kluczowych oraz dwie sekcje z CV.
5.  **Analiza CV:** Rekruter przegląda CV w sekcji "Zakwalifikowane". Na każdej karcie widzi procent dopasowania oraz tagi ze słowami kluczowymi (zielone - dopasowane, czerwone - brakujące).
6.  **Zmiana statusu:** Rekruter decyduje, że jedno z CV, mimo automatycznej kwalifikacji, nie pasuje. Klika przycisk "Odrzuć" na karcie tego CV.
7.  **Aktualizacja interfejsu:** Karta CV zostaje natychmiast przeniesiona do sekcji "Odrzucone CV". Liczniki w panelu statystyk ("Zakwalifikowane" i "Odrzucone") zostają zaktualizowane. Pojawia się komunikat "Operacja wykonana".
8.  **Edycja słów kluczowych:** Rekruter zauważa, że warto dodać nowe słowo kluczowe do oferty. W panelu słów kluczowych klika "Edytuj", dodaje nowe słowo, a następnie klika "Zapisz".
9.  **Powrót do panelu:** Po zakończeniu pracy z ofertą, rekruter może wrócić do panelu głównego, korzystając z nawigacji.

## 4. Układ i struktura nawigacji

Nawigacja w aplikacji jest prosta i opiera się na bezpośrednich przejściach między widokami.

- **Nawigacja główna (po zalogowaniu):**
    - Logo aplikacji lub link "Dashboard" w nagłówku, prowadzący zawsze do `/dashboard`.
    - Przycisk/ikona wylogowania.
- **Przepływ nawigacyjny:**
    - `/login` -> `/dashboard` (po udanym logowaniu)
    - `/register` -> `/dashboard` (po udanej rejestracji)
    - `/dashboard` -> `/offers/new` (po kliknięciu "Dodaj nową ofertę")
    - `/dashboard` -> `/offers/{id}` (po kliknięciu w kartę oferty)
    - `/offers/{id}` -> `/dashboard` (poprzez link w nawigacji głównej)
    - `/offers/new` -> `/dashboard` (po pomyślnym utworzeniu oferty)

Nie ma potrzeby stosowania skomplikowanej, wielopoziomowej nawigacji w ramach MVP.

## 5. Kluczowe komponenty

- **`JobOfferCard`:** Komponent wielokrotnego użytku wyświetlany na `/dashboard`. Zawiera tytuł oferty, statystyki (zakwalifikowane/odrzucone CV) i stanowi klikalny element prowadzący do szczegółów oferty.
- **`CVCard`:** Wyświetlany w widoku `/offers/{id}`. Prezentuje kluczowe dane kandydata: imię i nazwisko, procent dopasowania, listę tagów ze słowami kluczowymi (dopasowane/brakujące) oraz przyciski akcji ("Akceptuj"/"Odrzuć") do zmiany statusu.
- **`StatisticsPanel`:** Komponent w widoku `/offers/{id}`, składający się z trzech bloczków, które dynamicznie wyświetlają całkowitą liczbę CV oraz liczbę zakwalifikowanych i odrzuconych.
- **`KeywordsPanel`:** Komponent w widoku `/offers/{id}`, który wyświetla listę słów kluczowych powiązanych z ofertą. Posiada dwa stany: widoku i edycji, umożliwiając rekruterowi aktualizację słów kluczowych.
- **`GlobalNotification` (Toast):** Komponent służący do wyświetlania globalnych powiadomień o sukcesie (np. "Operacja wykonana") lub błędach (np. "Przepraszamy, wystąpił błąd"), zapewniając spójny feedback dla użytkownika.
