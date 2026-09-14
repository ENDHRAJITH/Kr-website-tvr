'use client'

import { useState } from 'react'
import Image from 'next/image'
import { StudiozService, ServiceCategory } from '@/types/database'
import StudiozVideoHero from './StudiozVideoHero'
import { StudiozVideoItem } from './StudiozVideoMarquee'
import { useTheme } from '@/context/ThemeContext'

interface StudiozViewProps {
  initialServices?: StudiozService[]
  categories?: ServiceCategory[]
  videoShowcases?: StudiozVideoItem[]
}


const FALLBACK_SERVICES: StudiozService[] = [
  {
    id: 's1',
    service_no: 1,
    name: 'Wedding Photography',
    category_id: 'wedding',
    label: 'Wedding',
    price: '₹ XX,XXX onwards',
    description: 'Complete wedding photography coverage designed to preserve every important moment of your celebration.',
    icon: 'camera',
    hero_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
    cover_points: ['Bride & Groom', 'Candid Moments', 'Family Portraits', 'Wedding Rituals', 'Guest Moments', 'Details & Decorations'],
    gallery_urls: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=85'
    ],
    display_order: 1,
    is_active: true
  },
  {
    id: 's2',
    service_no: 2,
    name: 'Pre-Wedding Shoot',
    category_id: 'wedding',
    label: 'Wedding',
    price: '₹ XX,XXX onwards',
    description: 'A creative pre-wedding session built around your story, location and personality.',
    icon: 'heart',
    hero_image_url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1600&q=85',
    cover_points: ['Location Planning', 'Couple Portraits', 'Creative Concepts', 'Candid Frames', 'Edited Images', 'Highlight Reel'],
    gallery_urls: [
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&w=1000&q=85'
    ],
    display_order: 2,
    is_active: true
  },
  {
    id: 's3',
    service_no: 3,
    name: 'Reception Coverage',
    category_id: 'wedding',
    label: 'Wedding',
    price: '₹ XX,XXX onwards',
    description: 'Elegant reception coverage focused on entrances, stage performances, family and celebratory moments.',
    icon: 'spark',
    hero_image_url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=85',
    cover_points: ['Stage & Decor', 'Couple Entry', 'Family Moments', 'Candid Coverage', 'Performances', 'Reception Film'],
    gallery_urls: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1000&q=85'
    ],
    display_order: 3,
    is_active: true
  },
  {
    id: 's4',
    service_no: 4,
    name: 'Nikkah Ceremony',
    category_id: 'wedding',
    label: 'Wedding',
    price: '₹ XX,XXX onwards',
    description: 'Thoughtful coverage of the Nikkah ceremony, portraits, traditional rituals and family celebrations.',
    icon: 'moon',
    hero_image_url: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1600&q=85',
    cover_points: ['Ceremony Coverage', 'Couple Portraits', 'Family Frames', 'Candid Moments', 'Details', 'Highlight Film'],
    gallery_urls: [
      'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=85'
    ],
    display_order: 4,
    is_active: true
  },
  {
    id: 's5',
    service_no: 5,
    name: 'Baby & Kids Photography',
    category_id: 'baby',
    label: 'Baby',
    price: '₹ X,XXX onwards',
    description: 'Gentle, creative baby photography focused on natural expressions and beautiful family details.',
    icon: 'baby',
    hero_image_url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1600&q=85',
    cover_points: ['Baby Portraits', 'Creative Setups', 'Family Frames', 'Detail Shots', 'Edited Photos', 'Short Reels'],
    gallery_urls: [
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1504159506876-f8338247a14a?auto=format&fit=crop&w=1000&q=85'
    ],
    display_order: 5,
    is_active: true
  },
  {
    id: 's6',
    service_no: 6,
    name: 'Birthday Celebrations',
    category_id: 'events',
    label: 'Events',
    price: '₹ X,XXX onwards',
    description: 'Fun and energetic coverage of birthdays, from decorations and arrivals to cake cutting celebrations.',
    icon: 'cake',
    hero_image_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=85',
    cover_points: ['Decorations', 'Cake Cutting', 'Family', 'Candid Moments', 'Group Photos', 'Event Highlights'],
    gallery_urls: [
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=1000&q=85'
    ],
    display_order: 6,
    is_active: true
  },
  {
    id: 's7',
    service_no: 7,
    name: 'Baby Shower & Valaikappu',
    category_id: 'baby',
    label: 'Baby',
    price: '₹ X,XXX onwards',
    description: 'Capture the joy, family and beautiful traditional details of a baby shower celebration.',
    icon: 'gift',
    hero_image_url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1600&q=85',
    cover_points: ['Decor', 'Parents-to-be', 'Family', 'Candid Moments', 'Traditional Ceremonies', 'Highlights'],
    gallery_urls: [
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=85'
    ],
    display_order: 7,
    is_active: true
  },
  {
    id: 's8',
    service_no: 8,
    name: 'Naming Ceremony',
    category_id: 'ceremonies',
    label: 'Ceremonies',
    price: '₹ X,XXX onwards',
    description: "A warm visual record of your family's naming ceremony and traditional rituals.",
    icon: 'flower',
    hero_image_url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1600&q=85',
    cover_points: ['Ceremony', 'Baby Moments', 'Family', 'Traditional Details', 'Portraits', 'Event Highlights'],
    gallery_urls: [
      'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1504159506876-f8338247a14a?auto=format&fit=crop&w=1000&q=85'
    ],
    display_order: 8,
    is_active: true
  },
  {
    id: 's9',
    service_no: 9,
    name: 'Puberty Ceremony',
    category_id: 'ceremonies',
    label: 'Ceremonies',
    price: '₹ XX,XXX onwards',
    description: 'Respectful photography and film coverage for traditional family puberty celebrations.',
    icon: 'flower',
    hero_image_url: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1600&q=85',
    cover_points: ['Ceremony Coverage', 'Family Portraits', 'Traditional Moments', 'Candid Frames', 'Details', 'Highlights'],
    gallery_urls: [
      'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1000&q=85'
    ],
    display_order: 9,
    is_active: true
  },
  {
    id: 's10',
    service_no: 10,
    name: 'Sathabishegam & Ceremonies',
    category_id: 'ceremonies',
    label: 'Ceremonies',
    price: '₹ XX,XXX onwards',
    description: 'Preserve the spiritual, family and celebratory traditional moments of a Sathabishegam.',
    icon: 'flower',
    hero_image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=85',
    cover_points: ['Ceremony', 'Family', 'Traditional Details', 'Portraits', 'Candid Moments', 'Highlight Film'],
    gallery_urls: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=85'
    ],
    display_order: 10,
    is_active: true
  },
  {
    id: 's11',
    service_no: 11,
    name: '60th Marriage (Sasthi Poorthi)',
    category_id: 'ceremonies',
    label: 'Ceremonies',
    price: '₹ XX,XXX onwards',
    description: 'Celebrate a lifetime milestone with a timeless visual story of family, tradition and togetherness.',
    icon: 'rings',
    hero_image_url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1600&q=85',
    cover_points: ['Couple Portraits', 'Family', 'Ceremony', 'Candid Moments', 'Details', 'Highlights'],
    gallery_urls: [
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=85'
    ],
    display_order: 11,
    is_active: true
  },
  {
    id: 's12',
    service_no: 12,
    name: 'Model & Fashion Shoot',
    category_id: 'portraits',
    label: 'Portraits',
    price: '₹ X,XXX onwards',
    description: 'Creative portrait and model shoots with direction, lighting and polished final visuals.',
    icon: 'user',
    hero_image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=85',
    cover_points: ['Creative Direction', 'Portraits', 'Lighting', 'Multiple Looks', 'Retouching', 'Social Formats'],
    gallery_urls: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1000&q=85'
    ],
    display_order: 12,
    is_active: true
  },
  {
    id: 's13',
    service_no: 13,
    name: 'Commercial Product Shoot',
    category_id: 'commercial',
    label: 'Commercial',
    price: '₹ X,XXX onwards',
    description: 'Clean, high-converting product visuals for brands, catalogues and digital marketing.',
    icon: 'box',
    hero_image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=85',
    cover_points: ['Product Styling', 'Studio Lighting', 'Multiple Angles', 'Retouching', 'Catalogue Images', 'Social Creatives'],
    gallery_urls: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85'
    ],
    display_order: 13,
    is_active: true
  },
  {
    id: 's14',
    service_no: 14,
    name: 'Live Multi-Cam Broadcasting',
    category_id: 'live',
    label: 'Live',
    price: '₹ XX,XXX onwards',
    description: 'Professional 4K multi-camera live broadcasting for grand weddings, ceremonies and corporate events.',
    icon: 'live',
    hero_image_url: 'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?auto=format&fit=crop&w=1600&q=85',
    cover_points: ['Multi-camera Setup', 'Live Switching', 'High Quality Audio', 'Streaming Setup', 'Event Monitoring', 'Live Support'],
    gallery_urls: [
      'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?auto=format&fit=crop&w=1000&q=85'
    ],
    display_order: 14,
    is_active: true
  }
]

