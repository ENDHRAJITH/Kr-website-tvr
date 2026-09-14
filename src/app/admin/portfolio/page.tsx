'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable, { Column } from '@/components/admin/DataTable'
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal'
import { PortfolioItem } from '@/types/database'
import { Briefcase, Image as ImageIcon } from 'lucide-react'

export default function PortfolioListPage() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<PortfolioItem | null>(null)
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()

  const fetchItems = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .order('display_order')

    if (!error && data) {
      setItems(data as PortfolioItem[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const { error } = await supabase.from('portfolio_items').delete().eq('id', deleteTarget.id)
    if (!error) {
      setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id))
      setDeleteTarget(null)
    } else {
      alert(`Error deleting item: ${error.message}`)
    }
    setDeleting(false)
  }

  const columns: Column<PortfolioItem>[] = [
    {
      header: 'Cover Image',
      cell: (row) =>
        row.cover_image_url ? (
          <img
            src={row.cover_image_url}
            alt={row.title}
            className="w-12 h-12 rounded-lg object-cover border border-zinc-800"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600">
            <ImageIcon className="w-5 h-5" />
          </div>
        ),
    },
    {
      header: 'Title',
      accessorKey: 'title',
      cell: (row) => <span className="font-semibold text-white">{row.title}</span>,
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: (row) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
            row.category === 'studioz'
              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
              : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
          }`}
        >
          {row.category}
        </span>
      ),
    },
    {
      header: 'Gallery Images',
      cell: (row) => (
        <span className="text-xs text-zinc-400 font-mono">
          {row.gallery_urls ? `${row.gallery_urls.length} photos` : '0 photos'}
        </span>
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
      <DataTable
        title="Portfolio Showcase"
        subtitle="Manage photography and digital marketing portfolio projects"
        columns={columns}
        data={items}
        loading={loading}
        newUrl="/admin/portfolio/new"
        newButtonLabel="Add Portfolio Item"
        editUrl={(row) => `/admin/portfolio/${row.id}/edit`}
        onDelete={(row) => setDeleteTarget(row)}
        emptyMessage="No portfolio items found. Click 'Add Portfolio Item' to create one."
      />

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Portfolio Item"
        description={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
