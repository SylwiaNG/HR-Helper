### **Specyfikacja Techniczna: Moduł Autentykacji i Autoryzacji**

Poniższy dokument opisuje architekturę i implementację funkcjonalności rejestracji, logowania, wylogowywania oraz odzyskiwania hasła w aplikacji HR Helper, zgodnie z wymaganiami z pliku `prd.md` i z wykorzystaniem stacku technologicznego opisanego w `tech-stack.md`.

---

### **1. Architektura Interfejsu Użytkownika (Frontend)**

Warstwa frontendowa zostanie oparta o Next.js App Router. Wprowadzimy rozróżnienie na trasy publiczne (dostępne dla niezalogowanych użytkowników) i prywatne (chronione, wymagające autentykacji).

#### **1.1. Struktura Katalogów i Routing**

Wprowadzimy grupowanie tras w katalogu `app`, aby oddzielić logikę i layouty dla różnych stanów autentykacji:

```
src/app/
├── (public)/
│   ├── login/
│   │   └── page.tsx       // Strona logowania
│   ├── register/
│   │   └── page.tsx       // Strona rejestracji
│   ├── reset-password/
│   │   └── page.tsx       // Strona do wysłania linku resetującego
│   └── update-password/
│       └── page.tsx       // Strona do ustawienia nowego hasła
│
├── (authed)/
│   ├── layout.tsx         // Layout dla zalogowanych użytkowników (np. z nawigacją)
│   └── page.tsx           // Główny dashboard po zalogowaniu (istniejący page.tsx)
│   └── offers/
│       └── ...            // Istniejące, chronione strony ofert
│
├── layout.tsx             // Główny layout aplikacji (zawierający <body /> i Supabase Listener)
└── globals.css
```

- **`(public)`**: Grupa dla stron dostępnych bez logowania. Będą one miały prosty layout, skoncentrowany na formularzu.
- **`(authed)`**: Grupa dla stron wymagających zalogowania. Będą współdzielić `(authed)/layout.tsx`, który może zawierać np. pasek nawigacyjny z przyciskiem "Wyloguj".
- **`src/app/page.tsx`** zostanie przeniesiony do **`src/app/(authed)/page.tsx`**.

#### **1.2. Nowe Komponenty UI**

Utworzymy dedykowane, klienckie komponenty formularzy w `src/components/auth/`:

- **`LoginForm.tsx`**:
    - **Odpowiedzialność**: Zarządzanie stanem formularza logowania (email, hasło), walidacja po stronie klienta i obsługa zdarzenia `onSubmit`.
    - **Interakcja**: Po wysłaniu formularza wywołuje Server Action `signIn`. W przypadku błędu (np. nieprawidłowe dane) wyświetla komunikat zwrotny. Po sukcesie, router Next.js przekierowuje użytkownika na stronę główną.
- **`RegisterForm.tsx`**:
    - **Odpowiedzialność**: Zarządzanie stanem formularza rejestracji (email, hasło, powtórz hasło), walidacja i obsługa `onSubmit`.
    - **Interakcja**: Wywołuje Server Action `signUp`. Po pomyślnej rejestracji wyświetla komunikat o konieczności potwierdzenia adresu e-mail. Zgodnie z mechanizmem Supabase, sesja użytkownika zostanie utworzona dopiero po kliknięciu w link weryfikacyjny wysłany na e-mail, co realizuje kryterium "weryfikacji danych" i "aktywacji konta".
- **`ResetPasswordForm.tsx`**:
    - **Odpowiedzialność**: Zarządzanie stanem formularza odzyskiwania hasła (email).
    - **Interakcja**: Wywołuje Server Action `sendPasswordResetLink`. Wyświetla komunikat o wysłaniu linku resetującego.
- **`UpdatePasswordForm.tsx`**:
    - **Odpowiedzialność**: Zarządzanie stanem formularza zmiany hasła (nowe hasło, powtórz hasło). Komponent będzie odczytywał `code` z parametrów URL, który jest niezbędny do autoryzacji zmiany.
    - **Interakcja**: Wywołuje Server Action `updatePassword`. Po pomyślnej zmianie hasła, użytkownik jest informowany o sukcesie i może przejść do strony logowania.
- **`SignOutButton.tsx`**:
    - **Odpowiedzialność**: Przycisk do wylogowywania.
    - **Interakcja**: Umieszczony w layoucie dla zalogowanych użytkowników. Wywołuje Server Action `signOut`, która przekierowuje na stronę logowania.

#### **1.3. Walidacja i Obsługa Błędów**

- **Walidacja Client-Side**: Podstawowa walidacja (np. czy pole jest puste, czy email ma poprawny format) będzie realizowana w komponentach formularzy przed wysłaniem, aby zapewnić szybki feedback dla użytkownika.
- **Walidacja Server-Side**: Kluczowa walidacja będzie miała miejsce w Server Actions.
- **Komunikaty**: Błędy zwrócone z Server Actions (np. "Użytkownik o tym adresie e-mail już istnieje", "Nieprawidłowe hasło") będą przechwytywane w komponentach klienckich i wyświetlane użytkownikowi, np. przy użyciu komponentu `sonner`.

---

### **2. Logika Backendowa (Next.js Server Actions)**

Zamiast tradycyjnych endpointów API, wykorzystamy Server Actions, które upraszczają komunikację frontend-backend.

#### **2.1. Pliki i Struktura**

Logika autentykacji zostanie umieszczona w pliku `src/app/auth/actions.ts`.

