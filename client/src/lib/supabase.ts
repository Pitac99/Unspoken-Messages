import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your actual Supabase project URL and anon public key
const SUPABASE_URL = 'https://mohlkqqidgvulyuketfu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vaGxrcXFpZGd2dWx5dWtldGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNTUzMTEsImV4cCI6MjA2NDYzMTMxMX0.6N5OoqvOC9OCnV516oJVEwwe4Jlw5n_6CzxUc-SQLq4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); 