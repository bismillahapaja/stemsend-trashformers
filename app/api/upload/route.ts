import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { isSupabaseConfigured, getSupabaseClient, STORAGE_BUCKET, getPublicUrl } from '@/lib/supabase'

const VALID_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!VALID_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, GIF are supported.' },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const uniqueName = `upload_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`

    // ─── Production: Supabase Storage ───────────────────────────────────────
    if (isSupabaseConfigured) {
      const storagePath = `waste-items/${uniqueName}`

      const { data, error } = await getSupabaseClient()
        .storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, buffer, {
          contentType: file.type,
          upsert: false,
          cacheControl: '3600',
        })

      if (error) {
        console.error('[Upload] Supabase Storage error:', error.message)
        return NextResponse.json(
          { error: `Storage upload failed: ${error.message}` },
          { status: 500 }
        )
      }

      const publicUrl = getPublicUrl(data.path)
      console.log('[Upload] Supabase Storage ✓', data.path, '→', publicUrl)

      return NextResponse.json({ url: publicUrl, base64, mimeType: file.type })
    }

    // ─── Local Development Fallback: public/uploads/ ─────────────────────────
    console.warn(
      '[Upload] Supabase not configured — using local disk fallback. ' +
      'This will NOT work on Netlify/Vercel. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    )

    const uploadDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const localPath = join(uploadDir, uniqueName)
    await writeFile(localPath, buffer)

    return NextResponse.json({
      url: `/uploads/${uniqueName}`,
      base64,
      mimeType: file.type,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    console.error('[Upload] Unexpected error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
