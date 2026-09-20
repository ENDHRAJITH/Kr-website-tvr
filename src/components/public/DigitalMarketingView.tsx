'use client'

import { useState } from 'react'
import { MarketingService, ServiceCategory } from '@/types/database'
import { useTheme } from '@/context/ThemeContext'

interface DigitalMarketingViewProps {
  initialServices: MarketingService[]
  categories: ServiceCategory[]
}

const FALLBACK_SERVICES: MarketingService[] = [
  {
    id: 'm1',
    service_no: 1,
    name: 'Plan A — Master Reel Promotion',
    subtitle: 'Instagram, Facebook & YouTube Shorts Reel Promotion',
    description: 'Using Reels (Instagram, Facebook, or YouTube Shorts) is one of the fastest ways to build an audience and drive sales today. Promoted across Karthick Tamilan 375,000+ follower channels.',
    price: '₹25,000/-',
    price_unit: 'per campaign',
    features: ['Reel Shoot', 'Reel Edit', 'Reel Promote', 'Casting', 'Voice Over', 'Drone Photos', 'Drone Shots in Reel', 'Targeting 375k+ Followers Pages'],
    benefits: ['Fast audience growth', '100,000+ Verified Views', 'High social media engagement', 'Instant brand awareness'],
    project_tag: 'PLAN A - REEL PROMOTION',
    category_id: 'reels',
    links: { 'Instagram ↗': 'https://instagram.com/karthick_tamilan' },
    display_order: 1,
    is_active: true
  },
  {
    id: 'm2',
    service_no: 2,
    name: 'Plan B — Landscape Cinematic Ad Video',
    subtitle: 'DSLR Mirrorless Full Frame Sony Alpha Shoot',
    description: 'Landscape ads allow you to showcase the full scale, luxury, and premium feel of a property or business, making them highly effective for YouTube, Facebook feed ads, website landing pages, theater ads, and big-screen office displays.',
    price: '₹25,000/-',
    price_unit: 'per ad video',
    features: ['01 Min Ad Video (for YouTube Ads)', 'Landscape Video Shoot (DSLR Mirrorless Sony Alpha)', 'Landscape Video Edit & Color Grading', 'Landscape Video Promote', 'Professional Voice Over', 'Drone Landscape Video & Photos', 'Usable for Theater Ads & LED Vehicles'],
    benefits: ['Showcases full scale & luxury feel', '100,000+ Verified Views', 'Perfect for YouTube & Facebook feed ads', 'High-impact big screen display'],
    project_tag: 'PLAN B - CINEMATIC AD',
    category_id: 'ads',
    links: { 'YouTube Ad ↗': '#' },
    display_order: 2,
    is_active: true
  },
  {
    id: 'm3',
    service_no: 3,
    name: 'Plan C — Organic Content Reels Promotions',
    subtitle: '10 Reels Per Month (Publish Every 2 Days)',
    description: 'Organic Content Reels Promotion by Karthick Tamilan. One video published every 2 days (10 reels/month) across FB, Instagram & YouTube to scale your business revenue.',
    price: '₹50,000/-',
    price_unit: '/ month',
    features: ['10 Reels Per Month', 'Publish Every 02 Days Once', 'Full Reel Shoot & Edit', 'Multi-Platform Promotion (FB, Insta, YouTube)', 'Karthick Tamilan Organic Reach Integration'],
    benefits: ['500,000+ Organic Views', '3x Growth in Monthly Revenue', 'Consistent brand visibility', 'High customer retention'],
    project_tag: 'PLAN C - MONTHLY REELS',
    category_id: 'reels',
    links: { 'Case Study ↗': '#' },
    display_order: 3,
    is_active: true
  },
  {
    id: 'm4',
    service_no: 4,
    name: 'Plan D — Local Influencer Connects',
    subtitle: '5 Local Niche Influencer Collaborations',
    description: 'Collaborate with 5 top local niche influencers in the region to launch promotional reels and boost brand awareness among your target audience.',
    price: '₹25,000/-',
    price_unit: 'for 05 Influencers',
    features: ['05 Niche Local Influencers Collaboration', '50k to 100k Reach Per Influencer', 'Target Audience Social Media Connect', 'Campaign Strategy & Co-ordination', '10 Lakh+ Total Projected Views'],
    benefits: ['Over 10 Lakh total views', 'High local brand awareness', 'Authentic creator trust', 'Hyper-targeted audience reach'],
    project_tag: 'PLAN D - INFLUENCERS',
    category_id: 'influencer',
    links: { 'Influencers List ↗': '#' },
    display_order: 4,
    is_active: true
  },
  {
    id: 'm5',
    service_no: 5,
    name: 'Plan E — Local Social Media Pages Connect',
    subtitle: '50+ Local Instagram Pages (60KM Radius)',
    description: 'Connect with 50+ local Instagram pages targeted specifically within a 60KM radius surrounding your business location at just ₹500 per page.',
    price: '₹25,000/-',
    price_unit: '50+ Pages @ ₹500/page',
    features: ['50+ Local Influencer & Meme/News Instagram Pages', 'Targeted 60KM Surrounding Radius', 'Hyper-Local Community Promotion', 'Massive Viral Regional Reach'],
    benefits: ['Dominates local target market', 'Surrounding 60KM radius saturation', 'Budget-friendly per page promotion', 'Instant local inquiries'],
    project_tag: 'PLAN E - LOCAL PAGES',
    category_id: 'local',
    links: { 'Network ↗': '#' },
    display_order: 5,
    is_active: true
  },
  {
    id: 'm6',
    service_no: 6,
    name: 'Plan F — Paid Promotions (Meta & YouTube Ads)',
    subtitle: 'Targeted Lead Gen Ads (FB + Insta + YouTube)',
    description: 'Paid promotional ad campaigns across Facebook, Instagram, and YouTube specifically optimized to collect verified phone numbers and emails of serious buyers.',
    price: '₹15,000/-',
    price_unit: 'for First Month',
    features: ['FB Ads — ₹5,000 Budget', 'Instagram Ads — ₹5,000 Budget', 'YouTube Ads — ₹5,000 Budget', 'Targeted Lead Generation Setup', 'Hyper-Local & NRI Investor Targeting', 'Verified Phone & Email Lead Capture'],
    benefits: ['Direct lead generation', 'High-intent buyer acquisition', 'Hand-delivered sales leads', 'Full ad account optimization'],
    project_tag: 'PLAN F - PAID ADS',
    category_id: 'ads',
    links: { 'Lead Proof ↗': '#' },
    display_order: 6,
    is_active: true
  },
  {
    id: 'm7',
    service_no: 7,
    name: 'Plan G — Grand Opening Shoot Promotions',
    subtitle: 'Full Launch & Event Shoot Coverage',
    description: 'Grand opening event shoot with traditional photography, candid videography, soft copies of photos, and 1 highlight output video.',
    price: '₹25,000/-',
    price_unit: 'per launch event',
    features: ['Traditional Photography', 'Candid Videography', 'Soft Copy of All Photos', '01 Edited Video Output with Highlights', 'Social Media Launch Posters'],
    benefits: ['Complete event coverage', 'Professional highlight reel', 'Social media launch hype', 'High quality soft copies'],
    project_tag: 'PLAN G - GRAND OPENING',
    category_id: 'events',
    links: { 'Sample Shoot ↗': '#' },
    display_order: 7,
    is_active: true
  },
  {
    id: 'm8',
    service_no: 8,
    name: 'Overall Plan — 360° All-In-One Master Package',
    subtitle: 'Complete Combined Growth Package (Plan A to Plan G)',
    description: 'The ultimate 360-degree digital marketing package combining all 7 plans (Plan A through G) for total market dominance and maximum ROI.',
    price: '₹1,90,000/-',
    price_unit: 'Full Package (Total 190K)',
    features: ['Plan A: Master Reel Promotion (25K)', 'Plan B: Landscape Cinematic Ad Video (25K)', 'Plan C: 10 Organic Reels (50K)', 'Plan D: 05 Local Influencers Connect (25K)', 'Plan E: 50+ Local Pages Connect (25K)', 'Plan F: Meta & YouTube Paid Ads (15K)', 'Plan G: Grand Opening Shoot (25K)'],
    benefits: ['Complete market dominance', 'Over 1 Million+ Combined Reach', 'Full-funnel marketing strategy', 'Maximum ROI and lead conversion'],
    project_tag: 'OVERALL MASTER PLAN',
    category_id: 'master',
    links: { 'Full Roadmap ↗': '#' },
    display_order: 8,
    is_active: true
  }
]

