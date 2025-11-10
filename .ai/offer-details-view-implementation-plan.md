# Plan implementacji widoku Offer Details

## 1. Przegląd
Widok `Offer Details` jest centralnym miejscem zarządzania pojedynczą ofertą pracy. Umożliwia rekruterowi przeglądanie statystyk, edycję słów kluczowych oferty oraz, co najważniejsze, weryfikację i zmianę statusu CV kandydatów, które zostały wstępnie zakwalifikowane przez system. Widok ten bezpośrednio realizuje kluczowe historyjki użytkownika związane z przeglądaniem, akceptacją i odrzucaniem CV.

## 2. Routing widoku
Widok będzie dostępny pod dynamiczną ścieżką: `/offers/[id]`, gdzie `[id]` to unikalny identyfikator oferty pracy. Implementacja w Next.js App Router będzie zlokalizowana w pliku `hr-helper/src/app/offers/[id]/page.tsx`.

## 3. Struktura komponentów
Komponenty będą zorganizowane w następującej hierarchii. Wszystkie komponenty będą komponentami klienckimi (`"use client"`) ze względu na interaktywność i zarządzanie stanem.

```
OfferDetailsPage (Komponent główny strony)
├── StatisticsPanel
│   ├── StatCard (x3)
├── KeywordsPanel
│   ├── Badge (dla każdego słowa kluczowego)
│   ├── Input (w trybie edycji)
│   └── Button (do zapisu)
├── CVList (dla zakwalifikowanych)
│   └── CVCard (dla każdego CV)
│       ├── Badge (dla słów kluczowych)
│       └── Button (do zmiany statusu)
└── CVList (dla odrzuconych)
    └── CVCard (dla każdego CV)
        ├── Badge (dla słów kluczowych)
        └── Button (do zmiany statusu)
```

## 4. Szczegóły komponentów

### `OfferDetailsPage`
- **Opis:** Główny kontener widoku, odpowiedzialny za pobieranie danych, zarządzanie stanem i koordynację komponentów podrzędnych.
- **Główne elementy:** `div` jako główny kontener, nagłówek `h1` z tytułem oferty.
- **Obsługiwane interakcje:** Brak bezpośrednich interakcji, deleguje je do komponentów podrzędnych.
- **Obsługiwana walidacja:** Sprawdza, czy oferta pracy została poprawnie załadowana.
- **Typy:** `JobOfferDTO`, `CVDTO`, `JobOfferStatsDTO`.
- **Propsy:** `params: { id: string }` (dostarczane przez Next.js).

### `StatisticsPanel`
- **Opis:** Wyświetla panel ze statystykami dotyczącymi aplikacji na daną ofertę.
- **Główne elementy:** Kontener `div` z trzema komponentami `StatCard`.
- **Obsługiwane interakcje:** Brak.
- **Obsługiwana walidacja:** Brak.
- **Typy:** `JobOfferStatsDTO`.
- **Propsy:** `stats: JobOfferStatsDTO`.

### `KeywordsPanel`
- **Opis:** Wyświetla listę słów kluczowych powiązanych z ofertą i umożliwia ich edycję.
- **Główne elementy:** Kontener `div`, komponenty `Badge` dla tagów, `Input` do edycji, `Button` do zapisu i przełączania trybu.
- **Obsługiwane interakcje:** Kliknięcie przycisku "Edytuj" przełącza komponent w tryb edycji. Kliknięcie "Zapisz" wysyła zmiany do API.
- **Obsługiwana walidacja:** Sprawdza, czy pole edycji nie jest puste.
- **Typy:** `JobOfferDTO`.
- **Propsy:** `offer: JobOfferDTO`, `onUpdate: (updatedKeywords: string[]) => Promise<void>`.

