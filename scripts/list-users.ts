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

async function listUsers() {
  console.log('🔍 Listing all users in local Supabase...\n')
  
  const { data, error } = await supabase.auth.admin.listUsers()
  
  if (error) {
    console.error('❌ Error listing users:', error.message)
    process.exit(1)
  }
  
  if (data.users.length === 0) {
    console.log('📭 No users found in the database')
    return
  }
  
  console.log(`Found ${data.users.length} user(s):\n`)
  
  data.users.forEach((user, index) => {
    console.log(`${index + 1}. User:`)
    console.log(`   ID: ${user.id}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Confirmed: ${user.email_confirmed_at ? '✅' : '❌'}`)
    console.log(`   Created: ${user.created_at}`)
    console.log(`   Last Sign In: ${user.last_sign_in_at || 'Never'}`)
    console.log('')
  })
}

listUsers()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error:', err)
    process.exit(1)
  })
