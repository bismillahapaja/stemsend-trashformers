import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL ?? ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

/**
 * Returns true when Supabase credentials are configured.
 * In local development with SQLite, these may be empty — uploads fall back to local disk.
 */
export const isSupabaseConfigured =
  supabaseUrl.startsWith('https://') && supabaseServiceKey.length > 10

/**
 * Server-only Supabase client using the service_role key.
 * Only use in API routes (server-side). Never expose to the browser.
 * This client bypasses Row Level Security — handle with care.
 */
let _client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error(
      '[Supabase] SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not configured. ' +
      'Add them to your .env file or Netlify environment variables. ' +
      'Get them from: Supabase Dashboard → Project Settings → API'
    )
  }
  if (!_client) {
    _client = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }
  return _client
}

/** Bucket name for waste item uploads in Supabase Storage */
export const STORAGE_BUCKET = 'trashformers'

/** Returns the public URL for a file in Supabase Storage */
export function getPublicUrl(filePath: string): string {
  const client = getSupabaseClient()
  const { data } = client.storage.from(STORAGE_BUCKET).getPublicUrl(filePath)
  return data.publicUrl
}

export default { getSupabaseClient, isSupabaseConfigured, STORAGE_BUCKET, getPublicUrl }
