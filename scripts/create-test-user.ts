import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.test
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTestUser() {
  const email = process.env.E2E_USERNAME!
  const password = process.env.E2E_PASSWORD!
  const userId = process.env.E2E_USERNAME_ID!

  if (!email || !password || !userId) {
    console.error('❌ Missing E2E credentials in .env.test')
    process.exit(1)
  }

  console.log('🔧 Creating/Updating test user...')
  console.log(`📧 Email: ${email}`)
  console.log(`🆔 User ID: ${userId}`)

  try {
    // Try to delete existing user first
    try {
      await supabase.auth.admin.deleteUser(userId)
      console.log('🗑️  Deleted existing user')
    } catch (error) {
      // User doesn't exist, continue
    }
  } catch (error) {
    // Ignore deletion errors
  }

  // Create user with admin API
  const { data, error } = await supabase.auth.admin.createUser({
    id: userId,
    email: email,
    password: password,
    email_confirm: true,  // Auto-confirm email for testing
    user_metadata: {
      name: 'Test User'
    }
  })

  if (error) {
    console.error('❌ Error creating user:', error.message)
    process.exit(1)
  }

  console.log('✅ Test user created successfully!')
  console.log(` - ID: ${data.user.id}`)
  console.log(` - Email: ${data.user.email}`)
}

createTestUser()
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((err) => {
    console.error('❌ Error:', err)
    process.exit(1)
  })