export default function DigitalMarketingView({
  initialServices,
  categories
}: DigitalMarketingViewProps) {
  const { isDarkMode } = useTheme()
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [openCardId, setOpenCardId] = useState<string | null>(null)
  const [addedNotice, setAddedNotice] = useState<string | null>(null)

  const services = initialServices && initialServices.length > 0 ? initialServices : FALLBACK_SERVICES

  const catList = categories && categories.length > 0
    ? [{ id: 'all', slug: 'all', name: 'All Services', division: 'marketing', display_order: 0 }, ...categories]
    : [{ id: 'all', slug: 'all', name: 'All Services', division: 'marketing', display_order: 0 }]

  const filteredServices = services.filter((s) => {
    if (activeFilter === 'all') return true

    const sCatId = (s.category_id || '').toLowerCase()
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
        (target && sCatName.includes(target))
      )
    })
  })

  const handleAddToCart = (s: MarketingService) => {
    const CART_KEY = 'kr_global_enquiry_cart_v2'
    const stored = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    const exists = stored.some((x: { name: string }) => x.name === s.name)
    if (!exists) {
      stored.push({
        id: s.id,
        name: s.name,
        price: `${s.price || 'Custom'} ${s.price_unit || ''}`.trim(),
        division: 'marketing'
      })
      localStorage.setItem(CART_KEY, JSON.stringify(stored))
      window.dispatchEvent(new Event('kr-cart-update'))
    }
    window.dispatchEvent(new Event('kr-open-drawer'))
    setAddedNotice(s.id)
    setTimeout(() => setAddedNotice(null), 1500)
  }

  const renderBrandIcon = (sName: string, serviceNo: number | null, index: number) => {
    const no = String(serviceNo || index + 1).padStart(2, '0')
    if (sName.includes('Instagram')) {
      return (
        <div className={`w-14 h-14 rounded-full border flex items-center justify-center shadow-sm ${
          isDarkMode ? 'border-white/15 bg-zinc-900' : 'border-black/10 bg-white'
        }`}>
          <svg viewBox="0 0 24 24" width="26" height="26">
            <defs>
              <linearGradient id="igGrad" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stopColor="#FEDA75" />
                <stop offset=".25" stopColor="#FA7E1E" />
                <stop offset=".5" stopColor="#D62976" />
                <stop offset=".75" stopColor="#962FBF" />
                <stop offset="1" stopColor="#4F5BD5" />
              </linearGradient>
            </defs>
            <rect x="2" y="2" width="20" height="20" rx="6" fill="none" stroke="url(#igGrad)" strokeWidth="2" />
            <circle cx="12" cy="12" r="4.2" fill="none" stroke="url(#igGrad)" strokeWidth="2" />
            <circle cx="17.2" cy="6.8" r="1.15" fill="url(#igGrad)" />
          </svg>
        </div>
      )
    }
    if (sName.includes('Facebook')) {
      return (
        <div className={`w-14 h-14 rounded-full border flex items-center justify-center shadow-sm ${
          isDarkMode ? 'border-white/15 bg-zinc-900' : 'border-black/10 bg-white'
        }`}>
          <svg viewBox="0 0 24 24" width="26" height="26">
            <circle cx="12" cy="12" r="11" fill="#1877F2" />
            <path d="M13.6 21.8v-7.3h2.45l.37-2.84h-2.82V9.85c0-.82.23-1.38 1.4-1.38h1.5V5.94A20 20 0 0 0 14.1 5.8c-2.16 0-3.64 1.32-3.64 3.74v2.1H8v2.84h2.46v7.3z" fill="#fff" />
          </svg>
        </div>
      )
    }
    if (sName.includes('YouTube')) {
      return (
        <div className={`w-14 h-14 rounded-full border flex items-center justify-center shadow-sm ${
          isDarkMode ? 'border-white/15 bg-zinc-900' : 'border-black/10 bg-white'
        }`}>
          <svg viewBox="0 0 24 24" width="26" height="26">
            <rect x="1.5" y="5.2" width="21" height="13.6" rx="4.5" fill="#FF0000" />
            <path d="M10 8.6l6 3.4-6 3.4z" fill="#fff" />
          </svg>
        </div>
      )
    }
    if (sName.includes('Google')) {
      return (
        <div className={`w-14 h-14 rounded-full border flex items-center justify-center shadow-sm ${
          isDarkMode ? 'border-white/15 bg-zinc-900' : 'border-black/10 bg-white'
        }`}>
          <svg viewBox="0 0 24 24" width="26" height="26">
            <path d="M22 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h5.6a4.8 4.8 0 0 1-2.08 3.15v2.6h3.36c1.97-1.81 3.1-4.49 3.1-7.78z" fill="#4285F4" />
            <path d="M12 22c2.8 0 5.16-.93 6.88-2.52l-3.36-2.6c-.93.63-2.13 1-3.52 1-2.7 0-4.99-1.83-5.8-4.28H2.73v2.68A10 10 0 0 0 12 22z" fill="#34A853" />
            <path d="M6.2 13.6a6 6 0 0 1 0-3.2V7.72H2.73a10 10 0 0 0 0 8.96z" fill="#FBBC05" />
            <path d="M12 5.9c1.52 0 2.88.52 3.95 1.55l2.96-2.96C17.15 2.7 14.8 1.8 12 1.8a10 10 0 0 0-9.27 5.92l3.47 2.68C7.01 7.73 9.3 5.9 12 5.9z" fill="#EA4335" />
          </svg>
        </div>
      )
    }

    return (
      <div className="w-14 h-14 rounded-full border border-[#F97316] text-[#F97316] flex items-center justify-center font-display font-bold text-base">
        {no}
      </div>
    )
  }

  return (
    <main className={`transition-colors duration-500 ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-white text-slate-900'}`}>
      {/* HERO SECTION */}
      <section className={`pt-36 md:pt-40 pb-12 md:pb-16 px-5 md:px-8 border-b ${
        isDarkMode ? 'bg-[#050505] border-white/10' : 'kr-grid border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] animate-pulse" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[.24em] text-[#F97316]">
                  KR Digital Marketing
                </span>
              </div>
              <h1 className={`font-display font-bold uppercase tracking-[-.055em] leading-[.9] text-4xl sm:text-5xl md:text-6xl ${
                isDarkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                DIGITAL MARKETING<br />
                <span className="text-[#F97316]">SERVICES.</span>
              </h1>
            </div>

            <div className="max-w-lg lg:text-right">
              <p className={`text-sm md:text-base leading-relaxed ${isDarkMode ? 'text-white/50' : 'text-black/55'}`}>
                Explore all marketing services, check starting prices, view deliverables and add the services you need to your enquiry.
              </p>
              <div className="flex flex-wrap gap-2 mt-5 lg:justify-end">
                <span className="hero-chip">8 Master Promotion Plans</span>
                <span className="hero-chip">375,000+ Followers</span>
                <span className="hero-chip">1,500+ Projects Completed</span>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* 1-ON-1 REVENUE & GROWTH STRATEGY CALL (₹5,000) SECTION */}
      <section className={`px-5 md:px-8 py-16 border-b ${
        isDarkMode ? 'bg-[#080808] border-white/10' : 'bg-slate-100/70 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white border-2 border-[#F97316] shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-[#F97316]/20 blur-2xl pointer-events-none" />

            <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F97316] text-white text-[11px] font-extrabold uppercase tracking-widest mb-4">
                  <span>⚡ 1-on-1 Private Consultation</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-none">
                  1-on-1 Business Revenue &amp; Growth Strategy Call
                </h2>
                <p className="text-orange-400 font-bold text-base md:text-lg mt-3">
                  Direct 60-Minute Private Strategy Session with Karthick Tamilan
                </p>
                <p className="text-white/70 text-sm md:text-base mt-4 max-w-2xl leading-relaxed">
                  Sit down directly with Karthick Tamilan to analyze your current business bottlenecks, uncover high-ROI market opportunities, optimize ad funnels, and build a tailored blueprint to multiply your monthly revenue.
                </p>

                <div className="mt-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#F97316] mb-3">
                    What You Will Discuss &amp; Learn In This Call:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2 text-xs md:text-sm text-white/90">
                      <span className="text-[#F97316] font-bold">✓</span>
                      <span><strong>Business Revenue Roadmap:</strong> How to scale monthly sales revenue.</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs md:text-sm text-white/90">
                      <span className="text-[#F97316] font-bold">✓</span>
                      <span><strong>Lead Gen Funnels:</strong> Acquiring verified high-intent buyer leads.</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs md:text-sm text-white/90">
                      <span className="text-[#F97316] font-bold">✓</span>
                      <span><strong>Viral Reel Blueprint:</strong> Dominate local target audience attention.</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs md:text-sm text-white/90">
                      <span className="text-[#F97316] font-bold">✓</span>
                      <span><strong>Ad Budget Optimization:</strong> Maximum ROAS on Meta &amp; YouTube.</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs md:text-sm text-white/90 sm:col-span-2">
                      <span className="text-[#F97316] font-bold">✓</span>
                      <span><strong>90-Day Execution Blueprint:</strong> Customized action steps for your exact business niche.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* PRICE & CALL TO ACTION BOX */}
              <div className="bg-zinc-900 border border-white/15 p-6 rounded-xl text-center flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[.25em] text-white/50">
                    Consultation Fee
                  </span>
                  <div className="font-display font-black text-4xl sm:text-5xl text-[#F97316] mt-2">
                    ₹5,000/-
                  </div>
                  <p className="text-xs text-white/50 mt-1">per 60-minute session</p>

                  <div className="mt-6 space-y-3">
                    <button
                      type="button"
                      onClick={() => handleAddToCart({
                        id: 'm0_call',
                        service_no: 0,
                        name: '1-on-1 Business Revenue Strategy Call with Karthick Tamilan',
                        subtitle: '1-Hour Private Growth & Revenue Consultation',
                        description: 'Direct 60-minute strategy call with Karthick Tamilan to analyze business bottlenecks, build lead funnels, and scale monthly revenue.',
                        price: '₹5,000/-',
                        price_unit: 'per session',
                        features: ['Revenue Scaling Roadmap', 'Lead Gen Funnels', 'Ad Spend Optimization', 'Viral Reel Blueprint', '90-Day Action Strategy'],
                        benefits: ['Direct expert advice', 'Immediate ROI roadmap', 'Clear action steps'],
                        project_tag: '1-ON-1 STRATEGY CALL',
                        category_id: 'consultation',
                        links: {},
                        display_order: 0,
                        is_active: true
                      })}
                      className="w-full bg-[#F97316] text-white py-3.5 px-4 text-xs font-bold uppercase tracking-wider rounded hover:bg-white hover:text-black transition cursor-pointer"
                    >
                      {addedNotice === 'm0_call' ? 'Added to Enquiry ✓' : '+ Add Strategy Call to Enquiry'}
                    </button>

                    <a
                      href="https://wa.me/919626759859?text=Hi%20Karthick%20Tamilan,%20I%20want%20to%20book%20a%201-on-1%20Business%20Revenue%20Strategy%20Call%20(Rs.5000)"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full border border-white/20 text-white py-3 px-4 text-xs font-bold uppercase tracking-wider rounded hover:border-[#F97316] hover:text-[#F97316] transition text-center"
                    >
                      Book Session via WhatsApp 💬
                    </a>
                  </div>
                </div>

                <p className="text-[10px] text-white/40 mt-5">
                  ⚡ Limited consultation slots available per week. Instant confirmation via WhatsApp or Enquiry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER & SERVICES SECTION */}
      <section id="services" className={`px-5 md:px-8 py-20 md:py-28 ${
        isDarkMode ? 'bg-[#0a0a0a]' : 'bg-slate-50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10">
            <div>
              <p className="text-[#F97316] text-xs font-bold uppercase tracking-[.25em]">
                01 / All Services
              </p>
              <h2 className={`font-display font-bold uppercase tracking-[-.05em] text-4xl md:text-6xl mt-3 ${
                isDarkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                OUR <span className="text-[#F97316]">SERVICES.</span>
              </h2>
            </div>
            <p className={`max-w-md text-sm md:text-base leading-relaxed ${isDarkMode ? 'text-white/50' : 'text-black/55'}`}>
              Every service includes a starting price, clear deliverables, benefits and space for verified portfolio proof. Tap Read More to expand.
            </p>
          </div>

          {/* FILTER TABS */}
          <div id="filterTabs" className="flex flex-wrap gap-2 mb-8">
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

          {/* ACCORDION SERVICES LIST */}
          <div id="servicesList" className="space-y-5">
            {filteredServices.map((s, idx) => {
              const isOpen = openCardId === s.id
              return (
                <article
                  key={s.id || idx}
                  className={`card border transition-all duration-300 ${
                    isDarkMode ? 'border-white/10 bg-zinc-950 text-white' : 'border-slate-200 bg-white text-slate-900 shadow-sm'
                  }`}
                >
                  <div className="p-6 md:p-8 lg:p-10">
                    <div className="grid lg:grid-cols-[70px_1fr_220px] gap-6 items-start">
                      {renderBrandIcon(s.name, s.service_no, idx)}

                      <div>
                        <p className="text-[#F97316] text-[10px] font-bold uppercase tracking-[.2em]">
                          {s.subtitle || s.project_tag || 'Marketing Service'}
                        </p>
                        <h3 className={`font-display text-3xl md:text-4xl font-bold uppercase tracking-[-.04em] mt-3 ${
                          isDarkMode ? 'text-white' : 'text-zinc-900'
                        }`}>
                          {s.name}
                        </h3>
                        <p className={`mt-3 text-sm md:text-base ${
                          isDarkMode ? 'text-white/60' : 'text-black/55'
                        }`}>
                          {s.description}
                        </p>
                      </div>

                      <div className="lg:text-right">
                        <p className={`text-[10px] font-bold uppercase tracking-[.2em] ${
                          isDarkMode ? 'text-white/40' : 'text-black/40'
                        }`}>
                          Starting From
                        </p>
                        <p className={`font-display text-2xl font-bold mt-1 ${
                          isDarkMode ? 'text-white' : 'text-zinc-900'
                        }`}>
                          {s.price || '₹XX,XXX'}
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>
                          {s.price_unit || ''}
                        </p>
                      </div>
                    </div>

                    <div className="mt-7 flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(s)}
                        className="bg-[#F97316] text-white px-5 py-3 text-xs font-bold uppercase hover:bg-black transition cursor-pointer"
                      >
                        {addedNotice === s.id ? 'Added ✓' : '+ Add to Enquiry'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setOpenCardId(isOpen ? null : s.id)}
                        className={`border px-5 py-3 text-xs font-bold uppercase transition flex items-center justify-center gap-2 cursor-pointer ${
                          isDarkMode 
                            ? 'border-white/15 text-white hover:border-[#F97316] hover:text-[#F97316]' 
                            : 'border-slate-300 text-zinc-900 hover:border-[#F97316] hover:text-[#F97316]'
                        }`}
                      >
                        <span>{isOpen ? 'Close' : 'Read More'}</span>
                        <span className={`arrow transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                          ↓
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* ACCORDION CONTENT */}
                  {isOpen && (
                    <div className={`details border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                      <div className={`p-6 md:p-8 lg:p-10 ${isDarkMode ? 'bg-zinc-900' : 'bg-[#FFF8F2]'}`}>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-9">
                          {/* WHAT WE PROVIDE */}
                          <div>
                            <div className="flex items-center gap-2">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round">
                                <path d="M9 11l3 3L22 4" />
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                              </svg>
                              <p className="text-[#F97316] text-[10px] font-bold uppercase tracking-[.2em]">
                                What We Provide
                              </p>
                            </div>
                            <ul className={`mt-4 space-y-2.5 text-sm ${isDarkMode ? 'text-white/70' : 'text-black/70'}`}>
                              {(s.features && s.features.length > 0 ? s.features : ['Campaign setup & execution', 'Strategic audience targeting', 'Continuous monitoring', 'Monthly progress reports']).map((feat, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <svg width="18" height="18" viewBox="0 0 20 20" className="shrink-0 mt-0.5">
                                    <circle cx="10" cy="10" r="10" fill="#16A34A" />
                                    <path d="M6 10.3l2.4 2.4L14.3 7" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* BENEFITS & PRICING */}
                          <div>
                            <div className="flex items-center gap-2">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="#F97316">
                                <path d="M12 2l2.6 5.7L21 8.6l-4.5 4.2 1.2 6.2L12 16l-5.7 3 1.2-6.2L3 8.6l6.4-.9z" />
                              </svg>
                              <p className="text-[#F97316] text-[10px] font-bold uppercase tracking-[.2em]">
                                Benefits
                              </p>
                            </div>
                            <ul className={`mt-4 space-y-2 text-sm ${isDarkMode ? 'text-white/70' : 'text-black/70'}`}>
                              {(s.benefits && s.benefits.length > 0 ? s.benefits : ['High impact reach', 'Better conversion rates', 'Targeted audiences', 'Measurable return on investment']).map((b, i) => (
                                <li key={i} className={`flex items-start gap-2.5 border rounded-lg p-2.5 ${
                                  isDarkMode ? 'bg-zinc-800/80 border-white/10' : 'bg-[#F3FBF6] border-[#DCEFE3]'
                                }`}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-600 shrink-0 mt-0.5">
                                    <path d="M12 2l2.6 5.7L21 8.6l-4.5 4.2 1.2 6.2L12 16l-5.7 3 1.2-6.2L3 8.6l6.4-.9z" />
                                  </svg>
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>

                            <p className="text-[#F97316] text-[10px] font-bold uppercase tracking-[.2em] mt-8">
                              Pricing
                            </p>
                            <p className={`font-display text-2xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                              {s.price || '₹XX,XXX'} {s.price_unit || ''}
                            </p>
                          </div>

                          {/* PROOF & RESULTS TICKER */}
                          <div className="border-t-4 border-[#F97316] pt-3">
                            <p className="text-[#F97316] text-[10px] font-bold uppercase tracking-[.2em]">
                              Proof &amp; Links
                            </p>
                            <div className="bg-[#0c0c0c] border border-[#1c1c1c] rounded-lg overflow-hidden mt-4 text-white">
                              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[#1c1c1c]">
                                <span className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                                <span className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
                                <span className="w-2 h-2 rounded-full bg-[#28C840]" />
                                <span className="ml-2 text-[8px] tracking-[.15em] text-white/40 font-bold uppercase flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  Live results
                                </span>
                              </div>
                              <div className="p-4 space-y-2">
                                <div className="flex gap-2.5 items-start">
                                  <div className="w-7 h-7 rounded-full bg-[#F97316]/20 flex items-center justify-center shrink-0">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2">
                                      <path d="M3 17l6-6 4 4 8-8" />
                                      <path d="M15 7h6v6" />
                                    </svg>
                                  </div>
                                  <div className="text-xs text-white/80 leading-snug">
                                    Recent client saw a <b>3.2x ROAS</b> on a {s.name} campaign this month.
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-black text-white px-5 md:px-8 py-20">
        <div className="max-w-7xl mx-auto border border-white/15 p-7 md:p-12">
          <p className="text-[#F97316] text-xs font-bold uppercase tracking-[.25em]">
            Ready?
          </p>
          <h2 className="font-display font-bold text-5xl md:text-8xl uppercase tracking-[-.06em] leading-[.85] mt-4">
            LET&apos;S BUILD<br />
            <span className="text-[#F97316]">SOMETHING.</span>
          </h2>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('kr-open-drawer'))}
            className="mt-8 bg-[#F97316] px-6 py-4 text-xs font-bold uppercase tracking-[.12em] hover:bg-white hover:text-black transition cursor-pointer"
          >
            Start Enquiry ↗
          </button>
        </div>
      </section>
    </main>
  )
}
