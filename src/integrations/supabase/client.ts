
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://twoldpyahnzvhpfuzfkw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3b2xkcHlhaG56dmhwZnV6Zmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODQ0MDgsImV4cCI6MjA2MzQ2MDQwOH0.GRIwE4VI9gQWr-ve4WtIcPbdpmxkgJZVysm6tBZy7rM";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

