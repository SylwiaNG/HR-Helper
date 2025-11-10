/**
 * DTO and Command Model Definitions for HR-Helper API
 * 
 * These types are built upon the database table definitions in `src/db/database.types.ts` and correspond
 * to the API plan outlined in `api-plan.md`.
 *
 * Each DTO directly or indirectly refers to the underlying database entity structures, ensuring
 * a consistent representation of data transfer objects and command models. Advanced TypeScript utility types
 * such as Pick, Partial, and Omit are used to transform database types into API-specific models.
 */

// Note: It is assumed that the base database types are imported from the module containing them
// For example:
// import { Database } from '../db/database.types';

/**
 * JobOfferDTO represents a job offer entity as returned by the API
 * Maps to the `job_offers` table row in the database
 */
export type JobOfferDTO = {
  id: number;
  user_id: string; // UUID
  title: string;
  description: string | null;
  keywords: string[] | null;
  created_at: string; // ISO date string
};

/**
 * JobOfferCreateCommand represents the payload for creating a new job offer
 * (POST /job_offers)
 */
export type JobOfferCreateCommand = {
  user_id: string;
  title: string;
  description?: string | null;
  keywords?: string[];
};

/**
 * JobOfferUpdateCommand represents the payload for updating an existing job offer
 * (PUT/PATCH /job_offers/{id})
 * Uses Partial to allow updating any subset of fields
 */
export type JobOfferUpdateCommand = Partial<Pick<JobOfferDTO, 'title' | 'description' | 'keywords'>>;

/**
 * JobOfferStatsDTO represents the aggregated statistics for a job offer
 * (GET /job_offers/{job_offer_id}/stats)
 */
export type JobOfferStatsDTO = {
  total_cvs: number;
  accepted: number;
  rejected: number;
};

/**
 * CVDTO represents a CV entity as returned by the API
 * Maps to the `cvs` table row in the database
 */
export type CVDTO = {
  id: number;
  job_offer_id: number;
  first_name: string;
  last_name: string;
  keywords: string[] | null;
  match_percentage: number | null;
  matched_keywords_count: number | null;
  status: 'new' | 'accepted' | 'rejected';
  created_at: string; // ISO date string
};

/**
 * CVCreateCommand represents the payload for submitting a new CV for a job offer
 * (POST /job_offers/{job_offer_id}/cvs)
 * Note: The `job_offer_id` is provided via the URL path, so it is not included here
 */
export type CVCreateCommand = {
  first_name: string;
  last_name: string;
  keywords: string[]; // Should be validated to not exceed 10 keywords
};

/**
 * CVUpdateCommand represents the payload for updating an existing CV
 * (PUT/PATCH /job_offers/{job_offer_id}/cvs/{id})
 * Allows partial updates using Partial
 */
export type CVUpdateCommand = Partial<Pick<CVDTO, 'first_name' | 'last_name' | 'keywords' | 'status'>>;

/**
 * CVAnalyzeCommand represents the command to trigger analysis on a CV
 * (POST /job_offers/{job_offer_id}/cvs/{id}/analyze)
 * Currently, no additional payload is required. This type is reserved for potential future properties.
 */
export type CVAnalyzeCommand = {};

// Additional DTOs for authentication (if needed) could be defined here, but Supabase Auth manages
// registration and login flows externally.

// End of DTO and Command Model definitions
