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
      cell: (row) => <span className="font-mono text-zinc-400 font-bold whitespace-nowrap">#{row.service_no ?? '-'}</span>,
    },
    {
      header: 'Plan / Package Name',
      accessorKey: 'name',
      cell: (row) => (
        <div className="space-y-1 max-w-sm">
          <p className="font-bold text-white text-sm leading-tight">{row.name}</p>
          {row.subtitle && <p className="text-xs text-zinc-400 leading-snug">{row.subtitle}</p>}
        </div>
      ),
    },
    {
      header: 'Project Tag',
      cell: (row) =>
        row.project_tag ? (
          <span className="inline-block whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20">
            {row.project_tag}
          </span>
        ) : (
          <span className="text-zinc-600">-</span>
        ),
    },
    {
      header: 'Price Rate',
      cell: (row) =>
        row.price ? (
          <div className="whitespace-nowrap font-bold text-orange-400 font-mono text-sm">
            {row.price} <span className="text-zinc-500 text-xs font-normal">{row.price_unit}</span>
          </div>
        ) : (
          <span className="text-zinc-600">Custom Quote</span>
        ),
    },
    {
      header: 'Features / Highlights',
      cell: (row) => (
        <span className="whitespace-nowrap text-xs text-zinc-300 font-semibold">
          {row.features ? `${row.features.length} Features Included` : '0 Items'}
        </span>
      ),
    },
    {
      header: 'Order',
      accessorKey: 'display_order',
      cell: (row) => <span className="font-mono font-bold text-zinc-300">#{row.display_order}</span>,
    },
    {
      header: 'Status',
      cell: (row) => (
        <span
          className={`inline-flex items-center whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-semibold border ${
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
