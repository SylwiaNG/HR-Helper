import { verifyCleanState } from './teardown'

/**
 * Global setup - runs once before all tests
 * Verifies database is in clean state before starting tests
 */
async function globalSetup() {
  console.log('\n🧪 Running global setup...')
  
  const testUserId = process.env.E2E_USERNAME_ID
  
  if (!testUserId) {
    throw new Error('E2E_USERNAME_ID must be set in .env.test')
  }

  try {
    // Verify database is clean before starting
    const state = await verifyCleanState(testUserId)
    
    if (!state.isClean) {
      console.warn('⚠️  Database not clean before tests:', state)
      console.warn('⚠️  Previous test data exists. Consider running cleanup.')
    } else {
      console.log('✅ Database is clean - ready for tests!')
    }
  } catch (error) {
    console.error('❌ Global setup failed:', error)
    throw error
  }
}

export default globalSetup
