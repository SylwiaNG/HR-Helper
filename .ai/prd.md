# Dokument wymagań produktu (PRD) - HR Helper

## 1. Przegląd produktu

Aplikacja web służy do usprawnienia procesu selekcji CV poprzez automatyczną analizę oraz ręczną weryfikację dokumentów przez rekruterów. System umożliwia przeglądanie, selekcję oraz usuwanie nieodpowiadających ofercie CV, ograniczając manualną pracę i eliminując niezgodne dokumenty aplikacyjne.

## 2. Problem użytkownika

Rekruterzy tracą dużo czasu na ręczne przeglądanie setek CV, z których wiele nie jest dopasowanych do konkretnej oferty pracy. Problemem jest zarówno czasochłonność tego procesu, jak i nieefektywność przeglądania potencjalnie nieodpowiednich kandydatów.

## 3. Wymagania funkcjonalne

- Przeglądanie CV: Umożliwienie rekruterowi przeglądania przesłanych CV w jednym, zorganizowanym miejscu.
- Selekcja CV: Automatyczna analiza CV pod kątem słów kluczowych w celu wstępnego przyporządkowania dokumentu jako pasujący lub niepasujący.
- Usuwanie CV: Możliwość usunięcia dokumentów, które nie spełniają kryteriów oferty pracy.
- Akceptacja CV: Opcja zachowania CV, które są zgodne z wymaganiami oferty (na podstawie słów kluczowych).
- Proste logowanie: Umożliwienie bezpiecznego logowania i autoryzacji rekrutera.

## 4. Granice produktu

W zakresie MVP nie będą wdrażane następujące funkcjonalności:

- Porównywanie jednego CV do kilku ofert
- Porównywanie kandydatów między sobą
- Wysyłka maili z podziękowaniem dla odrzuconych kandydatów
- Możliwość sortowania CV od najlepszych do najmniej pasujących
- Generowanie raportów
- Aplikacja mobilna (wdrażamy początkowo tylko wersję webową)
- Integracje z innymi aplikacjami

## 5. Historyjki użytkowników

### US-001: Rejestracja użytkownika
- Tytuł: Rejestracja użytkownika
- Opis: Jako nowy użytkownik chcę się zarejestrować, aby mieć dostęp do swoich ofert pracy i CV kandydatów
- Kryteria akceptacji:
 - Formularz rejestracyjny zawiera pola do wpisania adresu e-mail oraz hasła
 - Po poprawnym uzupełnieniu danych i weryfikacji danych konto jest aktywowane
 - Użytkownik zostaje zalogowany i otrzymuje dostęp do swojego konta

### US-002: Logowanie użytkownika
- Tytuł: Bezpieczne logowanie rekrutera
- Opis: Jako rekruter chcę mieć możliwość bezpiecznego logowania się do systemu, aby mieć dostęp do swoich ofert i przesłanych CV.
- Kryteria akceptacji:
  - Użytkownik musi wprowadzić poprawny identyfikator i hasło.
  - System powinien zabezpieczać dane poprzez hashowanie haseł.
  - W przypadku błędnych danych wyświetlane jest odpowiednie powiadomienie o błędzie.

### US-003: Przeglądanie CV
- Tytuł: Widok listy CV
- Opis: Jako rekruter chcę móc przeglądać listę przesłanych CV, aby szybko zapoznać się z dokumentami kandydatów.
- Kryteria akceptacji:
  - Oferta pracy jest widoczna po zalogowaniu
  - Lista CV jest widoczna po zalogowaniu.
  - CV są podzielone na odrzucone i wstępnie zaakceptowane
  - Każde CV zawiera podstawowe informacje (np. imię, nazwisko, doświadczenie, słowa kluczowe).
  - Możliwość sortowania lub filtrowania nie jest wdrożona w MVP.

### US-004: Automatyczna selekcja CV
- Tytuł: Automatyczna analiza dokumentów
- Opis: System automatycznie analizuje CV pod kątem dopasowania do oferty pracy, przypisując wstępny status na podstawie występowania słów kluczowych.
- Kryteria akceptacji:
  - System analizuje każde CV z wykorzystaniem prostego dopasowania słów kluczowych.
  - Wynik analizy (np. procent dopasowania lub liczba dopasowanych słów kluczowych) jest widoczny dla rekrutera.

### US-005: Ręczna zmiana statusu CV
- Tytuł: Zarządzanie statusem CV
- Opis: Jako rekruter chcę mieć możliwość ręcznej zmiany statusu CV (akceptacja lub odrzucenie), aby mieć kontrolę nad finalną selekcją kandydatów.
- Kryteria akceptacji:
  - Rekruter może otworzyć szczegóły CV i zmienić jego status.
  - Zmiany statusu są natychmiast aktualizowane w systemie.

### US-006: Panel statystyk oferty
- Tytuł: Wyświetlanie statystyk rekrutacyjnych
- Opis: Jako rekruter chcę widzieć panel z danymi dotyczącymi oferty pracy, w tym liczbę przesłanych CV oraz statystyki akceptacji i odrzucenia, aby lepiej ocenić skuteczność rekrutacji.
- Kryteria akceptacji:
  - Po zalogowaniu system wyświetla panel statystyk wraz z podstawowymi danymi.
  - Informacje o liczbie CV i ich statusie są aktualizowane dynamicznie.

### US-007: Walidacja przepływu automatycznego testu
- Tytuł: Automatyczny test przepływu rekrutacyjnego
- Opis: Jako członek zespołu projektowego chcę uruchomić automatyczny test, który weryfikuje cały przepływ (analiza CV, klasyfikacja, prezentacja wyników), aby upewnić się, że najważniejsze funkcjonalności działają poprawnie.
- Kryteria akceptacji:
  - Test automatyczny sprawdza czy CV są analizowane, klasyfikowane i wyświetlane zgodnie z wymaganiami.
  - Wynik testu jest raportowany i widoczny dla zespołu.

### US-008: Bezpieczny dostęp i autoryzacja
- Tytuł: Zalogowany użytkownik może mieć dostęp tylko do swoich ofert i nadesłanych na nie CV
- Opis: Tylko zalogowany użytkownik może mieć dostęp do swoich ofert i wysłanych CV
- Nie ma dostępu do ofert i nadesłanych CV innych użytkowników

## 6. Metryki sukcesu

- Co najmniej 75% pozytywnych ocen rekruterów, mierzone poprzez ankiety po użyciu systemu.
- Skuteczność selekcji: 75% CV zakwalifikowanych przez system odpowiada wynikowi ręcznej weryfikacji na próbce testowej.
- Stabilność systemu: Wszystkie automatyczne testy przepływu przechodzą pomyślnie przy każdym wdrożeniu.
