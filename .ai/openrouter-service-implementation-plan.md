# Przewodnik Implementacji Usługi OpenRouter

## 1. Opis usługi

`OpenRouterService` to klasa TypeScript zaprojektowana jako centralny punkt interakcji z API OpenRouter. Jej celem jest abstrakcja złożoności bezpośrednich wywołań API, zapewniając bezpieczny, reużywalny i łatwy w utrzymaniu interfejs do komunikacji z różnymi modelami LLM. Usługa będzie działać jako funkcja serwerowa (Supabase Edge Function), aby chronić klucze API i zarządzać logiką po stronie serwera.

## 2. Opis konstruktora

Konstruktor inicjalizuje usługę, konfigurując kluczowe parametry.

```typescript
constructor(apiKey: string, defaultModel?: string);
```

-   `apiKey`: Klucz API OpenRouter. Będzie on wstrzykiwany ze zmiennych środowiskowych po stronie serwera, aby nigdy nie był eksponowany po stronie klienta.
-   `defaultModel` (opcjonalny): Nazwa domyślnego modelu (np. `anthropic/claude-3.5-sonnet`), który będzie używany, jeśli żaden inny model nie zostanie określony w wywołaniu metody.

## 3. Publiczne metody i pola

### `public async getChatCompletion(options: ChatCompletionOptions): Promise<any>`

Główna metoda usługi, która wysyła zapytanie do API OpenRouter i zwraca odpowiedź modelu.

**Parametry (`ChatCompletionOptions`):**

-   `systemPrompt`: (string) Instrukcja systemowa definiująca rolę i zachowanie modelu.
-   `userPrompt`: (string) Wiadomość od użytkownika.
-   `model`: (string, opcjonalny) Nazwa modelu do użycia, np. `openai/gpt-4o`. Zastępuje domyślny model.
-   `responseFormat`: (object, opcjonalny) Definiuje schemat JSON dla ustrukturyzowanych odpowiedzi.
-   `temperature`: (number, opcjonalny) Kontroluje losowość odpowiedzi (np. `0.7`).
-   `maxTokens`: (number, opcjonalny) Maksymalna liczba tokenów w odpowiedzi.

**Przykład użycia:**

```typescript
const response = await openRouterService.getChatCompletion({
  systemPrompt: "Jesteś asystentem rekrutacyjnym. Analizujesz CV.",
  userPrompt: "Przeanalizuj to CV: [treść CV] i oceń dopasowanie do oferty na stanowisko 'Frontend Developer' ze słowami kluczowymi: React, TypeScript.",
  model: "anthropic/claude-3.5-sonnet",
  responseFormat: {
    type: 'json_schema',
    json_schema: {
      name: 'cv_analysis_schema',
      strict: true,
      schema: {
        type: 'object',
        properties: {
          matchPercentage: { type: 'number', description: 'Procentowe dopasowanie CV do oferty (0-100).' },
          matchingKeywords: { type: 'array', items: { type: 'string' }, description: 'Lista słów kluczowych z oferty znalezionych w CV.' },
          summary: { type: 'string', description: 'Krótkie, 3-zdaniowe podsumowanie kandydata.' },
          isRecommended: { type: 'boolean', description: 'Czy kandydat jest rekomendowany do dalszego etapu.' }
        },
        required: ['matchPercentage', 'summary', 'isRecommended']
      }
    }
  }
});
```

## 4. Prywatne metody i pola

### `private readonly apiKey: string;`

Przechowuje klucz API OpenRouter.

### `private readonly defaultModel: string;`

Przechowuje nazwę domyślnego modelu.

### `private readonly openRouterApiUrl: string = "https://openrouter.ai/api/v1/chat/completions";`

Statyczny adres URL punktu końcowego API.

### `private buildRequestPayload(options: ChatCompletionOptions): object`

Prywatna metoda pomocnicza do budowania obiektu żądania (payload) zgodnie ze specyfikacją API OpenRouter na podstawie przekazanych opcji.

### `private async sendRequest(payload: object): Promise<any>`

Prywatna metoda odpowiedzialna za wysłanie żądania `fetch` do API, obsługę nagłówków autoryzacji i zwrócenie odpowiedzi.

## 5. Obsługa błędów

Usługa będzie implementować scentralizowaną obsługę błędów, rzucając niestandardowe wyjątki, które mogą być przechwytywane przez kod wywołujący.

-   `OpenRouterAPIError`: Rzucany w przypadku odpowiedzi API ze statusem błędu (4xx, 5xx). Zawiera status, kod błędu i wiadomość z API.
-   `NetworkError`: Rzucany w przypadku problemów z połączeniem sieciowym.
-   `ValidationError`: Rzucany, gdy odpowiedź JSON nie jest zgodna z wymaganym schematem `responseFormat`.

