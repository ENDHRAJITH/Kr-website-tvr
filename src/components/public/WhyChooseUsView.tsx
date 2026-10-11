'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from '@/context/ThemeContext'
import { WhyChooseUsData } from '@/types/database'
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Eye,
  Users,
  MapPin,
  Globe,
  X,
  Maximize2,
  Award,
  Briefcase,
  Network,
  ShieldCheck
} from 'lucide-react'

const FALLBACK_DATA: WhyChooseUsData = {
  hero: {
    badge: 'Why Choose Us • Verified Market Authority',
    title: 'WHY BRANDS & REAL ESTATE DEVELOPERS',
    titleHighlight: 'TRUST KARTHICK TAMILAN.',
    description: "We don't just create ad campaigns — we build visual desire backed by 12.4 Million+ verified content views, 70.6% prime investor demographics, and laser-targeted NRI lead funnels.",
    stats: [
      { value: '12.4M+', label: '30-Day Content Views' },
      { value: '4.04M+', label: 'Unique Viewers Reached' },
      { value: '9.5M+', label: 'Viral Reel Plays' },
      { value: '70.6%', label: 'Investors Aged 25–44' }
    ]
  },
  bniLeadership: {
    badge: 'Regional Entrepreneur Leadership',
    chapterName: 'BNI Emperor Chapter',
    leaderName: 'KARTHICK TAMILAN',
    role: 'VICE PRESIDENT — BNI EMPEROR CHAPTER',
    subtitle: 'Founder, KR Digital Marketing & Studioz',
    description: 'Karthick Tamilan holds the position of Vice President of the BNI Emperor Chapter in Thiruvarur district (under the BNI Nagapattinam, Karaikal, Mayiladuthurai, and Thiruvarur region).',
    photoUrl: '/images/karthick-bni-vp.jpg',
    highlights: [
      {
        title: 'Leadership Team Management',
        description: 'Managing the chapter leadership team, driving member growth, and streamlining business referrals across Thiruvarur & Delta districts.'
      },
      {
        title: 'LTRT & Cross-Chapter Events',
        description: 'Organizing Leadership Team Roundtable (LTRT) meets and cross-chapter entrepreneur networking initiatives across the Delta region.'
      }
    ],
    whyItMatters: 'Partnering with Karthick Tamilan gives your brand direct market trust and access to an established network of top entrepreneurs, real estate developers, and corporate leaders across the entire Delta region!'
  },
  analytics: {
    badge: 'Verified Account Insights (@karthick_tamilan)',
    title: 'REAL AUDIENCE',
    titleHighlight: 'ANALYTICS & PROOF.',
    description: 'Verified high-intent demographic breakdown for maximum real estate sales & brand conversion.',
    overview: {
      contentViews: '12.4M',
      viewsGrowth: '+21.4% Growth',
      nonFollowersRatio: '78.6%',
      followersRatio: '21.4%',
      uniqueViewers: '4,045,498',
      reelsPlays: '9,500,000 Plays',
      postImpressions: '594,000 Impressions',
      monthlyGrowth: '+6,600'
    },
    age: {
      headline: '70.6% OF AUDIENCE IS AGED 25 TO 44 YEARS',
      description: 'This is the exact prime age group with active financial savings, bank loan eligibility, and high purchase intent for Real Estate Plot Layouts, Luxury Villas, Commercial Shops, and Consumer Brands!',
      decisionMakersPercent: '71%',
      decisionMakersNote: 'Over 71% of viewers are working professionals and entrepreneurs actively looking to invest money in property, land, and lifestyle upgrades.',
      ranges: [
        { label: '25–34 Years (Prime Home Buyers)', pct: '44.9%', color: 'orange' },
        { label: '35–44 Years (Senior Business & Land Investors)', pct: '25.7%', color: 'purple' },
        { label: '18–24 Years', pct: '14.8%', color: 'blue' },
        { label: '45–54 Years (Senior Wealth Investors)', pct: '7.7%', color: 'emerald' }
      ]
    },
    locations: {
      countries: [
        { name: 'India (Local Market)', flag: '🇮🇳', pct: '87.6%', highlight: true },
        { name: 'United Arab Emirates (UAE Gulf NRIs)', flag: '🇦🇪', pct: '3.3%', highlight: true },
        { name: 'Singapore (SEA NRIs)', flag: '🇸🇬', pct: '2.5%', highlight: true },
        { name: 'Malaysia', flag: '🇲🇾', pct: '1.4%', highlight: false },
        { name: 'Kuwait', flag: '🇰🇼', pct: '1.3%', highlight: false }
      ],
      cities: [
        { name: 'Chennai (Metro Buyers)', icon: '🏙️', pct: '12.8%', highlight: true },
        { name: 'Thiruvarur (Delta Heart)', icon: '🌾', pct: '4.3%', highlight: true },
        { name: 'Nannilam', icon: '🌾', pct: '3.3%', highlight: false },
        { name: 'Mannargudi', icon: '🌾', pct: '2.8%', highlight: false },
        { name: 'Singapore', icon: '🇸🇬', pct: '2.5%', highlight: false }
      ],
      nriFunnelsNote: 'Over 8.5% of total reach comes directly from Gulf & SEA NRI investors looking to buy real estate back in Tamil Nadu!',
      deltaMonopolyNote: 'Dominating Thanjavur, Trichy, Thiruvarur, Nannilam & Mannargudi with hyper-local precision!'
    },
    proofScreenshots: [
      {
        title: '12.4M Views & 9.5M Reels',
        subtitle: 'Overview Proof',
        imageUrl: '/images/analytics/overview.jpg'
      },
      {
        title: '25–34 Yrs (44.9%) & 35–44 Yrs (25.7%)',
        subtitle: 'Age Demographics Proof',
        imageUrl: '/images/analytics/age.jpg'
      },
      {
        title: 'India 87.6%, UAE 3.3%, SG 2.5%',
        subtitle: 'Country Reach Proof',
        imageUrl: '/images/analytics/countries.jpg'
      },
      {
        title: 'Chennai 12.8%, Thiruvarur 4.3%',
        subtitle: 'City Reach Proof',
        imageUrl: '/images/analytics/cities.jpg'
      }
    ]
  },
  growthScenarios: [
    {
      number: '01',
      title: '🏡 Real Estate Layout & Plot Sales',
      description: 'Traditional paper fliers fail to show layout beauty. We produce 4K Sony DSLR & Drone aerial walkthroughs, broadcasting to 70.6% buyers aged 25–44 in Delta & Chennai. We deliver verified lead forms directly to your sales team, driving instant site visit bookings.',
      tags: ['✓ 100+ Layouts Sold Out', 'Drone Aerials • Site Visit Leads']
    },
    {
      number: '02',
      title: '✈️ Gulf & SEA NRI Buyer Acquisition',
      description: 'With 3.3% reach in UAE and 2.5% in Singapore, our international NRI marketing funnels connect non-resident Tamils looking to purchase real estate back in their hometowns, converting overseas interest into bank transfers.',
      tags: ['✓ UAE (3.3%) • Singapore (2.5%)', 'International NRI Plot Sales']
    },
    {
      number: '03',
      title: '📢 Local Business & Retail Hype',
      description: 'For retail grand openings, jewelry stores, restaurants, and corporate brands: our 50+ local Instagram pages connect (60KM radius) and 5 top influencers create massive local footfall and immediate order inquiries.',
      tags: ['✓ 50+ Local Insta Pages Connect', 'Surrounding 60KM Footfall']
    },
    {
      number: '04',
      title: '📈 Revenue Scaling & ROAS Optimization',
      description: 'Over 1,500+ ad campaigns executed prove that our funnels eliminate wasted ad dollars. We track cost-per-lead (CPL) and return on ad spend (ROAS) to scale monthly revenue consistently.',
      tags: ['✓ 1,500+ Ad Campaigns Executed', 'Maximum ROAS Optimization']
    }
  ]
}

