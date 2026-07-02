'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  UploadCloud, AlertCircle, ScanLine, Loader2, BrainCircuit, X,
  Ban, RefreshCcw,
} from 'lucide-react'

interface NotWasteState {
  imageUrl: string
  reason: string
}

export default function UploadZone() {
  const [dragging, setDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notWaste, setNotWaste] = useState<NotWasteState | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, WebP)')
      return
    }
    setError(null)
    setNotWaste(null)
    setFile(f)
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(f)
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const dropped = e.dataTransfer.files[0]
      if (dropped) handleFile(dropped)
    },
    [handleFile]
  )

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) handleFile(selected)
  }

  const handleReset = () => {
    setPreview(null)
    setFile(null)
    setError(null)
    setNotWaste(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleAnalyze = async () => {
    if (!file) return
    setError(null)
    setNotWaste(null)
    setUploading(true)

    try {
      // Step 1: Upload
      const formData = new FormData()
      formData.append('file', file)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) throw new Error(uploadData.error ?? 'Upload failed')

      setUploading(false)
      setAnalyzing(true)

      // Step 2: Analyze
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: uploadData.url,
          base64: uploadData.base64,
          mimeType: uploadData.mimeType,
        }),
      })
      const analyzeData = await analyzeRes.json()

      // ── Non-waste response (HTTP 422) ──────────────────────────────────
      if (analyzeRes.status === 422 && analyzeData.isWaste === false) {
        setNotWaste({
          imageUrl: analyzeData.imageUrl ?? preview ?? '',
          reason: analyzeData.notWasteReason ?? 'Gambar yang diupload bukan merupakan item sampah.',
        })
        setAnalyzing(false)
        return
      }
      // ──────────────────────────────────────────────────────────────────

      if (!analyzeRes.ok) throw new Error(analyzeData.error ?? 'Analysis failed')

      // Store result in sessionStorage for result page
      sessionStorage.setItem('lastResult', JSON.stringify(analyzeData))
      router.push('/result')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setUploading(false)
      setAnalyzing(false)
    }
  }

  const isLoading = uploading || analyzing

  // ── Non-waste UI ─────────────────────────────────────────────────────────
  if (notWaste) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-4">
        {/* Image preview */}
        {(notWaste.imageUrl || preview) && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden" style={{ background: 'var(--slate-50)' }}>
            <Image
              src={notWaste.imageUrl || preview!}
              alt="Uploaded image"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
        )}

        {/* Non-waste alert card */}
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{ background: '#FFF7ED', border: '2px solid #FED7AA' }}
        >
          {/* Header */}
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#FED7AA' }}
            >
              <Ban className="w-6 h-6" style={{ color: '#9A3412' }} />
            </div>
            <div>
              <h3
                className="font-bold text-lg"
                style={{ color: '#9A3412', fontFamily: 'var(--font-jakarta)' }}
              >
                Bukan Item Sampah
              </h3>
              <p className="text-sm mt-0.5 font-medium" style={{ color: '#C2410C' }}>
                Gambar yang diupload tidak terdeteksi sebagai sampah
              </p>
            </div>
          </div>

          {/* Reason */}
          <div
            className="rounded-xl p-4"
            style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid #FED7AA' }}
          >
            <p className="text-sm leading-relaxed" style={{ color: '#7C2D12' }}>
              <span className="font-semibold">Keterangan AI: </span>
              {notWaste.reason}
            </p>
          </div>

          {/* Guidance */}
          <div
            className="rounded-xl p-3 flex items-start gap-2"
            style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid #FDBA74' }}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#C2410C' }} />
            <p className="text-xs" style={{ color: '#9A3412' }}>
              Sistem ini dirancang untuk menganalisis item <strong>sampah atau limbah</strong> saja (kardus, botol plastik, kertas, kaleng, kabel, alat tulis, wadah makanan). Silakan upload foto item sampah yang ingin dianalisis.
            </p>
          </div>

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="btn-primary w-full justify-center py-3"
            style={{ borderRadius: '0.75rem' }}
          >
            <RefreshCcw className="w-4 h-4" />
            Upload Foto Sampah Lainnya
          </button>
        </div>
      </div>
    )
  }
  // ──────────────────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* Drop zone */}
      <div
        id="upload-dropzone"
        className={`drop-zone relative cursor-pointer transition-all duration-300 ${dragging ? 'drag-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !isLoading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          id="file-input"
          accept="image/*"
          className="hidden"
          onChange={onInputChange}
          disabled={isLoading}
        />

        {preview ? (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain"
              style={{ background: 'var(--slate-50)' }}
              sizes="(max-width: 768px) 100vw, 672px"
            />
            {!isLoading && (
              <div className="absolute inset-0 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl" style={{ background: 'rgba(0,0,0,0.45)' }}>
                <span className="text-white font-semibold text-sm px-4 py-2 rounded-full flex items-center gap-2" style={{ background: 'rgba(0,0,0,0.5)' }}>
                  <X className="w-4 h-4" /> Click to change image
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="py-16 px-8 flex flex-col items-center gap-5 text-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center animate-float"
              style={{ background: 'var(--emerald-50)', border: '1px solid var(--emerald-100)' }}
            >
              <UploadCloud className="w-9 h-9" style={{ color: 'var(--emerald-700)' }} />
            </div>
            <div>
              <p className="text-lg font-semibold" style={{ color: 'var(--slate-800)', fontFamily: 'var(--font-jakarta)' }}>
                Drop your waste item photo here
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--slate-500)' }}>
                or click to browse &mdash; JPEG, PNG, WebP up to 10MB
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {['Cardboard', 'Plastic Bottle', 'Paper', 'Metal Can', 'Cable', 'Stationery', 'Food Container'].map(
                (label) => (
                  <span
                    key={label}
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: 'var(--slate-100)', color: 'var(--slate-600)' }}
                  >
                    {label}
                  </span>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          className="rounded-xl px-4 py-3 text-sm flex items-start gap-2.5"
          style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C' }}
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Analyze button */}
      {file && !isLoading && (
        <button
          id="analyze-btn"
          onClick={handleAnalyze}
          className="btn-primary w-full justify-center py-4 text-base"
          style={{ borderRadius: '0.75rem' }}
        >
          <ScanLine className="w-5 h-5" />
          Analyze with AI
        </button>
      )}

      {/* Loading state */}
      {isLoading && (
        <div
          className="rounded-2xl p-7 text-center space-y-3"
          style={{ background: 'var(--emerald-50)', border: '1px solid var(--emerald-100)' }}
        >
          <div className="flex justify-center">
            <Loader2 className="w-10 h-10 animate-spin-slow" style={{ color: 'var(--emerald-700)' }} />
          </div>
          <div className="flex items-center justify-center gap-2">
            {analyzing && <BrainCircuit className="w-4 h-4" style={{ color: 'var(--emerald-700)' }} />}
            <p className="font-semibold" style={{ color: 'var(--forest-800)', fontFamily: 'var(--font-jakarta)' }}>
              {uploading ? 'Uploading image...' : 'Analyzing with Gemini AI...'}
            </p>
          </div>
          <p className="text-sm" style={{ color: 'var(--slate-500)' }}>
            {uploading ? 'Securely uploading your photo' : 'Detecting item type and checking if it is waste...'}
          </p>
        </div>
      )}
    </div>
  )
}
