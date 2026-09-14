'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ImageUploader from '@/components/admin/ImageUploader'
import { ServiceCategory, StudiozService } from '@/types/database'
import { ArrowLeft, Loader2, Save } from 'lucide-react'

export default function EditStudiozServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()

  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [name, setName] = useState('')
  const [serviceNo, setServiceNo] = useState<number | ''>('')
  const [categoryId, setCategoryId] = useState('')
  const [label, setLabel] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('')
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null)
  const [coverPointsText, setCoverPointsText] = useState('')
  const [galleryUrls, setGalleryUrls] = useState<string[]>([])
  const [displayOrder, setDisplayOrder] = useState<number>(0)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setInitialLoading(true)

      // Fetch Categories
      const { data: catData } = await supabase
        .from('service_categories')
        .select('*')
        .eq('division', 'studioz')
        .order('display_order')
      if (catData) setCategories(catData as ServiceCategory[])

      // Fetch Service Record
      const { data: serviceData, error: serviceError } = await supabase
        .from('studioz_services')
        .select('*')
        .eq('id', id)
        .single()

      if (serviceError || !serviceData) {
        setError('Service record not found.')
        setInitialLoading(false)
        return
      }

      const service = serviceData as StudiozService
      setName(service.name || '')
      setServiceNo(service.service_no ?? '')
      setCategoryId(service.category_id || '')
      setLabel(service.label || '')
      setPrice(service.price || '')
      setDescription(service.description || '')
      setIcon(service.icon || '')
      setHeroImageUrl(service.hero_image_url || null)
      setCoverPointsText(service.cover_points ? service.cover_points.join('\n') : '')
      setGalleryUrls(service.gallery_urls || [])
      setDisplayOrder(service.display_order ?? 0)
      setIsActive(service.is_active ?? true)

      setInitialLoading(false)
    }

    fetchData()
  }, [id, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return setError('Service name is required.')

    setLoading(true)
    setError(null)

    const coverPoints = coverPointsText
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0)

    const { error: updateError } = await supabase
      .from('studioz_services')
      .update({
        name,
        service_no: serviceNo === '' ? null : Number(serviceNo),
        category_id: categoryId || null,
        label: label || null,
        price: price || null,
        description: description || null,
        icon: icon || null,
        hero_image_url: heroImageUrl,
        cover_points: coverPoints.length > 0 ? coverPoints : null,
        gallery_urls: galleryUrls.length > 0 ? galleryUrls : null,
        display_order: displayOrder,
        is_active: isActive,
      })
      .eq('id', id)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    router.push('/admin/studioz-services')
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/studioz-services"
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Edit Studioz Service</h1>
            <p className="text-sm text-zinc-400">Update package details and images</p>
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
          {/* Service Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Service Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Wedding Photography"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          {/* Service Number */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Service Number (#)</label>
            <input
              type="number"
              value={serviceNo}
              onChange={(e) => setServiceNo(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="1, 2, 3..."
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500 text-sm"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Label / Badge */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Label / Badge</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Popular, Premium"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Price String</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. ₹25,000"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
            />
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
            placeholder="Detailed description..."
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
          />
        </div>

        {/* Cover Points */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            Cover Points (One per line)
          </label>
          <textarea
            rows={3}
            value={coverPointsText}
            onChange={(e) => setCoverPointsText(e.target.value)}
            placeholder="Full day coverage&#10;Unlimited edited photos"
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm font-mono"
          />
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Hero Image */}
          <ImageUploader
            label="Hero Cover Image"
            value={heroImageUrl}
            onChange={(url) => setHeroImageUrl(url)}
          />

          {/* Gallery Images */}
          <ImageUploader
            multiple={true}
            label="Gallery Images"
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
