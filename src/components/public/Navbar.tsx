'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Menu, X, ArrowUpRight, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

const CART_KEY = "kr_global_enquiry_cart_v2"

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const { theme, isDarkMode, toggleTheme } = useTheme()

  // Do not render Navbar on Admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const updateCartCount = () => {
    try {
      const items = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
      setCartCount(Array.isArray(items) ? items.length : 0)
    } catch {
      setCartCount(0)
    }
  }

  useEffect(() => {
    updateCartCount()

    const handleCartUpdate = () => updateCartCount()
    window.addEventListener('kr-cart-update', handleCartUpdate)
    window.addEventListener('storage', handleCartUpdate)

    return () => {
      window.removeEventListener('kr-cart-update', handleCartUpdate)
      window.removeEventListener('storage', handleCartUpdate)
    }
  }, [])

  const openDrawer = () => {
    window.dispatchEvent(new CustomEvent('kr-open-drawer'))
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Why Choose Us', href: '/why-choose-us' },
    { name: 'About', href: '/about' },
    { name: 'Studioz', href: '/studioz' },
    { name: 'Digital Marketing', href: '/digital-marketing' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Contact', href: '/contact' },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <header suppressHydrationWarning className="fixed top-0 left-0 w-full z-50 px-4 md:px-6 pt-4">
      <nav suppressHydrationWarning className={`max-w-7xl mx-auto flex items-center justify-between px-5 md:px-7 py-4 border backdrop-blur-xl transition-colors duration-500 shadow-sm ${
        isDarkMode
          ? 'bg-zinc-950/90 text-white border-white/10'
          : 'bg-white/90 text-slate-900 border-[#FDE7D3]'
      }`}>
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0 min-w-0">
          <Image
            src="/kr-logo.png"
            alt="KR Digital Marketing & Studioz Logo"
            width={120}
            height={120}
            className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 object-contain shrink-0 group-hover:scale-105 transition-transform duration-300"
            priority
            unoptimized
          />
          <div className={`leading-none border-l pl-2 sm:pl-2.5 py-0.5 shrink-0 ${
            isDarkMode ? 'border-white/15' : 'border-gray-200'
          }`}>
            <div className={`font-sans font-extrabold text-xs sm:text-sm md:text-base tracking-tight transition-colors ${
              isDarkMode ? 'text-white group-hover:text-orange-500' : 'text-black group-hover:text-orange-500'
            }`}>
              KR
            </div>
            <div className="text-[7.5px] sm:text-[8.5px] md:text-[9px] font-bold tracking-[0.10em] sm:tracking-[0.16em] text-orange-500 mt-0.5 uppercase truncate max-w-[125px] sm:max-w-none">
              DIGITAL MARKETING &amp; STUDIOZ
            </div>
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex items-center gap-7 xl:gap-8 text-sm font-medium">
          {navLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 transition-colors ${
                  active
                    ? 'text-orange-500 font-semibold after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-orange-500'
                    : isDarkMode ? 'text-white/80 hover:text-orange-500' : 'text-zinc-800 hover:text-orange-500'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </div>

        {/* CTA & CART & THEME TOGGLE */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-2">
          {/* Global Light/Dark Theme Switcher */}
          <button
            onClick={toggleTheme}
            type="button"
            aria-label="Toggle Light/Dark Theme"
            title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
            className={`w-9 h-9 sm:w-10 sm:h-10 border flex items-center justify-center transition cursor-pointer rounded-full shrink-0 ${
              isDarkMode 
                ? 'border-white/15 bg-white/5 text-amber-400 hover:border-orange-500 hover:bg-white/10' 
                : 'border-[#FDE7D3] bg-white text-zinc-700 hover:border-orange-500 hover:text-orange-500'
            }`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Cart Icon Button */}
          <button
            onClick={openDrawer}
            type="button"
            aria-label="Open enquiry cart"
            className={`relative w-9 h-9 sm:w-10 sm:h-10 border flex items-center justify-center transition cursor-pointer rounded-full sm:rounded-none shrink-0 ${
              isDarkMode
                ? 'border-white/15 bg-white/5 text-white hover:border-orange-500'
                : 'border-[#FDE7D3] bg-white text-zinc-800 hover:border-orange-500'
            }`}
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.8]" />
            <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
              {cartCount}
            </span>
          </button>

          {/* Talk to KR WhatsApp Button */}
          <a
            href="https://wa.me/919626759859"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold transition-transform duration-300 hover:-translate-y-0.5 shadow-sm shadow-orange-500/20 rounded-sm shrink-0"
          >
            <span>Talk to KR</span>
            <ArrowUpRight className="w-4 h-4 ml-0.5" />
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden w-9 h-9 sm:w-10 sm:h-10 border flex items-center justify-center transition shrink-0 ${
              isDarkMode
                ? 'border-white/15 text-white hover:text-orange-500'
                : 'border-[#FDE7D3] text-zinc-800 hover:text-orange-500'
            }`}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className={`lg:hidden max-w-7xl mx-auto mt-2 border p-6 shadow-lg animate-in fade-in slide-in-from-top-2 ${
          isDarkMode
            ? 'bg-zinc-950 border-white/15 text-white'
            : 'bg-white border-[#FDE7D3] text-zinc-800'
        }`}>
          <div className="flex flex-col gap-5 text-sm font-medium">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={active ? 'text-orange-500 font-bold' : isDarkMode ? 'text-white/90 hover:text-orange-500' : 'text-zinc-800 hover:text-orange-500'}
                >
                  {link.name}
                </Link>
              )
            })}

            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-white/50">Switch Theme:</span>
              <button
                onClick={toggleTheme}
                type="button"
                className="px-3 py-1.5 border border-orange-500/50 rounded-full text-xs font-bold text-orange-500 flex items-center gap-2"
              >
                {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>

            <a
              href="https://wa.me/919626759859"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-500 hover:bg-orange-600 text-white text-center py-3 font-semibold transition-colors flex items-center justify-center gap-1"
            >
              <span>Talk to KR</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
