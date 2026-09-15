'use client'

import { useState } from 'react'
import { uploadImage } from '@/lib/cloudinary'
import { getMediaType } from '@/lib/utils/media'
import { Upload, X, Loader2, AlertCircle, Video, Image as ImageIcon, Link as LinkIcon, Plus } from 'lucide-react'
import { useAdminTheme } from '@/context/AdminThemeContext'

interface MediaGalleryUploaderProps {
  value?: string[] | null
  onChange: (urls: string[]) => void
  label?: string
}

export default function MediaGalleryUploader({
  value = [],
  onChange,
  label = 'Gallery Media (Photos & Videos)',
}: MediaGalleryUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [videoInput, setVideoInput] = useState('')
  const { theme } = useAdminTheme()
  const isDark = theme === 'dark'

  const galleryList = value || []

  // Handle uploading image OR video files from device
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      const uploadPromises = Array.from(files).map((file) => uploadImage(file))
      const uploadedUrls = await Promise.all(uploadPromises)
      onChange([...galleryList, ...uploadedUrls])
    } catch (err: any) {
      console.error('Media upload error:', err)
      setError(err?.message || 'Failed to upload media file.')
    } finally {
      setUploading(false)
    }
  }

  // Handle adding external Video Link (YouTube, Instagram Reel, MP4 URL)
  const handleAddVideoLink = (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoInput.trim()) return

    const trimmed = videoInput.trim()
    onChange([...galleryList, trimmed])
    setVideoInput('')
  }

  const handleRemove = (indexToRemove: number) => {
    const updated = galleryList.filter((_, idx) => idx !== indexToRemove)
    onChange(updated)
  }

  return (
    <div className="space-y-4">
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

      {/* Media Gallery Items Preview Grid */}
      {galleryList.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {galleryList.map((url, idx) => {
            const mediaType = getMediaType(url)
            const isVideo = mediaType !== 'image'

            return (
              <div
                key={idx}
                className={`relative group w-full h-32 rounded-xl overflow-hidden border transition-all ${
                  isDark ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-zinc-100'
                }`}
              >
                {mediaType === 'image' && (
                  <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                )}

                {mediaType === 'video_file' && (
                  <video src={url} className="w-full h-full object-cover" muted playsInline />
                )}

                {(mediaType === 'youtube' || mediaType === 'instagram') && (
                  <div className="w-full h-full p-3 flex flex-col items-center justify-center text-center bg-zinc-950 text-white gap-2">
                    <Video className="w-6 h-6 text-orange-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                      {mediaType === 'youtube' ? 'YouTube Reel' : 'Instagram Reel'}
                    </span>
                    <p className="text-[9px] text-zinc-400 truncate max-w-full px-1">{url}</p>
                  </div>
                )}

                {/* Video Badge Tag */}
                {isVideo && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-orange-500 text-black text-[9px] font-bold uppercase tracking-wider shadow">
                    Video
                  </span>
                )}

                {/* Remove Button Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add External Video Link Box */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
        <p className={`text-xs font-semibold mb-2 flex items-center gap-1.5 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
          <LinkIcon className="w-3.5 h-3.5 text-orange-500" />
          <span>Add Video Link (YouTube / Instagram Reel / Direct MP4 URL)</span>
        </p>

        <div className="flex gap-2">
          <input
            type="url"
            value={videoInput}
            onChange={(e) => setVideoInput(e.target.value)}
            placeholder="https://youtube.com/watch?v=... or https://instagram.com/reel/..."
            className={`flex-1 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-orange-500 border ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-300 text-zinc-900'
            }`}
          />
          <button
            type="button"
            onClick={handleAddVideoLink}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Video</span>
          </button>
        </div>
      </div>

      {/* File Dropzone for uploading photos & video files */}
      <label
        className={`relative flex flex-col items-center justify-center p-5 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 group ${
          isDark
            ? 'border-zinc-800 hover:border-orange-500/50 bg-zinc-950/50 hover:bg-zinc-900/50'
            : 'border-zinc-300 hover:border-orange-500 bg-zinc-50 hover:bg-white'
        }`}
      >
        <input
          type="file"
          accept="image/*,video/*"
          multiple={true}
          onChange={handleFileChange}
          disabled={uploading}
          className="sr-only"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-orange-500">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className={`text-xs font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              Uploading media file to server...
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-center">
            <div
              className={`p-2.5 rounded-xl transition-colors ${
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
                  isDark ? 'text-zinc-300 group-hover:text-white' : 'text-zinc-700 group-hover:text-zinc-900'
                }`}
              >
                Upload Gallery Photos &amp; Video Files (.mp4, .png, .jpg)
              </p>
              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>
                Select photos or video files from your computer
              </p>
            </div>
          </div>
        )}
      </label>
    </div>
  )
}
