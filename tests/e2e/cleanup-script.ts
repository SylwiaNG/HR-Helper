#!/usr/bin/env node

/**
 * Manual cleanup script for E2E test data
 * Usage: npm run test:e2e:cleanup
 */

import dotenv from 'dotenv'
import path from 'path'

// Load .env.test BEFORE importing teardown
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') })

import { cleanupTestUserData, verifyCleanState } from './teardown'

async function main() {
  console.log('🧹 Manual E2E Data Cleanup')
  console.log('=' .repeat(50))
  
  const userId = process.env.E2E_USERNAME_ID
  
  if (!userId) {
    console.error('❌ E2E_USERNAME_ID not found in .env.test')
    process.exit(1)
  }

  console.log(`\n📝 Test User ID: ${userId}`)
  
  // Check current state
  console.log('\n📊 Checking current state...')
  const beforeState = await verifyCleanState(userId)
  
  if (beforeState.isClean) {
    console.log('✨ Database is already clean! Nothing to do.')
    process.exit(0)
  }

  console.log(`\n🗑️  Found data to clean:`)
  console.log(`   - Job Offers: ${beforeState.jobOffersCount}`)
  console.log(`   - CVs: ${beforeState.cvsCount}`)
  
  // Ask for confirmation (in non-CI environment)
  if (!process.env.CI) {
    console.log('\n⚠️  Press Ctrl+C to cancel, or wait 3 seconds to continue...')
    await new Promise(resolve => setTimeout(resolve, 3000))
  }

  // Perform cleanup
  console.log('\n🧹 Starting cleanup...')
  await cleanupTestUserData(userId)
  
  // Verify cleanup
  console.log('\n✅ Verifying cleanup...')
  const afterState = await verifyCleanState(userId)
  
  if (afterState.isClean) {
    console.log('✨ Cleanup successful! Database is clean.')
    process.exit(0)
  } else {
    console.error('❌ Cleanup incomplete:', afterState)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('❌ Cleanup failed:', error)
  process.exit(1)
})