### `CVList`
- **Opis:** Kontener na listę CV, wizualnie oddziela sekcje "Zakwalifikowane" i "Odrzucone".
- **Główne elementy:** `section` z tłem (zielonym lub czerwonym), nagłówek `h2` i lista komponentów `CVCard`.
- **Obsługiwane interakcje:** Brak, deleguje do `CVCard`.
- **Obsługiwana walidacja:** Brak.
- **Typy:** `CVDTO`.
- **Propsy:** `title: string`, `cvs: CVDTO[]`, `onStatusChange: (cvId: number, newStatus: 'accepted' | 'rejected') => Promise<void>`.

### `CVCard`
- **Opis:** Reprezentuje pojedyncze CV kandydata. Wyświetla kluczowe informacje i pozwala na zmianę statusu.
- **Główne elementy:** `div` (karta), `p` na imię i nazwisko, `p` na procent dopasowania, `div` z tagami (`Badge`), `Button` do akcji.
- **Obsługiwane interakcje:** Kliknięcie przycisku "Akceptuj" lub "Odrzuć" wywołuje `onStatusChange`.
- **Obsługiwana walidacja:** Brak.
- **Typy:** `CVDTO`.
- **Propsy:** `cv: CVDTO`, `onStatusChange: (cvId: number, newStatus: 'accepted' | 'rejected') => Promise<void>`.

## 5. Typy
Oprócz istniejących typów DTO (`JobOfferDTO`, `CVDTO`, `JobOfferStatsDTO`) zdefiniowanych w `src/types.ts`, nie przewiduje się potrzeby tworzenia złożonych, nowych typów ViewModel. Komponenty będą operować bezpośrednio na DTO.

## 6. Zarządzanie stanem
Zarządzanie stanem zostanie zaimplementowane w głównym komponencie `OfferDetailsPage` przy użyciu hooków `useState` i `useEffect`.

- `const [offer, setOffer] = useState<JobOfferDTO | null>(null);` - Przechowuje dane oferty.
- `const [stats, setStats] = useState<JobOfferStatsDTO | null>(null);` - Przechowuje statystyki.
- `const [cvs, setCvs] = useState<CVDTO[]>([]);` - Przechowuje listę wszystkich CV.
- `const [loading, setLoading] = useState<boolean>(true);` - Zarządza stanem ładowania danych.
- `const [error, setError] = useState<string | null>(null);` - Przechowuje komunikaty o błędach.

Nie ma potrzeby tworzenia customowego hooka, ponieważ logika jest zamknięta w obrębie jednego widoku.

## 7. Integracja API
Komponent `OfferDetailsPage` będzie odpowiedzialny za komunikację z API.

1.  **Pobieranie danych początkowych (w `useEffect`):**
    - `GET /api/job_offers/{id}` -> Pobranie szczegółów oferty.
    - `GET /api/job_offers/{id}/stats` -> Pobranie statystyk.
    - `GET /api/job_offers/{id}/cvs` -> Pobranie wszystkich CV.
    Wszystkie trzy wywołania powinny być wykonane równolegle za pomocą `Promise.all`.

2.  **Aktualizacja słów kluczowych (w `KeywordsPanel`):**
    - `PUT /api/job_offers/{id}`
    - **Request Body:** `JobOfferUpdateCommand` (`{ keywords: string[] }`)
    - **Response:** Po sukcesie, strona powinna odświeżyć stan oferty.

3.  **Zmiana statusu CV (w `CVCard`):**
    - `PATCH /api/job_offers/{id}/cvs/{cvId}`
    - **Request Body:** `CVUpdateCommand` (`{ status: 'accepted' | 'rejected' }`)
    - **Response:** Po sukcesie, komponent `OfferDetailsPage` zaktualizuje stan `cvs` i `stats`, aby natychmiastowo odzwierciedlić zmianę w interfejsie.

## 8. Interakcje użytkownika
- **Przeglądanie:** Użytkownik może przewijać listy zakwalifikowanych i odrzuconych CV.
- **Zmiana statusu CV:** Kliknięcie przycisku "Akceptuj" lub "Odrzuć" na `CVCard` natychmiast przenosi kartę do odpowiedniej sekcji i aktualizuje liczniki w `StatisticsPanel`. Przycisk na karcie powinien być zablokowany na czas operacji API.
- **Edycja słów kluczowych:** Kliknięcie "Edytuj" w `KeywordsPanel` aktywuje tryb edycji. Po modyfikacji, kliknięcie "Zapisz" wysyła żądanie do API i aktualizuje widok.

