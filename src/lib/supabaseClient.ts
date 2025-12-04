import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zqnjyuvszrszyityyiza.storage.supabase.co/storage/v1/s3';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpxbmp5dXZzenJzenlpdHl5aXphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjYwMjIsImV4cCI6MjA3MzA0MjAyMn0.W054982dBeOGlH-V4WjrwJEp6-kUAq41xW-iz3yxmy8';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);