interface WhyChooseUsViewProps {
  initialData?: WhyChooseUsData
}

export default function WhyChooseUsView({ initialData }: WhyChooseUsViewProps) {
  const { isDarkMode } = useTheme()
  const [data, setData] = useState<WhyChooseUsData>(initialData || FALLBACK_DATA)
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState<'overview' | 'age' | 'locations' | 'proof'>('overview')
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/why-choose-us')
      .then((res) => res.json())
      .then((resData) => {
        if (resData && resData.data) {
          setData(resData.data)
        }
      })
      .catch(() => {})
  }, [])

  const { hero, bniLeadership, analytics, growthScenarios } = data || FALLBACK_DATA

  return (
    <main className={`transition-colors duration-500 ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-white text-slate-900'}`}>
      {/* 01 — HERO BANNER */}
      <section className={`pt-36 md:pt-40 pb-16 md:pb-24 px-5 md:px-8 border-b ${
        isDarkMode ? 'bg-[#050505] border-white/10' : 'kr-grid border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/30 mb-6">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>{hero?.badge || 'Why Choose Us • Verified Market Authority'}</span>
          </div>

          <h1 className={`font-display font-black uppercase tracking-tight leading-[.92] text-4xl sm:text-5xl md:text-6xl lg:text-7xl max-w-5xl mx-auto ${
            isDarkMode ? 'text-white' : 'text-zinc-900'
          }`}>
            {hero?.title || 'WHY BRANDS & REAL ESTATE DEVELOPERS'} <br className="hidden sm:inline" />
            <span className="text-[#F97316]">{hero?.titleHighlight || 'TRUST KARTHICK TAMILAN.'}</span>
          </h1>

          <p className={`mt-6 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${
            isDarkMode ? 'text-white/70' : 'text-slate-600'
          }`}>
            {hero?.description || "We don't just create ad campaigns — we build visual desire backed by 12.4 Million+ verified content views, 70.6% prime investor demographics, and laser-targeted NRI lead funnels."}
          </p>

          {/* Quick Stats Banner from Verified IG Insights */}
          {hero?.stats && hero.stats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto mt-10 pt-8 border-t border-slate-200 dark:border-white/10">
              {hero.stats.map((stat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#F97316]/10 border border-[#F97316]/30 text-center">
                  <p className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-[#F97316]">{stat.value}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/70 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 01.5 — BNI REGIONAL LEADERSHIP & ENTREPRENEUR AUTHORITY */}
      <section className={`px-5 md:px-8 py-16 md:py-24 border-b ${
        isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-gradient-to-br from-orange-50/50 via-white to-slate-50 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[400px_1fr] xl:grid-cols-[440px_1fr] gap-10 lg:gap-14 items-center">
            
            {/* Karthick Tamilan Suit Portrait Card */}
            <div className="relative group mx-auto w-full max-w-sm lg:max-w-none">
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-[#F97316] via-amber-500 to-orange-600 blur-lg opacity-70 group-hover:opacity-100 transition duration-500" />
              <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-zinc-950 shadow-2xl aspect-[4/5]">
                <Image
                  src={bniLeadership?.photoUrl || '/images/karthick-bni-vp.jpg'}
                  alt={`${bniLeadership?.leaderName || 'Karthick Tamilan'} - BNI Vice President`}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  priority
                  unoptimized
                />
                
                {/* Floating BNI Official Logo Badge Overlay */}
                <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-red-500/20 flex items-center gap-1.5">
                  <img src="/images/bni-logo.png" alt="BNI Official Logo" className="h-4 w-auto object-contain" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 flex flex-col justify-end">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F97316] text-black text-[11px] font-black uppercase tracking-wider w-fit mb-2">
                    <Award className="w-3.5 h-3.5" />
                    <span>{bniLeadership?.chapterName || 'BNI Vice President'}</span>
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                    {bniLeadership?.leaderName || 'KARTHICK TAMILAN'}
                  </h3>
                  <p className="text-xs text-orange-400 font-bold mt-0.5">
                    {bniLeadership?.subtitle || 'Founder, KR Digital Marketing & Studioz'}
                  </p>
                </div>
              </div>
            </div>

            {/* BNI Vice President Leadership Credentials */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/30">
                  <Briefcase className="w-4 h-4" />
                  <span>{bniLeadership?.badge || 'Regional Entrepreneur Leadership'}</span>
                </div>

                {/* BNI Official Logo Badge */}
                <div className="inline-flex items-center gap-3 bg-white dark:bg-zinc-900 border border-red-500/30 px-3.5 py-1.5 rounded-full shadow-sm">
                  <img src="/images/bni-logo.png" alt="BNI Logo" className="h-5 w-auto object-contain" />
                  <span className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-wider border-l border-slate-200 dark:border-white/15 pl-2.5">
                    {bniLeadership?.chapterName || 'BNI Emperor Chapter'}
                  </span>
                </div>
              </div>

              <h2 className={`font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-[0.95] ${
                isDarkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                {bniLeadership?.role || 'VICE PRESIDENT — BNI EMPEROR CHAPTER'}
              </h2>

              <p className={`text-base sm:text-lg font-medium leading-relaxed ${
                isDarkMode ? 'text-white/80' : 'text-slate-700'
              }`}>
                {bniLeadership?.description || 'Karthick Tamilan holds the position of Vice President of the BNI Emperor Chapter in Thiruvarur district.'}
              </p>

              {bniLeadership?.highlights && bniLeadership.highlights.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  {bniLeadership.highlights.map((item, idx) => (
                    <div key={idx} className={`p-5 rounded-2xl border transition ${
                      isDarkMode ? 'bg-zinc-900/90 border-white/10' : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                      <div className="w-10 h-10 rounded-xl bg-[#F97316]/15 text-[#F97316] flex items-center justify-center font-bold mb-3">
                        {idx === 0 ? <Users className="w-5 h-5" /> : <Network className="w-5 h-5" />}
                      </div>
                      <h4 className="font-display font-extrabold text-base uppercase text-zinc-900 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-white/60 mt-1.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {bniLeadership?.whyItMatters && (
                <div className="p-5 rounded-2xl bg-[#F97316]/10 border border-[#F97316]/30 flex items-start gap-4">
                  <ShieldCheck className="w-6 h-6 text-[#F97316] shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-slate-700 dark:text-white/80 leading-relaxed">
                    <strong>Why this matters for your business:</strong> {bniLeadership.whyItMatters}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 02 — VERIFIED INSTAGRAM ANALYTICS & AUDIENCE DEMOGRAPHICS DASHBOARD */}
      <section className={`px-5 md:px-8 py-20 border-b ${
        isDarkMode ? 'bg-[#080808] border-white/10' : 'bg-slate-100/70 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-white/10 pb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#F97316] mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>{analytics?.badge || 'Verified Account Insights (@karthick_tamilan)'}</span>
              </div>
              <h2 className={`font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight ${
                isDarkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                {analytics?.title || 'REAL AUDIENCE'} <span className="text-[#F97316]">{analytics?.titleHighlight || 'ANALYTICS & PROOF.'}</span>
              </h2>
            </div>
            <p className={`max-w-md text-xs sm:text-sm leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
              {analytics?.description || 'Verified high-intent demographic breakdown for maximum real estate sales & brand conversion.'}
            </p>
          </div>

          {/* Interactive Dashboard Tabs */}
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
            <button
              type="button"
              onClick={() => setActiveAnalyticsTab('overview')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition cursor-pointer ${
                activeAnalyticsTab === 'overview'
                  ? 'bg-[#F97316] text-white shadow-lg shadow-orange-500/25'
                  : isDarkMode
                  ? 'bg-zinc-900 text-white/70 hover:text-white border border-white/10'
                  : 'bg-white text-slate-700 hover:text-black border border-slate-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{analytics?.overview?.contentViews || '12.4M'} Views Overview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAnalyticsTab('age')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition cursor-pointer ${
                activeAnalyticsTab === 'age'
                  ? 'bg-[#F97316] text-white shadow-lg shadow-orange-500/25'
                  : isDarkMode
                  ? 'bg-zinc-900 text-white/70 hover:text-white border border-white/10'
                  : 'bg-white text-slate-700 hover:text-black border border-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Age & Buying Power (25–44 Yrs)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAnalyticsTab('locations')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition cursor-pointer ${
                activeAnalyticsTab === 'locations'
                  ? 'bg-[#F97316] text-white shadow-lg shadow-orange-500/25'
                  : isDarkMode
                  ? 'bg-zinc-900 text-white/70 hover:text-white border border-white/10'
                  : 'bg-white text-slate-700 hover:text-black border border-slate-200'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Locations (India, UAE, Singapore & Delta)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAnalyticsTab('proof')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition cursor-pointer ${
                activeAnalyticsTab === 'proof'
                  ? 'bg-[#F97316] text-white shadow-lg shadow-orange-500/25'
                  : isDarkMode
                  ? 'bg-zinc-900 text-white/70 hover:text-white border border-white/10'
                  : 'bg-white text-slate-700 hover:text-black border border-slate-200'
              }`}
            >
              <Maximize2 className="w-4 h-4" />
              <span>Verified Screenshots Proof</span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW & REACH */}
          {activeAnalyticsTab === 'overview' && analytics?.overview && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Views Breakdown */}
              <div className={`p-7 rounded-2xl border ${
                isDarkMode ? 'bg-zinc-900/90 border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#F97316] uppercase tracking-wider">Content Views (30 Days)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">{analytics.overview.viewsGrowth}</span>
                </div>
                <p className="font-display font-black text-4xl sm:text-5xl text-[#F97316] mt-3">{analytics.overview.contentViews}</p>
                <p className="text-xs text-slate-500 dark:text-white/60 mt-1">Total video &amp; post impressions served</p>

                {/* Viral Ratio Progress Bar */}
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10 space-y-3">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#F97316]">{analytics.overview.nonFollowersRatio} Non-Followers</span>
                    <span className="text-emerald-400">{analytics.overview.followersRatio} Followers</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden flex">
                    <div className="h-full bg-[#F97316]" style={{ width: analytics.overview.nonFollowersRatio }} />
                    <div className="h-full bg-emerald-500" style={{ width: analytics.overview.followersRatio }} />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-white/50 leading-relaxed">
                    ⚡ <strong>{analytics.overview.nonFollowersRatio} of viewers are non-followers</strong>, meaning your promotional video goes viral to completely new prospective buyers every campaign!
                  </p>
                </div>
              </div>

              {/* Viewers Reached */}
              <div className={`p-7 rounded-2xl border ${
                isDarkMode ? 'bg-zinc-900/90 border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#F97316] uppercase tracking-wider">Unique Viewers Reached</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">Verified</span>
                </div>
                <p className="font-display font-black text-4xl sm:text-5xl text-purple-400 mt-3">{analytics.overview.uniqueViewers}</p>
                <p className="text-xs text-slate-500 dark:text-white/60 mt-1">Over 4 Million unique individuals reached</p>

                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold">Reels Engagement:</span>
                    <span className="font-extrabold text-[#F97316]">{analytics.overview.reelsPlays}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-[#F97316]" style={{ width: '94.1%' }} />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2">
                    <span className="font-bold">Posts &amp; Carousels:</span>
                    <span className="font-extrabold text-blue-400">{analytics.overview.postImpressions}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '5.9%' }} />
                  </div>
                </div>
              </div>

              {/* Net New Followers */}
              <div className={`p-7 rounded-2xl border ${
                isDarkMode ? 'bg-zinc-900/90 border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#F97316] uppercase tracking-wider">Net Monthly Growth</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">Verified</span>
                </div>
                <p className="font-display font-black text-4xl sm:text-5xl text-amber-400 mt-3">{analytics.overview.monthlyGrowth}</p>
                <p className="text-xs text-slate-500 dark:text-white/60 mt-1">Organic new followers gained every 30 days</p>

                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10 space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-slate-700 dark:text-white/80">
                    💡 <strong>What this means for your business:</strong> You get access to an active, growing audience that trusts Karthick Tamilan&apos;s recommendations.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AGE RANGE & PURCHASING POWER */}
          {activeAnalyticsTab === 'age' && analytics?.age && (
            <div className={`p-8 md:p-10 rounded-2xl border ${
              isDarkMode ? 'bg-zinc-900/90 border-white/10' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-extrabold uppercase tracking-wider mb-4">
                    <span>🔥 High-Purchasing Power Demographics</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-zinc-900 dark:text-white">
                    {analytics.age.headline}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-white/70 mt-2 leading-relaxed">
                    {analytics.age.description}
                  </p>

                  {/* Age Range Progress Bars */}
                  <div className="mt-8 space-y-4">
                    {analytics.age.ranges.map((rng, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-zinc-900 dark:text-white flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
                            <span>{rng.label}</span>
                          </span>
                          <span className="text-[#F97316] font-black text-sm">{rng.pct}</span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden p-0.5">
                          <div className="h-full bg-gradient-to-r from-[#F97316] to-amber-400 rounded-full" style={{ width: rng.pct }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Age Highlight Card */}
                <div className="p-6 rounded-2xl bg-[#F97316]/10 border border-[#F97316]/30 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#F97316] text-black font-black text-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    {analytics.age.decisionMakersPercent}
                  </div>
                  <h4 className="font-display font-black text-xl text-zinc-900 dark:text-white uppercase">
                    Decision Makers
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-white/70 mt-2 leading-relaxed">
                    {analytics.age.decisionMakersNote}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LOCATIONS (INDIA, UAE, SINGAPORE & DELTA CITIES) */}
          {activeAnalyticsTab === 'locations' && analytics?.locations && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Top Countries */}
              <div className={`p-8 rounded-2xl border ${
                isDarkMode ? 'bg-zinc-900/90 border-white/10' : 'bg-white border-slate-200 shadow-md'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-display text-xl font-bold uppercase text-zinc-900 dark:text-white">
                      🌍 Top Countries (Global NRI Reach)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-white/60">Verified international audience locations</p>
                  </div>
                  <Globe className="w-6 h-6 text-[#F97316]" />
                </div>

                <div className="space-y-4">
                  {analytics.locations.countries.map((cntry, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span>{cntry.flag} {cntry.name}</span>
                        <span className="text-[#F97316] font-black">{cntry.pct}</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                        <div className="h-full bg-[#F97316]" style={{ width: cntry.pct }} />
                      </div>
                    </div>
                  ))}
                </div>

                {analytics.locations.nriFunnelsNote && (
                  <div className="mt-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-bold">
                    💎 <strong>NRI Investor Funnels:</strong> {analytics.locations.nriFunnelsNote}
                  </div>
                )}
              </div>

              {/* Top Cities */}
              <div className={`p-8 rounded-2xl border ${
                isDarkMode ? 'bg-zinc-900/90 border-white/10' : 'bg-white border-slate-200 shadow-md'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-display text-xl font-bold uppercase text-zinc-900 dark:text-white">
                      📍 Top Cities (Delta &amp; Metro Authority)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-white/60">Hyper-local city audience concentration</p>
                  </div>
                  <MapPin className="w-6 h-6 text-[#F97316]" />
                </div>

                <div className="space-y-4">
                  {analytics.locations.cities.map((city, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span>{city.icon} {city.name}</span>
                        <span className="text-[#F97316] font-black">{city.pct}</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                        <div className="h-full bg-[#F97316]" style={{ width: city.pct }} />
                      </div>
                    </div>
                  ))}
                </div>

                {analytics.locations.deltaMonopolyNote && (
                  <div className="mt-6 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-[#F97316] font-bold">
                    🎯 <strong>Delta Region Monopoly:</strong> {analytics.locations.deltaMonopolyNote}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: VERIFIED SCREENSHOTS PROOF LIGHTBOX GALLERY */}
          {activeAnalyticsTab === 'proof' && analytics?.proofScreenshots && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-[#F97316] font-bold text-center">
                📷 Tap any verified Instagram Insights screenshot to view in full screen resolution.
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analytics.proofScreenshots.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setLightboxImg(item.imageUrl)}
                    className="group relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 cursor-pointer aspect-[9/16] shadow-lg hover:border-[#F97316] transition"
                  >
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end">
                      <p className="text-xs font-extrabold text-white">{item.title}</p>
                      <p className="text-[10px] text-orange-400 font-mono">{item.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 03 — REAL ESTATE & BRAND GROWTH SCENARIOS */}
      {growthScenarios && growthScenarios.length > 0 && (
        <section className={`px-5 md:px-8 py-20 md:py-28 border-b ${
          isDarkMode ? 'bg-zinc-950/80 border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className={`font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight ${
                isDarkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                REAL ESTATE &amp; BRAND <span className="text-[#F97316]">GROWTH SCENARIOS</span>
              </h2>
              <p className={`text-sm md:text-base ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
                How our data-driven marketing funnels turn online reach into actual booked transactions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {growthScenarios.map((scenario, idx) => (
                <div key={idx} className={`p-8 md:p-10 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                  isDarkMode ? 'bg-zinc-900/90 border-white/10 hover:border-[#F97316]' : 'bg-white border-slate-200 shadow-md hover:border-[#F97316]'
                }`}>
                  <div className="w-14 h-14 rounded-2xl bg-[#F97316]/15 text-[#F97316] flex items-center justify-center font-display text-2xl font-black mb-6">
                    {scenario.number || `0${idx + 1}`}
                  </div>
                  <h3 className={`font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                    {scenario.title}
                  </h3>
                  <p className={`mt-4 text-sm md:text-base leading-relaxed ${isDarkMode ? 'text-white/70' : 'text-slate-600'}`}>
                    {scenario.description}
                  </p>
                  {scenario.tags && scenario.tags.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#F97316]">
                      {scenario.tags.map((tag, tIdx) => (
                        <span key={tIdx}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 04 — TRADITIONAL VS KARTHICK TAMILAN COMPARISON */}
      <section className="px-5 md:px-8 py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto p-8 md:p-14 rounded-3xl border border-[#F97316]/40 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#F97316]/10 blur-3xl pointer-events-none" />

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase text-center mb-10 tracking-tight leading-none">
            TRADITIONAL MARKETING VS. <span className="text-[#F97316]">KARTHICK TAMILAN GROWTH STRATEGY</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-10 divide-y md:divide-y-0 md:divide-x divide-white/15">
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-red-400 font-extrabold uppercase tracking-wider text-sm">
                <XCircle className="w-5 h-5 shrink-0" />
                <span>Traditional Agencies &amp; Old Ads</span>
              </div>
              <ul className="space-y-4 text-sm text-white/70">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Paper fliers &amp; billboards with zero trackable leads.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Low quality phone photos &amp; boring promotional reels.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Generic targeting wasting 80% of ad budgets on non-buyers.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Focus on vanity views rather than booked real estate plot sales.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-5 pt-8 md:pt-0 md:pl-10">
              <div className="flex items-center gap-2 text-emerald-400 font-extrabold uppercase tracking-wider text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Karthick Tamilan Growth Strategy</span>
              </div>
              <ul className="space-y-4 text-sm text-white/95">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>4K Sony Alpha DSLR &amp; Drone Aerial Shoots</strong> that create instant visual desire.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>375,000+ Social Media Audience Broadcast</strong> across IG, FB &amp; YT.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>60KM Surrounding Radius &amp; NRI Targeting</strong> for high-intent buyers.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Hand-delivered Verified Phone Leads</strong> to close sales &amp; plot bookings fast.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center pt-8 border-t border-white/10 flex flex-wrap justify-center gap-4">
            <Link
              href="/digital-marketing"
              className="bg-[#F97316] text-white px-7 py-4 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-white hover:text-black transition"
            >
              Explore All Digital Marketing Services ↗
            </Link>
            <a
              href="https://wa.me/919626759859?text=Hi%20Karthick%20Tamilan,%20I%20want%20to%20discuss%20Digital%20Marketing"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/20 text-white px-7 py-4 text-xs font-bold uppercase tracking-widest rounded-lg hover:border-[#F97316] hover:text-[#F97316] transition"
            >
              Talk Directly via WhatsApp 💬
            </a>
          </div>
        </div>
      </section>

      {/* LIGHTBOX MODAL FOR PROOF SCREENSHOTS */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-red-500 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <img
            src={lightboxImg}
            alt="Instagram Analytics Proof"
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl border border-white/20"
          />
        </div>
      )}
    </main>
  )
}
