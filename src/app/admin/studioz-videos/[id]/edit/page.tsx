'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ImageUploader from '@/components/admin/ImageUploader'
import VideoUploader from '@/components/admin/VideoUploader'
import { ArrowLeft, Loader2, Save, Video } from 'lucide-react'

export default function EditStudiozVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Wedding Film')
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [displayOrder, setDisplayOrder] = useState<number>(1)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    const fetchVideo = async () => {
      setFetching(true)
      const { data, error } = await supabase
        .from('studioz_videos')
        .select('*')
        .eq('id', id)
        .single()

      if (data && !error) {
        setTitle(data.title || '')
        setCategory(data.category || 'Film')
        setThumbnailUrl(data.thumbnail_url || null)
        setVideoUrl(data.video_url || '')
        setDisplayOrder(data.display_order ?? 1)
        setIsActive(data.is_active !== false)
      } else {
        setError(error?.message || 'Video item not found in database.')
      }
      setFetching(false)
    }

    fetchVideo()
  }, [id, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !videoUrl.trim()) {
      return setError('Title and Video URL are required.')
    }

    setLoading(true)
    setError(null)

    const { error: updateError } = await supabase
      .from('studioz_videos')
      .update({
        title,
        category: category || 'Film',
        thumbnail_url: thumbnailUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
        video_url: videoUrl,
        display_order: displayOrder,
        is_active: isActive,
      })
      .eq('id', id)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    router.push('/admin/studioz-videos')
    router.refresh()
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-zinc-500 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
        <span>Loading video details...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/studioz-videos"
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Edit Video Showcase</h1>
            <p className="text-sm text-zinc-400">Update YouTube, Instagram Reel, or MP4 video item settings</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Video Showcase Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Grand Cinematic Wedding Story"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm font-semibold"
            />
          </div>

          {/* Category Tag */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Category Tag</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Wedding Film, Pre-Wedding, Teaser, Reel"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          {/* Display Order */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Display Order Rank</label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500 text-sm font-mono"
            />
          </div>

          {/* Video URL */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Video className="w-4 h-4 text-orange-500" />
              <span>Video Link URL (YouTube, Instagram Reel, or Direct MP4) *</span>
            </label>
            <input
              type="text"
              required
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... or https://www.instagram.com/reel/..."
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm font-mono"
            />
            <p className="text-[11px] text-zinc-500">
              Paste YouTube link (`youtube.com/watch?v=...`), Instagram Reel link (`instagram.com/reel/...`), OR upload an MP4 file below.
            </p>

            <div className="pt-3">
              <VideoUploader
                label="Or Upload Video File (MP4/WebM)"
                value={videoUrl}
                onChange={(url) => url && setVideoUrl(url)}
              />
            </div>
          </div>
        </div>

        {/* Thumbnail Image Uploader */}
        <div className="pt-2">
          <ImageUploader
            label="Cover Thumbnail Image"
            value={thumbnailUrl}
            onChange={(url) => setThumbnailUrl(url)}
          />
        </div>

        {/* Active Checkbox */}
        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="is_active"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-white cursor-pointer select-none">
            Active in Public Video Carousel
          </label>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-zinc-800">
          <Link
            href="/admin/studioz-videos"
            className="px-5 py-3 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white text-sm font-medium transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-xl text-sm shadow-lg shadow-orange-500/20 transition-all duration-150 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating Showcase...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
