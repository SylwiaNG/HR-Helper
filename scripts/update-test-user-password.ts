import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.test
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function updateUserPassword() {
  const email = process.env.E2E_USERNAME!
  const password = process.env.E2E_PASSWORD!
  const userId = process.env.E2E_USERNAME_ID!
  
  console.log('🔧 Updating user password...')
  console.log(`📧 Email: ${email}`)
  console.log(`🆔 User ID: ${userId}`)
  console.log(`🔑 New Password: ${password}`)
  
  // Update user password using admin API
  const { data, error } = await supabase.auth.admin.updateUserById(
    userId,
    { 
      password: password,
      email_confirm: true
    }
  )
  
  if (error) {
    console.error('❌ Error updating password:', error.message)
    process.exit(1)
  }
  
  console.log('✅ Password updated successfully!')
  console.log(` - User ID: ${data.user.id}`)
  console.log(` - Email: ${data.user.email}`)
  console.log(`\n✨ You can now login with:`)
  console.log(`   Email: ${email}`)
  console.log(`   Password: ${password}`)
}

updateUserPassword()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error:', err)
    process.exit(1)
  })
