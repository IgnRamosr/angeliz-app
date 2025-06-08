import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://uwnkvvihxkjaobxuazia.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3bmt2dmloeGtqYW9ieHVhemlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMjMwMDMsImV4cCI6MjA2MDU5OTAwM30.Xr4R_iSRwItK7qSBPHRTq06YQMDT88pUcXuMu4ITcys';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);