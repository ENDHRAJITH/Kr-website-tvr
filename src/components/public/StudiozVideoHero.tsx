'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import VideoPlayerModal from './VideoPlayerModal'
import { StudiozVideoItem } from './StudiozVideoMarquee'

const DEFAULT_VIDEOS: StudiozVideoItem[] = [
  {
    id: 'hero-1',
    title: 'Grand Cinematic Wedding Story',
    category: 'Wedding Film',
    thumbnail_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: 'hero-2',
    title: 'Pre-Wedding Love Story Highlights',
    category: 'Pre-Wedding',
    thumbnail_url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1600&q=85',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: 'hero-3',
    title: 'Royal Reception Celebration Teaser',
    category: 'Reception',
    thumbnail_url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=85',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: 'hero-4',
    title: 'Traditional Nikkah Ceremony Moments',
    category: 'Nikkah',
    thumbnail_url: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1600&q=85',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: 'hero-5',
    title: 'Adorable Baby Milestone Shoot',
    category: 'Baby Shoot',
    thumbnail_url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1600&q=85',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  }
]

interface StudiozVideoHeroProps {
  videos?: StudiozVideoItem[]
  isDarkMode?: boolean
}

export default function StudiozVideoHero({ videos, isDarkMode = false }: StudiozVideoHeroProps) {
  const [activeVideos, setActiveVideos] = useState<StudiozVideoItem[]>(videos && videos.length > 0 ? videos : DEFAULT_VIDEOS)

  useEffect(() => {
    if (videos && videos.length > 0) {
      setActiveVideos(videos)
      return
    }
    try {
      const saved = localStorage.getItem('kr_studioz_videos')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setActiveVideos(parsed)
        }
      }
    } catch (e) {
      // ignore
    }
  }, [videos])

  const items = activeVideos && activeVideos.length > 0 ? activeVideos : DEFAULT_VIDEOS
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeModalUrl, setActiveModalUrl] = useState<string | null>(null)
  const [activeModalTitle, setActiveModalTitle] = useState<string>('')
  const [isPaused, setIsPaused] = useState(false)

  const activeItem = items[activeIndex] || items[0]

  // Auto-play timer for carousel
  useEffect(() => {
    if (isPaused || activeModalUrl !== null) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isPaused, activeModalUrl, items.length])

  const handlePlayClick = (video: StudiozVideoItem) => {
    setActiveModalUrl(video.video_url)
    setActiveModalTitle(video.title)
  }

  return (
    <section 
      className={`relative pt-36 sm:pt-40 md:pt-44 pb-12 md:pb-24 px-4 sm:px-6 lg:px-8 transition-colors duration-500 border-b ${
        isDarkMode 
          ? 'bg-[#050505] text-white border-white/10' 
          : 'bg-gradient-to-b from-slate-50 via-white to-zinc-50 text-slate-900 border-zinc-200'
      }`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Title */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#F97316] text-xs font-bold uppercase tracking-[0.25em]">
              <span className="w-2 h-2 rounded-full bg-[#F97316] animate-ping" />
              KR Studioz Featured Showcases
            </div>
            <h2 className={`font-display font-bold uppercase tracking-tight text-3xl sm:text-5xl md:text-6xl mt-2 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              CINEMATIC <span className="text-[#F97316]">FILMS &amp; REELS</span>
            </h2>
          </div>

          <p className={`text-xs sm:text-sm max-w-md ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>
            Click play to watch our wedding highlights, pre-wedding films and event coverage.
          </p>
        </div>

        {/* Video Hero Carousel Layout (Left Main Feature + Right Playlist Stack) */}
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 items-stretch">
          
          {/* LEFT FEATURED VIDEO CARD */}
          <div className={`relative rounded-2xl overflow-hidden border group min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] flex flex-col justify-between shadow-2xl transition-all duration-500 ${
            isDarkMode ? 'border-white/15 bg-zinc-900' : 'border-zinc-200 bg-white'
          }`}>
            
            {/* Background Thumbnail Image */}
            <Image
              src={activeItem.thumbnail_url}
              alt={activeItem.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
              unoptimized
            />
            
            {/* Dark Gradient Overlay for title legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/20 group-hover:via-black/45 transition-all duration-500" />

            {/* Top Badges */}
            <div className="relative z-10 p-5 sm:p-7 flex items-center justify-between">
              <span className="bg-[#F97316] text-white px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-md">
                {activeItem.category || 'Featured Film'}
              </span>

              <span className="bg-black/60 backdrop-blur-md text-white/90 border border-white/20 px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                HD 4K VIDEO
              </span>
            </div>

            {/* Center Play Button Overlay */}
            <div className="relative z-10 my-auto flex justify-center items-center py-6">
              <button
                type="button"
                onClick={() => handlePlayClick(activeItem)}
                className="group/btn relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#F97316] hover:bg-white text-white hover:text-black flex items-center justify-center transition-all duration-300 transform group-hover/btn:scale-110 shadow-2xl shadow-orange-500/40 cursor-pointer"
                aria-label={`Play ${activeItem.title}`}
              >
                {/* Glowing Ripple Rings */}
                <span className="absolute inset-0 rounded-full border-2 border-[#F97316] animate-ping opacity-30 pointer-events-none" />
                
                {/* Play Triangle Icon */}
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-8 h-8 sm:w-10 sm:h-10 ml-1.5 transition-transform duration-300 group-hover/btn:scale-110"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>

            {/* Bottom Content & Navigation Dots */}
            <div className="relative z-10 p-5 sm:p-7 space-y-4">
              <div>
                <h3 className="font-display font-bold uppercase text-2xl sm:text-3xl md:text-4xl text-white tracking-tight leading-snug drop-shadow-md">
                  {activeItem.title}
                </h3>
              </div>

              {/* Controls: Dots Pagination + Prev/Next Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-white/20">
                {/* Pagination Dots (ooooo) */}
                <div className="flex items-center gap-2">
                  {items.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === activeIndex
                          ? 'w-8 bg-[#F97316]'
                          : 'w-2.5 bg-white/40 hover:bg-white/80'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Arrow Controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1))}
                    className="w-9 h-9 rounded-full bg-black/40 hover:bg-[#F97316] text-white flex items-center justify-center transition cursor-pointer backdrop-blur-sm"
                    aria-label="Previous video"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveIndex((prev) => (prev + 1) % items.length)}
                    className="w-9 h-9 rounded-full bg-black/40 hover:bg-[#F97316] text-white flex items-center justify-center transition cursor-pointer backdrop-blur-sm"
                    aria-label="Next video"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT VERTICAL PLAYLIST STACK */}
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[520px] no-scrollbar">
            <div className={`flex items-center justify-between px-1 pb-1 text-xs font-bold uppercase tracking-wider ${
              isDarkMode ? 'text-white/50' : 'text-slate-400'
            }`}>
              <span>PLAYLIST CAROUSEL ({items.length})</span>
              <span className="text-[#F97316]">AUTO-PLAY ON</span>
            </div>

            {items.map((video, idx) => {
              const isActive = idx === activeIndex
              return (
                <div
                  key={video.id || idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`group relative rounded-xl border p-3.5 flex gap-4 items-center cursor-pointer transition-all duration-300 ${
                    isActive
                      ? isDarkMode 
                        ? 'border-[#F97316] bg-zinc-900 shadow-lg shadow-orange-500/10'
                        : 'border-[#F97316] bg-orange-50/70 shadow-lg shadow-orange-500/10'
                      : isDarkMode
                        ? 'border-white/10 bg-zinc-950/80 hover:bg-zinc-900 hover:border-white/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {/* Thumbnail Image */}
                  <div className="relative w-24 h-16 sm:w-28 sm:h-18 rounded-lg overflow-hidden shrink-0 bg-slate-200 dark:bg-zinc-800">
                    <Image
                      src={video.thumbnail_url}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                    
                    {/* Small Play Badge */}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-all">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        isActive ? 'bg-[#F97316] text-white scale-110' : 'bg-white/90 text-slate-900 group-hover:bg-[#F97316] group-hover:text-white'
                      }`}>
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 ml-0.5">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                        isActive 
                          ? 'bg-[#F97316]/20 text-[#F97316]' 
                          : isDarkMode ? 'bg-white/10 text-white/60' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {video.category || 'Film'}
                      </span>
                      {isActive && (
                        <span className="text-[9px] font-bold text-[#F97316] animate-pulse flex items-center gap-1">
                          ● PLAYING
                        </span>
                      )}
                    </div>
                    <h4 className={`text-xs sm:text-sm font-semibold truncate transition-colors ${
                      isActive 
                        ? isDarkMode ? 'text-white font-bold' : 'text-slate-900 font-bold'
                        : isDarkMode ? 'text-white/80 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'
                    }`}>
                      {video.title}
                    </h4>
                  </div>

                  {/* Play Directly Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePlayClick(video)
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition cursor-pointer shrink-0 ${
                      isDarkMode 
                        ? 'bg-white/5 hover:bg-[#F97316] text-white/50 hover:text-white' 
                        : 'bg-slate-100 hover:bg-[#F97316] text-slate-500 hover:text-white'
                    }`}
                    title="Watch in Lightbox"
                  >
                    ↗
                  </button>
                </div>
              )
            })}
          </div>

        </div>
      </div>

      {/* LIGHTBOX MODAL PLAYER */}
      {activeModalUrl && (
        <VideoPlayerModal
          videoUrl={activeModalUrl}
          title={activeModalTitle}
          onClose={() => setActiveModalUrl(null)}
        />
      )}
    </section>
  )
}