'use client'

import Link from 'next/link'
import { Inbox, Camera, Megaphone, Briefcase, ArrowRight, ShieldCheck } from 'lucide-react'
import { useAdminTheme } from '@/context/AdminThemeContext'

interface AdminDashboardOverviewProps {
  newEnquiriesCount: number
  totalEnquiriesCount: number
  studiozCount: number
  marketingCount: number
}

export default function AdminDashboardOverview({
  newEnquiriesCount,
  totalEnquiriesCount,
  studiozCount,
  marketingCount,
}: AdminDashboardOverviewProps) {
  const { theme } = useAdminTheme()
  const isDark = theme === 'dark'

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border transition-colors ${
          isDark
            ? 'bg-zinc-900 border-zinc-800 text-white'
            : 'bg-white border-zinc-200 text-zinc-900 shadow-sm'
        }`}
      >
        <div>
          <h1
            className={`text-2xl font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}
          >
            Admin Dashboard
          </h1>
          <p
            className={`text-sm mt-1 ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}
          >
            Welcome back! Manage content, services, portfolio, and view client enquiries.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 self-start sm:self-center">
          <ShieldCheck className="w-4 h-4" />
          <span>System Ready</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          className={`p-6 rounded-2xl border space-y-3 transition-colors ${
            isDark
              ? 'bg-zinc-900 border-zinc-800'
              : 'bg-white border-zinc-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              }`}
            >
              New Enquiries
            </span>
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div
            className={`text-3xl font-extrabold ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}
          >
            {newEnquiriesCount}
          </div>
          <p
            className={`text-xs ${
              isDark ? 'text-zinc-500' : 'text-zinc-600'
            }`}
          >
            Pending client leads requiring response
          </p>
        </div>

        <div
          className={`p-6 rounded-2xl border space-y-3 transition-colors ${
            isDark
              ? 'bg-zinc-900 border-zinc-800'
              : 'bg-white border-zinc-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              }`}
            >
              Total Enquiries
            </span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div
            className={`text-3xl font-extrabold ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}
          >
            {totalEnquiriesCount}
          </div>
          <p
            className={`text-xs ${
              isDark ? 'text-zinc-500' : 'text-zinc-600'
            }`}
          >
            Total submitted enquiries to date
          </p>
        </div>

        <div
          className={`p-6 rounded-2xl border space-y-3 transition-colors ${
            isDark
              ? 'bg-zinc-900 border-zinc-800'
              : 'bg-white border-zinc-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              }`}
            >
              Studioz Services
            </span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
              <Camera className="w-5 h-5" />
            </div>
          </div>
          <div
            className={`text-3xl font-extrabold ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}
          >
            {studiozCount}
          </div>
          <p
            className={`text-xs ${
              isDark ? 'text-zinc-500' : 'text-zinc-600'
            }`}
          >
            Active photography & video offerings
          </p>
        </div>

        <div
          className={`p-6 rounded-2xl border space-y-3 transition-colors ${
            isDark
              ? 'bg-zinc-900 border-zinc-800'
              : 'bg-white border-zinc-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              }`}
            >
              Marketing Services
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Megaphone className="w-5 h-5" />
            </div>
          </div>
          <div
            className={`text-3xl font-extrabold ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}
          >
            {marketingCount}
          </div>
          <p
            className={`text-xs ${
              isDark ? 'text-zinc-500' : 'text-zinc-600'
            }`}
          >
            Active digital marketing packages
          </p>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="space-y-4">
        <h2
          className={`text-lg font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-zinc-900'
          }`}
        >
          Quick Management
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Link
            href="/admin/enquiries"
            className={`group border p-5 rounded-2xl transition-all duration-200 flex items-center justify-between ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 hover:border-orange-500/50'
                : 'bg-white border-zinc-200 hover:border-orange-500 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-black transition-colors">
                <Inbox className="w-6 h-6" />
              </div>
              <div>
                <h3
                  className={`font-semibold group-hover:text-orange-500 transition-colors ${
                    isDark ? 'text-white' : 'text-zinc-900'
                  }`}
                >
                  Client Enquiries
                </h3>
                <p
                  className={`text-xs ${
                    isDark ? 'text-zinc-400' : 'text-zinc-600'
                  }`}
                >
                  Review lead responses
                </p>
              </div>
            </div>
            <ArrowRight
              className={`w-5 h-5 group-hover:text-orange-500 group-hover:translate-x-1 transition-all ${
                isDark ? 'text-zinc-500' : 'text-zinc-400'
              }`}
            />
          </Link>

          <Link
            href="/admin/studioz-services"
            className={`group border p-5 rounded-2xl transition-all duration-200 flex items-center justify-between ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 hover:border-orange-500/50'
                : 'bg-white border-zinc-200 hover:border-orange-500 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 group-hover:bg-orange-500 group-hover:text-black transition-colors">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h3
                  className={`font-semibold group-hover:text-orange-500 transition-colors ${
                    isDark ? 'text-white' : 'text-zinc-900'
                  }`}
                >
                  Studioz Services
                </h3>
                <p
                  className={`text-xs ${
                    isDark ? 'text-zinc-400' : 'text-zinc-600'
                  }`}
                >
                  Manage studio packages
                </p>
              </div>
            </div>
            <ArrowRight
              className={`w-5 h-5 group-hover:text-orange-500 group-hover:translate-x-1 transition-all ${
                isDark ? 'text-zinc-500' : 'text-zinc-400'
              }`}
            />
          </Link>

          <Link
            href="/admin/studioz-videos"
            className={`group border p-5 rounded-2xl transition-all duration-200 flex items-center justify-between ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 hover:border-orange-500/50'
                : 'bg-white border-zinc-200 hover:border-orange-500 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:bg-orange-500 group-hover:text-black transition-colors">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h3
                  className={`font-semibold group-hover:text-orange-500 transition-colors ${
                    isDark ? 'text-white' : 'text-zinc-900'
                  }`}
                >
                  Featured Videos
                </h3>
                <p
                  className={`text-xs ${
                    isDark ? 'text-zinc-400' : 'text-zinc-600'
                  }`}
                >
                  Carousel films &amp; reels
                </p>
              </div>
            </div>
            <ArrowRight
              className={`w-5 h-5 group-hover:text-orange-500 group-hover:translate-x-1 transition-all ${
                isDark ? 'text-zinc-500' : 'text-zinc-400'
              }`}
            />
          </Link>

          <Link
            href="/admin/portfolio"
            className={`group border p-5 rounded-2xl transition-all duration-200 flex items-center justify-between ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 hover:border-orange-500/50'
                : 'bg-white border-zinc-200 hover:border-orange-500 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 group-hover:bg-orange-500 group-hover:text-black transition-colors">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3
                  className={`font-semibold group-hover:text-orange-500 transition-colors ${
                    isDark ? 'text-white' : 'text-zinc-900'
                  }`}
                >
                  Portfolio Works
                </h3>
                <p
                  className={`text-xs ${
                    isDark ? 'text-zinc-400' : 'text-zinc-600'
                  }`}
                >
                  Update gallery items
                </p>
              </div>
            </div>
            <ArrowRight
              className={`w-5 h-5 group-hover:text-orange-500 group-hover:translate-x-1 transition-all ${
                isDark ? 'text-zinc-500' : 'text-zinc-400'
              }`}
            />
          </Link>
        </div>
      </div>
    </div>
  )
}
