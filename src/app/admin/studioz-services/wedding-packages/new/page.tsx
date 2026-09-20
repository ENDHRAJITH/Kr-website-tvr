'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ImageUploader from '@/components/admin/ImageUploader'
import MediaGalleryUploader from '@/components/admin/MediaGalleryUploader'
import { ArrowLeft, Loader2, Save } from 'lucide-react'

export default function NewWeddingPackagePage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [religion, setReligion] = useState<'hindu' | 'christian' | 'muslim'>('hindu')
  const [planCode, setPlanCode] = useState<'A' | 'B' | 'C'>('A')
  const [planName, setPlanName] = useState('')
  const [tagline, setTagline] = useState('')
  const [badge, setBadge] = useState('')
  const [price, setPrice] = useState('')
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null)
  const [photoVideoText, setPhotoVideoText] = useState('')
  const [deliverablesText, setDeliverablesText] = useState('')
  const [galleryUrls, setGalleryUrls] = useState<string[]>([])
  const [isPopular, setIsPopular] = useState(false)
  const [isUltra, setIsUltra] = useState(false)
  const [displayOrder, setDisplayOrder] = useState<number>(1)
  const [isActive, setIsActive] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!planName.trim()) return setError('Plan Name is required.')
    if (!price.trim()) return setError('Price is required.')

    setLoading(true)
    setError(null)

    const photoVideoInclusions = photoVideoText
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0)

    const deliverablesInclusions = deliverablesText
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0)

    const { error: insertError } = await supabase.from('wedding_packages').insert([
      {
        religion,
        plan_code: planCode,
        plan_name: planName,
        tagline: tagline || null,
        badge: badge || null,
        price,
        hero_image_url: heroImageUrl,
        photo_video_inclusions: photoVideoInclusions.length > 0 ? photoVideoInclusions : null,
        deliverables_inclusions: deliverablesInclusions.length > 0 ? deliverablesInclusions : null,
        gallery_urls: galleryUrls.length > 0 ? galleryUrls : null,
        is_popular: isPopular,
        is_ultra: isUltra,
        display_order: displayOrder,
        is_active: isActive,
      },
    ])

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push('/admin/studioz-services')
    router.refresh()
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/studioz-services"
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Add Wedding Package</h1>
            <p className="text-sm text-zinc-400">Create a Hindu, Christian, or Muslim Plan A/B/C package</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Religion */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Religion / Tradition *</label>
            <select
              value={religion}
              onChange={(e) => setReligion(e.target.value as any)}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500 text-sm font-semibold"
            >
              <option value="hindu">HINDU WEDDING</option>
              <option value="christian">CHRISTIAN WEDDING</option>
              <option value="muslim">MUSLIM WEDDING</option>
            </select>
          </div>

          {/* Plan Code */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Plan Code *</label>
            <select
              value={planCode}
              onChange={(e) => setPlanCode(e.target.value as any)}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500 text-sm font-bold font-mono"
            >
              <option value="A">PLAN A</option>
              <option value="B">PLAN B</option>
              <option value="C">PLAN C</option>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Package Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Package Name *</label>
            <input
              type="text"
              required
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="e.g. Shubham Package (Plan A)"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Price String *</label>
            <input
              type="text"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. ₹35,000/-"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm font-bold text-orange-400 font-mono"
            />
          </div>

          {/* Tagline */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Tagline / Subtitle</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Essential Coverage for Traditional Celebrations"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          {/* Badge */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Badge Tag (Optional)</label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. MOST POPULAR CHOICE or GRAND VIP PACKAGE"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>
        </div>

        {/* Coverage & Deliverables Inclusions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Photo & Video Inclusions */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Photo & Video Inclusions (One per line)
            </label>
            <textarea
              rows={5}
              value={photoVideoText}
              onChange={(e) => setPhotoVideoText(e.target.value)}
              placeholder="Traditional Photography&#10;Traditional Videography&#10;Candid Photography&#10;Drone Shots"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm font-mono"
            />
          </div>

          {/* Deliverables Inclusions */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Deliverables & Physical Inclusions (One per line)
            </label>
            <textarea
              rows={5}
              value={deliverablesText}
              onChange={(e) => setDeliverablesText(e.target.value)}
              placeholder="High-Quality Album — 300 Photos&#10;Luxury Album Bag&#10;3 Wall Photo Frames&#10;1 Custom Photo Calendar"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm font-mono"
            />
          </div>
        </div>

        {/* Images & Videos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <ImageUploader
            label="Hero Cover Image"
            value={heroImageUrl}
            onChange={(url) => setHeroImageUrl(url)}
          />

          <MediaGalleryUploader
            label="Photos & Video Links (YouTube URLs supported)"
            value={galleryUrls}
            onChange={(urls) => setGalleryUrls(urls)}
          />
        </div>

        {/* Highlight Options */}
        <div className="flex flex-wrap items-center gap-6 pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isPopular}
              onChange={(e) => setIsPopular(e.target.checked)}
              className="w-5 h-5 accent-orange-500 rounded"
            />
            <span className="text-sm font-medium text-white">Mark as Popular Choice</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isUltra}
              onChange={(e) => setIsUltra(e.target.checked)}
              className="w-5 h-5 accent-orange-500 rounded"
            />
            <span className="text-sm font-medium text-white">Mark as Grand VIP Package</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-5 h-5 accent-orange-500 rounded"
            />
            <span className="text-sm font-medium text-white">Active on Public Site</span>
          </label>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-zinc-800">
          <Link
            href="/admin/studioz-services"
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
                <span>Saving Package...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Create Wedding Package</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