const DEFAULT_CATEGORIES = [
  { slug: 'all', name: 'All Services' },
  { slug: 'wedding', name: 'Wedding' },
  { slug: 'events', name: 'Events' },
  { slug: 'baby', name: 'Baby & Kids' },
  { slug: 'ceremonies', name: 'Ceremonies' },
  { slug: 'portraits', name: 'Portraits' },
  { slug: 'commercial', name: 'Commercial' },
  { slug: 'live', name: 'Live Stream' },
]

export default function StudiozView({
  initialServices = [],
  categories = [],
  videoShowcases = []
}: StudiozViewProps) {
  const { isDarkMode, toggleTheme } = useTheme()
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [detailService, setDetailService] = useState<StudiozService | null>(null)
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)
  const [addedNotice, setAddedNotice] = useState<string | null>(null)


  const services = initialServices ?? []

  const catList = categories && categories.length > 0
    ? [{ id: 'all', slug: 'all', name: 'All Services', division: 'studioz', display_order: 0 }, ...categories]
    : DEFAULT_CATEGORIES.map(c => ({ id: c.slug, slug: c.slug, name: c.name, division: 'studioz' as const, display_order: 0 }))

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

  const handleAddToCart = (s: StudiozService) => {
    const CART_KEY = 'kr_global_enquiry_cart_v2'
    const stored = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    const exists = stored.some((x: { name: string }) => x.name === s.name)
    if (!exists) {
      stored.push({
        id: s.id,
        name: s.name,
        price: s.price || 'Custom',
        division: 'studioz'
      })
      localStorage.setItem(CART_KEY, JSON.stringify(stored))
      window.dispatchEvent(new Event('kr-cart-update'))
    }
    window.dispatchEvent(new Event('kr-open-drawer'))
    setAddedNotice(s.id)
    setTimeout(() => setAddedNotice(null), 1500)
  }

  return (
    <main id="studioz" className={`min-h-screen transition-colors duration-500 ${
      isDarkMode ? 'bg-[#050505] text-white' : 'bg-white text-slate-900'
    }`}>

      {/* 1. HERO VIDEO CAROUSEL SHOWCASE */}
      <StudiozVideoHero videos={videoShowcases} isDarkMode={isDarkMode} />

      {/* 2. SERVICES SECTION */}
      <section id="services" className={`px-4 sm:px-6 lg:px-8 py-20 md:py-28 transition-colors duration-500 border-b ${
        isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-[#F97316] text-xs font-bold uppercase tracking-[0.25em]">
                01 / Discover Services
              </p>
              <h2 className={`font-display font-bold uppercase tracking-tight text-3xl sm:text-5xl md:text-6xl mt-2 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                OUR STUDIO <span className="text-[#F97316]">SERVICES.</span>
              </h2>
            </div>
            <p className={`max-w-md text-xs sm:text-sm leading-relaxed ${
              isDarkMode ? 'text-white/50' : 'text-slate-600'
            }`}>
              Explore photography, videography, and broadcasting services tailored to your occasion. Select services to build your enquiry.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div id="filterTabs" className="flex gap-2.5 overflow-x-auto pb-4 no-scrollbar">
            {catList.map((cat) => {
              const filterKey = cat.slug || cat.id || cat.name.toLowerCase()
              const isActive = activeFilter === filterKey
              return (
                <button
                  key={cat.id || filterKey}
                  type="button"
                  onClick={() => setActiveFilter(filterKey)}
                  className={`filter-tab ${isActive ? 'active' : ''} ${
                    !isDarkMode && !isActive ? '!border-slate-300 !bg-white !text-slate-700 hover:!text-[#F97316]' : ''
                  }`}
                >
                  {cat.name}
                </button>
              )
            })}
          </div>

          {/* Services Cards Grid */}
          <div id="servicesList" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredServices.map((s, idx) => (
              <article
                key={s.id || idx}
                className={`group relative rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xl ${
                  isDarkMode 
                    ? 'border-white/10 bg-zinc-950 hover:border-[#F97316]/50' 
                    : 'border-slate-200 bg-white hover:border-[#F97316]/50 hover:shadow-2xl shadow-slate-200/60'
                }`}
              >
                <div>
                  {/* Image Cover */}
                  <div className="relative h-60 sm:h-64 w-full overflow-hidden bg-slate-100 dark:bg-zinc-900">
                    {s.hero_image_url && (
                      <Image
                        src={s.hero_image_url}
                        alt={s.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                      <span className="bg-black/70 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-widest">
                        #{String(s.service_no || idx + 1).padStart(2, '0')}
                      </span>
                      <span className="bg-[#F97316] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md">
                        {(s as any).service_categories?.name || s.label || s.category_id || 'Studioz'}
                      </span>
                    </div>

                    {/* Title Overlay */}
                    <div className="absolute left-5 right-5 bottom-4 text-white z-10">
                      <h3 className="font-display font-bold uppercase text-2xl sm:text-3xl leading-tight drop-shadow-md">
                        {s.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Description */}
                  <div className="p-5 sm:p-6">
                    <p className={`text-xs sm:text-sm leading-relaxed min-h-[50px] ${
                      isDarkMode ? 'text-white/60' : 'text-slate-600'
                    }`}>
                      {s.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className={`p-5 sm:p-6 pt-0 border-t mt-2 ${
                  isDarkMode ? 'border-white/5' : 'border-slate-100'
                }`}>
                  <div className="flex items-center justify-between gap-3 pt-4 mb-3">
                    <div>
                      <p className={`text-[9px] font-bold uppercase tracking-widest ${
                        isDarkMode ? 'text-white/40' : 'text-slate-400'
                      }`}>
                        Starting From
                      </p>
                      <p className="font-display font-bold text-base sm:text-lg text-[#F97316] mt-0.5">
                        {s.price || '₹ XX,XXX'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(s)}
                      className="bg-[#F97316] hover:bg-slate-900 text-white px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer whitespace-nowrap shadow-md"
                    >
                      {addedNotice === s.id ? '✓ Added' : '+ Add To Enquiry'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDetailService(s)}
                    className={`w-full border py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition cursor-pointer ${
                      isDarkMode
                        ? 'border-white/15 hover:border-[#F97316] hover:text-[#F97316] text-white/80'
                        : 'border-slate-300 hover:border-[#F97316] hover:text-[#F97316] text-slate-700 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    View Details &amp; Gallery →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHY KR STUDIOZ SECTION */}
      <section className={`px-4 sm:px-6 lg:px-8 py-20 md:py-28 transition-colors duration-500 border-b ${
        isDarkMode ? 'bg-[#050505] border-white/10' : 'bg-white border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 items-start">
            <div>
              <p className="text-[#F97316] text-xs font-bold uppercase tracking-[0.25em]">
                02 / Why Choose Us
              </p>
              <h2 className={`font-display font-bold uppercase tracking-tight text-4xl sm:text-6xl lg:text-7xl leading-[0.88] mt-4 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                YOUR<br />MOMENT.<br />
                <span className="text-[#F97316]">OUR STORY.</span>
              </h2>
              <p className={`text-xs sm:text-sm mt-6 max-w-md leading-relaxed ${
                isDarkMode ? 'text-white/50' : 'text-slate-500'
              }`}>
                We blend cinematic storytelling, top-tier camera gear, and passionate creative direction to make your celebrations unforgettable.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className={`border p-6 rounded-xl transition ${
                isDarkMode ? 'border-white/10 bg-zinc-950 hover:border-[#F97316]/50' : 'border-slate-200 bg-slate-50/70 hover:border-[#F97316]/50'
              }`}>
                <span className="text-[#F97316] font-display text-2xl font-bold">01</span>
                <h3 className={`font-display font-bold uppercase text-lg sm:text-xl mt-4 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>Experienced Team</h3>
                <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${
                  isDarkMode ? 'text-white/50' : 'text-slate-600'
                }`}>
                  Every celebration receives dedicated lead photographers, cinematic cinematographers and audio engineers.
                </p>
              </div>

              <div className={`border p-6 rounded-xl transition ${
                isDarkMode ? 'border-white/10 bg-zinc-950 hover:border-[#F97316]/50' : 'border-slate-200 bg-slate-50/70 hover:border-[#F97316]/50'
              }`}>
                <span className="text-[#F97316] font-display text-2xl font-bold">02</span>
                <h3 className={`font-display font-bold uppercase text-lg sm:text-xl mt-4 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>Candid &amp; Artistic</h3>
                <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${
                  isDarkMode ? 'text-white/50' : 'text-slate-600'
                }`}>
                  We capture genuine emotions, candid laughter, and precious family traditions naturally.
                </p>
              </div>

              <div className={`border p-6 rounded-xl transition ${
                isDarkMode ? 'border-white/10 bg-zinc-950 hover:border-[#F97316]/50' : 'border-slate-200 bg-slate-50/70 hover:border-[#F97316]/50'
              }`}>
                <span className="text-[#F97316] font-display text-2xl font-bold">03</span>
                <h3 className={`font-display font-bold uppercase text-lg sm:text-xl mt-4 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>Complete Coverage</h3>
                <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${
                  isDarkMode ? 'text-white/50' : 'text-slate-600'
                }`}>
                  Photography, 4K films, drone reels, and multi-cam live streaming under one studio roof.
                </p>
              </div>

              <div className={`border p-6 rounded-xl transition ${
                isDarkMode ? 'border-white/10 bg-zinc-950 hover:border-[#F97316]/50' : 'border-slate-200 bg-slate-50/70 hover:border-[#F97316]/50'
              }`}>
                <span className="text-[#F97316] font-display text-2xl font-bold">04</span>
                <h3 className={`font-display font-bold uppercase text-lg sm:text-xl mt-4 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>Custom Packages</h3>
                <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${
                  isDarkMode ? 'text-white/50' : 'text-slate-600'
                }`}>
                  Tailored packages designed specifically around your event dates, locations, and budget.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FINAL CTA BANNER */}
      <section className={`px-4 sm:px-6 lg:px-8 py-20 md:py-28 transition-colors duration-500 ${
        isDarkMode ? 'bg-[#0a0a0a]' : 'bg-slate-50'
      }`}>
        <div className={`max-w-7xl mx-auto border p-8 sm:p-14 rounded-2xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 ${
          isDarkMode ? 'border-white/15 bg-zinc-950' : 'border-slate-200 bg-slate-900 text-white shadow-2xl'
        }`}>
          <div className="relative z-10 max-w-2xl">
            <p className="text-[#F97316] text-xs font-bold uppercase tracking-[0.25em]">
              03 / Ready to Record
            </p>
            <h2 className="font-display font-bold uppercase tracking-tight text-3xl sm:text-5xl md:text-6xl mt-3 text-white leading-tight">
              YOUR STORY DESERVES TO BE <span className="text-[#F97316]">REMEMBERED.</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/60 mt-4 leading-relaxed">
              Contact us or add services to your cart to request a personalized quote for your upcoming event.
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
                onClick={() => handleAddToCart(detailService)}
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

              {/* Gallery Grid */}
              {detailService.gallery_urls && detailService.gallery_urls.length > 0 && (
                <div className={`pt-6 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                  <h3 className={`font-display font-bold uppercase text-lg mb-4 ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Sample Gallery Work
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {detailService.gallery_urls.map((img, i) => (
                      <div
                        key={i}
                        onClick={() => setLightboxImg(img)}
                        className="relative h-40 rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 cursor-pointer group"
                      >
                        <Image
                          src={img}
                          alt="Gallery item"
                          fill
                          className="object-cover group-hover:scale-105 transition duration-300"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX IMAGE ZOOM */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-[130] bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImg(null)}
        >
          <button
            type="button"
            className="absolute top-6 right-6 text-white text-3xl font-bold hover:text-[#F97316]"
            onClick={() => setLightboxImg(null)}
          >
            ×
          </button>
          <div className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center">
            <Image
              src={lightboxImg}
              alt="Gallery preview"
              width={1200}
              height={800}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
              unoptimized
            />
          </div>
        </div>
      )}
    </main>
  )
}
