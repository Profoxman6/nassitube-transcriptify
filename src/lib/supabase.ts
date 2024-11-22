import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ctbgzzmcxggkbtidslya.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0Ymd6em1jeGdna2J0aWRzbHlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyNjU5NDEsImV4cCI6MjA0Nzg0MTk0MX0.xfKlY8265junBwXKum2ei5l1cQH92UPIQC0EbnhxWWU";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);