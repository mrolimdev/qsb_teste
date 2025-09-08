import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = 'https://mmmtfroqhfnmzrmycqlv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tbXRmcm9xaGZubXpybXljcWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjE5MjAsImV4cCI6MjA2NzIzNzkyMH0.XEYaWp1q-y_grFXTjL7p-Jpv-JtKKGlXTOdBW9wHtTc';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
