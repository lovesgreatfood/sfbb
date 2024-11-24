import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = 'https://zzboroucprfvuqcxgqdf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6Ym9yb3VjcHJmdnVxY3hncWRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyODQzNzcsImV4cCI6MjA0Nzg2MDM3N30.cx8n2t3vbl7jWsbbJniqVH5pM2Lx3UJRc5vhYhHMmj0';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-my-custom-header': 'food-safety-management'
    }
  }
});