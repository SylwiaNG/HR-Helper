/**
 * API Endpoint Implementation for POST /job_offers
 * 
 * This endpoint handles the creation of a new job offer as described in the API plan.
 * 
 * Steps implemented:
 * 1. Reading and parsing the request JSON body.
 * 2. Validating required fields (user_id and title) and optional fields (description, keywords).
 * 3. Creating job offer in Supabase.
 * 4. Handling potential errors and returning appropriate HTTP status codes with messages.
 */

import { NextResponse } from 'next/server';
import { jobOfferService } from '../../../services/jobOfferService';
import { JobOfferCreateCommand } from '../../../../../src/types';

/**
 * Handles GET requests to /api/job_offers
 * Fetches all job offers.
 */
export async function GET() {
  try {
    const jobOffers = await jobOfferService.getJobOffers();
    return NextResponse.json(jobOffers, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Server error while fetching job offers: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * Handles POST requests to /api/job_offers
 * Creates a new job offer.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as JobOfferCreateCommand;

    // Validate required fields
    if (!body.user_id || !body.title) {
      return NextResponse.json(
        { error: 'Invalid input: user_id and title are required fields.' },
        { status: 400 }
      );
    }

    // Create new job offer
    const newJobOffer = await jobOfferService.createJobOffer(body);

    return NextResponse.json(newJobOffer, { status: 201 });
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON format.' }, { status: 400 });
    }
    console.error('Error creating job offer:', error);
    return NextResponse.json(
      { error: 'Server error while creating job offer: ' + error.message },
      { status: 500 }
    );
  }
}