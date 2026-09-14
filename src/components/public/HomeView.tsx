'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { StudiozService, MarketingService, PortfolioItem, ClientLogo, SiteStat } from '@/types/database'
import { useTheme } from '@/context/ThemeContext'
import HomePortfolio from '@/components/public/HomePortfolio'

interface HomeViewProps {
  studiozServices: StudiozService[]
  marketingServices: MarketingService[]
  portfolioItems: PortfolioItem[]
  clientLogos: ClientLogo[]
  siteStats: SiteStat[]
}

export default function HomeView({
  studiozServices,
  marketingServices,
  portfolioItems,
  clientLogos,
  siteStats,
}: HomeViewProps) {
  const { isDarkMode } = useTheme()
  const [heroImageUrl, setHeroImageUrl] = useState('/f11.png')
  const [heroImageScale, setHeroImageScale] = useState(100)

  useEffect(() => {
    fetch('/api/site-settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings?.home_hero_image_url) {
          setHeroImageUrl(data.settings.home_hero_image_url)
        }
        if (data.settings?.home_hero_image_scale) {
          setHeroImageScale(Number(data.settings.home_hero_image_scale) || 100)
        }
      })
      .catch(() => {})
  }, [])

  // Get follower stat if available or default
  const followerStat =
    siteStats.find(
      (s) =>
        s.label.toLowerCase().includes('follower') ||
        s.label.toLowerCase().includes('social')
    )?.value || '3,90,000+'

  // Default marketing fallback if DB is empty
  const defaultMarketingServices = [
    { id: 'm1', name: 'Search Engine\nOptimization', description: 'Improve your search visibility and help the right customers discover your business.' },
    { id: 'm2', name: 'Digital\nVideo Ads', description: 'Creative video advertising that captures attention and communicates your brand instantly.' },
    { id: 'm3', name: 'Google\nAds', description: 'Reach customers actively searching for your products and services through targeted campaigns.' },
    { id: 'm4', name: 'Influencer\nMarketing', description: 'Connect your brand with relevant creators and reach audiences that trust their voice.' },
    { id: 'm5', name: 'Instagram\nAds', description: 'Build awareness and generate enquiries through creative Instagram advertising campaigns.' },
    { id: 'm6', name: 'Branding &\nIdentity', description: 'Create a memorable visual identity that gives your business a strong and consistent presence.' },
    { id: 'm7', name: 'YouTube\nAds', description: 'Put your brand in front of the right audience with engaging YouTube video campaigns.' },
    { id: 'm8', name: 'Graphic\nDesign', description: 'From social creatives to promotional designs, we make your brand visually stand out.' },
  ]

  const activeMarketing = marketingServices
  const marketingMarqueeItems = activeMarketing.length > 0 ? [...activeMarketing, ...activeMarketing] : []

  const activeStudioz = studiozServices
  const studiozMarqueeItems = activeStudioz.length > 0 ? [...activeStudioz, ...activeStudioz] : []

  const activeLogos = clientLogos.map(l => l.name)
  const logoMarqueeItems = activeLogos.length > 0 ? [...activeLogos, ...activeLogos] : []

  return (
    <main id="home" className={`transition-colors duration-500 ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-white text-zinc-900'}`}>
      {/* ==========================================================
          HERO SECTION
      =========================================================== */}
      <section className={`relative min-h-screen pt-20 sm:pt-22 md:pt-24 lg:pt-28 overflow-hidden ${
        isDarkMode ? 'dark-kr-grid bg-[#050505]' : 'kr-grid bg-white'
      }`}>
        {/* GRID OVERLAY */}
        <div className={`absolute inset-0 pointer-events-none ${
          isDarkMode ? 'dark-grid-fade' : 'grid-fade'
        }`} />

        {/* CORNER MARKS */}
        <div className="absolute top-28 left-4 md:left-6 w-3 h-3 border-l border-t border-orange-500 pointer-events-none" />
        <div className="absolute top-28 right-4 md:right-6 w-3 h-3 border-r border-t border-orange-500 pointer-events-none" />
        <div className="absolute bottom-8 left-4 md:left-6 w-3 h-3 border-l border-b border-orange-500 pointer-events-none" />
        <div className="absolute bottom-8 right-4 md:right-6 w-3 h-3 border-r border-b border-orange-500 pointer-events-none" />

        {/* HERO CONTAINER */}
        <div className="relative z-10 max-w-[1600px] mx-auto px-5 sm:px-6 md:px-8 xl:px-12">
          <div className="w-full">
            {/* TOP BADGE */}
            <div className="reveal flex items-center justify-center mt-2 sm:mt-3 md:mt-5">
              <div className={`rounded-full w-[calc(100vw-42px)] max-w-[320px] sm:w-auto sm:max-w-none px-5 py-2.5 sm:px-7 sm:py-3 md:px-9 md:py-3.5 flex items-center justify-center gap-2.5 sm:gap-3 transition-colors duration-500 ${
                isDarkMode
                  ? 'bg-[#0a0a0a] border border-[#F97316]/40 shadow-[0_12px_30px_rgba(249,115,22,0.25)]'
                  : 'bg-white border border-[#FDE7D3] shadow-[0_12px_30px_rgba(249,115,22,0.13)]'
              }`}>
                <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="#F97316">
                  <path d="M12 2l2.5 6.5L21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5L12 2z" />
                </svg>
                <p className="text-[9px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.12em] sm:tracking-[0.16em] text-[#F97316] whitespace-nowrap">
                  Delta Leading Influencer
                </p>
              </div>
            </div>

            {/* MAIN HERO GRID */}
            <div className="mt-6 sm:mt-8 md:mt-10 xl:-translate-y-10 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(460px,620px)_minmax(0,1fr)] gap-10 sm:gap-12 md:gap-16 xl:gap-14 items-center">
              {/* STUDIOZ LEFT COLUMN */}
              <div className="reveal delay-1 w-full min-w-0 flex flex-col items-center xl:items-start text-center xl:text-left xl:-mt-12">
                <div className="flex items-center justify-center xl:justify-start gap-2 mb-4 md:mb-5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#F97316]" />
                  </span>
                  <p className={`text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.18em] sm:tracking-[0.22em] font-bold ${
                    isDarkMode ? 'text-white/70' : 'text-zinc-700'
                  }`}>
                    KR Studioz
                  </p>
                </div>

                <h1 className={`font-display font-black tracking-[-0.065em] leading-[0.86] text-[3rem] sm:text-[3.8rem] md:text-[5rem] lg:text-[5.5rem] xl:text-[clamp(3rem,5.5vw,6rem)] ${
                  isDarkMode ? 'text-white' : 'text-zinc-900'
                }`}>
                  CAPTURE
                  <br />
                  <span className="text-[#F97316]">MOMENTS.</span>
                </h1>

                <p className={`mt-5 sm:mt-6 md:mt-7 w-full max-w-[310px] sm:max-w-[330px] md:max-w-md text-sm md:text-base leading-[1.6] font-medium text-center xl:text-left ${
                  isDarkMode ? 'text-white/80' : 'text-zinc-700'
                }`}>
                  Cinematic photography and videography that turn your special moments into memories that last forever.
                </p>

                <Link
                  href="/studioz"
                  className="inline-flex items-center justify-center mt-6 sm:mt-7 md:mt-8 kr-button min-w-[170px] sm:min-w-[180px] px-6 py-3.5 sm:px-7 sm:py-4 text-sm font-semibold"
                >
                  Explore Studioz
                  <span className="ml-3">↗</span>
                </Link>
              </div>

              {/* FOUNDER CENTER AREA */}
              <div className="reveal delay-2 relative flex items-center justify-center w-full min-w-0 min-h-[350px] sm:min-h-[400px] md:min-h-[520px] lg:min-h-[570px] xl:min-h-[620px] xl:mt-8">
                {/* OUTER CIRCLE */}
                <div className={`absolute w-[255px] h-[255px] sm:w-[315px] sm:h-[315px] md:w-[420px] md:h-[420px] lg:w-[500px] lg:h-[500px] xl:w-[560px] xl:h-[560px] rounded-full border pointer-events-none ${
                  isDarkMode ? 'border-orange-500/25' : 'border-orange-300/60'
                }`} />

                {/* INNER CIRCLE */}
                <div className={`absolute w-[215px] h-[215px] sm:w-[275px] sm:h-[275px] md:w-[360px] md:h-[360px] lg:w-[430px] lg:h-[430px] xl:w-[490px] xl:h-[490px] rounded-full border pointer-events-none ${
                  isDarkMode ? 'border-orange-500/15' : 'border-orange-200/80'
                }`} />

                {/* FLOATING DOTS */}
                <div className="floating-dot absolute top-7 right-[15%] sm:top-8 sm:right-[17%] md:right-[18%] xl:right-4 w-3 h-3 rounded-full bg-[#F97316] z-20" />
                <div className="floating-dot absolute bottom-14 left-[15%] sm:left-[17%] md:left-[18%] xl:left-2 w-2 h-2 rounded-full bg-orange-400 z-20" />

                {/* FOUNDER IMAGE */}
                <div
                  className="relative z-10 flex items-end justify-center w-full -translate-y-2 sm:-translate-y-1 md:translate-y-0 transition-transform duration-300 origin-bottom"
                  style={{ transform: `scale(${heroImageScale / 100})` }}
                >
                  <Image
                    src={heroImageUrl || '/f11.png'}
                    alt="KR Founders"
                    width={590}
                    height={700}
                    priority
                    className="founder-image relative z-10 w-[300px] sm:w-[360px] md:w-[470px] lg:w-[530px] xl:w-[590px] h-auto max-w-none object-contain select-none [mask-image:linear-gradient(to_bottom,black_88%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_88%,transparent_100%)]"
                    unoptimized
                  />

                  {/* BOTTOM FADE */}
                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[250px] sm:w-[310px] md:w-[390px] lg:w-[460px] xl:w-[520px] h-16 sm:h-20 md:h-28 blur-2xl opacity-85 pointer-events-none z-20 ${
                    isDarkMode ? 'bg-[#050505]' : 'bg-white'
                  }`} />
                </div>

                {/* FOLLOWER BADGE */}
                <div className={`absolute z-40 bottom-0 left-1/2 -translate-x-1/2 w-[calc(100vw-34px)] max-w-[330px] sm:w-auto sm:max-w-none border border-[#F97316]/30 shadow-[0_14px_35px_rgba(249,115,22,0.2)] px-4 py-3 sm:px-5 sm:py-3.5 md:px-7 md:py-4 flex items-center justify-center gap-3 sm:gap-4 rounded-none sm:rounded-sm whitespace-nowrap transition-colors duration-500 ${
                  isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-zinc-900'
                }`}>
                  {/* SOCIAL ICONS */}
                  <div className="flex items-center -space-x-1 shrink-0">
                    <span className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#F97316]/30 text-[#F97316] relative z-30 ${
                      isDarkMode ? 'bg-[#121212]' : 'bg-white'
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                      </svg>
                    </span>
                    <span className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#F97316]/30 text-[#F97316] relative z-20 ${
                      isDarkMode ? 'bg-[#121212]' : 'bg-white'
                    }`}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.9V8.1l6.5 3.9-6.5 3.9Z" />
                      </svg>
                    </span>
                    <span className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#F97316]/30 text-[#F97316] relative z-10 ${
                      isDarkMode ? 'bg-[#121212]' : 'bg-white'
                    }`}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 8h3V4h-3c-3.3 0-5 1.7-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.7.3-1 1-1Z" />
                      </svg>
                    </span>
                  </div>

                  {/* FOLLOWER COUNT */}
                  <div className="leading-tight text-center min-w-0">
                    <p className={`font-display font-bold text-lg sm:text-xl md:text-2xl tracking-tight ${
                      isDarkMode ? 'text-white' : 'text-zinc-900'
                    }`}>
                      {followerStat}
                    </p>
                    <p className={`mt-0.5 text-[7px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.10em] sm:tracking-[0.14em] whitespace-nowrap ${
                      isDarkMode ? 'text-white/60' : 'text-zinc-600'
                    }`}>
                      Followers Across Social Media
                    </p>
                  </div>
                </div>
              </div>

              {/* DIGITAL MARKETING RIGHT COLUMN */}
              <div className="reveal delay-3 w-full min-w-0 flex flex-col items-center xl:items-end text-center xl:text-right xl:-mt-10">
                <div className="w-full max-w-[430px]">
                  <div className="flex items-center justify-center xl:justify-end gap-2 mb-4 md:mb-5">
                    <p className={`text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.18em] sm:tracking-[0.22em] font-bold whitespace-nowrap ${
                      isDarkMode ? 'text-white/70' : 'text-zinc-700'
                    }`}>
                      KR Digital Marketing
                    </p>
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#F97316]" />
                    </span>
                  </div>

                  <h1 className={`font-display font-black tracking-[-0.065em] leading-[0.86] text-[3rem] sm:text-[3.8rem] md:text-[5rem] lg:text-[5.5rem] xl:text-[clamp(3rem,5.2vw,5.8rem)] text-center xl:text-right ${
                    isDarkMode ? 'text-white' : 'text-zinc-900'
                  }`}>
                    BUILD
                    <br />
                    <span className="text-[#F97316]">BRANDS.</span>
                  </h1>

                  <p className={`mt-5 sm:mt-6 md:mt-7 w-full max-w-[310px] sm:max-w-[330px] md:max-w-[360px] mx-auto xl:ml-auto xl:mr-0 text-sm md:text-base leading-[1.6] font-medium text-center xl:text-right ${
                    isDarkMode ? 'text-white/80' : 'text-zinc-700'
                  }`}>
                    Strategy, creativity and technology that help businesses build powerful brands and grow digitally.
                  </p>

                  <div className="mt-6 sm:mt-7 md:mt-8 flex justify-center xl:justify-end">
                    <Link
                      href="/digital-marketing"
                      className="inline-flex items-center justify-center kr-button min-w-[190px] px-6 sm:px-7 py-3.5 sm:py-4 text-sm font-semibold text-center"
                    >
                      <span>
                        Explore Digital
                        <br className="xl:hidden" /> Marketing
                      </span>
                      <span className="ml-3">↗</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM DIVIDER */}
            <div className={`reveal delay-3 mt-12 sm:mt-14 md:mt-16 xl:mt-8 pt-5 md:pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-3 ${
              isDarkMode ? 'border-white/10 text-white/40' : 'border-[#FDE7D3] text-gray-400'
            }`}>
              <p className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.16em] text-center md:text-left">
                Photography • Films • Memories
              </p>
              <p className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.16em] text-center md:text-right">
                Strategy • Creativity • Growth
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================
          TRUSTED BY MARQUEE
      =========================================================== */}
      <section className={`border-y overflow-hidden transition-colors duration-500 ${
        isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-[#FDE7D3]'
      }`}>
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-6 flex items-center gap-8">
          <div className="shrink-0">
            <p className={`text-xs uppercase tracking-[0.2em] font-semibold ${
              isDarkMode ? 'text-white/40' : 'text-gray-500'
            }`}>
              Trusted By
            </p>
          </div>

          <div className="overflow-hidden flex-1">
            <div className="marquee items-center gap-16 whitespace-nowrap">
              {logoMarqueeItems.map((name, i) => (
                <span
                  key={i}
                  className={`font-display font-bold text-sm md:text-base uppercase ${
                    isDarkMode ? 'text-white/30' : 'text-gray-300'
                  }`}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================
          ABOUT KR SECTION
      =========================================================== */}
      <section
        id="about"
        className={`relative min-h-screen px-5 sm:px-6 md:px-10 lg:px-16 py-24 md:py-32 overflow-hidden transition-colors duration-500 ${
          isDarkMode ? 'bg-[#050505]' : 'bg-white kr-grid'
        }`}
      >
        <div className="absolute top-16 left-4 w-16 h-16 border-l border-t border-[#F97316]/40" />
        <div className="absolute bottom-10 right-4 w-16 h-16 border-r border-b border-[#F97316]/40" />
        <span className="absolute top-28 right-[10%] w-3 h-3 rounded-full bg-[#F97316] animate-pulse" />
        <span className="absolute bottom-32 left-[8%] w-2 h-2 rounded-full bg-[#F97316]" />

        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10 md:mb-14">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#F97316] animate-pulse" />
              <span className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-[#F97316]">
                About KR
              </span>
            </div>
            <span className={`hidden sm:block text-[10px] md:text-xs font-bold tracking-[0.2em] ${
              isDarkMode ? 'text-white/30' : 'text-black/30'
            }`}>
              01 / ABOUT
            </span>
          </div>

          <div className={`relative border border-[#F97316] p-6 sm:p-8 md:p-12 lg:p-16 transition-colors duration-500 ${
            isDarkMode
              ? 'bg-[#0a0a0a] shadow-[8px_8px_0px_#F97316]'
              : 'bg-white shadow-[8px_8px_0px_#050505]'
          }`}>
            <span className="absolute -top-2 -left-2 w-4 h-4 bg-[#F97316] rounded-full" />
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#F97316] rounded-full" />
            <span className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#F97316] rounded-full" />
            <span className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#F97316] rounded-full" />

            <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-20 items-center">
              <div>
                <p className={`text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-6 ${
                  isDarkMode ? 'text-white/40' : 'text-black/40'
                }`}>
                  One Creative Team
                </p>
                <h2 className={`font-display font-black uppercase tracking-[-0.065em] leading-[0.82] text-[3.5rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7rem] ${
                  isDarkMode ? 'text-white' : 'text-zinc-900'
                }`}>
                  MORE<br />
                  <span className="text-[#F97316] relative inline-block">
                    THAN
                    <span className="absolute left-0 -bottom-2 md:-bottom-3 w-full h-1 md:h-2 bg-[#F97316]" />
                  </span>
                  <br />
                  A COMPANY.
                </h2>
              </div>

              <div>
                <div className="border-l-4 border-[#F97316] pl-5 md:pl-7 mb-8">
                  <p className={`text-xl sm:text-2xl md:text-3xl font-black leading-[1.05] tracking-tight ${
                    isDarkMode ? 'text-white' : 'text-zinc-900'
                  }`}>
                    We capture moments.<br />
                    We build brands.<br />
                    <span className="text-[#F97316]">We create impact.</span>
                  </p>
                </div>

                <p className={`text-sm md:text-base leading-relaxed font-medium max-w-lg ${
                  isDarkMode ? 'text-white/60' : 'text-black/60'
                }`}>
                  KR brings creativity, storytelling and digital expertise together to create experiences people remember and brands believe in.
                </p>

                <div className="grid grid-cols-3 gap-3 md:gap-4 mt-9">
                  <div className={`border p-4 md:p-5 hover:border-[#F97316] hover:-translate-y-1 transition-all duration-300 ${
                    isDarkMode ? 'border-white/15 bg-zinc-900/50' : 'border-black/10 bg-white'
                  }`}>
                    <div className="text-[#F97316] font-black text-lg md:text-xl mb-2">01</div>
                    <p className={`text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider ${
                      isDarkMode ? 'text-white' : 'text-zinc-800'
                    }`}>Creativity</p>
                  </div>
                  <div className={`border p-4 md:p-5 hover:border-[#F97316] hover:-translate-y-1 transition-all duration-300 ${
                    isDarkMode ? 'border-white/15 bg-zinc-900/50' : 'border-black/10 bg-white'
                  }`}>
                    <div className="text-[#F97316] font-black text-lg md:text-xl mb-2">02</div>
                    <p className={`text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider ${
                      isDarkMode ? 'text-white' : 'text-zinc-800'
                    }`}>Storytelling</p>
                  </div>
                  <div className={`border p-4 md:p-5 hover:border-[#F97316] hover:-translate-y-1 transition-all duration-300 ${
                    isDarkMode ? 'border-white/15 bg-zinc-900/50' : 'border-black/10 bg-white'
                  }`}>
                    <div className="text-[#F97316] font-black text-lg md:text-xl mb-2">03</div>
                    <p className={`text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider ${
                      isDarkMode ? 'text-white' : 'text-zinc-800'
                    }`}>Impact</p>
                  </div>
                </div>

                <Link
                  href="/about"
                  className="group inline-flex items-center gap-4 mt-9 px-6 py-4 bg-[#F97316] text-white font-bold uppercase tracking-[0.12em] text-xs shadow-[6px_6px_0px_#050505] transition-all duration-300 hover:bg-black hover:-translate-y-1"
                >
                  Explore Our Story
                  <span className="text-lg transition-transform duration-300 group-hover:translate-x-2">→</span>
                </Link>
              </div>
            </div>

            <div className="mt-14 md:mt-16 pt-6 border-t border-[#F97316]/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div className={`flex items-center gap-3 text-[10px] md:text-xs font-bold uppercase tracking-[0.18em] ${
                isDarkMode ? 'text-white/70' : 'text-zinc-700'
              }`}>
                <span className="w-2 h-2 bg-[#F97316] rounded-full" />
                One Creative Team
              </div>
              <div className={`flex flex-wrap items-center gap-3 text-[10px] md:text-xs font-bold uppercase tracking-[0.12em] ${
                isDarkMode ? 'text-white/70' : 'text-zinc-700'
              }`}>
                <span>KR Studioz</span>
                <span className="text-[#F97316] text-lg">×</span>
                <span>KR Digital Marketing</span>
              </div>
            </div>

            <div
              className="absolute right-5 top-5 w-20 h-20 opacity-40 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#F97316 1.2px, transparent 1.2px)',
                backgroundSize: '10px 10px',
              }}
            />
            <div className="absolute left-0 bottom-0 w-24 h-1 bg-[#F97316]" />
          </div>

          {/* BOTTOM TAGS */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/studioz"
              className={`group border p-5 transition-all duration-300 hover:border-[#F97316] ${
                isDarkMode ? 'border-white/15 bg-[#0a0a0a]' : 'border-black/10 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#F97316] font-bold mb-2">World 01</p>
                  <h3 className={`font-display text-xl md:text-2xl font-black uppercase ${
                    isDarkMode ? 'text-white' : 'text-zinc-900'
                  }`}>KR Studioz</h3>
                </div>
                <span className={`text-2xl group-hover:translate-x-2 transition-transform duration-300 ${
                  isDarkMode ? 'text-white' : 'text-zinc-900'
                }`}>→</span>
              </div>
              <p className={`mt-3 text-xs md:text-sm font-medium ${
                isDarkMode ? 'text-white/50' : 'text-black/50'
              }`}>
                Photography • Films • Events • Memories
              </p>
            </Link>

            <Link
              href="/digital-marketing"
              className="group border border-black/10 p-5 bg-black text-white hover:border-[#F97316] transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#F97316] font-bold mb-2">World 02</p>
                  <h3 className="font-display text-xl md:text-2xl font-black uppercase">KR Digital Marketing</h3>
                </div>
                <span className="text-2xl text-[#F97316] group-hover:translate-x-2 transition-transform duration-300">→</span>
              </div>
              <p className="mt-3 text-xs md:text-sm text-white/50 font-medium">
                Strategy • Branding • Ads • Growth
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================================
          DIGITAL MARKETING MARQUEE SECTION
      =========================================================== */}
      <section id="marketing" className="relative min-h-screen bg-[#050505] text-white overflow-hidden py-24">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(249,115,22,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,.6) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-orange-600/10 blur-[150px] pointer-events-none" />

        <div className="relative z-10 max-w-[1600px] mx-auto">
          <div className="px-6 md:px-10 lg:px-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,.9)] animate-pulse" />
              <p className="text-orange-400 text-xs md:text-sm uppercase tracking-[0.3em] font-black">
                KR Digital Marketing
              </p>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <h2 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] font-black uppercase tracking-[-0.07em] leading-[0.78]">
                Build
                <br />
                <span className="text-orange-500">Brands.</span>
              </h2>

              <p className="max-w-md text-sm md:text-base leading-relaxed text-white/50 font-medium">
                Creative ideas, powerful advertising and digital strategies designed to make your brand impossible to ignore.
              </p>
            </div>
          </div>

          <div className="mt-20 relative">
            <div className="border-t border-white/10" />

            <div className="service-marquee flex w-max py-10">
              {marketingMarqueeItems.map((service, idx) => (
                <div key={service.id ? `${service.id}-${idx}` : idx} className="service-card">
                  <div className="service-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
                      <circle cx="11" cy="11" r="7" />
                      <path d="m20 20-4-4" />
                    </svg>
                  </div>
                  <span className="service-number">
                    {String((idx % activeMarketing.length) + 1).padStart(2, '0')}
                  </span>
                  <h3 className="whitespace-pre-line">{service.name}</h3>
                  <p>{service.description}</p>
                </div>
              ))}
            </div>

            <div className="border-b border-white/10" />
          </div>

          <div className="px-6 md:px-10 lg:px-16 mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-bold">
                Strategy • Creativity • Growth
              </p>
            </div>

            <Link
              href="/digital-marketing"
              className="group inline-flex items-center justify-center gap-4 px-8 py-4 bg-orange-500 text-white font-black uppercase tracking-[0.12em] text-xs transition-all duration-300 hover:bg-white hover:text-black hover:-translate-y-1 shadow-[0_10px_30px_rgba(249,115,22,.15)]"
            >
              Explore More
              <span className="text-lg transition-transform duration-300 group-hover:translate-x-2">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================================
          KR STUDIOZ MARQUEE SECTION
      =========================================================== */}
      <section id="studioz" className={`relative min-h-screen overflow-hidden py-24 transition-colors duration-500 ${
        isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-black'
      }`}>
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.09]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(249,115,22,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,.35) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-[1600px] mx-auto">
          <div className="px-6 md:px-10 lg:px-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-3 h-3 rounded-full bg-orange-600 shadow-[0_0_20px_rgba(249,115,22,.45)] animate-pulse" />
              <p className="text-orange-600 text-xs md:text-sm uppercase tracking-[0.3em] font-black">
                KR Studioz
              </p>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <h2 className={`font-display text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] font-black uppercase tracking-[-0.07em] leading-[0.78] ${
                isDarkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                Capture
                <br />
                <span className="text-orange-600">Moments.</span>
              </h2>

              <p className={`max-w-md text-sm md:text-base leading-relaxed font-medium ${
                isDarkMode ? 'text-white/60' : 'text-black/50'
              }`}>
                We don&apos;t just take photographs. We capture emotions, celebrations and stories that deserve to be remembered.
              </p>
            </div>
          </div>

          <div className="mt-20 relative">
            <div className={`border-t ${isDarkMode ? 'border-white/10' : 'border-orange-900/10'}`} />

            <div className="studioz-marquee flex w-max py-10">
              {studiozMarqueeItems.map((service, idx) => (
                <div key={service.id ? `${service.id}-${idx}` : idx} className="studio-card">
                  <div className="studio-image">
                    {service.hero_image_url && (
                      <Image
                        src={service.hero_image_url}
                        alt={service.name}
                        fill
                        className="object-cover"
                        sizes="340px"
                        unoptimized
                      />
                    )}
                    <div className="studio-overlay" />
                    <span className="studio-image-number">
                      {String((idx % activeStudioz.length) + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="studio-content mt-4">
                    <span className="studio-number">
                      {String((idx % activeStudioz.length) + 1).padStart(2, '0')} / STUDIOZ
                    </span>
                    <h3 className={`whitespace-pre-line ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{service.name}</h3>
                    <p className={isDarkMode ? 'text-white/60' : 'text-gray-600'}>{service.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={`border-b ${isDarkMode ? 'border-white/10' : 'border-orange-900/10'}`} />
          </div>

          <div className="px-6 md:px-10 lg:px-16 mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-orange-600" />
              <p className={`text-xs uppercase tracking-[0.2em] font-bold ${
                isDarkMode ? 'text-white/40' : 'text-black/40'
              }`}>
                Photography • Films • Memories
              </p>
            </div>

            <Link
              href="/studioz"
              className="group inline-flex items-center justify-center gap-4 px-8 py-4 bg-orange-600 text-white font-black uppercase tracking-[0.12em] text-xs transition-all duration-300 hover:bg-black hover:-translate-y-1 shadow-[0_10px_30px_rgba(249,115,22,.15)]"
            >
              Explore Studioz
              <span className="text-lg transition-transform duration-300 group-hover:translate-x-2">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================================
          PORTFOLIO SECTION
      =========================================================== */}
      <HomePortfolio initialItems={portfolioItems} />

      {/* ==========================================================
          CONTACT SECTION
      =========================================================== */}
      <section
        id="contact"
        className={`min-h-[60vh] flex items-center justify-center px-6 transition-colors duration-500 ${
          isDarkMode ? 'bg-[#050505] text-white' : 'bg-[#0a0a0a] text-white'
        }`}
      >
        <div className="text-center">
          <p className="text-orange-400 text-sm uppercase tracking-[0.2em]">
            Contact KR
          </p>
          <h2 className="mt-4 font-display text-5xl md:text-7xl font-bold">
            Let&apos;s Create
            <br />
            Something Remarkable.
          </h2>
          <a
            href="https://wa.me/919626759859"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex mt-8 kr-button px-7 py-4 font-semibold"
          >
            WhatsApp KR
            <span className="ml-3">↗</span>
          </a>
        </div>
      </section>
    </main>
  )
}
