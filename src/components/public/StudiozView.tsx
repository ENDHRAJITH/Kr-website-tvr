'use client'

import { useState } from 'react'
import Image from 'next/image'
import { StudiozService, ServiceCategory, WeddingPackage } from '@/types/database'
import StudiozVideoHero from './StudiozVideoHero'
import { StudiozVideoItem } from './StudiozVideoMarquee'
import { useTheme } from '@/context/ThemeContext'
import { getMediaType, getYouTubeEmbedUrl, getInstagramEmbedUrl } from '@/lib/utils/media'
import { Play, Video, Check, Sparkles, Plus, Star, ShieldCheck, Camera } from 'lucide-react'

interface StudiozViewProps {
  initialServices?: StudiozService[]
  categories?: ServiceCategory[]
  videoShowcases?: StudiozVideoItem[]
  weddingPackages?: WeddingPackage[]
}

// --------------------------------------------------------------------------
// WEDDING PACKAGES INTERFACE & STATIC FALLBACK DATA
// --------------------------------------------------------------------------
interface WeddingPlan {
  id: string
  planCode: 'A' | 'B' | 'C'
  name: string
  tagline: string
  price: string
  isPopular?: boolean
  isUltra?: boolean
  photoTypes: string[]
  deliverables: string[]
  heroImage: string
  galleryUrls?: string[]
}

interface WeddingReligionCategory {
  id: string
  name: string
  badge: string
  subtitle: string
  plans: WeddingPlan[]
}

