import { createClient } from '@supabase/supabase-js'

// আপনার অরিজিনাল ইউআরএল এবং নতুন অ্যানন কি (Anon Key)
const supabaseUrl = 'https://mdgzgrmvlcratrfubioi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kZ3pncm12bGNyYXRyZnViaW9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NzI4MTYsImV4cCI6MjA5MzA0ODgxNn0.BJlzGQKpMW0b2v4ZOCnIKtduFGNo8YZkawB2mau9DQk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)