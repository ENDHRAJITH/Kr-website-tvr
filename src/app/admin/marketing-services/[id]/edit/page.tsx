'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ServiceCategory, MarketingService } from '@/types/database'
import { ArrowLeft, Loader2, Save } from 'lucide-react'

export default function EditMarketingServicePage({ params }: { params: Promise<{ id: string }> }) {
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
  const [subtitle, setSubtitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [priceUnit, setPriceUnit] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [projectTag, setProjectTag] = useState('')
  const [featuresText, setFeaturesText] = useState('')
  const [benefitsText, setBenefitsText] = useState('')
  const [displayOrder, setDisplayOrder] = useState<number>(0)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setInitialLoading(true)

      // Fetch Categories
      const { data: catData } = await supabase
        .from('service_categories')
        .select('*')
        .eq('division', 'marketing')
        .order('display_order')
      if (catData) setCategories(catData as ServiceCategory[])

      // Fetch Record
      const { data: serviceData, error: serviceError } = await supabase
        .from('marketing_services')
        .select('*')
        .eq('id', id)
        .single()

      if (serviceError || !serviceData) {
        setError('Marketing service record not found.')
        setInitialLoading(false)
        return
      }

      const service = serviceData as MarketingService
      setName(service.name || '')
      setServiceNo(service.service_no ?? '')
      setSubtitle(service.subtitle || '')
      setDescription(service.description || '')
      setPrice(service.price || '')
      setPriceUnit(service.price_unit || '')
      setCategoryId(service.category_id || '')
      setProjectTag(service.project_tag || '')
      setFeaturesText(service.features ? service.features.join('\n') : '')
      setBenefitsText(service.benefits ? service.benefits.join('\n') : '')
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

    const features = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0)

    const benefits = benefitsText
      .split('\n')
      .map((b) => b.trim())
      .filter((b) => b.length > 0)

    const { error: updateError } = await supabase
      .from('marketing_services')
      .update({
        name,
        service_no: serviceNo === '' ? null : Number(serviceNo),
        subtitle: subtitle || null,
        description: description || null,
        price: price || null,
        price_unit: priceUnit || null,
        category_id: categoryId || null,
        project_tag: projectTag || null,
        features: features.length > 0 ? features : null,
        benefits: benefits.length > 0 ? benefits : null,
        display_order: displayOrder,
        is_active: isActive,
      })
      .eq('id', id)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    router.push('/admin/marketing-services')
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
          href="/admin/marketing-services"
          className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Edit Marketing Service</h1>
          <p className="text-sm text-zinc-400">Update digital marketing package attributes</p>
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
          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Service Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Social Media Management"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          {/* Service No */}
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

          {/* Subtitle */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Subtitle</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Boost brand reach..."
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

          {/* Price */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Price String</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. ₹15,000"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          {/* Price Unit */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Price Unit</label>
            <input
              type="text"
              value={priceUnit}
              onChange={(e) => setPriceUnit(e.target.value)}
              placeholder="e.g. /month"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          {/* Project Tag */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Project Tag</label>
            <input
              type="text"
              value={projectTag}
              onChange={(e) => setProjectTag(e.target.value)}
              placeholder="e.g. SEO, SMM"
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
            placeholder="Detailed overview..."
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
          />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Package Features (One per line)
            </label>
            <textarea
              rows={4}
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              placeholder="Features..."
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Key Benefits (One per line)
            </label>
            <textarea
              rows={4}
              value={benefitsText}
              onChange={(e) => setBenefitsText(e.target.value)}
              placeholder="Benefits..."
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm font-mono"
            />
          </div>
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
            href="/admin/marketing-services"
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
