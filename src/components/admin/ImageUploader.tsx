'use client'

import { useState } from 'react'
import { uploadImage } from '@/lib/cloudinary'
import { Upload, X, Loader2, AlertCircle } from 'lucide-react'
import { useAdminTheme } from '@/context/AdminThemeContext'

interface SingleImageUploaderProps {
  multiple?: false
  value?: string | null
  onChange: (url: string | null) => void
  label?: string
}

interface MultipleImageUploaderProps {
  multiple: true
  value?: string[] | null
  onChange: (urls: string[]) => void
  label?: string
}

type ImageUploaderProps = SingleImageUploaderProps | MultipleImageUploaderProps

export default function ImageUploader(props: ImageUploaderProps) {
  const { label = 'Upload Image', multiple = false } = props
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
      if (multiple) {
        const uploadPromises = Array.from(files).map((file) => uploadImage(file))
        const uploadedUrls = await Promise.all(uploadPromises)
        const currentUrls = (props as MultipleImageUploaderProps).value || []
        ;(props as MultipleImageUploaderProps).onChange([...currentUrls, ...uploadedUrls])
      } else {
        const file = files[0]
        const url = await uploadImage(file)
        ;(props as SingleImageUploaderProps).onChange(url)
      }
    } catch (err: any) {
      console.error('Image upload error:', err)
      setError(err?.message || 'Failed to upload image. Please check Cloudinary settings.')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveSingle = () => {
    if (!multiple) {
      (props as SingleImageUploaderProps).onChange(null)
    }
  }

  const handleRemoveMultiple = (indexToRemove: number) => {
    if (multiple) {
      const currentUrls = (props as MultipleImageUploaderProps).value || []
      const updated = currentUrls.filter((_, idx) => idx !== indexToRemove)
      ;(props as MultipleImageUploaderProps).onChange(updated)
    }
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

      {/* Single Image Preview */}
      {!multiple && (props as SingleImageUploaderProps).value && (
        <div
          className={`relative group w-48 h-36 rounded-xl overflow-hidden border ${
            isDark ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-zinc-100'
          }`}
        >
          <img
            src={(props as SingleImageUploaderProps).value!}
            alt="Upload preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemoveSingle}
              className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Multiple Image Previews */}
      {multiple && (props as MultipleImageUploaderProps).value && (props as MultipleImageUploaderProps).value!.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {(props as MultipleImageUploaderProps).value!.map((url, idx) => (
            <div
              key={idx}
              className={`relative group w-full h-28 rounded-xl overflow-hidden border ${
                isDark ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-zinc-100'
              }`}
            >
              <img src={url} alt={`Gallery image ${idx + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleRemoveMultiple(idx)}
                  className="p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File Dropzone */}
      <label
        className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 group ${
          isDark
            ? 'border-zinc-800 hover:border-orange-500/50 bg-zinc-950/50 hover:bg-zinc-900/50'
            : 'border-zinc-300 hover:border-orange-500 bg-zinc-50 hover:bg-white'
        }`}
      >
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
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
              Uploading image to Cloudinary...
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
                Click to upload {multiple ? 'images' : 'image'}
              </p>
              <p
                className={`text-[11px] mt-0.5 ${
                  isDark ? 'text-zinc-500' : 'text-zinc-600'
                }`}
              >
                PNG, JPG, WEBP up to 10MB
              </p>
            </div>
          </div>
        )}
      </label>
    </div>
  )
}