export default function StudiozView({
  initialServices = [],
  categories = [],
  videoShowcases = [],
  weddingPackages = []
}: StudiozViewProps) {
  const { isDarkMode } = useTheme()
  const [selectedReligion, setSelectedReligion] = useState<string>('hindu')
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [detailService, setDetailService] = useState<StudiozService | null>(null)
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)
  const [addedNotice, setAddedNotice] = useState<string | null>(null)

  const services = initialServices ?? []

  // --------------------------------------------------------------------------
  // DYNAMIC DATABASE MAPPING FOR 3 WEDDING CATEGORIES & 3 PLANS PER CATEGORY
  // --------------------------------------------------------------------------
  const religionDefs = [
    { id: 'hindu', name: 'Hindu Wedding', badge: 'Traditional Rituals & Celebrations', subtitle: 'Nalangu, Haldi, Mehendi, Sangeet, Nichayathartham, Muhurtham & Reception Coverage' },
    { id: 'christian', name: 'Christian Wedding', badge: 'Holy Matrimony & Receptions', subtitle: 'Engagement, Bridal Shower, Church Ceremony, Choir & Grand Reception Coverage' },
    { id: 'muslim', name: 'Muslim Wedding', badge: 'Nikah & Walima Celebrations', subtitle: 'Engagement, Mehendi, Sacred Nikkah, Groom Procession & Walima Reception' }
  ]

  const dynamicWeddingReligions: WeddingReligionCategory[] = religionDefs.map((def) => {
    // 1. Fetch from wedding_packages table
    const tableItems = (weddingPackages || []).filter(
      (wp) => wp.religion?.toLowerCase() === def.id.toLowerCase()
    )

    if (tableItems.length > 0) {
      tableItems.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))

      const plans: WeddingPlan[] = tableItems.map((item) => ({
        id: item.id,
        planCode: (item.plan_code || 'A') as 'A' | 'B' | 'C',
        name: item.plan_name,
        tagline: item.tagline || '',
        price: item.price,
        isPopular: item.is_popular || Boolean(item.badge && item.badge.toLowerCase().includes('popular')),
        isUltra: item.is_ultra || Boolean(item.badge && item.badge.toLowerCase().includes('vip')),
        heroImage: item.hero_image_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85',
        photoTypes: item.photo_video_inclusions || [],
        deliverables: item.deliverables_inclusions || [],
        galleryUrls: item.gallery_urls || []
      }))

      return {
        id: def.id,
        name: def.name,
        badge: def.badge,
        subtitle: def.subtitle,
        plans
      }
    }

    // 2. Fallback to studioz_services table
    const dbItems = services.filter((s) => {
      const lbl = (s.label || '').toLowerCase()
      const catObjName = ((s as any).service_categories?.name || '').toLowerCase()
      const nm = (s.name || '').toLowerCase()
      const searchKey = def.id
      return lbl.includes(searchKey) || catObjName.includes(searchKey) || nm.includes(searchKey)
    })

    if (dbItems.length > 0) {
      dbItems.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))

      const plans: WeddingPlan[] = dbItems.map((item, idx) => {
        const planCode: 'A' | 'B' | 'C' = idx === 0 ? 'A' : idx === 1 ? 'B' : 'C'
        const coverPoints = item.cover_points || []
        const photoTypes = coverPoints.filter((pt) =>
          /photo|video|shoot|retouch/i.test(pt) && !/album|bag|drive|frame|calendar|led|output|poster/i.test(pt)
        )
        const deliverables = coverPoints.filter((pt) => !photoTypes.includes(pt))

        return {
          id: item.id,
          planCode,
          name: item.name,
          tagline: item.description || '',
          price: item.price || 'Custom Quote',
          isPopular: planCode === 'B' || item.price?.includes('65,000'),
          isUltra: planCode === 'C' || item.price?.includes('90,000'),
          heroImage: item.hero_image_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85',
          photoTypes: photoTypes.length > 0 ? photoTypes : coverPoints,
          deliverables: deliverables.length > 0 ? deliverables : []
        }
      })

      return {
        id: def.id,
        name: def.name,
        badge: def.badge,
        subtitle: def.subtitle,
        plans
      }
    }

    return { id: def.id, name: def.name, badge: def.badge, subtitle: def.subtitle, plans: [] }
  })

  const currentReligionObj = dynamicWeddingReligions.find((r) => r.id === selectedReligion) || dynamicWeddingReligions[0]

  // --------------------------------------------------------------------------
  // DYNAMIC DATABASE MAPPING FOR SPECIAL PACKAGES
  // --------------------------------------------------------------------------
  const specialDbItems = services.filter((s) => {
    const catName = ((s as any).service_categories?.name || '').toLowerCase()
    const catSlug = ((s as any).service_categories?.slug || '').toLowerCase()
    const label = (s.label || '').toLowerCase()
    const catId = (s.category_id || '').toLowerCase()

    return (
      catId === '44444444-4444-4444-a444-444444444444' ||
      catName.includes('special') ||
      catSlug.includes('special') ||
      catName.includes('function') ||
      label.includes('events')
    )
  })

  const dynamicSpecialPackages = specialDbItems.map((item) => {
    let icon = item.icon || '✨'
    const nm = item.name.toLowerCase()
    if (nm.includes('engagement') || nm.includes('ring')) icon = '💍'
    else if (nm.includes('reception') || nm.includes('stage')) icon = '🥂'
    else if (nm.includes('birthday') || nm.includes('party')) icon = '🎂'
    else if (nm.includes('opening') || nm.includes('grand')) icon = '🏬'
    else if (nm.includes('baby')) icon = '👶'

    return {
      id: item.id,
      name: item.name,
      subtitle: item.description || '',
      price: item.price || 'Custom Quote',
      icon,
      heroImage: item.hero_image_url || '',
      items: item.cover_points && item.cover_points.length > 0 ? item.cover_points : [item.description || '']
    }
  })

  // --------------------------------------------------------------------------
  // DYNAMIC DATABASE MAPPING FOR ADD-ON SERVICES
  // --------------------------------------------------------------------------
  const addonDbItems = services.filter((s) => {
    const catName = ((s as any).service_categories?.name || '').toLowerCase()
    const catSlug = ((s as any).service_categories?.slug || '').toLowerCase()
    const label = (s.label || '').toLowerCase()
    const catId = (s.category_id || '').toLowerCase()

    return (
      catId === '77777777-7777-4777-a777-777777777777' ||
      catName.includes('add-on') ||
      catName.includes('addon') ||
      catSlug.includes('add-on') ||
      label.includes('add-on') ||
      label.includes('addon')
    )
  })

  const dynamicAddonServices = addonDbItems.map((item) => {
    let icon = item.icon || '✨'
    if (icon === 'ring') icon = '💍'
    if (icon === 'sparkles') icon = '✨'
    if (icon === 'framed_picture') icon = '🖼️'
    if (icon === 'briefcase') icon = '💼'

    return {
      id: item.id,
      name: item.name,
      category: item.label || (item as any).service_categories?.name || 'Add-on',
      price: item.price || 'Popular Add-on',
      icon: icon
    }
  })

  const catList = categories && categories.length > 0
    ? [{ id: 'all', slug: 'all', name: 'All Services', division: 'studioz', display_order: 0 }, ...categories]
    : [{ id: 'all', slug: 'all', name: 'All Services', division: 'studioz', display_order: 0 }]

  const filteredServices = services.filter((s) => {
    if (activeFilter === 'all') return true

    const sCatId = (s.category_id || '').toLowerCase()
    const sLabel = (s.label || '').toLowerCase()
    const sCatObj = (s as any).service_categories
    const sCatName = (sCatObj?.name || '').toLowerCase()
    const sCatSlug = (sCatObj?.slug || '').toLowerCase()
    const sCatObjId = (sCatObj?.id || '').toLowerCase()

    const activeCatObj = catList.find(
      (c) =>
        c.id === activeFilter ||
        c.slug === activeFilter ||
        c.name.toLowerCase() === activeFilter.toLowerCase()
    )

    const matchTargets = Array.from(
      new Set(
        [
          activeFilter.toLowerCase(),
          activeCatObj?.id?.toLowerCase(),
          activeCatObj?.slug?.toLowerCase(),
          activeCatObj?.name?.toLowerCase(),
        ].filter(Boolean) as string[]
      )
    )

    return matchTargets.some((target) => {
      if (!target) return false
      return (
        sCatId === target ||
        sCatId.includes(target) ||
        target.includes(sCatId) ||
        sCatObjId === target ||
        sCatSlug === target ||
        sCatName === target ||
        (sCatName && target.includes(sCatName)) ||
        (target && sCatName.includes(target)) ||
        (sLabel && sLabel.includes(target))
      )
    })
  })

  const handleAddToCart = (item: { id: string; name: string; price?: string | null }) => {
    const CART_KEY = 'kr_global_enquiry_cart_v2'
    const stored = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    const exists = stored.some((x: { name: string }) => x.name === item.name)
    if (!exists) {
      stored.push({
        id: item.id,
        name: item.name,
        price: item.price || 'Custom Quote',
        division: 'studioz'
      })
      localStorage.setItem(CART_KEY, JSON.stringify(stored))
      window.dispatchEvent(new Event('kr-cart-update'))
    }
    window.dispatchEvent(new Event('kr-open-drawer'))
    setAddedNotice(item.id)
    setTimeout(() => setAddedNotice(null), 1500)
  }

  return (
    <main id="studioz" className={`min-h-screen transition-colors duration-500 ${
      isDarkMode ? 'bg-[#050505] text-white' : 'bg-white text-slate-900'
    }`}>

      {/* 1. HERO VIDEO CAROUSEL SHOWCASE */}
      <StudiozVideoHero videos={videoShowcases} isDarkMode={isDarkMode} />

      {/* =========================================================================
          2. WEDDING PACKAGES SECTION (3 RELIGIONS × 3 PLANS) FROM DATABASE TABLE
      ========================================================================= */}
      <section id="wedding-packages" className={`px-4 sm:px-6 lg:px-8 py-20 md:py-28 border-b transition-colors duration-500 ${
        isDarkMode ? 'bg-[#080808] border-white/10' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316] text-xs font-bold uppercase tracking-widest mb-4">
              <Sparkles className="w-4 h-4" />
              <span>KR Studioz Exclusive Wedding Collections</span>
            </div>
            <h2 className={`font-display font-black uppercase text-3xl sm:text-5xl md:text-6xl tracking-tight leading-none ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              WEDDING <span className="text-[#F97316]">PACKAGES.</span>
            </h2>
          </div>

          {/* Religion Selector Tabs */}
          <div className="flex justify-center mb-12">
            <div className={`inline-flex p-1.5 rounded-2xl border flex-wrap justify-center gap-2 max-w-full ${
              isDarkMode ? 'bg-zinc-950 border-white/15' : 'bg-white border-slate-300 shadow-lg'
            }`}>
              {dynamicWeddingReligions.map((rel) => {
                const isSelected = selectedReligion === rel.id
                return (
                  <button
                    key={rel.id}
                    type="button"
                    onClick={() => setSelectedReligion(rel.id)}
                    className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-display font-bold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#F97316] text-white shadow-lg shadow-orange-500/25 scale-[1.02]'
                        : isDarkMode
                          ? 'text-white/70 hover:text-white hover:bg-white/5'
                          : 'text-slate-700 hover:text-black hover:bg-slate-100'
                    }`}
                  >
                    <span>{rel.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Subtitle Banner */}
          <div className={`p-4 rounded-xl text-center mb-10 border transition-all ${
            isDarkMode ? 'bg-zinc-950/80 border-orange-500/20 text-orange-400' : 'bg-orange-50 border-orange-200 text-orange-800'
          }`}>
            <p className="text-xs sm:text-sm font-semibold tracking-wide">
              {currentReligionObj.badge} — {currentReligionObj.subtitle}
            </p>
          </div>

          {/* 3 Pricing Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {currentReligionObj.plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl border p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  plan.isPopular
                    ? isDarkMode
                      ? 'bg-gradient-to-b from-zinc-900 to-zinc-950 border-[#F97316] shadow-[0_0_40px_rgba(249,115,22,0.25)] scale-[1.03] z-10'
                      : 'bg-white border-[#F97316] shadow-2xl shadow-orange-500/20 scale-[1.03] z-10'
                    : plan.isUltra
                      ? isDarkMode
                        ? 'bg-zinc-950 border-amber-500/40 hover:border-amber-500'
                        : 'bg-white border-amber-400/60 hover:border-amber-500 shadow-xl'
                      : isDarkMode
                        ? 'bg-zinc-950 border-white/10 hover:border-white/30'
                        : 'bg-white border-slate-200 shadow-xl hover:border-slate-300'
                }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#F97316] text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-white" />
                    <span>MOST POPULAR CHOICE</span>
                  </div>
                )}

                {/* Ultra VIP Badge */}
                {plan.isUltra && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 fill-black" />
                    <span>GRAND VIP PACKAGE</span>
                  </div>
                )}

                <div>
                  {/* Plan Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-black uppercase tracking-widest text-[#F97316]">
                      PLAN {plan.planCode}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                      isDarkMode ? 'bg-white/5 text-white/60' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {currentReligionObj.name}
                    </span>
                  </div>

                  <h3 className={`font-display font-bold uppercase text-2xl sm:text-3xl ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs mt-2 leading-relaxed font-medium min-h-[36px] ${
                    isDarkMode ? 'text-white/60' : 'text-slate-600'
                  }`}>
                    {plan.tagline}
                  </p>

                  {/* Price */}
                  <div className="my-6 pt-4 border-t border-dashed border-white/10">
                    <span className={`text-[9px] uppercase tracking-widest font-bold ${
                      isDarkMode ? 'text-white/40' : 'text-slate-400'
                    }`}>Net Package Rate</span>
                    <p className="font-display font-black text-3xl sm:text-4xl text-[#F97316] mt-1 tracking-tight">
                      {plan.price}
                    </p>
                  </div>

                  {/* Feature Lists */}
                  <div className="space-y-4 text-xs">
                    {/* Photography & Videography */}
                    {plan.photoTypes.length > 0 && (
                      <div>
                        <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${
                          isDarkMode ? 'text-white/40' : 'text-slate-400'
                        }`}>
                          Photography &amp; Videography
                        </p>
                        <ul className="space-y-2">
                          {plan.photoTypes.map((pt, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <Check className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
                              <span className={`font-semibold ${isDarkMode ? 'text-white/90' : 'text-slate-800'}`}>
                                {pt}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Deliverables & Albums */}
                    {plan.deliverables.length > 0 && (
                      <div className="pt-3 border-t border-dashed border-white/10">
                        <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${
                          isDarkMode ? 'text-white/40' : 'text-slate-400'
                        }`}>
                          Album &amp; Deliverables
                        </p>
                        <ul className="space-y-2">
                          {plan.deliverables.map((del, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <ShieldCheck className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
                              <span className={isDarkMode ? 'text-white/80' : 'text-slate-700'}>
                                {del}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions: View Media Modal & Add To Cart */}
                <div className="mt-8 pt-6 border-t border-white/10 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setDetailService({
                        id: plan.id,
                        service_no: plan.planCode === 'A' ? 1 : plan.planCode === 'B' ? 2 : 3,
                        name: `${currentReligionObj.name} — ${plan.name}`,
                        category_id: null,
                        label: currentReligionObj.name,
                        price: plan.price,
                        description: plan.tagline,
                        icon: 'camera',
                        hero_image_url: plan.heroImage,
                        cover_points: [...plan.photoTypes, ...plan.deliverables],
                        gallery_urls: plan.galleryUrls && plan.galleryUrls.length > 0 ? plan.galleryUrls : [plan.heroImage, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
                        display_order: 1,
                        is_active: true
                      })
                    }}
                    className={`w-full py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 ${
                      isDarkMode
                        ? 'border-white/20 hover:border-[#F97316] text-white/90 hover:text-[#F97316]'
                        : 'border-slate-300 hover:border-[#F97316] text-slate-700 hover:text-[#F97316] bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5 text-[#F97316]" />
                    <span>View Photos &amp; Video ▶</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddToCart({
                      id: plan.id,
                      name: `${currentReligionObj.name} — ${plan.name} (Plan ${plan.planCode})`,
                      price: plan.price
                    })}
                    className={`w-full py-3.5 rounded-xl font-display font-bold text-xs uppercase tracking-widest transition cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                      plan.isPopular
                        ? 'bg-[#F97316] hover:bg-white hover:text-black text-white shadow-orange-500/30'
                        : plan.isUltra
                          ? 'bg-amber-500 hover:bg-amber-600 text-black shadow-amber-500/20'
                          : isDarkMode
                            ? 'bg-white/10 hover:bg-[#F97316] text-white hover:text-white'
                            : 'bg-slate-900 hover:bg-[#F97316] text-white'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>{addedNotice === plan.id ? '✓ Package Added' : 'Add Package To Enquiry'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. STUDIOZ & SPECIAL SERVICES SECTION FROM DATABASE TABLE (studioz_services)
      ========================================================================= */}
      {services.length > 0 && (
        <section id="special-services" className={`px-4 sm:px-6 lg:px-8 py-20 md:py-28 border-b transition-colors duration-500 ${
          isDarkMode ? 'bg-[#050505] border-white/10' : 'bg-white border-slate-200'
        }`}>
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316] text-xs font-bold uppercase tracking-widest mb-4">
                <Camera className="w-4 h-4" />
                <span>Studioz &amp; Special Functions ({services.length})</span>
              </div>
              <h2 className={`font-display font-black uppercase text-3xl sm:text-5xl md:text-6xl tracking-tight leading-none ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                SPECIAL EVENT <span className="text-[#F97316]">SERVICES.</span>
              </h2>
              <p className={`text-xs sm:text-sm mt-4 leading-relaxed font-medium ${
                isDarkMode ? 'text-white/60' : 'text-slate-600'
              }`}>
                Tailored photography &amp; videography packages for Ring Ceremonies, Receptions, Birthday Parties, and Commercial Grand Openings.
              </p>
            </div>

            {/* Special Services Grid */}
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              {services.map((service, idx) => {
                const coverPoints = service.cover_points || []
                return (
                  <div
                    key={service.id}
                    className={`group relative rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl ${
                      isDarkMode
                        ? 'bg-zinc-950 border-white/10 hover:border-[#F97316]/50 shadow-black/40'
                        : 'bg-slate-50 border-slate-200 hover:border-[#F97316] shadow-xl'
                    }`}
                  >
                    {/* Hero Image Header */}
                    {service.hero_image_url && (
                      <div className="relative h-64 w-full overflow-hidden bg-zinc-900">
                        <Image
                          src={service.hero_image_url}
                          alt={service.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                        
                        {/* Badges Overlay */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/20">
                            {service.label || 'Special Package'}
                          </span>
                          <span className="px-3.5 py-1 rounded-full text-xs font-black font-mono bg-[#F97316] text-white shadow-lg">
                            {service.price || 'Custom Quote'}
                          </span>
                        </div>

                        <div className="absolute bottom-4 left-6 right-6 z-10">
                          <span className="text-[10px] font-mono font-bold text-[#F97316] tracking-widest uppercase">
                            SERVICE #{String(service.service_no || idx + 1).padStart(2, '0')}
                          </span>
                          <h3 className="font-display font-bold uppercase text-2xl sm:text-3xl text-white mt-0.5 drop-shadow-md">
                            {service.name}
                          </h3>
                        </div>
                      </div>
                    )}

                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                      {!service.hero_image_url && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono font-bold text-[#F97316] tracking-widest uppercase">
                              SERVICE #{String(service.service_no || idx + 1).padStart(2, '0')}
                            </span>
                            <span className="font-mono font-bold text-sm text-[#F97316]">{service.price}</span>
                          </div>
                          <h3 className={`font-display font-bold uppercase text-2xl sm:text-3xl ${
                            isDarkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            {service.name}
                          </h3>
                        </div>
                      )}

                      {/* Description */}
                      {service.description && (
                        <p className={`text-xs sm:text-sm leading-relaxed ${
                          isDarkMode ? 'text-white/70' : 'text-slate-600'
                        }`}>
                          {service.description}
                        </p>
                      )}

                      {/* Cover Points / Inclusions List */}
                      {coverPoints.length > 0 && (
                        <div className="space-y-2.5 pt-2">
                          <p className={`text-[10px] font-bold uppercase tracking-wider ${
                            isDarkMode ? 'text-white/40' : 'text-slate-400'
                          }`}>
                            Package Highlights &amp; Coverage
                          </p>
                          <div className="grid sm:grid-cols-2 gap-2 text-xs">
                            {coverPoints.map((pt, pIdx) => (
                              <div key={pIdx} className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
                                <span className={`font-medium ${isDarkMode ? 'text-white/90' : 'text-slate-800'}`}>
                                  {pt}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="pt-6 border-t border-white/10 grid sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setDetailService(service)}
                          className={`py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 ${
                            isDarkMode
                              ? 'border-white/20 hover:border-[#F97316] text-white hover:text-[#F97316]'
                              : 'border-slate-300 hover:border-[#F97316] text-slate-700 hover:text-[#F97316] bg-white'
                          }`}
                        >
                          <Video className="w-3.5 h-3.5 text-[#F97316]" />
                          <span>View Details &amp; Media</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAddToCart({
                            id: service.id,
                            name: service.name,
                            price: service.price
                          })}
                          className="py-3 px-4 rounded-xl font-display font-bold text-xs uppercase tracking-widest transition cursor-pointer flex items-center justify-center gap-2 bg-[#F97316] hover:bg-white hover:text-black text-white shadow-lg shadow-orange-500/20"
                        >
                          <Plus className="w-4 h-4" />
                          <span>{addedNotice === service.id ? '✓ Service Added' : 'Add To Enquiry'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}



      {/* 7. FINAL CTA BANNER */}
      <section className={`px-4 sm:px-6 lg:px-8 py-20 md:py-28 transition-colors duration-500 ${
        isDarkMode ? 'bg-[#0a0a0a]' : 'bg-slate-50'
      }`}>
        <div className={`max-w-7xl mx-auto border p-8 sm:p-14 rounded-2xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 ${
          isDarkMode ? 'border-white/15 bg-zinc-950' : 'border-slate-200 bg-slate-900 text-white shadow-2xl'
        }`}>
          <div className="relative z-10 max-w-2xl">
            <p className="text-[#F97316] text-xs font-bold uppercase tracking-[0.25em]">
              06 / Ready to Record
            </p>
            <h2 className="font-display font-bold uppercase tracking-tight text-3xl sm:text-5xl md:text-6xl mt-3 text-white leading-tight">
              YOUR STORY DESERVES TO BE <span className="text-[#F97316]">REMEMBERED.</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/60 mt-4 leading-relaxed">
              Contact us or add packages to your cart to request a personalized quote for your upcoming event.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('kr-open-drawer'))}
            className="relative z-10 bg-[#F97316] hover:bg-white text-white hover:text-black px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition cursor-pointer shadow-lg shadow-orange-500/20 whitespace-nowrap shrink-0"
          >
            Start An Enquiry ↗
          </button>
        </div>
      </section>

      {/* SERVICE DETAIL OVERLAY MODAL */}
      {detailService && (
        <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md overflow-y-auto p-4 sm:p-8">
          <div className={`max-w-5xl mx-auto border rounded-2xl overflow-hidden shadow-2xl my-6 ${
            isDarkMode ? 'bg-zinc-950 border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* Header */}
            <div className={`sticky top-0 z-20 px-6 py-4 border-b flex items-center justify-between backdrop-blur-md ${
              isDarkMode ? 'bg-zinc-950/90 border-white/10' : 'bg-white/90 border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => setDetailService(null)}
                className={`text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                  isDarkMode ? 'text-white/70 hover:text-[#F97316]' : 'text-slate-600 hover:text-[#F97316]'
                }`}
              >
                ← Back to Services
              </button>
              <button
                type="button"
                onClick={() => handleAddToCart({ id: detailService.id, name: detailService.name, price: detailService.price })}
                className="bg-[#F97316] hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                + Add To Enquiry
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-10 space-y-8">
              {/* Top Banner */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="text-[#F97316] text-xs font-bold uppercase tracking-widest">
                    #{String(detailService.service_no || 1).padStart(2, '0')} / {detailService.label || 'Studioz'}
                  </span>
                  <h2 className={`font-display font-bold uppercase text-3xl sm:text-5xl mt-2 ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {detailService.name}
                  </h2>
                  <p className={`text-xs sm:text-sm mt-4 leading-relaxed ${
                    isDarkMode ? 'text-white/60' : 'text-slate-600'
                  }`}>
                    {detailService.description}
                  </p>
                  <div className="mt-6">
                    <span className={`text-[10px] uppercase tracking-widest font-bold ${
                      isDarkMode ? 'text-white/40' : 'text-slate-400'
                    }`}>Starting Price</span>
                    <p className="font-display text-2xl font-bold text-[#F97316] mt-1">{detailService.price || '₹ XX,XXX'}</p>
                  </div>
                </div>

                <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-zinc-900">
                  {detailService.hero_image_url && (
                    <Image
                      src={detailService.hero_image_url}
                      alt={detailService.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </div>
              </div>

              {/* Cover Points */}
              {detailService.cover_points && detailService.cover_points.length > 0 && (
                <div className={`pt-6 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                  <h3 className={`font-display font-bold uppercase text-lg mb-4 ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    What We Cover in {detailService.name}
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {detailService.cover_points.map((pt, i) => (
                      <div key={i} className={`border p-3.5 rounded-lg flex items-center gap-3 ${
                        isDarkMode ? 'border-white/10 bg-zinc-900' : 'border-slate-200 bg-slate-50'
                      }`}>
                        <span className="w-6 h-6 rounded-full bg-[#F97316]/20 text-[#F97316] text-xs font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <span className={`text-xs font-semibold ${
                          isDarkMode ? 'text-white/80' : 'text-slate-700'
                        }`}>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery Grid (Photos & Videos) */}
              {detailService.gallery_urls && detailService.gallery_urls.length > 0 && (
                <div className={`pt-6 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                  <h3 className={`font-display font-bold uppercase text-lg mb-4 ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Sample Gallery Work (Photos &amp; Videos)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {detailService.gallery_urls.map((url, i) => {
                      const mediaType = getMediaType(url)
                      const isVideo = mediaType !== 'image'

                      return (
                        <div
                          key={i}
                          onClick={() => setLightboxImg(url)}
                          className="relative h-44 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 cursor-pointer group bg-zinc-900"
                        >
                          {mediaType === 'image' && (
                            <Image
                              src={url}
                              alt={`Gallery item ${i + 1}`}
                              fill
                              className="object-cover group-hover:scale-105 transition duration-500"
                              unoptimized
                            />
                          )}

                          {mediaType === 'video_file' && (
                            <video
                              src={url}
                              className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
                              muted
                              playsInline
                            />
                          )}

                          {(mediaType === 'youtube' || mediaType === 'instagram') && (
                            <div className="w-full h-full p-4 flex flex-col items-center justify-center text-center bg-zinc-950 text-white gap-2 group-hover:scale-105 transition duration-500">
                              <Video className="w-8 h-8 text-[#F97316] animate-pulse" />
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F97316]">
                                {mediaType === 'youtube' ? 'YouTube Video' : 'Instagram Reel'}
                              </span>
                              <p className="text-[9px] text-zinc-400 truncate max-w-full px-2">Click to Play</p>
                            </div>
                          )}

                          {/* Video Badge & Play Button Overlay */}
                          {isVideo && (
                            <>
                              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#F97316] text-black text-[9px] font-bold uppercase tracking-wider shadow z-10">
                                {mediaType === 'youtube' ? 'YouTube' : mediaType === 'instagram' ? 'Reel' : 'Video'}
                              </span>
                              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                                <div className="w-11 h-11 rounded-full bg-[#F97316] text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                  <Play className="w-5 h-5 fill-black ml-0.5" />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MEDIA LIGHTBOX MODAL (Photos & Videos) */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-[130] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxImg(null)}
        >
          <button
            type="button"
            className="absolute top-6 right-6 text-white text-3xl font-bold hover:text-[#F97316] z-50 cursor-pointer"
            onClick={() => setLightboxImg(null)}
          >
            ×
          </button>
          
          <div
            className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {getMediaType(lightboxImg) === 'youtube' && (
              <iframe
                src={getYouTubeEmbedUrl(lightboxImg)}
                className="w-full max-w-4xl aspect-video rounded-2xl border border-white/20 shadow-2xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}

            {getMediaType(lightboxImg) === 'instagram' && (
              <iframe
                src={getInstagramEmbedUrl(lightboxImg)}
                className="w-full max-w-md h-[75vh] rounded-2xl border border-white/20 shadow-2xl bg-black"
                allowFullScreen
              />
            )}

            {getMediaType(lightboxImg) === 'video_file' && (
              <video
                src={lightboxImg}
                controls
                autoPlay
                className="max-w-full max-h-full rounded-2xl border border-white/20 shadow-2xl"
              />
            )}

            {getMediaType(lightboxImg) === 'image' && (
              <img
                src={lightboxImg}
                alt="Enlarged view"
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              />
            )}
          </div>
        </div>
      )}

    </main>
  )
}
