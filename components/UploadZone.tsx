'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function UploadZone() {
  const [dragging, setDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, WebP)')
      return
    }
    setError(null)
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

  const handleAnalyze = async () => {
    if (!file) return
    setError(null)
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

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
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
              className="object-contain bg-green-50"
              sizes="(max-width: 768px) 100vw, 672px"
            />
            {!isLoading && (
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                <span className="text-white font-semibold text-sm bg-black/50 px-4 py-2 rounded-full">
                  Click to change image
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="py-16 px-8 flex flex-col items-center gap-5 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl animate-float">
              📸
            </div>
            <div>
              <p className="text-lg font-semibold text-green-800">
                Drop your waste item photo here
              </p>
              <p className="text-sm text-green-600/70 mt-1">
                or click to browse &mdash; JPEG, PNG, WebP up to 10MB
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-green-700/60">
              {['Cardboard', 'Plastic Bottle', 'Paper', 'Metal Can', 'Cable', 'Stationery', 'Food Container'].map(
                (label) => (
                  <span key={label} className="bg-green-100 px-2.5 py-1 rounded-full">
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
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Analyze button */}
      {file && !isLoading && (
        <button
          id="analyze-btn"
          onClick={handleAnalyze}
          className="w-full gradient-green text-white font-semibold py-4 px-8 rounded-2xl shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-200 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 text-base"
        >
          🔍 Analyze with AI
        </button>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
          </div>
          <p className="font-semibold text-green-800">
            {uploading ? '📤 Uploading image...' : '🤖 Analyzing with Gemini AI...'}
          </p>
          <p className="text-sm text-green-600/70">
            {uploading ? 'Securely uploading your photo' : 'Identifying item type, condition, and safety status'}
          </p>
        </div>
      )}
    </div>
  )
}
