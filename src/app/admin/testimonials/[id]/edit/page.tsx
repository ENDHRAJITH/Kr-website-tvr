'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ImageUploader from '@/components/admin/ImageUploader'
import { Testimonial } from '@/types/database'
import { ArrowLeft, Loader2, Save, Star } from 'lucide-react'

export default function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()

  const [initialLoading, setInitialLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [rating, setRating] = useState<number>(5)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [displayOrder, setDisplayOrder] = useState<number>(0)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setInitialLoading(true)

      const { data, error: fetchError } = await supabase
        .from('testimonials')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError || !data) {
        setError('Testimonial record not found.')
        setInitialLoading(false)
        return
      }

      const item = data as Testimonial
      setName(item.name || '')
      setText(item.text || '')
      setRating(item.rating ?? 5)
      setPhotoUrl(item.photo_url || null)
      setDisplayOrder(item.display_order ?? 0)
      setIsActive(item.is_active ?? true)

      setInitialLoading(false)
    }

    fetchData()
  }, [id, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return setError('Client name is required.')
    if (!text.trim()) return setError('Testimonial text is required.')

    setLoading(true)
    setError(null)

    const { error: updateError } = await supabase
      .from('testimonials')
      .update({
        name,
        text,
        rating,
        photo_url: photoUrl,
        display_order: displayOrder,
        is_active: isActive,
      })
      .eq('id', id)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    router.push('/admin/testimonials')
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
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/testimonials"
          className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Edit Client Testimonial</h1>
          <p className="text-sm text-zinc-400">Update client review details</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Client Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ananya & Rahul"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Rating (1 to 5 Stars)</label>
            <div className="flex items-center gap-2 pt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'}`}
                  />
                </button>
              ))}
              <span className="text-xs text-zinc-400 font-semibold ml-2">{rating} / 5 Stars</span>
            </div>
          </div>

          {/* Display Order */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Display Order</label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Testimonial Text *</label>
          <textarea
            rows={4}
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Review text..."
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
          />
        </div>

        {/* Photo Uploader */}
        <ImageUploader
          label="Client Photo / Avatar"
          value={photoUrl}
          onChange={(url) => setPhotoUrl(url)}
        />

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

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-zinc-800">
          <Link
            href="/admin/testimonials"
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
