# Schemat Bazy Danych - HR Helper (MVP)

## 1. Tabele i Kolumny

### users
- Uwaga: Tabela `users` będzie obsługiwana przez Supabase Auth.
- Kolumny:
  - id: UUID PRIMARY KEY, generowany przez Supabase Auth
  - email: VARCHAR(255) UNIQUE NOT NULL
  - password_hash: VARCHAR(255) NOT NULL  -- bcrypt hash
  - role: ENUM('rekruter') NOT NULL DEFAULT 'rekruter'
  - created_at: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()

### job_offers
- Kolumny:
  - id: SERIAL PRIMARY KEY
  - user_id: UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
  - title: VARCHAR(255) NOT NULL
  - description: TEXT
  - keywords: TEXT[]  -- lista słów kluczowych dla oferty pracy
  - created_at: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()

### cvs
- Kolumny:
  - id: SERIAL PRIMARY KEY
  - job_offer_id: INTEGER NOT NULL REFERENCES job_offers(id) ON DELETE CASCADE
  - first_name: VARCHAR(100) NOT NULL
  - last_name: VARCHAR(100) NOT NULL
  - keywords: TEXT[]  -- maksymalnie 10 słów kluczowych, opcjonalna walidacja
  - match_percentage: NUMERIC(5,2)  -- procent dopasowania wynikający z analizy CV
  - matched_keywords_count: INTEGER  -- liczba dopasowanych słów kluczowych
  - status: ENUM('new', 'accepted', 'rejected') NOT NULL DEFAULT 'new'
  - created_at: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()

## 2. Relacje między Tabelami

- Relacja jeden-do-wielu między `job_offers` a `cvs` (każde CV musi być przypisane do jednej oferty pracy).
- Relacja między `users` a `job_offers`: jeden-do-wielu (rekruter może mieć wiele ofert pracy).

## 3. Indeksy

- Indeks na kolumnie `user_id` w tabeli `job_offers` dla szybszego wyszukiwania.
- Indeks na kolumnie `job_offer_id` w tabeli `cvs`.
- Indeks GIN dla kolumn typu array:
  - GIN index na kolumnie `keywords` w tabeli `job_offers`.
  - GIN index na kolumnie `keywords` w tabeli `cvs`.
- Indeks na kolumnie `status` w tabeli `cvs` dla optymalizacji filtrowania.

## 4. Zasady PostgreSQL i RLS

- Wdrożenie mechanizmu Row Level Security (RLS) na tabelach `job_offers` i `cvs`:
  - Rekruterzy mają dostęp tylko do ofert pracy przypisanych do ich `user_id` oraz powiązanych CV.
  - Administratorzy (w przyszłości) będą mieli dostęp do wszystkich danych.
- Przykładowe RLS Policies:
  ```sql
  CREATE POLICY job_offers_rls ON job_offers
    USING (user_id = auth.uid());
  
  CREATE POLICY cvs_rls ON cvs
    USING (job_offer_id IN (SELECT id FROM job_offers WHERE user_id = auth.uid()));
  ```

## 5. Dodatkowe Uwagi

- Hasła są przechowywane jako bcrypt hash, a tabela `users` jest zarządzana przez Supabase Auth.
- Model bazy danych został zaprojektowany z myślą o skalowalności i wydajności, umożliwiając przyszłe rozszerzenia, np. dodanie audytu zmian.
- Opcjonalna walidacja dla liczby słów kluczowych w kolumnach `keywords` może być implementowana na poziomie aplikacji lub poprzez constraint.
