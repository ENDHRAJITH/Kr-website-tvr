'use client'

import { useState } from 'react'
import { uploadVideo } from '@/lib/cloudinary'
import { Upload, Video as VideoIcon, X, Loader2, AlertCircle } from 'lucide-react'
import { useAdminTheme } from '@/context/AdminThemeContext'

interface VideoUploaderProps {
  value?: string | null
  onChange: (url: string | null) => void
  label?: string
}

export default function VideoUploader({
  value,
  onChange,
  label = 'Upload MP4 Video File',
}: VideoUploaderProps) {
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
      const url = await uploadVideo(file)
      onChange(url)
    } catch (err: any) {
      console.error('Video upload error:', err)
      setError(err?.message || 'Failed to upload video file.')
    } finally {
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

      {/* Video Preview */}
      {value && (
        <div
          className={`relative group w-full max-w-md h-48 rounded-xl overflow-hidden border ${
            isDark ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-zinc-100'
          }`}
        >
          {value.match(/\.(mp4|webm|mov)(\?.*)?$/i) || value.startsWith('data:video') || value.includes('cloudinary') ? (
            <video src={value} controls className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
              <VideoIcon className="w-8 h-8 text-orange-500 mb-2" />
              <p className="text-xs font-semibold truncate max-w-full text-white">{value}</p>
            </div>
          )}

          <div className="absolute top-2 right-2 z-10">
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg cursor-pointer"
              title="Remove video"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
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
          accept="video/mp4,video/webm,video/quicktime,video/mov"
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
              Uploading video file...
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
                Click to upload MP4/WebM video file
              </p>
              <p
                className={`text-[11px] mt-0.5 ${
                  isDark ? 'text-zinc-500' : 'text-zinc-600'
                }`}
              >
                Direct video upload for studio carousel
              </p>
            </div>
          </div>
        )}
      </label>
    </div>
  )
}
