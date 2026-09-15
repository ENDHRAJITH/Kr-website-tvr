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
    name: 'Search Engine Optimization',
    subtitle: 'Organic Growth',
    description: 'Improve your search visibility and help the right customers discover your business.',
    price: '₹XX,XXX',
    price_unit: '/ month',
    features: ['SEO audit', 'Keyword research', 'Competitor analysis', 'On-page SEO', 'Technical SEO', 'Local SEO', 'Google Business Profile optimization', 'Monthly monitoring & reports'],
    benefits: ['Better search visibility', 'Relevant organic traffic', 'Stronger online presence', 'Long-term discoverability'],
    project_tag: 'SEO PROJECT',
    category_id: 'brand',
    links: { 'Case Study ↗': '#', 'Website ↗': '#', 'Proof ↗': '#' },
    display_order: 1,
    is_active: true
  },
  {
    id: 'm2',
    service_no: 2,
    name: 'Digital Video Ads',
    subtitle: 'Creative Advertising',
    description: 'Creative video advertising that captures attention and communicates your brand instantly.',
    price: '₹XX,XXX',
    price_unit: 'Custom package',
    features: ['Creative concept', 'Script / content direction', 'Video production', 'Video editing', 'Motion graphics', 'Ad-ready formats', 'Creative variations'],
    benefits: ['More attention', 'Clearer communication', 'Reusable marketing content', 'Stronger campaign creatives'],
    project_tag: 'VIDEO CAMPAIGN',
    category_id: 'creative',
    links: { 'Watch Video ↗': '#', 'Instagram ↗': '#', 'Case Study ↗': '#' },
    display_order: 2,
    is_active: true
  },
  {
    id: 'm3',
    service_no: 3,
    name: 'Google Ads',
    subtitle: 'Paid Search',
    description: 'Reach customers actively searching for your products and services through targeted campaigns.',
    price: '₹XX,XXX',
    price_unit: '/ month',
    features: ['Campaign setup', 'Keyword research', 'Search / display campaigns', 'Audience targeting', 'Ad copy', 'Conversion tracking', 'Optimization & reporting'],
    benefits: ['High-intent reach', 'Targeted traffic', 'Measurable performance', 'More lead opportunities'],
    project_tag: 'GOOGLE ADS CAMPAIGN',
    category_id: 'ads',
    links: { 'Case Study ↗': '#', 'Campaign ↗': '#', 'Website ↗': '#' },
    display_order: 3,
    is_active: true
  },
  {
    id: 'm4',
    service_no: 4,
    name: 'Influencer Marketing',
    subtitle: 'Creator Campaigns',
    description: "Connect your brand with creators who already have your audience's attention.",
    price: '₹XX,XXX',
    price_unit: 'Custom campaign',
    features: ['Influencer research', 'Creator selection', 'Audience analysis', 'Campaign planning', 'Content coordination', 'Campaign monitoring', 'Performance reporting'],
    benefits: ['New audience reach', 'Social credibility', 'Brand awareness', 'Authentic content'],
    project_tag: 'INFLUENCER CAMPAIGN',
    category_id: 'creative',
    links: { 'Instagram ↗': '#', 'Campaign ↗': '#', 'Case Study ↗': '#' },
    display_order: 4,
    is_active: true
  },
  {
    id: 'm5',
    service_no: 5,
    name: 'Instagram Ads',
    subtitle: 'Social Advertising',
    description: 'Target the right audience with creative campaigns built for Instagram.',
    price: '₹XX,XXX',
    price_unit: '/ month',
    features: ['Campaign strategy', 'Audience targeting', 'Creative direction', 'Reels ads', 'Story ads', 'Feed ads', 'Retargeting', 'Performance monitoring'],
    benefits: ['Increase reach', 'Generate enquiries', 'Promote offers', 'Target specific audiences'],
    project_tag: 'INSTAGRAM CAMPAIGN',
    category_id: 'ads',
    links: { 'Instagram ↗': '#', 'Campaign ↗': '#', 'Case Study ↗': '#' },
    display_order: 5,
    is_active: true
  },
  {
    id: 'm6',
    service_no: 6,
    name: 'Branding',
    subtitle: 'Brand Identity',
    description: 'Build a visual identity that makes your business recognizable and memorable.',
    price: '₹XX,XXX',
    price_unit: 'One-time project',
    features: ['Brand strategy', 'Logo design', 'Colour palette', 'Typography', 'Brand identity', 'Social media identity', 'Business collateral', 'Brand guidelines'],
    benefits: ['Stronger identity', 'Professional appearance', 'Consistent communication', 'Better recognition'],
    project_tag: 'BRAND IDENTITY PROJECT',
    category_id: 'brand',
    links: { 'View Brand ↗': '#', 'Portfolio ↗': '#', 'Case Study ↗': '#' },
    display_order: 6,
    is_active: true
  },
  {
    id: 'm7',
    service_no: 7,
    name: 'YouTube Ads',
    subtitle: 'Video Advertising',
    description: 'Reach your audience through high-impact video advertising.',
    price: '₹XX,XXX',
    price_unit: '/ month',
    features: ['Campaign strategy', 'Audience targeting', 'Video ad setup', 'Placement strategy', 'Campaign optimization', 'Performance tracking', 'Reporting'],
    benefits: ['Video reach', 'Brand awareness', 'Targeted audiences', 'Product promotion'],
    project_tag: 'YOUTUBE CAMPAIGN',
    category_id: 'ads',
    links: { 'Watch Video ↗': '#', 'Campaign ↗': '#', 'Case Study ↗': '#' },
    display_order: 7,
    is_active: true
  },
  {
    id: 'm8',
    service_no: 8,
    name: 'Graphic Design',
    subtitle: 'Creative Design',
    description: 'Creative visuals that communicate your message clearly across digital channels.',
    price: '₹X,XXX',
    price_unit: 'Custom package',
    features: ['Social media posts', 'Posters', 'Banners', 'Promotional creatives', 'Festival designs', 'Advertisement creatives', 'Marketing materials', 'Brand visuals'],
    benefits: ['Professional communication', 'Consistent brand appearance', 'Better social presence', 'Faster campaign execution'],
    project_tag: 'DESIGN WORK',
    category_id: 'creative',
    links: { 'View Designs ↗': '#', 'Portfolio ↗': '#', 'Instagram ↗': '#' },
    display_order: 8,
    is_active: true
  },
  {
    id: 'm9',
    service_no: 9,
    name: 'Facebook Ads',
    subtitle: 'Social Advertising',
    description: 'Reach the right people with targeted Facebook advertising campaigns.',
    price: '₹XX,XXX',
    price_unit: '/ month',
    features: ['Campaign strategy', 'Audience research', 'Ad setup', 'Creative direction', 'Lead campaigns', 'Conversion campaigns', 'Retargeting', 'Performance monitoring'],
    benefits: ['Targeted audiences', 'Lead generation', 'Offer promotion', 'Brand reach'],
    project_tag: 'FACEBOOK CAMPAIGN',
    category_id: 'ads',
    links: { 'Campaign ↗': '#', 'Creative ↗': '#', 'Case Study ↗': '#' },
    display_order: 9,
    is_active: true
  },
  {
    id: 'm10',
    service_no: 10,
    name: 'Video Testimonials',
    subtitle: 'Social Proof',
    description: 'Turn genuine customer experiences into powerful social proof for your brand.',
    price: '₹XX,XXX',
    price_unit: 'Custom package',
    features: ['Testimonial planning', 'Interview direction', 'Video shooting', 'Lighting & audio', 'Video editing', 'Branding', 'Captions / subtitles', 'Social media formats'],
    benefits: ['Customer trust', 'Real experiences', 'Brand credibility', 'Reusable content'],
    project_tag: 'TESTIMONIAL VIDEO',
    category_id: 'creative',
    links: { 'Watch Video ↗': '#', 'Project ↗': '#', 'Instagram ↗': '#' },
    display_order: 10,
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

  const services = initialServices ?? []

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
                <span className="hero-chip">10 Services</span>
                <span className="hero-chip">2 Divisions</span>
                <span className="hero-chip">Custom Pricing</span>
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
