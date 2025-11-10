# Instrukcje Copilot - HR-Helper

Niniejszy dokument zawiera wskazówki dla agentów AI, aby mogli efektywnie pracować z kodem HR-Helper. Instrukcje te koncentrują się na architekturze projektu, istotnych workflow deweloperskich, konwencjach oraz wzorcach komunikacji w projekcie.

## 1. Architektura projektu

- **Framework i struktura**: Projekt oparty jest na Next.js i TypeScript. Główna logika aplikacji znajduje się w katalogu `src/app` (np. `layout.tsx`, `page.tsx`), a style w `src/app/globals.css`.
- **Pliki konfiguracyjne**: Ustawienia globalne znajdują się w plikach `next.config.ts`, `tsconfig.json`, `postcss.config.mjs` oraz reguły ESLint w `eslint.config.mjs`.

## 2. Workflow deweloperski

- **Instalacja i budowanie**: Użyj `npm install` do instalacji zależności. W trybie deweloperskim uruchamiaj `npm run dev`, a do produkcyjnych buildów używaj `npm run build`.
- **Debugowanie i linting**: Projekt korzysta z ESLint dla kontroli jakości kodu. Zwracaj uwagę na błędy Next.js i TypeScript podczas pracy nad stronami i komponentami.

## 3. Specyficzne konwencje projektu

- **Struktura plików**: Komponenty stron znajdują się w katalogu `src/app`. Stylizacja komponentów znajduje się w plikach CSS globalnych lub modułowych.
- **Nazewnictwo**: Pliki konfiguracyjne (np. `next-env.d.ts`, `next.config.ts`) są umieszczone w katalogu głównym, natomiast definicje layoutów i komponentów mieszczą się w `src/app`.
- **Wzorce projektowe**: Przykłady kompozycji komponentów można znaleźć w `layout.tsx`, a globalne style w `globals.css`.

## 4. Integracje i zależności zewnętrzne

- **Ekosystem Next.js**: Projekt wykorzystuje funkcje Next.js, takie jak serwerowe renderowanie oraz nową strukturę katalogu `app`. Wszelkie zmiany należy konsultować z dokumentacją Next.js.
- **Przetwarzanie CSS**: Konfiguracja PostCSS w `postcss.config.mjs` wpływa na całościową stylizację projektu.
- **Konfiguracja ESLint i TypeScript**: Wszelkie modyfikacje tych konfiguracji powinny być przetestowane, aby zapewnić ciągłość jakości kodu.

## 5. Wskazówki dla agentów AI

- **Świadomość kontekstu**: Podczas wdrażania zmian odwołuj się do plików takich jak `src/app/page.tsx` lub `next.config.ts`, aby zachować spójność architektury.
- **Intencje dewelopera**: Skoncentruj się na konkretnej i kontekstowej pomocy. Przykładowo, sugerując nowy komponent, dostosuj go do ustalonych wzorców w `layout.tsx`.
- **Utrzymanie kodu**: Jeśli proponowane zmiany mogą wpłynąć na komendy budowania lub lintingu, uwzględnij ten aspekt w swoich rekomendacjach.

*Proszę o informacje zwrotne, jeśli któraś sekcja jest niejasna lub wymaga dodatkowych szczegółów.*
