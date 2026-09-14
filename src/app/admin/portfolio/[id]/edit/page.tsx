'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ImageUploader from '@/components/admin/ImageUploader'
import { PortfolioItem } from '@/types/database'
import { ArrowLeft, Loader2, Save } from 'lucide-react'

export default function EditPortfolioItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()

  const [initialLoading, setInitialLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<'studioz' | 'digital'>('studioz')
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)
  const [galleryUrls, setGalleryUrls] = useState<string[]>([])
  const [videoUrl, setVideoUrl] = useState('')
  const [description, setDescription] = useState('')
  const [displayOrder, setDisplayOrder] = useState<number>(0)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setInitialLoading(true)

      const { data, error: fetchError } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError || !data) {
        setError('Portfolio item record not found.')
        setInitialLoading(false)
        return
      }

      const item = data as PortfolioItem
      setTitle(item.title || '')
      setCategory(item.category || 'studioz')
      setCoverImageUrl(item.cover_image_url || null)
      setGalleryUrls(item.gallery_urls || [])
      // Check if gallery_urls has video link
      const firstGallery = item.gallery_urls?.[0] || ''
      if (firstGallery.includes('youtube.com') || firstGallery.includes('youtu.be') || firstGallery.includes('instagram.com') || firstGallery.match(/\.(mp4|webm)/i)) {
        setVideoUrl(firstGallery)
      }
      setDescription(item.description || '')
      setDisplayOrder(item.display_order ?? 0)
      setIsActive(item.is_active ?? true)

      setInitialLoading(false)
    }

    fetchData()
  }, [id, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return setError('Project title is required.')

    setLoading(true)
    setError(null)

    // Combine videoUrl into gallery_urls if present
    const otherGalleries = galleryUrls.filter(u => u !== videoUrl)
    const combinedGallery = [...(videoUrl.trim() ? [videoUrl.trim()] : []), ...otherGalleries]

    const { error: updateError } = await supabase
      .from('portfolio_items')
      .update({
        title,
        category,
        cover_image_url: coverImageUrl,
        gallery_urls: combinedGallery.length > 0 ? combinedGallery : null,
        description: description || null,
        display_order: displayOrder,
        is_active: isActive,
      })
      .eq('id', id)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    router.push('/admin/portfolio')
    router.refresh()
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/portfolio"
          className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Edit Portfolio Project</h1>
          <p className="text-sm text-zinc-400">Update project details and gallery images</p>
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
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Project Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Royal Wedding Highlights"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as 'studioz' | 'digital')}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500 text-sm"
            >
              <option value="studioz">Studioz (Photography / Video)</option>
              <option value="digital">Digital (Marketing / Branding)</option>
            </select>
          </div>

          {/* Display Order */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Display Order</label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Project summary..."
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
          />
        </div>

        {/* Video Link */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            Video Link (YouTube / Instagram Reel / Direct MP4 URL)
          </label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="e.g. https://www.youtube.com/watch?v=... or https://www.instagram.com/reel/..."
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
          />
          <p className="text-[11px] text-zinc-500">
            Supports YouTube videos, Instagram Reels/Posts, or Cloudinary MP4 URLs for the Studioz Auto-Moving Video Marquee.
          </p>
        </div>

        {/* Image Uploaders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Cover Image */}
          <ImageUploader
            label="Main Cover Image"
            value={coverImageUrl}
            onChange={(url) => setCoverImageUrl(url)}
          />

          {/* Gallery Images */}
          <ImageUploader
            multiple={true}
            label="Project Gallery Photos"
            value={galleryUrls}
            onChange={(urls) => setGalleryUrls(urls)}
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
            Active on Public Site
          </label>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-zinc-800">
          <Link
            href="/admin/portfolio"
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
                <span>Saving Changes...</span>
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
