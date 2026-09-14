'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable, { Column } from '@/components/admin/DataTable'
import ImageUploader from '@/components/admin/ImageUploader'
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal'
import { ClientLogo } from '@/types/database'
import { Plus, X, Loader2, Save, ExternalLink } from 'lucide-react'

export default function ClientLogosPage() {
  const [logos, setLogos] = useState<ClientLogo[]>([])
  const [loading, setLoading] = useState(true)

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ClientLogo | null>(null)
  const [name, setName] = useState('')
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [link, setLink] = useState('')
  const [displayOrder, setDisplayOrder] = useState<number>(0)
  const [isActive, setIsActive] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<ClientLogo | null>(null)
  const [deleting, setDeleting] = useState(false)

  const supabase = createClient()

  const fetchLogos = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('client_logos')
      .select('*')
      .order('display_order')

    if (!error && data) {
      setLogos(data as ClientLogo[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchLogos()
  }, [])

  const handleOpenCreateModal = () => {
    setEditingItem(null)
    setName('')
    setLogoUrl(null)
    setLink('')
    setDisplayOrder(logos.length + 1)
    setIsActive(true)
    setFormError(null)
    setModalOpen(true)
  }

  const handleOpenEditModal = (item: ClientLogo) => {
    setEditingItem(item)
    setName(item.name)
    setLogoUrl(item.logo_url)
    setLink(item.link || '')
    setDisplayOrder(item.display_order)
    setIsActive(item.is_active)
    setFormError(null)
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return setFormError('Client name is required.')
    if (!logoUrl) return setFormError('Logo image is required.')

    setSaving(true)
    setFormError(null)

    if (editingItem) {
      const { error } = await supabase
        .from('client_logos')
        .update({
          name,
          logo_url: logoUrl,
          link: link || null,
          display_order: displayOrder,
          is_active: isActive,
        })
        .eq('id', editingItem.id)

      if (error) {
        setFormError(error.message)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase.from('client_logos').insert([
        {
          name,
          logo_url: logoUrl,
          link: link || null,
          display_order: displayOrder,
          is_active: isActive,
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
    fetchLogos()
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const { error } = await supabase.from('client_logos').delete().eq('id', deleteTarget.id)
    if (!error) {
      setLogos((prev) => prev.filter((l) => l.id !== deleteTarget.id))
      setDeleteTarget(null)
    } else {
      alert(`Error deleting client logo: ${error.message}`)
    }
    setDeleting(false)
  }

  const columns: Column<ClientLogo>[] = [
    {
      header: 'Logo Preview',
      cell: (row) => (
        <div className="w-16 h-10 p-1 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center">
          <img src={row.logo_url} alt={row.name} className="max-w-full max-h-full object-contain" />
        </div>
      ),
    },
    {
      header: 'Client Name',
      accessorKey: 'name',
      cell: (row) => <span className="font-semibold text-white">{row.name}</span>,
    },
    {
      header: 'Website Link',
      cell: (row) =>
        row.link ? (
          <a
            href={row.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-orange-400 hover:underline"
          >
            <span>Visit site</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-zinc-600">-</span>
        ),
    },
    {
      header: 'Order',
      accessorKey: 'display_order',
    },
    {
      header: 'Status',
      cell: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
            row.is_active
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-zinc-800 text-zinc-500 border-zinc-700'
          }`}
        >
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Client Logos</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage corporate client logos and brand partner carousels</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-semibold rounded-xl text-sm shadow-lg shadow-orange-500/20 transition-all duration-150 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Client Logo</span>
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={logos}
        loading={loading}
        onEdit={(row) => handleOpenEditModal(row)}
        onDelete={(row) => setDeleteTarget(row)}
        emptyMessage="No client logos found. Click 'Add Client Logo' to upload one."
      />

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Edit Client Logo' : 'Add Client Logo'}
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
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Client Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme Corporation"
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>

              <ImageUploader
                label="Client Logo Image *"
                value={logoUrl}
                onChange={(url) => setLogoUrl(url)}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Client Website Link</label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://clientwebsite.com"
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

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="logo_is_active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
                />
                <label htmlFor="logo_is_active" className="text-xs font-medium text-white cursor-pointer select-none">
                  Active on Public Site
                </label>
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
                      <span>Save Logo</span>
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
        title="Delete Client Logo"
        description={`Are you sure you want to delete the logo for "${deleteTarget?.name}"?`}
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
