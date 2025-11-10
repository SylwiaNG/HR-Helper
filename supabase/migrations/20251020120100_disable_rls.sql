-- Migration: Disable RLS policies
-- Description: Temporarily disables all RLS policies for development purposes
-- WARNING: This should never be used in production!

-- Drop all policies for job_offers
drop policy if exists "Users can view own job offers" on job_offers;
drop policy if exists "Users can create job offers" on job_offers;
drop policy if exists "Users can update own job offers" on job_offers;
drop policy if exists "Users can delete own job offers" on job_offers;
drop policy if exists "Block anonymous access to job offers" on job_offers;

-- Drop all policies for cvs
drop policy if exists "Users can view cvs for their job offers" on cvs;
drop policy if exists "Users can create cvs for their job offers" on cvs;
drop policy if exists "Users can update cvs for their job offers" on cvs;
drop policy if exists "Users can delete cvs for their job offers" on cvs;
drop policy if exists "Block anonymous access to cvs" on cvs;

-- Disable RLS on tables
alter table job_offers disable row level security;
alter table cvs disable row level security;