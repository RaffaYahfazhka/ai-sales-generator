import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createDummyUser() {
  const { data, error } = await supabase.auth.signUp({
    email: 'bebas@mail.com',
    password: '123456',
  })

  if (error) {
    console.error('Error creating user:', error.message)
  } else {
    console.log('User created successfully:', data.user?.email)
    console.log('Please check your email for verification if email confirmation is enabled in Supabase.')
  }
}

createDummyUser()
