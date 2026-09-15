'use client'

import Image from 'next/image'
import Link from 'next/link'
import { TeamMember, Testimonial, SiteStat } from '@/types/database'
import { useTheme } from '@/context/ThemeContext'
import FoundersPortfolioDeck from './FoundersPortfolioDeck'
import StatsCounter from './StatsCounter'

interface AboutViewProps {
  initialTeamMembers: TeamMember[]
  initialTestimonials: Testimonial[]
  initialStats: SiteStat[]
}

export default function AboutView({
  initialTeamMembers = [],
  initialTestimonials = [],
  initialStats = []
}: AboutViewProps) {
  const { isDarkMode } = useTheme()

  const teamMembers = initialTeamMembers
  const testimonials = initialTestimonials
  const stats = initialStats

  return (
    <main className={`transition-colors duration-500 ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-white text-slate-900'}`}>
      {/* 01 — HERO */}
      <section className={`relative min-h-screen flex items-center px-5 md:px-10 lg:px-16 pt-36 pb-24 overflow-hidden border-b ${
        isDarkMode ? 'bg-[#050505] border-white/10' : 'kr-grid border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-3 h-3 rounded-full bg-[#F97316]" />
            <span className="text-xs md:text-sm uppercase tracking-[0.3em] font-bold text-[#F97316]">
              01 / About KR
            </span>
          </div>

          <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-12 lg:gap-20 items-end">
            <div>
              <p className={`text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-7 ${
                isDarkMode ? 'text-white/40' : 'text-slate-400'
              }`}>
                More Than A Company
              </p>
              <h1 className={`font-display font-black uppercase tracking-[-0.07em] leading-[0.8] text-[4rem] sm:text-[5rem] md:text-[7rem] lg:text-[9rem] xl:text-[10rem] ${
                isDarkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                MORE<br />
                <span className="text-[#F97316]">THAN</span><br />
                A COMPANY.
              </h1>
            </div>

            <div>
              <div className="border-l-4 border-[#F97316] pl-5 md:pl-7">
                <p className={`font-display text-2xl md:text-4xl font-bold leading-tight ${
                  isDarkMode ? 'text-white' : 'text-zinc-900'
                }`}>
                  We capture moments.<br />
                  We build brands.<br />
                  <span className="text-[#F97316]">We create impact.</span>
                </p>
              </div>

              <p className={`mt-8 text-sm md:text-base leading-relaxed max-w-lg ${
                isDarkMode ? 'text-white/60' : 'text-black/60'
              }`}>
                KR Digital Marketing &amp; Studioz brings creativity, storytelling and digital expertise together under one creative ecosystem.
                <br /><br />
                From meaningful celebrations and visual storytelling to branding, advertising and digital growth, we help people and businesses create experiences worth remembering.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className={`border px-4 py-3 text-xs font-bold uppercase ${
                  isDarkMode ? 'border-white/15 text-white' : 'border-black/10 text-zinc-900'
                }`}>
                  Creativity
                </span>
                <span className={`border px-4 py-3 text-xs font-bold uppercase ${
                  isDarkMode ? 'border-white/15 text-white' : 'border-black/10 text-zinc-900'
                }`}>
                  Storytelling
                </span>
                <span className={`border px-4 py-3 text-xs font-bold uppercase ${
                  isDarkMode ? 'border-white/15 text-white' : 'border-black/10 text-zinc-900'
                }`}>
                  Growth
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — WHO IS KR */}
      <section className={`relative py-24 md:py-32 px-5 md:px-10 lg:px-16 transition-colors duration-500 ${
        isDarkMode ? 'bg-[#0a0a0a]' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[.8fr_1.2fr] gap-12 lg:gap-20">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#F97316] font-bold">
                02 / Who Is KR?
              </p>
              <h2 className={`mt-6 font-display text-5xl md:text-7xl font-black uppercase tracking-[-0.06em] leading-[.85] ${
                isDarkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                WE CREATE.<br />
                WE CAPTURE.<br />
                <span className="text-[#F97316]">WE CONNECT.</span>
              </h2>
            </div>

            <div>
              <p className={`text-lg md:text-2xl font-semibold leading-relaxed ${
                isDarkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                KR is a creative team built around two powerful worlds — visual storytelling and digital growth.
              </p>

              <p className={`mt-6 text-sm md:text-base leading-relaxed max-w-2xl ${
                isDarkMode ? 'text-white/60' : 'text-black/55'
              }`}>
                KR Studioz focuses on photography, films, events and visual storytelling, helping people preserve the moments that matter most.
                <br /><br />
                KR Digital Marketing focuses on branding, advertising, content and digital marketing, helping businesses build stronger identities and connect with the right audience.
                <br /><br />
                Together, both sides of KR create a complete creative ecosystem where ideas can be captured, created and taken to the world.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mt-10">
                <div className={`border p-6 hover:border-[#F97316] transition ${
                  isDarkMode ? 'border-white/10 bg-zinc-900' : 'border-black/10 bg-white'
                }`}>
                  <span className="text-[#F97316] font-black text-2xl">01</span>
                  <h3 className={`mt-5 font-bold uppercase ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Creativity</h3>
                  <p className={`mt-2 text-xs leading-relaxed ${isDarkMode ? 'text-white/50' : 'text-black/50'}`}>
                    Ideas that make every project unique and memorable.
                  </p>
                </div>

                <div className={`border p-6 hover:border-[#F97316] transition ${
                  isDarkMode ? 'border-white/10 bg-zinc-900' : 'border-black/10 bg-white'
                }`}>
                  <span className="text-[#F97316] font-black text-2xl">02</span>
                  <h3 className={`mt-5 font-bold uppercase ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Storytelling</h3>
                  <p className={`mt-2 text-xs leading-relaxed ${isDarkMode ? 'text-white/50' : 'text-black/50'}`}>
                    Stories that create emotion, meaning and connection.
                  </p>
                </div>

                <div className={`border p-6 hover:border-[#F97316] transition ${
                  isDarkMode ? 'border-white/10 bg-zinc-900' : 'border-black/10 bg-white'
                }`}>
                  <span className="text-[#F97316] font-black text-2xl">03</span>
                  <h3 className={`mt-5 font-bold uppercase ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Impact</h3>
                  <p className={`mt-2 text-xs leading-relaxed ${isDarkMode ? 'text-white/50' : 'text-black/50'}`}>
                    Work designed to create attention and meaningful results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SITE STATS COUNTER GRID */}
      <StatsCounter stats={stats} />

      {/* 03 — TWO WORLDS */}
      <section className={`py-24 md:py-32 px-5 md:px-10 lg:px-16 ${
        isDarkMode ? 'bg-[#050505]' : 'kr-grid'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#F97316] font-bold">
              03 / Two Worlds
            </p>
            <h2 className={`mt-5 font-display text-5xl md:text-7xl font-black uppercase tracking-[-0.06em] ${
              isDarkMode ? 'text-white' : 'text-zinc-900'
            }`}>
              ONE TEAM <span className="text-[#F97316]">×</span> TWO WORLDS.
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mt-14">
            {/* STUDIOZ */}
            <div className={`border p-7 md:p-10 hover:border-[#F97316] transition-all duration-500 ${
              isDarkMode ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/10'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#F97316]">
                  World 01
                </span>
                <span className="text-2xl text-[#F97316]">↗</span>
              </div>

              <h3 className={`mt-8 font-display text-4xl md:text-6xl font-black uppercase tracking-[-0.06em] ${
                isDarkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                KR <br />
                <span className="text-[#F97316]">STUDIOZ</span>
              </h3>

              <p className={`mt-6 text-lg font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                WE CAPTURE YOUR MOMENTS.
              </p>

              <p className={`mt-4 text-sm leading-relaxed max-w-xl ${
                isDarkMode ? 'text-white/60' : 'text-black/55'
              }`}>
                KR Studioz is focused on capturing meaningful moments through photography, films and visual storytelling. From intimate celebrations to large functions and professional shoots, we create visuals that preserve the emotion and character of every occasion.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                <span className={`border px-3 py-2 text-xs ${isDarkMode ? 'border-white/15 text-white' : 'border-black/10 text-zinc-900'}`}>Wedding</span>
                <span className={`border px-3 py-2 text-xs ${isDarkMode ? 'border-white/15 text-white' : 'border-black/10 text-zinc-900'}`}>Pre-Wedding</span>
                <span className={`border px-3 py-2 text-xs ${isDarkMode ? 'border-white/15 text-white' : 'border-black/10 text-zinc-900'}`}>Baby Shoot</span>
                <span className={`border px-3 py-2 text-xs ${isDarkMode ? 'border-white/15 text-white' : 'border-black/10 text-zinc-900'}`}>Events</span>
                <span className={`border px-3 py-2 text-xs ${isDarkMode ? 'border-white/15 text-white' : 'border-black/10 text-zinc-900'}`}>Product Shoot</span>
                <span className={`border px-3 py-2 text-xs ${isDarkMode ? 'border-white/15 text-white' : 'border-black/10 text-zinc-900'}`}>Live Broadcast</span>
              </div>

              <Link
                href="/studioz"
                className="inline-flex mt-10 bg-[#F97316] text-white px-6 py-4 text-xs font-bold uppercase tracking-[0.12em] hover:bg-black transition"
              >
                Explore Studioz →
              </Link>
            </div>

            {/* DIGITAL */}
            <div className={`p-7 md:p-10 hover:border-[#F97316] border transition-all duration-500 ${
              isDarkMode ? 'bg-zinc-950 text-white border-white/10' : 'bg-[#050505] text-white border-[#050505]'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#F97316]">
                  World 02
                </span>
                <span className="text-2xl text-[#F97316]">↗</span>
              </div>

              <h3 className="mt-8 font-display text-4xl md:text-6xl font-black uppercase tracking-[-0.06em]">
                KR <br />
                <span className="text-[#F97316]">DIGITAL</span>
              </h3>

              <p className="mt-6 text-lg font-bold">
                WE BUILD YOUR BRAND.
              </p>

              <p className="mt-4 text-sm text-white/50 leading-relaxed max-w-xl">
                KR Digital Marketing helps businesses build stronger digital identities through strategy, branding, advertising and content. We combine creative thinking with digital marketing to help brands communicate clearly and reach the people who matter.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                <span className="border border-white/15 px-3 py-2 text-xs">SEO</span>
                <span className="border border-white/15 px-3 py-2 text-xs">Google Ads</span>
                <span className="border border-white/15 px-3 py-2 text-xs">Branding</span>
                <span className="border border-white/15 px-3 py-2 text-xs">Instagram Ads</span>
                <span className="border border-white/15 px-3 py-2 text-xs">YouTube Ads</span>
                <span className="border border-white/15 px-3 py-2 text-xs">Influencer Marketing</span>
              </div>

              <Link
                href="/digital-marketing"
                className="inline-flex mt-10 bg-[#F97316] text-white px-6 py-4 text-xs font-bold uppercase tracking-[0.12em] hover:bg-white hover:text-black transition"
              >
                Explore Digital Marketing →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — PEOPLE BEHIND KR */}
      <section className={`py-24 md:py-32 px-5 md:px-10 lg:px-16 ${
        isDarkMode ? 'bg-[#0a0a0a]' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#F97316] font-bold">
              04 / People Behind KR
            </p>
            <h2 className={`mt-5 font-display text-5xl md:text-8xl font-black uppercase tracking-[-0.06em] leading-[.85] ${
              isDarkMode ? 'text-white' : 'text-zinc-900'
            }`}>
              THE PEOPLE<br />
              BEHIND <span className="text-[#F97316]">KR.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-14">
            {teamMembers.map((member) => (
              <div key={member.id} className={`border overflow-hidden group ${
                isDarkMode ? 'border-white/10 bg-zinc-900' : 'border-black/10 bg-white'
              }`}>
                <div className="h-[420px] md:h-[520px] bg-[#FDE7D3] relative flex items-center justify-center overflow-hidden">
                  {member.photo_url ? (
                    <Image
                      src={member.photo_url}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      unoptimized
                    />
                  ) : (
                    <div className="font-display font-black text-6xl text-[#F97316]/40">
                      {member.name.slice(0, 2)}
                    </div>
                  )}
                </div>

                <div className="p-7 md:p-9">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#F97316] font-bold">
                    {member.role}
                  </p>
                  <h3 className={`mt-3 font-display text-4xl md:text-5xl font-black uppercase ${
                    isDarkMode ? 'text-white' : 'text-zinc-900'
                  }`}>
                    {member.name}
                  </h3>
                  <p className={`mt-5 text-sm leading-relaxed ${
                    isDarkMode ? 'text-white/60' : 'text-black/55'
                  }`}>
                    {member.bio}
                  </p>

                  {/* Team Member Social Links */}
                  {member.social_links && Object.keys(member.social_links).length > 0 && (
                    <div className="flex items-center gap-2.5 mt-6 pt-5 border-t border-black/10 dark:border-white/10">
                      {member.social_links.youtube && (
                        <a
                          href={member.social_links.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`${member.name}'s YouTube Channel`}
                          className="w-10 h-10 rounded-full bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/20 flex items-center justify-center transition-all duration-200 hover:scale-105"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.9V8.1l6.5 3.9-6.5 3.9Z" />
                          </svg>
                        </a>
                      )}

                      {member.social_links.instagram && (
                        <a
                          href={member.social_links.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`${member.name}'s Instagram`}
                          className="w-10 h-10 rounded-full bg-pink-600/10 text-pink-500 hover:bg-pink-600 hover:text-white border border-pink-500/20 flex items-center justify-center transition-all duration-200 hover:scale-105"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="5" />
                            <circle cx="12" cy="12" r="4" />
                            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                          </svg>
                        </a>
                      )}

                      {member.social_links.facebook && (
                        <a
                          href={member.social_links.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`${member.name}'s Facebook`}
                          className="w-10 h-10 rounded-full bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white border border-blue-500/20 flex items-center justify-center transition-all duration-200 hover:scale-105"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 8h3V4h-3c-3.3 0-5 1.7-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.7.3-1 1-1Z" />
                          </svg>
                        </a>
                      )}

                      {member.social_links.whatsapp && (
                        <a
                          href={member.social_links.whatsapp.startsWith('http') ? member.social_links.whatsapp : `https://wa.me/${member.social_links.whatsapp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`${member.name}'s WhatsApp`}
                          className="w-10 h-10 rounded-full bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white border border-emerald-500/20 flex items-center justify-center transition-all duration-200 hover:scale-105"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.5 14.4c-.3-.1-1.7-.8-2-1-.3-.1-.5-.1-.7.2s-.8 1-1 1.2c-.2.2-.4.2-.7.1-1.9-.9-3.1-1.7-4.3-3.8-.3-.5.3-.5.9-1.6.1-.2.1-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.5a1 1 0 0 0-.7.3c-.3.3-1 1-1 2.5s1 2.8 1.2 3c.2.2 2 3.1 5 4.3.7.3 1.2.5 1.7.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.7.2-1.3.1-1.3Z" />
                            <path d="M12 0C5.4 0 0 5.4 0 12c0 2.1.5 4.1 1.5 5.8L0 24l6.4-1.5C8.1 23.4 10 24 12 24c6.6 0 12-5.4 12-12S18.6 0 12 0Zm0 21.8c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-3.8.9.9-3.7-.2-.4A9.8 9.8 0 0 1 2.2 12C2.2 6.6 6.6 2.2 12 2.2s9.8 4.4 9.8 9.8-4.4 9.8-9.8 9.8Z" />
                          </svg>
                        </a>
                      )}

                      {member.social_links.linkedin && (
                        <a
                          href={member.social_links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`${member.name}'s LinkedIn`}
                          className="w-10 h-10 rounded-full bg-sky-600/10 text-sky-500 hover:bg-sky-600 hover:text-white border border-sky-500/20 flex items-center justify-center transition-all duration-200 hover:scale-105"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDERS PORTFOLIO DECKS */}
      <FoundersPortfolioDeck />

      {/* 05 — CTA */}
      <section className={`py-24 md:py-32 px-5 md:px-8 ${
        isDarkMode ? 'bg-[#050505]' : 'kr-grid'
      }`}>
        <div className={`max-w-5xl mx-auto text-center border p-8 md:p-16 ${
          isDarkMode ? 'border-[#F97316] bg-zinc-950 text-white' : 'border-[#F97316] bg-white text-zinc-900 shadow-[8px_8px_0px_#F97316]'
        }`}>
          <p className="text-[#F97316] text-xs font-bold uppercase tracking-[.25em]">
            Start Something Great
          </p>
          <h2 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-[.9] tracking-[-.05em] mt-5">
            BUILD SOMETHING<br />
            <span className="text-[#F97316]">MEMORABLE.</span>
          </h2>
          <p className={`mt-6 text-sm max-w-lg mx-auto ${
            isDarkMode ? 'text-white/60' : 'text-black/50'
          }`}>
            Ready to tell your story, build your brand, or capture your moments with KR? Let&apos;s talk.
          </p>

          <a
            href="https://wa.me/919626759859"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 mt-8 bg-[#F97316] text-white px-7 py-4 text-xs font-bold uppercase tracking-[.15em] hover:bg-zinc-900 transition"
          >
            Talk to KR <span>↗</span>
          </a>
        </div>
      </section>
    </main>
  )
}
