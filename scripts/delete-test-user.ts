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

async function deleteTestUser() {
  const email = process.env.E2E_USERNAME!
  
  console.log('🔍 Looking for user:', email)
  
  // List all users and find by email
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
  
  if (listError) {
    console.error('❌ Error listing users:', listError.message)
    process.exit(1)
  }
  
  const user = users.find(u => u.email === email)
  
  if (!user) {
    console.log('✅ User not found - already deleted')
    return
  }
  
  console.log('🗑️  Deleting user:', user.id)
  
  const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
  
  if (deleteError) {
    console.error('❌ Error deleting user:', deleteError.message)
    process.exit(1)
  }
  
  console.log('✅ User deleted successfully!')
}

deleteTestUser()
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((err) => {
    console.error('❌ Error:', err)
    process.exit(1)
  })