## 6. Kwestie bezpieczeństwa

1.  **Ochrona klucza API:** Klucz API OpenRouter **nigdy** nie może być przechowywany ani używany po stronie klienta. Usługa musi być wdrożona jako funkcja serwerowa (Supabase Edge Function), a klucz API musi być przechowywany jako sekret w zmiennych środowiskowych Supabase.
2.  **Walidacja danych wejściowych:** Dane wejściowe od użytkownika (`userPrompt`) powinny być oczyszczane z potencjalnie szkodliwego kodu (np. skryptów) przed wysłaniem do API, aby zapobiec atakom typu Prompt Injection.
3.  **Zarządzanie kosztami:** Należy zaimplementować mechanizmy ograniczające nadużycia, np. poprzez ustawienie rozsądnego `maxTokens` i monitorowanie użycia API.

## 7. Plan wdrożenia krok po kroku

### Krok 1: Konfiguracja projektu Supabase

1.  Przejdź do panelu swojego projektu na `supabase.com`.
2.  W sekcji `Project Settings` > `Secrets`, dodaj nowy sekret o nazwie `OPENROUTER_API_KEY` i wklej swój klucz API OpenRouter.

### Krok 2: Utworzenie funkcji Supabase Edge Function

1.  W lokalnym projekcie, w katalogu `supabase/functions`, utwórz nowy folder dla usługi, np. `analyze-cv`.
2.  Wewnątrz `supabase/functions/analyze-cv/`, utwórz plik `index.ts`. Będzie to punkt wejścia dla naszej funkcji.

### Krok 3: Implementacja `OpenRouterService` w `index.ts`

W pliku `supabase/functions/analyze-cv/index.ts` zaimplementuj klasę `OpenRouterService` zgodnie ze specyfikacją opisaną w tym dokumencie.

```typescript
// supabase/functions/analyze-cv/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Definicje niestandardowych błędów (np. OpenRouterAPIError)

// Definicja interfejsu ChatCompletionOptions

class OpenRouterService {
  private readonly apiKey: string;
  private readonly defaultModel: string;
  private readonly openRouterApiUrl = "https://openrouter.ai/api/v1/chat/completions";

  constructor(apiKey: string, defaultModel: string = "anthropic/claude-3.5-sonnet") {
    if (!apiKey) {
      throw new Error("OpenRouter API key is required.");
    }
    this.apiKey = apiKey;
    this.defaultModel = defaultModel;
  }

  // Implementacja metody publicznej getChatCompletion(options)
  
  // Implementacja metod prywatnych buildRequestPayload(options) i sendRequest(payload)
}

serve(async (req) => {
  // 1. Sprawdź, czy metoda to POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    // 2. Pobierz klucz API ze zmiennych środowiskowych
    const apiKey = Deno.env.get("OPENROUTER_API_KEY");
    if (!apiKey) {
      throw new Error("Server configuration error: API key not found.");
    }

    // 3. Zainicjalizuj usługę
    const service = new OpenRouterService(apiKey);

    // 4. Sparsuj body żądania z frontendu
    const requestBody = await req.json();
    
    // 5. Wywołaj usługę z opcjami z body
    const completion = await service.getChatCompletion(requestBody);

    // 6. Zwróć odpowiedź do klienta
    return new Response(JSON.stringify(completion), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    // Obsługa błędów i zwracanie odpowiedniego statusu HTTP
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
```

### Krok 4: Integracja z frontendem Next.js

1.  W komponencie frontendowym, który ma korzystać z analizy AI (np. w `OfferDetailsPage`), utwórz funkcję, która będzie wywoływać wdrożoną funkcję Supabase.
2.  Użyj klienta Supabase JS, aby bezpiecznie wywołać funkcję.

```typescript
// Przykład w komponencie React
import { supabase } from '@/lib/supabase'; // Załóżmy, że klient Supabase jest tu skonfigurowany

async function analyzeCvWithAI(cvContent: string) {
  const { data, error } = await supabase.functions.invoke('analyze-cv', {
    body: {
      systemPrompt: "Jesteś asystentem rekrutacyjnym...",
      userPrompt: `Przeanalizuj to CV: ${cvContent}`,
      // ... inne opcje, w tym responseFormat
    },
  });

  if (error) {
    console.error("Błąd wywołania funkcji AI:", error);
    // Obsłuż błąd w UI, np. pokazując powiadomienie toast
    return null;
  }

  return data;
}
```

Dzięki takiemu podejściu cała logika interakcji z OpenRouter, wraz z kluczem API, jest bezpiecznie zamknięta na serwerze, a frontend jedynie konsumuje gotowe wyniki.