```typescript
// src/app/auth/actions.ts

'use server';

import { createServerClient } from '@/lib/supabase/server'; // Implementacja klienta Supabase dla Server Components/Actions
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function signIn(formData: FormData) {
  // 1. Pobranie danych z formularza
  // 2. Walidacja danych (np. Zod)
  // 3. Wywołanie supabase.auth.signInWithPassword()
  // 4. W przypadku błędu, zwrot obiektu z błędem
  // 5. W przypadku sukcesu, rewalidacja ścieżki i przekierowanie
}

export async function signUp(formData: FormData) {
  // 1. Pobranie danych i walidacja
  // 2. Wywołanie supabase.auth.signUp()
  // 3. Obsługa błędu (np. użytkownik już istnieje) i sukcesu
}

export async function signOut() {
  // 1. Wywołanie supabase.auth.signOut()
  // 2. Przekierowanie na stronę logowania
}

export async function sendPasswordResetLink(formData: FormData) {
    // 1. Pobranie emaila i walidacja
    // 2. Wywołanie supabase.auth.resetPasswordForEmail()
    // 3. Zwrócenie komunikatu o sukcesie/błędzie
}

export async function updatePassword(formData: FormData) {
    // 1. Pobranie nowego hasła i kodu autoryzacyjnego
    // 2. Walidacja danych
    // 3. Wywołanie supabase.auth.updateUser()
    // 4. Obsługa błędu i sukcesu
}
```

#### **2.2. Ochrona Tras (Middleware)**

Kluczowym elementem autoryzacji będzie plik `src/middleware.ts`, który będzie przechwytywał wszystkie żądania przychodzące do aplikacji.

- **Odpowiedzialność**:
    1. Sprawdzenie, czy użytkownik posiada aktywną sesję (na podstawie cookie zarządzanego przez Supabase).
    2. Jeśli użytkownik nie jest zalogowany i próbuje uzyskać dostęp do chronionej trasy (np. `/offers`), zostanie przekierowany na `/login`.
    3. Jeśli użytkownik jest zalogowany i próbuje wejść na stronę publiczną (np. `/login`), zostanie przekierowany na stronę główną.
    4. Odświeżanie sesji użytkownika przy każdym żądaniu.

```typescript
// src/middleware.ts
import { createServerClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(request.cookies, response.cookies);
  const { data: { session } } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // Ochrona tras prywatnych
  if (!session && !pathname.startsWith('/login') && !pathname.startsWith('/register') && !pathname.startsWith('/reset-password') && !pathname.startsWith('/update-password')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Przekierowanie zalogowanych z tras publicznych
  if (session && (pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/reset-password') || pathname.startsWith('/update-password'))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

---

### **3. System Autentykacji (Supabase Auth)**

Wykorzystamy wbudowane mechanizmy Supabase Auth, które doskonale integrują się z Next.js.

#### **3.1. Konfiguracja**

1.  **Zmienne Środowiskowe**: W pliku `.env.local` zostaną zdefiniowane klucze Supabase:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2.  **Klienci Supabase**: Utworzymy dwie wersje klienta Supabase w `src/lib/supabase/`:
    - `client.ts`: Klient do użytku w komponentach klienckich (`createBrowserClient`).
    - `server.ts`: Klient do użytku po stronie serwera - w Server Actions i Middleware (`createServerClient`). Wykorzystuje on `cookies` z `next/headers` do bezpiecznego zarządzania sesją.
3.  **Email Templates**: W panelu Supabase zostaną skonfigurowane szablony e-maili dla:
    - Potwierdzenia rejestracji.
    - Resetowania hasła.

#### **3.2. Realizacja Funkcjonalności**

- **Rejestracja (US-001)**: `supabase.auth.signUp()` zostanie użyte w Server Action. Supabase automatycznie wyśle e-mail z linkiem potwierdzającym. Domyślnie RLS (Row Level Security) uniemożliwi zalogowanie się bez potwierdzenia.
- **Logowanie (US-002)**: `supabase.auth.signInWithPassword()` obsłuży logowanie. Po sukcesie, biblioteka `@supabase/ssr` automatycznie ustawi odpowiednie cookie sesyjne.
- **Wylogowanie (US-002)**: `supabase.auth.signOut()` usunie sesję i wyczyści cookie.
- **Odzyskiwanie hasła (US-002a)**: Proces dwuetapowy:
    1.  `supabase.auth.resetPasswordForEmail()` wyśle e-mail z linkiem do strony `/update-password`.
    2.  Na tej stronie, po podaniu nowego hasła, zostanie wywołana funkcja `supabase.auth.updateUser()`, która sfinalizuje zmianę hasła.
- **Dostęp do danych (US-008)**: Zasady RLS w bazie danych Supabase zostaną skonfigurowane tak, aby użytkownik mógł odczytywać i modyfikować tylko te dane, które są z nim powiązane (np. poprzez `auth.uid() = user_id`).

---

### **Podsumowanie Kluczowych Kroków**

1.  **Struktura projektu**: Reorganizacja katalogu `app` na grupy `(public)` i `(authed)`.
2.  **Komponenty**: Stworzenie komponentów `LoginForm`, `RegisterForm`, `ResetPasswordForm`, `UpdatePasswordForm` i `SignOutButton`.
3.  **Logika**: Implementacja Server Actions (`signIn`, `signUp`, `signOut`, `sendPasswordResetLink`, `updatePassword`).
4.  **Middleware**: Utworzenie `middleware.ts` do ochrony tras.
5.  **Supabase**: Konfiguracja klientów Supabase dla środowiska klienckiego i serwerowego oraz dostosowanie szablonów e-mail.
6.  **RLS**: Zapewnienie, że polityki Row Level Security są aktywne i poprawnie skonfigurowane dla tabel z danymi (np. `job_offers`).

Ta architektura zapewnia bezpieczeństwo, skalowalność i jest zgodna z nowoczesnymi praktykami tworzenia aplikacji w Next.js, jednocześnie w pełni realizując wymagania biznesowe.
