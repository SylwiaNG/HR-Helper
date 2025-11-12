import { createClient } from '@supabase/supabase-js'

/**
 * Teardown utilities for E2E tests
 * Cleans up test data from database after tests
 */

/**
 * Get Supabase admin client
 * Creates client with service role key for admin operations
 */
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.test')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Delete all job offers for test user
 * @param userId - Test user ID from E2E_USERNAME_ID
 */
export async function deleteTestUserJobOffers(userId: string) {
  console.log(`🧹 Cleaning job_offers for user: ${userId}`)
  
  const supabaseAdmin = getSupabaseAdmin()
  
  const { data, error } = await supabaseAdmin
    .from('job_offers')
    .delete()
    .eq('user_id', userId)
    .select()

  if (error) {
    console.error('Error deleting job offers:', error)
    throw error
  }

  console.log(`✅ Deleted ${data?.length || 0} job offers`)
  return data
}

/**
 * Delete all CVs for test user's job offers
 * This cascades automatically via foreign key, but can be called explicitly
 * @param userId - Test user ID
 */
export async function deleteTestUserCVs(userId: string) {
  console.log(`🧹 Cleaning cvs for user: ${userId}`)
  
  const supabaseAdmin = getSupabaseAdmin()
  
  // First get all job offer IDs for this user
  const { data: jobOffers } = await supabaseAdmin
    .from('job_offers')
    .select('id')
    .eq('user_id', userId)

  if (!jobOffers || jobOffers.length === 0) {
    console.log('✅ No CVs to delete (no job offers found)')
    return []
  }

  const jobOfferIds = jobOffers.map((jo: any) => jo.id)

  const { data, error } = await supabaseAdmin
    .from('cvs')
    .delete()
    .in('job_offer_id', jobOfferIds)
    .select()

  if (error) {
    console.error('Error deleting CVs:', error)
    throw error
  }

  console.log(`✅ Deleted ${data?.length || 0} CVs`)
  return data
}

/**
 * Complete cleanup for test user
 * Deletes CVs first (if needed), then job offers
 * @param userId - Test user ID from E2E_USERNAME_ID
 */
export async function cleanupTestUserData(userId: string) {
  console.log(`\n🧹 Starting complete cleanup for user: ${userId}`)
  
  try {
    // CVs will be deleted automatically via CASCADE, 
    // but we can delete them explicitly for logging
    await deleteTestUserCVs(userId)
    
    // Delete job offers (this also cascades to CVs)
    await deleteTestUserJobOffers(userId)
    
    console.log('✅ Complete cleanup successful\n')
  } catch (error) {
    console.error('❌ Cleanup failed:', error)
    throw error
  }
}

/**
 * Verify test user data is clean
 * @param userId - Test user ID
 * @returns Object with counts of remaining data
 */
export async function verifyCleanState(userId: string) {
  const supabaseAdmin = getSupabaseAdmin()
  
  const { data: jobOffers } = await supabaseAdmin
    .from('job_offers')
    .select('id')
    .eq('user_id', userId)

  const jobOfferIds = jobOffers?.map((jo: any) => jo.id) || []
  
  let cvCount = 0
  if (jobOfferIds.length > 0) {
    const { data: cvs } = await supabaseAdmin
      .from('cvs')
      .select('id')
      .in('job_offer_id', jobOfferIds)
    
    cvCount = cvs?.length || 0
  }

  const result = {
    jobOffersCount: jobOffers?.length || 0,
    cvsCount: cvCount,
    isClean: (jobOffers?.length || 0) === 0 && cvCount === 0,
  }

  console.log('📊 State verification:', result)
  return result
}
