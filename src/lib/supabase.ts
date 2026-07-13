import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * Demo mode is the default: when there's no Supabase URL we run entirely on
 * the in-memory mock store. This is the flag the whole app keys off of.
 */
export const isDemo = !url

export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: { persistSession: true, autoRefreshToken: true },
      })
    : null

export const PROOFS_BUCKET = 'proofs'
