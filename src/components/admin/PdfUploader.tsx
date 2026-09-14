'use client'

import { useState } from 'react'
import { FileText, Upload, X, Loader2, AlertCircle, ExternalLink } from 'lucide-react'
import { useAdminTheme } from '@/context/AdminThemeContext'

interface PdfUploaderProps {
  value?: string | null
  onChange: (url: string | null) => void
  label?: string
}

export default function PdfUploader({
  value,
  onChange,
  label = 'Upload PDF Document File',
}: PdfUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { theme } = useAdminTheme()
  const isDark = theme === 'dark'

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      const file = files[0]
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

      if (cloudName && uploadPreset) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', uploadPreset)

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
          { method: 'POST', body: formData }
        )
        const data = await res.json()
        if (data.secure_url) {
          onChange(data.secure_url)
          setUploading(false)
          return
        }
      }

      // Fallback: Convert to Data URL / Object URL
      const reader = new FileReader()
      reader.onload = () => {
        onChange(reader.result as string)
        setUploading(false)
      }
      reader.onerror = () => {
        setError('Failed to read PDF file.')
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (err: any) {
      console.error('PDF upload error:', err)
      setError(err?.message || 'Failed to upload PDF file.')
      setUploading(false)
    }
  }

  const handleRemove = () => {
    onChange(null)
  }

  return (
    <div className="space-y-3">
      {label && (
        <label
          className={`block text-xs font-semibold uppercase tracking-wider ${
            isDark ? 'text-zinc-300' : 'text-zinc-700'
          }`}
        >
          {label}
        </label>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* PDF File Preview */}
      {value && (
        <div
          className={`flex items-center justify-between p-4 rounded-xl border ${
            isDark ? 'border-zinc-800 bg-zinc-950 text-white' : 'border-zinc-200 bg-zinc-100 text-zinc-900'
          }`}
        >
          <div className="flex items-center gap-3 truncate max-w-[80%]">
            <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-500">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold truncate">PDF Document Selected</p>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-orange-500 hover:underline flex items-center gap-1 font-mono truncate"
              >
                <span>{value.length > 50 ? `${value.slice(0, 45)}...` : value}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 rounded-full bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white transition-colors cursor-pointer"
            title="Remove PDF file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Dropzone */}
      <label
        className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 group ${
          isDark
            ? 'border-zinc-800 hover:border-orange-500/50 bg-zinc-950/50 hover:bg-zinc-900/50'
            : 'border-zinc-300 hover:border-orange-500 bg-zinc-50 hover:bg-white'
        }`}
      >
        <input
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleFileChange}
          disabled={uploading}
          className="sr-only"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-orange-500">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span
              className={`text-xs font-medium ${
                isDark ? 'text-zinc-300' : 'text-zinc-700'
              }`}
            >
              Uploading PDF document...
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <div
              className={`p-3 rounded-xl transition-colors ${
                isDark
                  ? 'bg-zinc-900 text-zinc-400 group-hover:text-orange-500 group-hover:bg-orange-500/10'
                  : 'bg-zinc-200/80 text-zinc-600 group-hover:text-orange-600 group-hover:bg-orange-500/15'
              }`}
            >
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p
                className={`text-xs font-semibold ${
                  isDark
                    ? 'text-zinc-300 group-hover:text-white'
                    : 'text-zinc-700 group-hover:text-zinc-900'
                }`}
              >
                Click to upload PDF Document File (.pdf)
              </p>
              <p
                className={`text-[11px] mt-0.5 ${
                  isDark ? 'text-zinc-500' : 'text-zinc-600'
                }`}
              >
                Select PDF portfolio file from computer
              </p>
            </div>
          </div>
        )}
      </label>
    </div>
  )
}
