-- Migration: Initial Schema Setup for HR Helper MVP
-- Description: Creates core tables and security policies for the HR application
-- Tables affected: job_offers, cvs
-- Note: users table is managed by Supabase Auth

-- enable required extensions
create extension if not exists "pg_trgm";

-- create custom types for status enums
create type user_role as enum ('rekruter');
create type cv_status as enum ('new', 'accepted', 'rejected');

-- create job_offers table
create table if not exists job_offers (
    id serial primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    title varchar(255) not null,
    description text,
    keywords text[],
    created_at timestamptz not null default now()
);

-- create index for faster user-based queries
create index job_offers_user_id_idx on job_offers(user_id);
-- create gin index for array operations on keywords
create index job_offers_keywords_idx on job_offers using gin(keywords);

-- enable row level security
alter table job_offers enable row level security;

-- rls policies for job_offers table
-- allow authenticated users to view their own job offers
create policy "Users can view own job offers"
    on job_offers for select
    to authenticated
    using (auth.uid() = user_id);

-- allow authenticated users to insert their own job offers
create policy "Users can create job offers"
    on job_offers for insert
    to authenticated
    with check (auth.uid() = user_id);

-- allow authenticated users to update their own job offers
create policy "Users can update own job offers"
    on job_offers for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- allow authenticated users to delete their own job offers
create policy "Users can delete own job offers"
    on job_offers for delete
    to authenticated
    using (auth.uid() = user_id);

-- create cvs table
create table if not exists cvs (
    id serial primary key,
    job_offer_id integer references job_offers(id) on delete cascade not null,
    first_name varchar(100) not null,
    last_name varchar(100) not null,
    keywords text[],
    match_percentage numeric(5,2),
    matched_keywords_count integer,
    status cv_status not null default 'new',
    created_at timestamptz not null default now(),
    -- add constraint to limit keywords array to 10 elements
    constraint cvs_keywords_limit check (array_length(keywords, 1) <= 10)
);

-- create indexes for cvs table
create index cvs_job_offer_id_idx on cvs(job_offer_id);
create index cvs_status_idx on cvs(status);
create index cvs_keywords_idx on cvs using gin(keywords);

-- enable row level security
alter table cvs enable row level security;

-- rls policies for cvs table
-- allow authenticated users to view cvs for their job offers
create policy "Users can view cvs for their job offers"
    on cvs for select
    to authenticated
    using (
        job_offer_id in (
            select id from job_offers where user_id = auth.uid()
        )
    );

-- allow authenticated users to insert cvs for their job offers
create policy "Users can create cvs for their job offers"
    on cvs for insert
    to authenticated
    with check (
        job_offer_id in (
            select id from job_offers where user_id = auth.uid()
        )
    );

-- allow authenticated users to update cvs for their job offers
create policy "Users can update cvs for their job offers"
    on cvs for update
    to authenticated
    using (
        job_offer_id in (
            select id from job_offers where user_id = auth.uid()
        )
    )
    with check (
        job_offer_id in (
            select id from job_offers where user_id = auth.uid()
        )
    );

-- allow authenticated users to delete cvs for their job offers
create policy "Users can delete cvs for their job offers"
    on cvs for delete
    to authenticated
    using (
        job_offer_id in (
            select id from job_offers where user_id = auth.uid()
        )
    );

-- block all access for anonymous users
create policy "Block anonymous access to job offers"
    on job_offers for all
    to anon
    using (false);

create policy "Block anonymous access to cvs"
    on cvs for all
    to anon
    using (false);