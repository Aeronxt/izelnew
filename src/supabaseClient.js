import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wrczctvglyhprlbkogjb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyY3pjdHZnbHlocHJsYmtvZ2piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNDU3MzcsImV4cCI6MjA2MTkyMTczN30.P0u7VzrNvY4TgxTT8NS4VIwsYYkFHXiyTaD8nSsU5SY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
}); 