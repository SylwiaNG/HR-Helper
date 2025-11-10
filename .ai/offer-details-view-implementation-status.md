# Status implementacji widoku Offer Details

## Zrealizowane kroki
- **Struktura plików:** Utworzono plik strony `hr-helper/src/app/offers/[id]/page.tsx` oraz pliki dla komponentów podrzędnych w `hr-helper/src/components/offers/`.
- **Komponent główny (`OfferDetailsPage`):** Zaimplementowano logikę zarządzania stanem (oferta, statystyki, CV) przy użyciu hooków `useState` i `useEffect`. Dodano obsługę stanu ładowania i błędów. Na tym etapie komponent korzysta z mockowanych danych.
- **Komponenty UI:** Stworzono unikalny, reużywalny komponent `CustomCard` w `hr-helper/src/components/ui/`, aby uniknąć problemów z zależnościami.
- **Panel statystyk:** Zbudowano komponenty `StatCard` i `StatisticsPanel`, które dynamicznie wyświetlają statystyki oferty. Zintegrowano `StatisticsPanel` z głównym widokiem strony.
- **Poprawki i stabilizacja:** Rozwiązano problemy z importami i zależnościami, doprowadzając widok do stanu, w którym renderuje się bez błędów.

## Kolejne kroki
- **Implementacja listy CV:** Zbudowanie komponentów `CVList` i `CVCard` do wyświetlania list zakwalifikowanych i odrzuconych CV.
- **Logika zmiany statusu CV:** Stworzenie w `OfferDetailsPage` funkcji `handleStatusChange` do aktualizacji statusu CV i przekazanie jej do komponentów `CVCard`.
- **Implementacja panelu słów kluczowych:** Rozpoczęcie prac nad komponentem `KeywordsPanel`, implementując na początek tryb wyświetlania słów kluczowych.
- **Stworzenie komponentu `Badge`:** Utworzenie prostego komponentu do wyświetlania tagów (słów kluczowych) w `CVCard` i `KeywordsPanel`.
