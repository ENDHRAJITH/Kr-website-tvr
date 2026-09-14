'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable, { Column } from '@/components/admin/DataTable'
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal'
import { MarketingService } from '@/types/database'
import { Megaphone } from 'lucide-react'

type ExtendedMarketingService = MarketingService & {
  service_categories?: { name: string } | null
}

export default function MarketingServicesListPage() {
  const [services, setServices] = useState<ExtendedMarketingService[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<ExtendedMarketingService | null>(null)
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()

  const fetchServices = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('marketing_services')
      .select('*, service_categories(name)')
      .order('display_order')

    if (!error && data) {
      setServices(data as ExtendedMarketingService[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const { error } = await supabase.from('marketing_services').delete().eq('id', deleteTarget.id)
    if (!error) {
      setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id))
      setDeleteTarget(null)
    } else {
      alert(`Error deleting service: ${error.message}`)
    }
    setDeleting(false)
  }

  const columns: Column<ExtendedMarketingService>[] = [
    {
      header: 'No.',
      accessorKey: 'service_no',
      cell: (row) => <span className="font-mono text-zinc-400">#{row.service_no ?? '-'}</span>,
    },
    {
      header: 'Name',
      accessorKey: 'name',
      cell: (row) => (
        <div>
          <p className="font-semibold text-white">{row.name}</p>
          {row.subtitle && <p className="text-xs text-zinc-400">{row.subtitle}</p>}
        </div>
      ),
    },
    {
      header: 'Category',
      cell: (row) => row.service_categories?.name || <span className="text-zinc-600">Uncategorized</span>,
    },
    {
      header: 'Price',
      cell: (row) =>
        row.price ? (
          <span className="font-medium text-emerald-400">
            {row.price} <span className="text-zinc-500 text-xs">{row.price_unit}</span>
          </span>
        ) : (
          <span className="text-zinc-600">Custom</span>
        ),
    },
    {
      header: 'Tag',
      cell: (row) =>
        row.project_tag ? (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-orange-400 border border-zinc-700">
            {row.project_tag}
          </span>
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
      <DataTable
        title="Marketing Services"
        subtitle="Manage digital marketing packages, SEO, social media, and campaign offerings"
        columns={columns}
        data={services}
        loading={loading}
        newUrl="/admin/marketing-services/new"
        newButtonLabel="Add Marketing Service"
        editUrl={(row) => `/admin/marketing-services/${row.id}/edit`}
        onDelete={(row) => setDeleteTarget(row)}
        emptyMessage="No marketing services found. Click 'Add Marketing Service' to create one."
      />

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Marketing Service"
        description={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
