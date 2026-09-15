'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTheme } from '@/context/ThemeContext'
import { FounderDeck, TeamMember } from '@/types/database'
import { createClient } from '@/lib/supabase/client'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minimize2,
  FileText,
  Sparkles,
  Layers,
  CheckCircle2,
  UserCheck,
  ExternalLink,
} from 'lucide-react'

interface FoundersPortfolioDeckProps {
  decks?: FounderDeck[]
  title?: string
  subtitle?: string
}

export default function FoundersPortfolioDeck({
  decks: propDecks,
  title = 'Founder Portfolio & Presentation Decks',
  subtitle = 'Explore interactive pitch decks, creative credentials & brand portfolios from our Founders.',
}: FoundersPortfolioDeckProps) {
  const { isDarkMode } = useTheme()
  const supabase = createClient()
  const [fetchedDecks, setFetchedDecks] = useState<FounderDeck[]>([])

  useEffect(() => {
    const fetchDecksAndTeam = async () => {
      try {
        const [decksRes, teamRes] = await Promise.all([
          supabase.from('founder_decks').select('*').order('display_order', { ascending: true }),
          supabase.from('team_members').select('*').order('display_order', { ascending: true }),
        ])

        const decksData = (decksRes.data as FounderDeck[]) || []
        const teamData = (teamRes.data as TeamMember[]) || []

        const baseDecks = propDecks && propDecks.length > 0 ? propDecks : decksData

        if (baseDecks.length > 0) {
          const enrichedDecks: FounderDeck[] = baseDecks.map((deck) => {
            const matchedMember = teamData.find(
              (m) =>
                m.name.toLowerCase().includes(deck.founder_name.toLowerCase()) ||
                deck.founder_name.toLowerCase().includes(m.name.toLowerCase()) ||
                (deck.division && m.role?.toLowerCase().includes(deck.division))
            )

            if (matchedMember) {
              return {
                ...deck,
                founder_role: deck.founder_role || matchedMember.role || 'Founder',
                avatar_url: deck.avatar_url || matchedMember.photo_url || undefined,
                bio: deck.bio || matchedMember.bio || undefined,
                social_links: {
                  ...(matchedMember.social_links as Record<string, string>),
                  ...(deck.social_links as Record<string, string>),
                },
              }
            }
            return deck
          })
          setFetchedDecks(enrichedDecks)
        } else if (teamData.length > 0) {
          const fallbackDecks: FounderDeck[] = teamData.map((m, idx) => ({
            id: m.id || `team-deck-${idx}`,
            founder_name: m.name,
            founder_role: m.role || 'Founder',
            avatar_url: m.photo_url || undefined,
            bio: m.bio || undefined,
            division: (m.role?.toLowerCase().includes('studioz') ? 'studioz' : 'marketing') as 'studioz' | 'marketing',
            slides: [],
            social_links: m.social_links || undefined,
            display_order: m.display_order || idx + 1,
          }))
          setFetchedDecks(fallbackDecks)
        }
      } catch (err) {
        console.warn('Error fetching founder decks & team members:', err)
      }
    }

    fetchDecksAndTeam()
  }, [propDecks, supabase])

  const activeDecks = (propDecks && propDecks.length > 0) ? propDecks : fetchedDecks

  // State
  const [activeFounderIndex, setActiveFounderIndex] = useState(0)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [viewMode, setViewMode] = useState<'slides' | 'pdf'>('slides')

  if (!activeDecks || activeDecks.length === 0) {
    return null
  }

  const currentFounder = activeDecks[activeFounderIndex] || activeDecks[0]
  const slides = currentFounder?.slides || []
  const totalSlides = slides.length
  const hasPdf = Boolean(currentFounder?.pdf_url && currentFounder.pdf_url.trim().length > 0)
  const effectiveViewMode = hasPdf ? viewMode : 'slides'

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % Math.max(totalSlides, 1))
  }

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) => (prev - 1 + totalSlides) % Math.max(totalSlides, 1))
  }

  const handleFounderChange = (index: number) => {
    setActiveFounderIndex(index)
    setActiveSlideIndex(0)
  }

  return (
    <section
      className={`py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden ${
        isDarkMode ? 'bg-[#050505] text-white' : 'bg-zinc-50 text-zinc-900'
      }`}
    >
      {/* Background Accent Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-orange-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-10">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-orange-500/10 text-orange-500 border border-orange-500/20">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Interactive Brand Decks</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            {title}
          </h2>
          <p className={`text-sm sm:text-base ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
            {subtitle}
          </p>
        </div>

        {/* Founder Tabs Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {activeDecks.map((deck, idx) => {
            const isActive = idx === activeFounderIndex
            return (
              <button
                key={deck.id}
                onClick={() => handleFounderChange(idx)}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? 'bg-orange-500 text-black border-orange-400 shadow-lg shadow-orange-500/25 scale-[1.02]'
                    : isDarkMode
                    ? 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:text-zinc-900 shadow-sm'
                }`}
              >
                {deck.avatar_url ? (
                  <img
                    src={deck.avatar_url}
                    alt={deck.founder_name}
                    className="w-7 h-7 rounded-full object-cover border border-black/20"
                  />
                ) : (
                  <UserCheck className="w-4 h-4" />
                )}
                <div className="text-left">
                  <div className="leading-tight">{deck.founder_name}'s Deck</div>
                  <div className={`text-[10px] font-medium opacity-80 truncate max-w-[150px]`}>
                    {deck.division === 'studioz' ? 'KR Studioz Founder' : 'KR Digital Founder'}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Founder Info & Actions Bar */}
        <div
          className={`p-5 sm:p-6 rounded-2xl border transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
            isDarkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-4">
            {currentFounder.avatar_url && (
              <img
                src={currentFounder.avatar_url}
                alt={currentFounder.founder_name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-500/40 shrink-0"
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">{currentFounder.founder_name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-500 border border-orange-500/20">
                  {currentFounder.founder_role}
                </span>
              </div>
              <p className={`text-xs mt-1 max-w-xl ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {currentFounder.bio}
              </p>

              {/* Founder Social Link Icons */}
              <div className="flex items-center gap-2 mt-2.5">
                {(currentFounder.youtube_url || (currentFounder.social_links as any)?.youtube) && (
                  <a
                    href={currentFounder.youtube_url || (currentFounder.social_links as any)?.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${currentFounder.founder_name}'s YouTube`}
                    className="w-7 h-7 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.9V8.1l6.5 3.9-6.5 3.9Z" />
                    </svg>
                  </a>
                )}
                {(currentFounder.instagram_url || (currentFounder.social_links as any)?.instagram) && (
                  <a
                    href={currentFounder.instagram_url || (currentFounder.social_links as any)?.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${currentFounder.founder_name}'s Instagram`}
                    className="w-7 h-7 rounded-full bg-pink-500/10 text-pink-500 hover:bg-pink-500 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                    </svg>
                  </a>
                )}
                {(currentFounder.facebook_url || (currentFounder.social_links as any)?.facebook) && (
                  <a
                    href={currentFounder.facebook_url || (currentFounder.social_links as any)?.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${currentFounder.founder_name}'s Facebook`}
                    className="w-7 h-7 rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 8h3V4h-3c-3.3 0-5 1.7-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.7.3-1 1-1Z" />
                    </svg>
                  </a>
                )}
                {(currentFounder.whatsapp_url || (currentFounder.social_links as any)?.whatsapp) && (
                  <a
                    href={currentFounder.whatsapp_url || (currentFounder.social_links as any)?.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${currentFounder.founder_name}'s WhatsApp`}
                    className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-1-.3-.1-.5-.1-.7.2s-.8 1-1 1.2c-.2.2-.4.2-.7.1-1.9-.9-3.1-1.7-4.3-3.8-.3-.5.3-.5.9-1.6.1-.2.1-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.5a1 1 0 0 0-.7.3c-.3.3-1 1-1 2.5s1 2.8 1.2 3c.2.2 2 3.1 5 4.3.7.3 1.2.5 1.7.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.7.2-1.3.1-1.3Z" />
                      <path d="M12 0C5.4 0 0 5.4 0 12c0 2.1.5 4.1 1.5 5.8L0 24l6.4-1.5C8.1 23.4 10 24 12 24c6.6 0 12-5.4 12-12S18.6 0 12 0Zm0 21.8c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-3.8.9.9-3.7-.2-.4A9.8 9.8 0 0 1 2.2 12C2.2 6.6 6.6 2.2 12 2.2s9.8 4.4 9.8 9.8-4.4 9.8-9.8 9.8Z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
            {/* View Mode Toggle - ONLY SHOWN IF PDF FILE EXISTS */}
            {hasPdf && (
              <div
                className={`p-1 rounded-xl border flex items-center gap-1 text-xs font-semibold ${
                  isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
                }`}
              >
                <button
                  onClick={() => setViewMode('slides')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    effectiveViewMode === 'slides'
                      ? 'bg-orange-500 text-black font-bold'
                      : isDarkMode
                      ? 'text-zinc-400 hover:text-white'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Interactive Slides
                </button>
                <button
                  onClick={() => setViewMode('pdf')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    effectiveViewMode === 'pdf'
                      ? 'bg-orange-500 text-black font-bold'
                      : isDarkMode
                      ? 'text-zinc-400 hover:text-white'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  PDF View
                </button>
              </div>
            )}

            {/* Download PDF Button - ONLY SHOWN IF PDF FILE EXISTS */}
            {hasPdf && (
              <a
                href={currentFounder.pdf_url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-black transition-colors shadow-md shadow-orange-500/20 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </a>
            )}

            {/* Fullscreen Button */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDarkMode
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
                  : 'bg-zinc-100 border-zinc-300 text-zinc-700 hover:text-zinc-900'
              }`}
              title="Fullscreen Mode"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* DECK PRESENTATION FRAME (A4 Landscape Horizontal Aspect Ratio: 1.414 : 1) */}
        {effectiveViewMode === 'slides' ? (
          <div className="relative max-w-4xl mx-auto">
            {/* A4 Horizontal Sheet Container */}
            <div
              className={`relative aspect-[1.414/1] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 border ${
                isDarkMode
                  ? 'bg-zinc-900 border-zinc-800 shadow-orange-500/5'
                  : 'bg-white border-zinc-300 shadow-zinc-400/30'
              }`}
            >
              {/* Active Slide Display */}
              {slides.length > 0 ? (
                <div className="relative w-full h-full group">
                  <Image
                    src={slides[activeSlideIndex]}
                    alt={`${currentFounder.founder_name} Slide ${activeSlideIndex + 1}`}
                    fill
                    className="object-cover transition-all duration-300"
                    priority
                    unoptimized
                  />

                  {/* Gradient Overlay for Controls */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity" />

                  {/* Top Slide Header */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold tracking-wider uppercase border border-white/10">
                      <FileText className="w-3 h-3 text-orange-500" />
                      <span>{currentFounder.founder_name}'s Deck</span>
                    </div>

                    <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-mono font-bold border border-white/10">
                      Page {String(activeSlideIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Next / Prev Hover Overlay Controls */}
                  <button
                    onClick={handlePrevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/70 hover:bg-orange-500 text-white hover:text-black flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-white/10 shadow-lg cursor-pointer"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    onClick={handleNextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/70 hover:bg-orange-500 text-white hover:text-black flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-white/10 shadow-lg cursor-pointer"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Bottom Slide Info & Dots */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col items-center gap-3">
                    {/* Slide Dots */}
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                      {slides.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveSlideIndex(idx)}
                          className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                            idx === activeSlideIndex
                              ? 'w-6 bg-orange-500'
                              : 'w-2 bg-white/40 hover:bg-white/70'
                          }`}
                          aria-label={`Go to page ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
                  <FileText className="w-12 h-12 text-zinc-500 animate-bounce" />
                  <h4 className="font-bold text-lg">No Slide Pages Uploaded</h4>
                  <p className="text-xs text-zinc-400 max-w-sm">
                    {currentFounder.founder_name}'s presentation deck is currently available as a downloadable PDF document.
                  </p>
                  {currentFounder.pdf_url && (
                    <a
                      href={currentFounder.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-orange-500 text-black font-bold text-xs"
                    >
                      View PDF File ↗
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Controls Bar */}
            <div className="flex items-center justify-between text-xs pt-4 px-2 font-medium">
              <span className={isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}>
                Tip: Click arrows or dots to flip deck pages
              </span>

              <button
                onClick={() => setIsFullscreen(true)}
                className="text-orange-500 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Open Fullscreen Reader</span>
              </button>
            </div>
          </div>
        ) : (
          /* PDF Embedded Iframe Mode */
          <div className="relative max-w-4xl mx-auto space-y-3">
            <div
              className={`relative w-full min-h-[550px] sm:min-h-[700px] rounded-2xl overflow-hidden border shadow-2xl ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'
              }`}
            >
              {currentFounder.pdf_url ? (
                <iframe
                  src={currentFounder.pdf_url}
                  title={`${currentFounder.founder_name} PDF Portfolio`}
                  className="w-full h-full min-h-[550px] sm:min-h-[700px] border-0"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-[550px] text-center p-8 space-y-4">
                  <FileText className="w-12 h-12 text-orange-500 animate-pulse" />
                  <p className="text-sm font-semibold">PDF File Link Pending for {currentFounder.founder_name}</p>
                </div>
              )}
            </div>

            {/* Bottom Controls Bar for PDF View */}
            <div className="flex items-center justify-between text-xs pt-2 px-2 font-medium">
              <span className={isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}>
                Tip: Toggle &quot;Interactive Slides&quot; to flip pages or open PDF Fullscreen
              </span>

              <button
                onClick={() => setIsFullscreen(true)}
                className="text-orange-500 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Open PDF Fullscreen Reader</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FULLSCREEN LIGHTBOX READER MODAL */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[130] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Top Modal Header */}
          <div
            className="flex items-center justify-between text-white z-10 pb-4 border-b border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
              <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider">
                {currentFounder.founder_name}&apos;s {viewMode === 'pdf' ? 'PDF Document' : 'Deck Slide'} — Fullscreen Reader
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {viewMode === 'slides' && (
                <span className="text-xs font-mono text-zinc-400">
                  Page {activeSlideIndex + 1} / {totalSlides}
                </span>
              )}
              <button
                onClick={() => setIsFullscreen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-orange-500 hover:text-black flex items-center justify-center text-xl font-bold transition cursor-pointer"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
          </div>

          {/* Main Fullscreen Body View */}
          <div
            className="relative flex-1 flex items-center justify-center py-4 my-2 max-h-[84vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {viewMode === 'pdf' ? (
              currentFounder.pdf_url ? (
                <iframe
                  src={currentFounder.pdf_url}
                  title={`${currentFounder.founder_name} Fullscreen PDF`}
                  className="w-full h-full min-h-[75vh] border-0 rounded-xl bg-white shadow-2xl"
                />
              ) : (
                <div className="text-white text-sm">No PDF URL provided for {currentFounder.founder_name}</div>
              )
            ) : (
              <>
                {slides[activeSlideIndex] ? (
                  <img
                    src={slides[activeSlideIndex]}
                    alt={`${currentFounder.founder_name} Fullscreen Slide ${activeSlideIndex + 1}`}
                    className="max-h-full max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
                  />
                ) : null}

                {/* Prev / Next Modal Buttons */}
                <button
                  onClick={handlePrevSlide}
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/80 hover:bg-orange-500 text-white hover:text-black flex items-center justify-center transition border border-white/20 cursor-pointer"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>

                <button
                  onClick={handleNextSlide}
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/80 hover:bg-orange-500 text-white hover:text-black flex items-center justify-center transition border border-white/20 cursor-pointer"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Fullscreen Navigation Bar */}
          <div
            className="flex items-center justify-between text-xs text-white/60 pt-3 border-t border-white/10 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <span>KR Digital Marketing &amp; Studioz</span>

            {/* Slide Indicators for Slides Mode */}
            {viewMode === 'slides' && (
              <div className="flex items-center gap-1.5">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlideIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === activeSlideIndex ? 'w-5 bg-orange-500' : 'w-2 bg-white/30'
                    }`}
                  />
                ))}
              </div>
            )}

            {currentFounder.pdf_url && (
              <a
                href={currentFounder.pdf_url}
                download
                className="text-orange-500 font-bold hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Original PDF</span>
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
