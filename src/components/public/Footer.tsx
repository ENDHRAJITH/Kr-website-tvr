'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Phone, MapPin, Mail } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export default function Footer() {
  const pathname = usePathname()
  const { isDarkMode } = useTheme()

  // Do not render Footer on Admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <footer className={`font-sans transition-colors duration-500 border-t ${
      isDarkMode 
        ? 'bg-[#050505] text-white border-white/10' 
        : 'bg-slate-900 text-white border-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Main Footer Grid */}
        <div className="py-14 md:py-16 border-b border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr] gap-10 lg:gap-12">
          {/* Column 1: Brand Info */}
          <div>
            <Link href="/" className="inline-block mb-3">
              <Image
                src="/kr-logo.png"
                alt="KR Digital Marketing & Studioz"
                width={160}
                height={50}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-xs md:text-sm leading-relaxed text-white/60 max-w-sm mt-3">
              We capture moments, build brands and create impact — photography, films, digital marketing and branding under one creative ecosystem.
            </p>

            {/* Founder Social Links */}
            <div className="mt-6 space-y-4">
              {/* KR Studioz - Rajitha */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-orange-400 mb-2">
                  KR Studioz — Founder Rajitha
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href="https://www.instagram.com/kr_studioz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Rajitha Instagram"
                    title="KR Studioz Instagram"
                    className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/80 hover:border-orange-500 hover:text-orange-400 transition-colors rounded-md bg-white/5"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                    </svg>
                  </a>
                  <a
                    href="https://www.facebook.com/krstudioz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Rajitha Facebook"
                    title="KR Studioz Facebook"
                    className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/80 hover:border-orange-500 hover:text-orange-400 transition-colors rounded-md bg-white/5"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 8h3V4h-3c-3.3 0-5 1.7-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.7.3-1 1-1Z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.youtube.com/@krstudioz"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Rajitha YouTube"
                    title="KR Studioz YouTube"
                    className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/80 hover:border-orange-500 hover:text-orange-400 transition-colors rounded-md bg-white/5"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.9V8.1l6.5 3.9-6.5 3.9Z" />
                    </svg>
                  </a>
                  <a
                    href="https://wa.me/919626759859"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Rajitha WhatsApp"
                    title="KR Studioz WhatsApp"
                    className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/80 hover:border-orange-500 hover:text-orange-400 transition-colors rounded-md bg-white/5"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-1-.3-.1-.5-.1-.7.2s-.8 1-1 1.2c-.2.2-.4.2-.7.1-1.9-.9-3.1-1.7-4.3-3.8-.3-.5.3-.5.9-1.6.1-.2.1-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.5a1 1 0 0 0-.7.3c-.3.3-1 1-1 2.5s1 2.8 1.2 3c.2.2 2 3.1 5 4.3.7.3 1.2.5 1.7.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.7.2-1.3.1-1.3Z" />
                      <path d="M12 0C5.4 0 0 5.4 0 12c0 2.1.5 4.1 1.5 5.8L0 24l6.4-1.5C8.1 23.4 10 24 12 24c6.6 0 12-5.4 12-12S18.6 0 12 0Zm0 21.8c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-3.8.9.9-3.7-.2-.4A9.8 9.8 0 0 1 2.2 12C2.2 6.6 6.6 2.2 12 2.2s9.8 4.4 9.8 9.8-4.4 9.8-9.8 9.8Z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* KR Digital Marketing - Karthik */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-orange-400 mb-2">
                  KR Digital — Founder Karthik
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href="https://www.instagram.com/karthick_tamilan__/?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Karthik Instagram"
                    title="Karthik Instagram"
                    className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/80 hover:border-orange-500 hover:text-orange-400 transition-colors rounded-md bg-white/5"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                    </svg>
                  </a>
                  <a
                    href="https://www.facebook.com/KRDigitalMarketing2019/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Karthik Facebook"
                    title="KR Digital Facebook"
                    className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/80 hover:border-orange-500 hover:text-orange-400 transition-colors rounded-md bg-white/5"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 8h3V4h-3c-3.3 0-5 1.7-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.7.3-1 1-1Z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.youtube.com/@karthicktamilan"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Karthik YouTube"
                    title="Karthik YouTube"
                    className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/80 hover:border-orange-500 hover:text-orange-400 transition-colors rounded-md bg-white/5"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.9V8.1l6.5 3.9-6.5 3.9Z" />
                    </svg>
                  </a>
                  <a
                    href="https://wa.me/919626759859"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Karthik WhatsApp"
                    title="KR Digital WhatsApp"
                    className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/80 hover:border-orange-500 hover:text-orange-400 transition-colors rounded-md bg-white/5"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-1-.3-.1-.5-.1-.7.2s-.8 1-1 1.2c-.2.2-.4.2-.7.1-1.9-.9-3.1-1.7-4.3-3.8-.3-.5.3-.5.9-1.6.1-.2.1-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.5a1 1 0 0 0-.7.3c-.3.3-1 1-1 2.5s1 2.8 1.2 3c.2.2 2 3.1 5 4.3.7.3 1.2.5 1.7.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.7.2-1.3.1-1.3Z" />
                      <path d="M12 0C5.4 0 0 5.4 0 12c0 2.1.5 4.1 1.5 5.8L0 24l6.4-1.5C8.1 23.4 10 24 12 24c6.6 0 12-5.4 12-12S18.6 0 12 0Zm0 21.8c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-3.8.9.9-3.7-.2-.4A9.8 9.8 0 0 1 2.2 12C2.2 6.6 6.6 2.2 12 2.2s9.8 4.4 9.8 9.8-4.4 9.8-9.8 9.8Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>


          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#F97316] mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3 text-xs md:text-sm">
              <li>
                <Link href="/" className="text-white/60 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/60 hover:text-white transition-colors">
                  About KR
                </Link>
              </li>
              <li>
                <Link href="/studioz" className="text-white/60 hover:text-white transition-colors">
                  KR Studioz
                </Link>
              </li>
              <li>
                <Link href="/digital-marketing" className="text-white/60 hover:text-white transition-colors">
                  Digital Marketing
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-white/60 hover:text-white transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-white/60 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#F97316] mb-5">
              Contact
            </h4>
            <ul className="space-y-3 text-xs md:text-sm">
              <li>
                <a
                  href="https://wa.me/919626759859"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
                  <span>+91 96267 59859</span>
                </a>
              </li>
              <li className="text-white/50 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
                <span>Delta, Tamil Nadu</span>
              </li>
              <li>
                <a
                  href="mailto:info@krdigital.in"
                  className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
                  <span>info@krdigital.in</span>
                </a>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-[11px] text-white/40 leading-relaxed">
                Photography &bull; Films &bull; Weddings &bull; Events<br />
                Social Media Ads &bull; Google Ads &bull; SEO &bull; Branding
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/40 tracking-wider">
          <span>
            &copy; {new Date().getFullYear()} KR Digital Marketing &amp; Studioz. All rights reserved.
          </span>
          <span>
            Made with <span className="text-[#F97316]">&hearts;</span> in Tamil Nadu
          </span>
        </div>
      </div>
    </footer>
  )
}