## 9. Warunki i walidacja
- **Dostęp:** Widok musi być chroniony. Niezalogowany użytkownik powinien być przekierowany do `/login`. Użytkownik niebędący właścicielem oferty powinien zobaczyć błąd 403/404.
- **Edycja słów kluczowych:** Przycisk "Zapisz" jest aktywny tylko wtedy, gdy lista słów kluczowych uległa zmianie.
- **Stan ładowania:** Podczas pobierania danych z API, widok powinien wyświetlać komponent szkieletowy (skeleton UI), aby poinformować użytkownika o trwającym procesie.

## 10. Obsługa błędów
- **Błąd pobierania danych:** Jeśli którekolwiek z początkowych żądań API zawiedzie, należy wyświetlić centralny komunikat o błędzie, np. "Nie udało się załadować danych oferty. Spróbuj ponownie później."
- **Błąd aktualizacji:** W przypadku niepowodzenia aktualizacji słów kluczowych lub statusu CV, należy wyświetlić powiadomienie typu "toast" z komunikatem o błędzie (np. "Operacja nie powiodła się") i przywrócić poprzedni stan UI, jeśli to konieczne.
- **Oferta nieznaleziona (404):** Jeśli API zwróci błąd 404 dla oferty, należy wyświetlić dedykowaną stronę lub komunikat "Oferta nie została znaleziona".

## 11. Kroki implementacji
1.  **Struktura plików:** Utwórz plik `hr-helper/src/app/offers/[id]/page.tsx` oraz pliki dla komponentów podrzędnych w `hr-helper/src/components/`, np. `StatisticsPanel.tsx`, `KeywordsPanel.tsx`, `CVList.tsx`, `CVCard.tsx`.
2.  **Komponent główny (`OfferDetailsPage`):** Zaimplementuj logikę pobierania danych (`JobOffer`, `Stats`, `CVs`) w hooku `useEffect` z użyciem `Promise.all`. Dodaj obsługę stanu ładowania i błędów.
3.  **Komponenty statyczne:** Zbuduj `StatisticsPanel` i `StatCard`, które jedynie wyświetlają dane przekazane w propsach.
4.  **Komponent `CVList` i `CVCard`:** Zaimplementuj listy CV, filtrując dane na podstawie statusu. Przekaż funkcję do zmiany statusu (`handleStatusChange`) z `OfferDetailsPage` do `CVCard`.
5.  **Logika zmiany statusu CV:** W `OfferDetailsPage` stwórz funkcję `handleStatusChange`, która wywołuje API (`PATCH /api/job_offers/{id}/cvs/{cvId}`). Po pomyślnej odpowiedzi zaktualizuj stany `cvs` i `stats`, aby UI odzwierciedlało zmianę bez przeładowania strony.
6.  **Komponent `KeywordsPanel`:** Zaimplementuj logikę przełączania między trybem wyświetlania a edycji. Stwórz funkcję `handleKeywordsUpdate`, która wywołuje API (`PUT /api/job_offers/{id}`).
7.  **Stylowanie:** Ostyluj wszystkie komponenty zgodnie z `ui-architecture.md`, używając Tailwind CSS. Zwróć szczególną uwagę na tła sekcji CV (zielone/czerwone) i tagi słów kluczowych.
8.  **Obsługa przypadków brzegowych:** Dodaj szkielety UI (skeleton components) na czas ładowania danych oraz zaimplementuj wyświetlanie komunikatów o błędach i powiadomień "toast".
9.  **Testowanie:** Ręcznie przetestuj wszystkie interakcje użytkownika, w tym pomyślne ścieżki oraz scenariusze błędów.
