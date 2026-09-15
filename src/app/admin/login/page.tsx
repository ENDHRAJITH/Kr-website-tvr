'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Lock, User, AlertCircle, Loader2, Eye, EyeOff, LogIn, ShieldCheck, Sparkles } from 'lucide-react'

export default function AdminLoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if already authenticated via JWT endpoint
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/auth/me')
        const data = await res.json()
        if (data.authenticated) {
          router.push('/admin')
        }
      } catch {
        // Not authenticated
      }
    }
    checkAuth()
  }, [router])

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!usernameOrEmail || !password) {
      setError('Please enter both username/email and password.')
      return
    }

    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        router.push('/admin')
        router.refresh()
      } else {
        setError(data.error || 'Invalid credentials.')
        setLoading(false)
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected network error occurred.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-100 selection:bg-orange-500 selection:text-black">
      {/* Left Panel — Brand Display (Desktop Only) */}
      <div className="hidden lg:flex lg:w-[45%] bg-zinc-900 border-r border-zinc-800/80 relative overflow-hidden flex-col items-center justify-between p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(249,115,22,0.12)_0%,transparent_60%),radial-gradient(circle_at_80%_80%,rgba(245,158,11,0.08)_0%,transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e08_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e08_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

        <div className="relative z-10 w-full flex justify-start">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Admin Portal</span>
          </div>
        </div>

        <div className="relative z-10 text-center max-w-sm my-auto">
          <div className="relative group mx-auto mb-8 w-32 h-32">
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 opacity-20 blur-xl group-hover:opacity-40 transition duration-500" />
            <div className="relative w-full h-full rounded-2xl bg-zinc-950 p-3 border border-zinc-800 flex items-center justify-center shadow-2xl overflow-hidden">
              <Image
                src="/kr-logo.png"
                alt="KR Digital Marketing & Studioz"
                width={100}
                height={100}
                className="object-contain w-auto h-auto max-h-full transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>
          </div>

          <h1 className="text-2xl xl:text-3xl font-black text-white tracking-tight mb-2">
            KR Digital Marketing
          </h1>
          <p className="text-orange-500 font-bold text-sm tracking-wide mb-8 uppercase">
            & Studioz Control Panel
          </p>

          <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-6 text-left space-y-3.5 shadow-xl backdrop-blur-sm">
            {[
              'Bcrypt Hashed Secure Authentication',
              'JWT Session Protection',
              'Manage Admin Password & Users',
              'Track & Respond to Client Enquiries'
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0 shadow-sm shadow-orange-500" />
                <span className="text-zinc-300 text-xs font-medium leading-tight">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-center">
          <p className="text-xs text-zinc-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            <span>&copy; {new Date().getFullYear()} KR Digital Marketing & Studioz</span>
          </p>
        </div>
      </div>

      {/* Right Panel — Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-8">
          
          <div className="lg:hidden text-center space-y-3 mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 p-2 shadow-xl mx-auto">
              <Image
                src="/kr-logo.png"
                alt="KR Digital Marketing & Studioz"
                width={70}
                height={70}
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">KR Digital Marketing</h2>
              <p className="text-xs text-orange-500 font-semibold uppercase tracking-wider">& Studioz Admin</p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Sign In to Admin
            </h2>
            <p className="text-sm text-zinc-400">
              Enter your admin username or email address to log in
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">{error}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Username or Email Address
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="admin or admin@krdigitalstudioz.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-11 py-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-orange-500 hover:bg-orange-600 active:scale-[0.99] disabled:opacity-50 text-black font-black rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 transition-all duration-150 flex items-center justify-center gap-2 text-sm tracking-wide"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>SIGN IN TO DASHBOARD</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-4 text-center">
            <p className="text-xs text-zinc-500">
              Protected Admin Portal — Secure JWT &amp; Bcrypt Auth
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
