'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MarketingService } from '@/types/database'
import { useTheme } from '@/context/ThemeContext'
import {
  CheckCircle2,
  Share2,
  Check,
  Sparkles,
  ArrowLeft,
  ShoppingBag,
  ExternalLink,
  MessageCircle
} from 'lucide-react'

interface Props {
  service: MarketingService
  relatedServices: MarketingService[]
}

export default function DigitalMarketingDetailClient({ service, relatedServices }: Props) {
  const { isDarkMode } = useTheme()
  const [copied, setCopied] = useState(false)
  const [added, setAdded] = useState(false)

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://karthicktamilan.com/digital-marketing/${service.id}`

  const whatsappShareText = encodeURIComponent(
    `🔥 Check out ${service.name} (${service.price} ${service.price_unit || ''}) by Karthick Tamilan:\n\n${service.subtitle || ''}\n\n👉 View details: ${currentUrl}`
  )

  const whatsappInquiryText = encodeURIComponent(
    `Hi Karthick Tamilan, I am interested in ${service.name} (${service.price} ${service.price_unit || ''}). Please share campaign availability & next steps.\n\nLink: ${currentUrl}`
  )

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleAddToCart = () => {
    const CART_KEY = 'kr_global_enquiry_cart_v2'
    const stored = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    const exists = stored.some((x: { name: string }) => x.name === service.name)
    if (!exists) {
      stored.push({
        id: service.id,
        name: service.name,
        price: service.price || 'Custom Quote',
        division: 'marketing'
      })
      localStorage.setItem(CART_KEY, JSON.stringify(stored))
      window.dispatchEvent(new Event('kr-cart-update'))
    }
    window.dispatchEvent(new Event('kr-open-drawer'))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className={`min-h-screen pt-32 pb-24 transition-colors duration-500 ${
      isDarkMode ? 'bg-[#050505] text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        {/* Back Link & Breadcrumb */}
        <div className="flex items-center justify-between pb-8 border-b border-zinc-200 dark:border-white/10">
          <Link
            href="/digital-marketing"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F97316] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Marketing Plans</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Share on WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${whatsappShareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm transition"
              title="Share on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Share on WhatsApp</span>
            </a>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                copied
                  ? 'bg-orange-500 text-white border-orange-500'
                  : isDarkMode
                  ? 'bg-zinc-900 border-white/15 text-white hover:border-[#F97316]'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-[#F97316]'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Main Service Hero Card */}
        <div className="mt-10 grid lg:grid-cols-[1fr_380px] gap-10 items-start">
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/30 mb-4">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>{service.project_tag || `PLAN 0${service.service_no || 1}`}</span>
              </div>

              <h1 className={`font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight leading-[0.95] ${
                isDarkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                {service.name}
              </h1>

              {service.subtitle && (
                <p className="mt-3 text-base sm:text-lg font-semibold text-[#F97316]">
                  {service.subtitle}
                </p>
              )}

              <p className={`mt-5 text-sm sm:text-base leading-relaxed ${
                isDarkMode ? 'text-white/70' : 'text-slate-600'
              }`}>
                {service.description}
              </p>
            </div>

            {/* Inclusions & Features */}
            {service.features && service.features.length > 0 && (
              <div className={`p-6 sm:p-8 rounded-2xl border ${
                isDarkMode ? 'bg-zinc-900/90 border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <h2 className="font-display font-black text-lg uppercase tracking-wider text-zinc-900 dark:text-white mb-5 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
                  <span>What is Included in this Plan</span>
                </h2>

                <div className="grid sm:grid-cols-2 gap-3.5">
                  {service.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
                      <span className={isDarkMode ? 'text-white/85' : 'text-slate-700'}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits & ROI */}
            {service.benefits && service.benefits.length > 0 && (
              <div className={`p-6 sm:p-8 rounded-2xl border ${
                isDarkMode ? 'bg-zinc-900/90 border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <h2 className="font-display font-black text-lg uppercase tracking-wider text-zinc-900 dark:text-white mb-5 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Targeted Outcomes &amp; Business Benefits</span>
                </h2>

                <div className="grid sm:grid-cols-2 gap-3.5">
                  {service.benefits.map((ben, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                      <span className="text-emerald-500 font-bold shrink-0">✓</span>
                      <span className={isDarkMode ? 'text-white/85' : 'text-slate-700 font-medium'}>{ben}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing & Booking Card (Sticky) */}
          <div className="lg:sticky lg:top-36 space-y-6">
            <div className={`p-7 rounded-3xl border shadow-xl ${
              isDarkMode
                ? 'bg-zinc-950 border-[#F97316]/30 shadow-orange-500/5'
                : 'bg-white border-orange-200 shadow-orange-500/10'
            }`}>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#F97316]">
                Campaign Investment
              </span>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display font-black text-3xl sm:text-4xl text-zinc-900 dark:text-white">
                  {service.price}
                </span>
                {service.price_unit && (
                  <span className="text-xs font-semibold text-slate-500 dark:text-white/60">
                    {service.price_unit}
                  </span>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10 space-y-3">
                {/* Book directly on WhatsApp */}
                <a
                  href={`https://wa.me/919626759859?text=${whatsappInquiryText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Book / Inquire on WhatsApp</span>
                </a>

                {/* Add to Basket */}
                <button
                  onClick={handleAddToCart}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider border transition cursor-pointer ${
                    added
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-orange-500/10 hover:bg-orange-500 hover:text-white text-[#F97316] border-orange-500/30'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{added ? 'Added to Inquiry Basket!' : 'Add to Inquiry Basket'}</span>
                </button>

                {/* Share Link */}
                <a
                  href={`https://api.whatsapp.com/send?text=${whatsappShareText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold border border-zinc-200 dark:border-white/15 text-zinc-700 dark:text-zinc-300 hover:border-orange-500 transition"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Plan with Partners</span>
                </a>
              </div>

              {/* Verified Authority note */}
              <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/10 text-[11px] text-slate-500 dark:text-white/50 leading-relaxed">
                ⚡ Broadcasted across <strong>375,000+ Followers</strong> &amp; <strong>12.4M+ Verified Views</strong> by Karthick Tamilan.
              </div>
            </div>
          </div>
        </div>

        {/* Related Services */}
        {relatedServices && relatedServices.length > 0 && (
          <div className="mt-20 pt-12 border-t border-zinc-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#F97316]">
                  Complementary Strategies
                </span>
                <h3 className="font-display font-black text-2xl uppercase tracking-tight text-zinc-900 dark:text-white">
                  Other Popular Marketing Plans
                </h3>
              </div>
              <Link
                href="/digital-marketing"
                className="text-xs font-bold uppercase tracking-wider text-[#F97316] hover:underline"
              >
                View All Plans ↗
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedServices.slice(0, 3).map((rel) => {
                const relSlug = rel.name ? rel.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : rel.id
                return (
                  <Link
                    key={rel.id}
                    href={`/digital-marketing/${relSlug}`}
                    className={`p-6 rounded-2xl border transition hover:border-[#F97316] group ${
                      isDarkMode ? 'bg-zinc-900/60 border-white/10' : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#F97316]">
                      {rel.project_tag || 'MARKETING PLAN'}
                    </span>
                    <h4 className="font-display font-black text-lg uppercase mt-2 text-zinc-900 dark:text-white group-hover:text-[#F97316] transition">
                      {rel.name}
                    </h4>
                    <p className="font-display font-black text-xl text-[#F97316] mt-3">
                      {rel.price} <span className="text-xs text-slate-500 font-normal">{rel.price_unit}</span>
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
