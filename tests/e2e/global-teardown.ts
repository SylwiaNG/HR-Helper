import { cleanupTestUserData, verifyCleanState } from './teardown'

/**
 * Global teardown - runs once after all tests complete
 * Cleans up all test data from database
 */
async function globalTeardown() {
  console.log('\n🧪 Running global teardown...')
  
  const testUserId = process.env.E2E_USERNAME_ID
  
  if (!testUserId) {
    console.warn('⚠️  E2E_USERNAME_ID not set, skipping cleanup')
    return
  }

  try {
    // Clean up all test data
    await cleanupTestUserData(testUserId)
    
    // Verify cleanup was successful
    const state = await verifyCleanState(testUserId)
    
    if (!state.isClean) {
      console.warn('⚠️  Database not fully clean after teardown:', state)
    } else {
      console.log('✨ Database clean - teardown complete!')
    }
  } catch (error) {
    console.error('❌ Global teardown failed:', error)
    // Don't throw - we don't want to fail the test run
  }
}

export default globalTeardown
