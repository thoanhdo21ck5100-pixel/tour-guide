import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export function generateTourCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `JPVN-${num}`;
}

export function normalizeTourCode(input: string): string {
  if (!input) return '';
  let cleaned = input.trim().toUpperCase().replace(/[#＃]/g, '').replace(/[\s　]+/g, '-');
  if (/^\d{4}$/.test(cleaned)) {
    return `JPVN-${cleaned}`;
  }
  if (/^JPVN\d{4}$/.test(cleaned)) {
    return `JPVN-${cleaned.slice(4)}`;
  }
  cleaned = cleaned.replace(/--+/g, '-');
  return cleaned;
}

