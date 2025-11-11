import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://txzijkghgpqkljloycth.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4emlqa2doZ3Bxa2xqbG95Y3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0OTA0MjEsImV4cCI6MjA3NTA2NjQyMX0.6ZlS26BTCf1pYfvkIR96Zuys7aK8regQ6ATP0ZshYNI';

export const supabase = createClient(supabaseUrl, supabaseKey);
