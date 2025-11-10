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
 - System nie oferuje możliwości rejestracji przez zewnętrzne serwisy (np. Google, GitHub)

### US-002: Logowanie i wylogowanie użytkownika
- Tytuł: Bezpieczne logowanie i wylogowanie rekrutera
- Opis: Jako rekruter chcę mieć możliwość bezpiecznego logowania się do systemu i wylogowania, aby mieć kontrolę nad dostępem do swoich ofert i przesłanych CV.
- Kryteria akceptacji:
  - Użytkownik musi wprowadzić poprawny identyfikator i hasło
  - System powinien zabezpieczać dane poprzez hashowanie haseł
  - W przypadku błędnych danych wyświetlane jest odpowiednie powiadomienie o błędzie
  - W prawym górnym rogu interfejsu znajduje się przycisk wylogowania
  - Po wylogowaniu użytkownik jest przekierowywany do strony logowania
  - System nie oferuje logowania przez zewnętrzne serwisy

### US-002a: Odzyskiwanie hasła
- Tytuł: Odzyskiwanie dostępu do konta
- Opis: Jako użytkownik chcę mieć możliwość odzyskania dostępu do swojego konta w przypadku zapomnienia hasła
- Kryteria akceptacji:
  - Na stronie logowania dostępna jest opcja "Zapomniałem hasła"
  - System wymaga podania adresu email użytego przy rejestracji
  - Na podany adres email wysyłany jest link do resetowania hasła
  - Po kliknięciu w link użytkownik może ustawić nowe hasło
  - System wymaga potwierdzenia nowego hasła przez jego dwukrotne wpisanie

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

### US-009: Tworzenie oferty pracy
- Tytuł: Dodawanie nowej oferty pracy
- Opis: Jako rekruter chcę mieć możliwość utworzenia nowej oferty pracy, aby rozpocząć proces rekrutacji
- Kryteria akceptacji:
  - Dostępny jest formularz tworzenia nowej oferty pracy
  - Formularz zawiera pola: tytuł stanowiska, opis, wymagania, słowa kluczowe
  - Wszystkie pola są walidowane przed zapisem
  - Po zapisie oferta jest widoczna na liście ofert rekrutera
  - System wyświetla potwierdzenie utworzenia oferty

### US-010: Edycja oferty pracy
- Tytuł: Modyfikacja istniejącej oferty pracy
- Opis: Jako rekruter chcę mieć możliwość edycji utworzonej oferty pracy, aby aktualizować jej treść
- Kryteria akceptacji:
  - Dla każdej oferty dostępna jest opcja edycji
  - W formularzu edycji wyświetlane są aktualne dane oferty
  - Wszystkie pola można modyfikować
  - System wyświetla potwierdzenie zapisania zmian
  - Historia modyfikacji jest zapisywana w systemie

### US-011: Usuwanie oferty pracy
- Tytuł: Usuwanie oferty pracy z systemu
- Opis: Jako rekruter chcę mieć możliwość usunięcia oferty pracy, która nie jest już aktualna
- Kryteria akceptacji:
  - Dla każdej oferty dostępna jest opcja usunięcia
  - System wymaga potwierdzenia przed usunięciem
  - Po usunięciu oferta nie jest już widoczna na liście
  - System wyświetla potwierdzenie usunięcia
  - Usunięcie oferty nie usuwa historii związanej z przeprowadzoną rekrutacją

## 6. Metryki sukcesu

- Co najmniej 75% pozytywnych ocen rekruterów, mierzone poprzez ankiety po użyciu systemu.
- Skuteczność selekcji: 75% CV zakwalifikowanych przez system odpowiada wynikowi ręcznej weryfikacji na próbce testowej.
- Stabilność systemu: Wszystkie automatyczne testy przepływu przechodzą pomyślnie przy każdym wdrożeniu.

## Interfejs Rekrutera
Po zalogowaniu, rekruter widzi dashboard zawierający:
- Przegląd 3 ofert pracy z wyświetloną liczbą nadesłanych CV, gdzie:
  - Ilość CV zaakceptowanych jest oznaczona napisana zielonym kolorem,
  - Ilość CV odrzuconych jest naznaczona czerwonym kolorem.
- Każda oferta zawiera tytuł oraz powiązane słowa kluczowe (modyfikowalne przez rekrutera).
- Po kliknięciu na ofertę pojawia się podsumowanie zawierające:
  - Całkowitą liczbę CV,
  - Liczbę CV odrzuconych,
  - Liczbę CV zaakceptowanych,
  - Listę słów kluczowych wraz z ich ilością.
- Następnie, interfejs podzielony jest na dwie sekcje:
  - Zakwalifikowane CV: zawiera imiona i nazwiska kandydatów, liczbę dopasowanych słów kluczowych oraz procent dopasowania do oferty. Sekcja ma zielone tło.
  - Odrzucone CV: zawiera liczbę dopasowanych słów kluczowych, procent dopasowania oraz listę słów kluczowych, które pojawiły się w CV, jeśli takie wystąpiły. Tło czerwone.
