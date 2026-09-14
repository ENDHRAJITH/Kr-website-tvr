'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable, { Column } from '@/components/admin/DataTable'
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal'
import { SiteStat } from '@/types/database'
import { Plus, X, Loader2, Save, BarChart2, Bot, Sparkles, Power, FileText, Upload, Image as ImageIcon, Maximize2, Trash2 } from 'lucide-react'

export default function SiteStatsPage() {
  const [stats, setStats] = useState<SiteStat[]>([])
  const [loading, setLoading] = useState(true)

  // AI Chatbot Toggle State
  const [botEnabled, setBotEnabled] = useState(true)
  const [togglingBot, setTogglingBot] = useState(false)

  // Home Hero Image State
  const [heroImageUrl, setHeroImageUrl] = useState('/f11.png')
  const [heroImageScale, setHeroImageScale] = useState(100)
  const [savingHero, setSavingHero] = useState(false)

  // RAG Knowledge Docs State
  const [ragDocs, setRagDocs] = useState<Array<{ id: string; filename: string; title: string; content_text: string }>>([])
  const [docTitle, setDocTitle] = useState('')
  const [docContentText, setDocContentText] = useState('')
  const [uploadingDoc, setUploadingDoc] = useState(false)

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SiteStat | null>(null)
  const [label, setLabel] = useState('')
  const [value, setValue] = useState('')
  const [icon, setIcon] = useState('')
  const [displayOrder, setDisplayOrder] = useState<number>(0)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<SiteStat | null>(null)
  const [deleting, setDeleting] = useState(false)

  const supabase = createClient()

  const fetchBotStatus = async () => {
    try {
      const res = await fetch('/api/ai-chat/status')
      const data = await res.json()
      if (typeof data.enabled === 'boolean') {
        setBotEnabled(data.enabled)
      }
    } catch (err) {
      console.warn('Failed to fetch bot status:', err)
    }
  }

  const fetchSiteSettings = async () => {
    try {
      const res = await fetch('/api/site-settings')
      const data = await res.json()
      if (data.settings?.home_hero_image_url) setHeroImageUrl(data.settings.home_hero_image_url)
      if (data.settings?.home_hero_image_scale) setHeroImageScale(Number(data.settings.home_hero_image_scale) || 100)
    } catch (err) {
      console.warn('Failed to fetch site settings:', err)
    }
  }

  const fetchRagDocs = async () => {
    try {
      const res = await fetch('/api/admin/rag-docs')
      const data = await res.json()
      if (data.docs) setRagDocs(data.docs)
    } catch (err) {
      console.warn('Failed to fetch RAG docs:', err)
    }
  }

  const handleSaveHeroSettings = async () => {
    setSavingHero(true)
    try {
      const res = await fetch('/api/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          home_hero_image_url: heroImageUrl,
          home_hero_image_scale: heroImageScale,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        alert('✅ Home Hero Image & Scale updated successfully!')
      } else {
        alert(`❌ ${data.error || 'Failed to update hero settings.'}`)
      }
    } catch (err: any) {
      alert(`❌ Error saving hero settings: ${err.message}`)
    } finally {
      setSavingHero(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setDocTitle(file.name.replace(/\.[^/.]+$/, ''))
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setDocContentText(text || `Extracted content from file ${file.name}`)
    }
    reader.readAsText(file)
  }

  const handleUploadRagDoc = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!docTitle.trim() || !docContentText.trim()) {
      alert('Please provide a document title and text content.')
      return
    }

    setUploadingDoc(true)
    try {
      const res = await fetch('/api/admin/rag-docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: docTitle,
          filename: `${docTitle.toLowerCase().replace(/\s+/g, '_')}.pdf`,
          content_text: docContentText,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        alert(`✅ ${data.message}`)
        setDocTitle('')
        setDocContentText('')
        fetchRagDocs()
      } else {
        alert(`❌ ${data.error || 'Failed to upload RAG doc.'}`)
      }
    } catch (err: any) {
      alert(`❌ Error uploading document: ${err.message}`)
    } finally {
      setUploadingDoc(false)
    }
  }

  const handleDeleteRagDoc = async (id: string) => {
    if (!confirm('Are you sure you want to delete this RAG knowledge document?')) return
    try {
      const res = await fetch(`/api/admin/rag-docs?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok && data.success) {
        setRagDocs((prev) => prev.filter((d) => d.id !== id))
      } else {
        alert(`❌ Failed to delete document: ${data.error}`)
      }
    } catch (err: any) {
      alert(`❌ Error deleting doc: ${err.message}`)
    }
  }

  const handleToggleBot = async () => {
    setTogglingBot(true)
    const nextState = !botEnabled
    try {
      const res = await fetch('/api/ai-chat/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: nextState }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setBotEnabled(nextState)
        alert(`✅ ${data.message}`)
      } else {
        alert(`❌ ${data.error || 'Failed to update toggle.'}`)
      }
    } catch (err: any) {
      alert(`❌ Error updating AI Chatbot state: ${err.message}`)
    } finally {
      setTogglingBot(false)
    }
  }

  const fetchStats = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('site_stats')
      .select('*')
      .order('display_order')

    if (!error && data) {
      // Filter out system rows from table list
      const cleanStats = (data as SiteStat[]).filter((s) => {
        const label = (s.label || '').toLowerCase()
        const id = (s.id || '').toLowerCase()
        const val = (s.value || '').toLowerCase()

        if (label.includes('chatbot') || id.includes('chatbot')) return false
        if (label.includes('ai_') || id.includes('ai_')) return false
        if (label.startsWith('home_hero_') || id.startsWith('home_hero_')) return false
        if (label.startsWith('rag_doc_') || id.startsWith('rag_doc_')) return false
        if (val === 'true' || val === 'false') return false
        return true
      })
      setStats(cleanStats)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchStats()
    fetchBotStatus()
    fetchSiteSettings()
    fetchRagDocs()
  }, [])

  const handleOpenCreateModal = () => {
    setEditingItem(null)
    setLabel('')
    setValue('')
    setIcon('')
    setDisplayOrder(stats.length + 1)
    setFormError(null)
    setModalOpen(true)
  }

  const handleOpenEditModal = (item: SiteStat) => {
    setEditingItem(item)
    setLabel(item.label)
    setValue(item.value)
    setIcon(item.icon || '')
    setDisplayOrder(item.display_order)
    setFormError(null)
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!label.trim()) return setFormError('Stat label is required.')
    if (!value.trim()) return setFormError('Stat value is required.')

    setSaving(true)
    setFormError(null)

    if (editingItem) {
      const { error } = await supabase
        .from('site_stats')
        .update({
          label,
          value,
          icon: icon || null,
          display_order: displayOrder,
        })
        .eq('id', editingItem.id)

      if (error) {
        setFormError(error.message)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase.from('site_stats').insert([
        {
          label,
          value,
          icon: icon || null,
          display_order: displayOrder,
        },
      ])

      if (error) {
        setFormError(error.message)
        setSaving(false)
        return
      }
    }

    setSaving(false)
    setModalOpen(false)
    fetchStats()
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const { error } = await supabase.from('site_stats').delete().eq('id', deleteTarget.id)
    if (!error) {
      setStats((prev) => prev.filter((s) => s.id !== deleteTarget.id))
      setDeleteTarget(null)
    } else {
      alert(`Error deleting stat: ${error.message}`)
    }
    setDeleting(false)
  }

  const columns: Column<SiteStat>[] = [
    {
      header: 'Stat Label',
      accessorKey: 'label',
      cell: (row) => <span className="font-semibold text-white">{row.label}</span>,
    },
    {
      header: 'Metric Value',
      accessorKey: 'value',
      cell: (row) => <span className="font-mono text-lg font-bold text-orange-400">{row.value}</span>,
    },
    {
      header: 'Icon Name',
      cell: (row) => row.icon ? <span className="font-mono text-xs text-zinc-400">{row.icon}</span> : <span className="text-zinc-600">-</span>,
    },
    {
      header: 'Display Order',
      accessorKey: 'display_order',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Site Stats &amp; AI Settings</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage public website metrics and toggle the Public AI Assistant</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-semibold rounded-xl text-sm shadow-lg shadow-orange-500/20 transition-all duration-150 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Site Stat</span>
        </button>
      </div>

      {/* AI CHATBOT PUBLIC TOGGLE CARD */}
      <div className="p-6 bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-orange-500/30 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold transition-all ${
            botEnabled
              ? 'bg-gradient-to-tr from-orange-500 to-amber-500 shadow-lg shadow-orange-500/20'
              : 'bg-zinc-800 border border-zinc-700 text-zinc-500'
          }`}>
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white leading-tight">Public Website AI Assistant Widget</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                botEnabled
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {botEnabled ? '🟢 ON / VISIBLE' : '🔴 OFF / HIDDEN'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              {botEnabled
                ? 'The AI Assistant floating button ("Ask KR AI") is active on the public website for all visitors.'
                : 'The AI Assistant widget is currently HIDDEN from visitors on the public website.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleBot}
          disabled={togglingBot}
          className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50 shrink-0 ${
            botEnabled
              ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white'
              : 'bg-emerald-500 text-black hover:bg-emerald-400 font-black'
          }`}
        >
          {togglingBot ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Power className="w-4 h-4" />
          )}
          <span>{botEnabled ? 'Turn Chatbot OFF' : 'Turn Chatbot ON'}</span>
        </button>
      </div>

      {/* HOME HERO IMAGE & SIZE SCALE CONTROL CARD */}
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-5 shadow-xl">
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Home Page Hero Image &amp; Display Size</h3>
            <p className="text-xs text-zinc-400">Change the main hero banner image and adjust its scale ratio</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
              Hero Image URL (Default: /f11.png)
            </label>
            <input
              type="text"
              value={heroImageUrl}
              onChange={(e) => setHeroImageUrl(e.target.value)}
              placeholder="e.g. /f11.png or https://res.cloudinary.com/..."
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-orange-500 transition"
            />
            <p className="text-[11px] text-zinc-500">Paste your image URL or leave as <code>/f11.png</code></p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
              Image Display Scale ({heroImageScale}%)
            </label>
            <select
              value={heroImageScale}
              onChange={(e) => setHeroImageScale(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 transition cursor-pointer"
            >
              <option value={100}>100% — Normal Default Size</option>
              <option value={110}>110% — Slightly Larger (+10%)</option>
              <option value={120}>120% — Medium Scale (+20%)</option>
              <option value={130}>130% — Large Scale (+30%)</option>
              <option value={140}>140% — Extra Large (+40%)</option>
              <option value={150}>150% — Maximum Scale (+50%)</option>
              <option value={170}>170% — Ultra Scale (+70%)</option>
            </select>
            <p className="text-[11px] text-zinc-500">Increase slider to scale founder hero image size</p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSaveHeroSettings}
            disabled={savingHero}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {savingHero ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Hero Image Settings</span>
          </button>
        </div>
      </div>

      {/* PDF & DOCUMENT KNOWLEDGE BASE UPLOADER CARD FOR LANGCHAIN RAG */}
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">LangChain RAG Knowledge Base Upload</h3>
              <p className="text-xs text-zinc-400">Upload PDF documents or custom text guides for AI Chatbot answers</p>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleUploadRagDoc} className="space-y-4 bg-zinc-950 p-5 rounded-xl border border-zinc-800">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                Document Title *
              </label>
              <input
                type="text"
                required
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="e.g. KR Wedding Packages Brochure 2026"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                Import Text from File (.pdf / .txt)
              </label>
              <input
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="w-full text-xs text-zinc-400 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-500/10 file:text-purple-400 hover:file:bg-purple-500/20 cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
              Knowledge Text Content * (Fed to AI Assistant Context)
            </label>
            <textarea
              required
              rows={4}
              value={docContentText}
              onChange={(e) => setDocContentText(e.target.value)}
              placeholder="Paste service details, package pricing, shoot locations, or company FAQs..."
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-purple-500 transition resize-none font-mono text-xs"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploadingDoc}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-purple-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {uploadingDoc ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span>Add Knowledge Doc to AI RAG</span>
            </button>
          </div>
        </form>

        {/* Existing Docs List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Active RAG Knowledge Base Docs ({ragDocs.length})
          </h4>

          {ragDocs.length === 0 ? (
            <div className="p-4 border border-dashed border-zinc-800 rounded-xl text-center text-xs text-zinc-500">
              No custom PDF/Knowledge docs uploaded yet. Use the form above to add custom documents.
            </div>
          ) : (
            <div className="grid gap-2.5">
              {ragDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="w-5 h-5 text-purple-400 shrink-0" />
                    <div className="truncate">
                      <p className="font-semibold text-xs text-white truncate">{doc.title}</p>
                      <p className="text-[10px] text-zinc-500 truncate font-mono mt-0.5">
                        {doc.filename} — {doc.content_text.slice(0, 70)}...
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteRagDoc(doc.id)}
                    className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition"
                    title="Delete RAG Document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={stats}
        loading={loading}
        onEdit={(row) => handleOpenEditModal(row)}
        onDelete={(row) => setDeleteTarget(row)}
        emptyMessage="No site stats found. Click 'Add Site Stat' to create one."
      />

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Edit Site Stat' : 'Add Site Stat'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Stat Label *</label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Projects Completed"
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Metric Value *</label>
                <input
                  type="text"
                  required
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="e.g. 50+ or 3 Years"
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Icon Identifier</label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="e.g. award, camera, users"
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Display Order</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-xl text-sm shadow-lg shadow-orange-500/20 transition-all duration-150 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Stat</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Site Stat"
        description={`Are you sure you want to delete "${deleteTarget?.label}"?`}
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
