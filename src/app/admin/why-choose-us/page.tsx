'use client'

import { useState, useEffect } from 'react'
import { WhyChooseUsData } from '@/types/database'
import ImageUploader from '@/components/admin/ImageUploader'
import {
  Save,
  Loader2,
  ExternalLink,
  Sparkles,
  BarChart3,
  Award,
  Globe,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

export default function AdminWhyChooseUsPage() {
  const [data, setData] = useState<WhyChooseUsData | null>(null)
  const [activeTab, setActiveTab] = useState<'hero' | 'bni' | 'analytics' | 'scenarios'>('hero')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetch('/api/why-choose-us')
      .then((res) => res.json())
      .then((resData) => {
        if (resData && resData.data) {
          setData(resData.data)
        }
      })
      .catch((err) => {
        console.error('Failed to load Why Choose Us data:', err)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    if (!data) return
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch('/api/why-choose-us', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      })

      const json = await res.json()
      if (res.ok && json.success) {
        setMessage({ type: 'success', text: 'Changes saved successfully to live website!' })
      } else {
        setMessage({ type: 'error', text: json.error || 'Failed to save changes.' })
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Network error saving data.' })
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(null), 5000)
    }
  }

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <p className="text-sm text-zinc-400">Loading Why Choose Us settings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Market Authority & Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
            Why Choose Us Editor
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage live verified statistics, BNI leadership credentials, audience demographics, and growth scenarios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/why-choose-us"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border border-zinc-200 dark:border-zinc-800 hover:border-orange-500/50 text-zinc-700 dark:text-zinc-300 transition"
          >
            <span>View Live Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 transition disabled:opacity-50 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      {message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs sm:text-sm font-semibold ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
            activeTab === 'hero'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
              : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Hero &amp; 4 Quick Stats</span>
        </button>

        <button
          onClick={() => setActiveTab('bni')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
            activeTab === 'bni'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
              : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>BNI VP Leadership</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
            activeTab === 'analytics'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
              : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Audience Demographics &amp; Proof</span>
        </button>

        <button
          onClick={() => setActiveTab('scenarios')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
            activeTab === 'scenarios'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
              : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Growth Scenarios ({data.growthScenarios?.length || 0})</span>
        </button>
      </div>

      {/* TAB 1: HERO & STATS */}
      {activeTab === 'hero' && (
        <div className="space-y-6 bg-white dark:bg-zinc-900/60 p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-base font-extrabold uppercase tracking-wide text-zinc-900 dark:text-white pb-3 border-b border-zinc-200 dark:border-zinc-800">
            Hero Headline &amp; Authority Statement
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">Top Badge Text</label>
              <input
                type="text"
                value={data.hero?.badge || ''}
                onChange={(e) => setData({ ...data, hero: { ...data.hero, badge: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">Main Title (Line 1)</label>
              <input
                type="text"
                value={data.hero?.title || ''}
                onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-medium"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">Title Highlight (Orange Text)</label>
              <input
                type="text"
                value={data.hero?.titleHighlight || ''}
                onChange={(e) => setData({ ...data, hero: { ...data.hero, titleHighlight: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">Hero Subtitle Description</label>
              <textarea
                rows={2}
                value={data.hero?.description || ''}
                onChange={(e) => setData({ ...data, hero: { ...data.hero, description: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-medium"
              />
            </div>
          </div>

          {/* 4 Quick Stats */}
          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-zinc-900 dark:text-white">
              The 4 High-Impact Stat Boxes
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.hero?.stats?.map((stat, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 space-y-2">
                  <label className="block text-[10px] font-extrabold uppercase text-orange-500">Stat #{idx + 1}</label>
                  <input
                    type="text"
                    placeholder="e.g. 12.4M+"
                    value={stat.value}
                    onChange={(e) => {
                      const newStats = [...data.hero.stats]
                      newStats[idx].value = e.target.value
                      setData({ ...data, hero: { ...data.hero, stats: newStats } })
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-lg font-black text-orange-500"
                  />
                  <input
                    type="text"
                    placeholder="Label description"
                    value={stat.label}
                    onChange={(e) => {
                      const newStats = [...data.hero.stats]
                      newStats[idx].label = e.target.value
                      setData({ ...data, hero: { ...data.hero, stats: newStats } })
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BNI LEADERSHIP */}
      {activeTab === 'bni' && (
        <div className="space-y-6 bg-white dark:bg-zinc-900/60 p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-base font-extrabold uppercase tracking-wide text-zinc-900 dark:text-white pb-3 border-b border-zinc-200 dark:border-zinc-800">
            BNI Vice President &amp; Entrepreneur Leadership Profile
          </h2>

          <div className="grid sm:grid-cols-3 gap-6 items-start">
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Leader Photo</label>
              <ImageUploader
                value={data.bniLeadership?.photoUrl || ''}
                onChange={(url) => setData({ ...data, bniLeadership: { ...data.bniLeadership, photoUrl: url || '' } })}
                label="Leader Portrait"
              />
            </div>

            <div className="sm:col-span-2 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Leader Full Name</label>
                  <input
                    type="text"
                    value={data.bniLeadership?.leaderName || ''}
                    onChange={(e) => setData({ ...data, bniLeadership: { ...data.bniLeadership, leaderName: e.target.value } })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Chapter Name</label>
                  <input
                    type="text"
                    value={data.bniLeadership?.chapterName || ''}
                    onChange={(e) => setData({ ...data, bniLeadership: { ...data.bniLeadership, chapterName: e.target.value } })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Headline Role</label>
                <input
                  type="text"
                  value={data.bniLeadership?.role || ''}
                  onChange={(e) => setData({ ...data, bniLeadership: { ...data.bniLeadership, role: e.target.value } })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Leadership Description</label>
                <textarea
                  rows={3}
                  value={data.bniLeadership?.description || ''}
                  onChange={(e) => setData({ ...data, bniLeadership: { ...data.bniLeadership, description: e.target.value } })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Why This Matters Statement</label>
                <textarea
                  rows={2}
                  value={data.bniLeadership?.whyItMatters || ''}
                  onChange={(e) => setData({ ...data, bniLeadership: { ...data.bniLeadership, whyItMatters: e.target.value } })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIENCE ANALYTICS & PROOF */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 bg-white dark:bg-zinc-900/60 p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-base font-extrabold uppercase tracking-wide text-zinc-900 dark:text-white pb-3 border-b border-zinc-200 dark:border-zinc-800">
            Instagram Analytics Numbers &amp; Audience Demographics
          </h2>

          {/* Overview numbers */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Content Views (30 Days)</label>
              <input
                type="text"
                value={data.analytics?.overview?.contentViews || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    analytics: {
                      ...data.analytics,
                      overview: { ...data.analytics.overview, contentViews: e.target.value }
                    }
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-bold text-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Growth Badge Text</label>
              <input
                type="text"
                value={data.analytics?.overview?.viewsGrowth || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    analytics: {
                      ...data.analytics,
                      overview: { ...data.analytics.overview, viewsGrowth: e.target.value }
                    }
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-bold text-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Unique Viewers Reached</label>
              <input
                type="text"
                value={data.analytics?.overview?.uniqueViewers || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    analytics: {
                      ...data.analytics,
                      overview: { ...data.analytics.overview, uniqueViewers: e.target.value }
                    }
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-bold text-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Viral Reels Plays</label>
              <input
                type="text"
                value={data.analytics?.overview?.reelsPlays || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    analytics: {
                      ...data.analytics,
                      overview: { ...data.analytics.overview, reelsPlays: e.target.value }
                    }
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-bold text-orange-500"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Non-Followers Viral Ratio (%)</label>
              <input
                type="text"
                value={data.analytics?.overview?.nonFollowersRatio || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    analytics: {
                      ...data.analytics,
                      overview: { ...data.analytics.overview, nonFollowersRatio: e.target.value }
                    }
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Monthly New Followers Net Gain</label>
              <input
                type="text"
                value={data.analytics?.overview?.monthlyGrowth || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    analytics: {
                      ...data.analytics,
                      overview: { ...data.analytics.overview, monthlyGrowth: e.target.value }
                    }
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-bold text-amber-500"
              />
            </div>
          </div>

          {/* Age Demographics */}
          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-zinc-900 dark:text-white">
              Age Breakdown &amp; Purchasing Power (25–44 Yrs)
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Age Headline</label>
                <input
                  type="text"
                  value={data.analytics?.age?.headline || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      analytics: {
                        ...data.analytics,
                        age: { ...data.analytics.age, headline: e.target.value }
                      }
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Decision Makers %</label>
                <input
                  type="text"
                  value={data.analytics?.age?.decisionMakersPercent || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      analytics: {
                        ...data.analytics,
                        age: { ...data.analytics.age, decisionMakersPercent: e.target.value }
                      }
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-bold text-orange-500"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {data.analytics?.age?.ranges?.map((rng, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950">
                  <label className="block text-[10px] font-bold text-zinc-500 mb-1 truncate">{rng.label}</label>
                  <input
                    type="text"
                    value={rng.pct}
                    onChange={(e) => {
                      const newRanges = [...data.analytics.age.ranges]
                      newRanges[idx].pct = e.target.value
                      setData({
                        ...data,
                        analytics: {
                          ...data.analytics,
                          age: { ...data.analytics.age, ranges: newRanges }
                        }
                      })
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-black text-orange-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GROWTH SCENARIOS */}
      {activeTab === 'scenarios' && (
        <div className="space-y-6 bg-white dark:bg-zinc-900/60 p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <h2 className="text-base font-extrabold uppercase tracking-wide text-zinc-900 dark:text-white">
                Real Estate &amp; Brand Growth Scenarios
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">Manage the conversion case-study scenarios displayed on the page.</p>
            </div>

            <button
              onClick={() => {
                const nextNo = (data.growthScenarios?.length || 0) + 1
                const newScenario = {
                  number: nextNo < 10 ? `0${nextNo}` : `${nextNo}`,
                  title: '✨ New High-Growth Campaign Scenario',
                  description: 'Detailed description of how KR marketing funnels convert audience into paying clients.',
                  tags: ['✓ Verified Outcome', 'High-Converting Strategy']
                }
                setData({ ...data, growthScenarios: [...(data.growthScenarios || []), newScenario] })
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white text-xs font-bold transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Scenario</span>
            </button>
          </div>

          <div className="space-y-4">
            {data.growthScenarios?.map((item, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="text"
                      value={item.number}
                      onChange={(e) => {
                        const newArr = [...data.growthScenarios]
                        newArr[idx].number = e.target.value
                        setData({ ...data, growthScenarios: newArr })
                      }}
                      className="w-16 px-2 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-black text-center text-orange-500"
                    />
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const newArr = [...data.growthScenarios]
                        newArr[idx].title = e.target.value
                        setData({ ...data, growthScenarios: newArr })
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-bold text-zinc-900 dark:text-white"
                    />
                  </div>

                  <button
                    onClick={() => {
                      const newArr = data.growthScenarios.filter((_, i) => i !== idx)
                      setData({ ...data, growthScenarios: newArr })
                    }}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                    title="Delete Scenario"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) => {
                    const newArr = [...data.growthScenarios]
                    newArr[idx].description = e.target.value
                    setData({ ...data, growthScenarios: newArr })
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-300"
                />

                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Tags (comma-separated):</span>
                  <input
                    type="text"
                    value={item.tags?.join(', ') || ''}
                    onChange={(e) => {
                      const newArr = [...data.growthScenarios]
                      newArr[idx].tags = e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                      setData({ ...data, growthScenarios: newArr })
                    }}
                    className="flex-1 px-3 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-orange-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
