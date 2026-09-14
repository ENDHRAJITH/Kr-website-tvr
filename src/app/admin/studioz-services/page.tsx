'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable, { Column } from '@/components/admin/DataTable'
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal'
import { StudiozService } from '@/types/database'
import { Camera, Image as ImageIcon } from 'lucide-react'

type ExtendedStudiozService = StudiozService & {
  service_categories?: { name: string } | null
}

export default function StudiozServicesListPage() {
  const [services, setServices] = useState<ExtendedStudiozService[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<ExtendedStudiozService | null>(null)
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()

  const fetchServices = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('studioz_services')
      .select('*, service_categories(name)')
      .order('display_order')

    if (!error && data) {
      setServices(data as ExtendedStudiozService[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const { error } = await supabase.from('studioz_services').delete().eq('id', deleteTarget.id)
    if (!error) {
      setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id))
      setDeleteTarget(null)
    } else {
      alert(`Error deleting service: ${error.message}`)
    }
    setDeleting(false)
  }

  const columns: Column<ExtendedStudiozService>[] = [
    {
      header: 'Hero Image',
      cell: (row) =>
        row.hero_image_url ? (
          <img
            src={row.hero_image_url}
            alt={row.name}
            className="w-12 h-12 rounded-lg object-cover border border-zinc-800"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600">
            <ImageIcon className="w-5 h-5" />
          </div>
        ),
    },
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
          {row.label && <span className="text-[10px] font-medium text-orange-400 uppercase tracking-wider">{row.label}</span>}
        </div>
      ),
    },
    {
      header: 'Category',
      cell: (row) => row.service_categories?.name || <span className="text-zinc-600">Uncategorized</span>,
    },
    {
      header: 'Price',
      accessorKey: 'price',
      cell: (row) => row.price || <span className="text-zinc-600">N/A</span>,
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
        title="Studioz Services"
        subtitle="Manage photography, videography, and event package offerings"
        columns={columns}
        data={services}
        loading={loading}
        newUrl="/admin/studioz-services/new"
        newButtonLabel="Add Studioz Service"
        editUrl={(row) => `/admin/studioz-services/${row.id}/edit`}
        onDelete={(row) => setDeleteTarget(row)}
        emptyMessage="No Studioz services found. Click 'Add Studioz Service' to create one."
      />

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Studioz Service"
        description={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
