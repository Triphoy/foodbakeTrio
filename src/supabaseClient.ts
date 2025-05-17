// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://avyhlrbzgjiudoifztrd.supabase.co'; // замени на свой URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2eWhscmJ6Z2ppdWRvaWZ6dHJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MTY3MDIsImV4cCI6MjA2MjA5MjcwMn0.1RddUZUbQfS_tukxessfqZrvu9V85-QcXV375nzKcWo'; // замени на свой ключ

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
