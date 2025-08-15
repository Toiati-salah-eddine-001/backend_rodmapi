import { createClient } from '@supabase/supabase-js'

const supabaseUrl = Bun.env.Supabase_Project_URL
const supabaseKey = Bun.env.Supabase_API_Key

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check Supabase_Project_URL and Supabase_API_Key.')
}

export const supabase = createClient(supabaseUrl, supabaseKey, { auth: { autoRefreshToken: false, persistSession: false }})