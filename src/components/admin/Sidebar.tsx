'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAdminTheme } from '@/context/AdminThemeContext'
import {
  LayoutDashboard,
  Inbox,
  Camera,
  Megaphone,
  FolderTree,
  Briefcase,
  Users,
  MessageSquareQuote,
  Image as ImageIcon,
  BarChart2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Enquiries', href: '/admin/enquiries', icon: Inbox },
  { name: 'Studioz Videos', href: '/admin/studioz-videos', icon: Camera },
  { name: 'Founder Decks', href: '/admin/founder-decks', icon: Briefcase },
  { name: 'Studioz Services', href: '/admin/studioz-services', icon: Camera },
  { name: 'Marketing Services', href: '/admin/marketing-services', icon: Megaphone },
  { name: 'Categories', href: '/admin/categories', icon: FolderTree },
  { name: 'Portfolio', href: '/admin/portfolio', icon: Briefcase },
  { name: 'Team', href: '/admin/team', icon: Users },
  { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
  { name: 'Client Logos', href: '/admin/client-logos', icon: ImageIcon },
  { name: 'Site Stats', href: '/admin/site-stats', icon: BarChart2 },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { theme, toggleTheme } = useAdminTheme()

  // State
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const isDark = theme === 'dark'

  const handleSignOut = async () => {
    document.cookie = 'kr_admin_session=; path=/; max-age=0; SameSite=Lax'
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const toggleCollapse = () => setIsCollapsed(!isCollapsed)

  return (
    <>
      {/* Mobile Top Header (Visible on screens < md) */}
      <div
        className={`md:hidden sticky top-0 z-40 px-4 py-3 flex items-center justify-between transition-colors border-b ${
          isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <img src="/kr-logo.png" alt="KR Logo" className="w-8 h-8 object-contain" />
          <div>
            <h1 className={`font-bold leading-tight text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              KR STUDIOZ
            </h1>
            <p className="text-[10px] text-orange-500 font-semibold uppercase tracking-wider">
              Admin Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-colors ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 text-amber-400 hover:text-amber-300'
                : 'bg-zinc-100 border-zinc-200 text-orange-600 hover:bg-zinc-200'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsMobileOpen(true)}
            className={`p-2 rounded-xl border ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-zinc-900'
            }`}
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Overlay Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen border-r flex flex-col justify-between select-none transition-all duration-300 ${
          isDark
            ? 'bg-zinc-950 border-zinc-800 text-zinc-300'
            : 'bg-white border-zinc-200 text-zinc-700'
        } ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'} ${
          isCollapsed ? 'md:w-20' : 'md:w-64'
        }`}
      >
        <div>
          {/* Header Branding */}
          <div
            className={`p-4 border-b flex items-center ${
              isDark ? 'border-zinc-800' : 'border-zinc-200'
            } ${
              isCollapsed && !isMobileOpen
                ? 'md:flex-col md:gap-3 md:items-center md:justify-center'
                : 'justify-between'
            }`}
          >
            <Link
              href="/admin"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-3 overflow-hidden"
            >
              <img
                src="/kr-logo.png"
                alt="KR Digital Marketing & Studioz"
                className="w-10 h-10 object-contain shrink-0 drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]"
              />
              {(!isCollapsed || isMobileOpen) && (
                <div className="truncate">
                  <h1
                    className={`font-extrabold leading-tight text-sm tracking-wide ${
                      isDark ? 'text-white' : 'text-zinc-900'
                    }`}
                  >
                    KR STUDIOZ
                  </h1>
                  <p className="text-[10px] text-orange-500 font-semibold tracking-widest uppercase">
                    Digital & Studioz
                  </p>
                </div>
              )}
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className={`md:hidden p-1.5 rounded-lg ${
                isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-900' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Desktop Collapse / Expand Toggle Button */}
            {!isMobileOpen && (
              <button
                onClick={toggleCollapse}
                className={`hidden md:flex items-center justify-center p-2 rounded-xl border transition-colors ${
                  isDark
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-orange-500/50'
                    : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-orange-500/50'
                }`}
                title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-190px)] no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive =
                pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  title={isCollapsed ? item.name : undefined}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm transition-all duration-150 group relative ${
                    isActive
                      ? isDark
                        ? 'bg-orange-500/10 text-orange-500 font-semibold border-l-4 border-orange-500'
                        : 'bg-orange-500/15 text-orange-600 font-semibold border-l-4 border-orange-500'
                      : isDark
                      ? 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/80'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                  } ${isCollapsed ? 'md:justify-center md:px-0 md:border-l-0' : ''}`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive
                        ? 'text-orange-500'
                        : isDark
                        ? 'text-zinc-400 group-hover:text-orange-400'
                        : 'text-zinc-500 group-hover:text-orange-600'
                    }`}
                  />

                  {(!isCollapsed || isMobileOpen) && (
                    <span className="truncate">{item.name}</span>
                  )}

                  {/* Tooltip on Collapsed Desktop Hover */}
                  {isCollapsed && !isMobileOpen && (
                    <div
                      className={`hidden md:group-hover:block absolute left-full ml-3 px-3 py-1.5 text-xs font-semibold rounded-lg shadow-xl border whitespace-nowrap z-50 pointer-events-none ${
                        isDark
                          ? 'bg-zinc-900 text-white border-zinc-800'
                          : 'bg-white text-zinc-900 border-zinc-200 shadow-zinc-300'
                      }`}
                    >
                      {item.name}
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer / Controls Section */}
        <div
          className={`p-3 md:p-4 border-t space-y-2 ${
            isDark ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-white'
          }`}
        >
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={isCollapsed ? (isDark ? 'Light Mode' : 'Dark Mode') : undefined}
            className={`w-full flex items-center justify-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors font-medium border ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 text-amber-400 hover:bg-zinc-800'
                : 'bg-zinc-100 border-zinc-200 text-orange-600 hover:bg-zinc-200'
            } ${isCollapsed ? 'md:px-0' : ''}`}
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 shrink-0 text-amber-400" />
                {(!isCollapsed || isMobileOpen) && <span>Light Mode</span>}
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 shrink-0 text-orange-600" />
                {(!isCollapsed || isMobileOpen) && <span>Dark Mode</span>}
              </>
            )}
          </button>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            title={isCollapsed ? 'Sign Out' : undefined}
            className={`w-full flex items-center justify-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-500/10 transition-colors font-medium ${
              isCollapsed ? 'md:px-0' : ''
            }`}
          >
            <LogOut className="w-5 h-5 shrink-0 text-red-500" />
            {(!isCollapsed || isMobileOpen) && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  )
}

