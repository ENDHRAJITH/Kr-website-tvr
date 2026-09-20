'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable, { Column } from '@/components/admin/DataTable'
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal'
import { StudiozService, WeddingPackage } from '@/types/database'
import { Camera, Image as ImageIcon, Search, Filter, HeartHandshake, Layers } from 'lucide-react'

type StudiozTabMode = 'wedding' | 'studioz'

type ExtendedStudiozService = StudiozService & {
  service_categories?: { name: string } | null
}

export default function StudiozServicesListPage() {
  const [activeTab, setActiveTab] = useState<StudiozTabMode>('wedding')

  // Data state
  const [weddingPackages, setWeddingPackages] = useState<WeddingPackage[]>([])
  const [studiozServices, setStudiozServices] = useState<ExtendedStudiozService[]>([])
  const [loading, setLoading] = useState(true)

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [religionFilter, setReligionFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const supabase = createClient()

  const fetchServices = async () => {
    setLoading(true)
    const [weddingRes, studiozRes] = await Promise.all([
      supabase.from('wedding_packages').select('*').order('display_order'),
      supabase.from('studioz_services').select('*, service_categories(name)').order('display_order'),
    ])

    setWeddingPackages(weddingRes.data || [])
    setStudiozServices(studiozRes.data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const tableName = activeTab === 'wedding' ? 'wedding_packages' : 'studioz_services'
    const { error } = await supabase.from(tableName).delete().eq('id', deleteTarget.id)

    if (!error) {
      if (activeTab === 'wedding') {
        setWeddingPackages((prev) => prev.filter((s) => s.id !== deleteTarget.id))
      } else {
        setStudiozServices((prev) => prev.filter((s) => s.id !== deleteTarget.id))
      }
      setDeleteTarget(null)
    } else {
      alert(`Error deleting record: ${error.message}`)
    }
    setDeleting(false)
  }

  // Filtered Wedding Packages
  const filteredWeddingPackages = weddingPackages.filter((wp) => {
    const matchesSearch =
      wp.plan_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (wp.religion && wp.religion.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (wp.price && wp.price.toLowerCase().includes(searchQuery.toLowerCase()))

    if (religionFilter === 'all') return matchesSearch
    return matchesSearch && wp.religion.toLowerCase() === religionFilter.toLowerCase()
  })

  // Filtered Studioz Services
  const filteredStudiozServices = studiozServices.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.label && s.label.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.price && s.price.toLowerCase().includes(searchQuery.toLowerCase()))

    if (categoryFilter === 'all') return matchesSearch
    const catName = (s.service_categories?.name || s.label || '').toLowerCase()
    return matchesSearch && catName.includes(categoryFilter.toLowerCase())
  })

  // Table Columns for Wedding Packages
  const weddingColumns: Column<WeddingPackage>[] = [
    {
      header: 'Hero Image',
      cell: (row) =>
        row.hero_image_url ? (
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 group shrink-0">
            <img
              src={row.hero_image_url}
              alt={row.plan_name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600 shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
        ),
    },
    {
      header: 'Plan Code',
      accessorKey: 'plan_code',
      cell: (row) => (
        <span className="inline-block whitespace-nowrap font-mono text-xs font-bold text-orange-400 px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 shadow-sm">
          PLAN {row.plan_code}
        </span>
      ),
    },
    {
      header: 'Package Name',
      accessorKey: 'plan_name',
      cell: (row) => (
        <div className="space-y-1 max-w-xs">
          <p className="font-bold text-white text-sm leading-tight">{row.plan_name}</p>
          {row.tagline && <p className="text-xs text-zinc-400 leading-snug line-clamp-2">{row.tagline}</p>}
          {row.badge && (
            <span className="inline-block mt-1 whitespace-nowrap px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 border border-orange-500/30">
              {row.badge}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Religion / Tradition',
      cell: (row) => (
        <span className="inline-flex items-center whitespace-nowrap px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-zinc-800/90 text-zinc-200 border border-zinc-700">
          {row.religion} WEDDING
        </span>
      ),
    },
    {
      header: 'Price Rate',
      accessorKey: 'price',
      cell: (row) => (
        <span className="whitespace-nowrap font-bold text-orange-400 font-mono text-sm">
          {row.price}
        </span>
      ),
    },
    {
      header: 'Inclusions',
      cell: (row) => {
        const pvCount = row.photo_video_inclusions?.length || 0
        const delCount = row.deliverables_inclusions?.length || 0
        return (
          <div className="text-xs space-y-1 whitespace-nowrap">
            <div className="flex items-center gap-1.5 font-bold text-zinc-200">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span>{pvCount + delCount} Total Items</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              {pvCount} Photo/Video • {delCount} Deliverables
            </p>
          </div>
        )
      },
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

  // Table Columns for Studioz & Special Services
  const studiozColumns: Column<ExtendedStudiozService>[] = [
    {
      header: 'Hero Image',
      cell: (row) =>
        row.hero_image_url ? (
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 group shrink-0">
            <img
              src={row.hero_image_url}
              alt={row.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600 shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
        ),
    },
    {
      header: 'No.',
      accessorKey: 'service_no',
      cell: (row) => <span className="font-mono text-zinc-400 font-bold">#{row.service_no ?? '-'}</span>,
    },
    {
      header: 'Service Name',
      accessorKey: 'name',
      cell: (row) => (
        <div className="max-w-xs space-y-0.5">
          <p className="font-bold text-white text-sm">{row.name}</p>
          {row.description && <p className="text-xs text-zinc-400 line-clamp-1">{row.description}</p>}
        </div>
      ),
    },
    {
      header: 'Category / Tag',
      cell: (row) => (
        <span className="inline-block whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold bg-zinc-800/90 text-zinc-200 border border-zinc-700">
          {row.label || row.service_categories?.name || 'Special Package'}
        </span>
      ),
    },
    {
      header: 'Price Rate',
      accessorKey: 'price',
      cell: (row) => (
        <span className="whitespace-nowrap font-bold text-orange-400 font-mono text-sm">
          {row.price || <span className="text-zinc-600">N/A</span>}
        </span>
      ),
    },
    {
      header: 'Inclusions',
      cell: (row) => (
        <span className="whitespace-nowrap text-xs text-zinc-300 font-semibold">
          {row.cover_points ? `${row.cover_points.length} Cover Items` : '0 Items'}
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
      {/* Top Section Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-2 bg-zinc-950 border border-zinc-800 rounded-2xl">
        <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('wedding')}
            className={`flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === 'wedding'
                ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Wedding Packages ({weddingPackages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('studioz')}
            className={`flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === 'studioz'
                ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Studioz & Special Services ({studiozServices.length})</span>
          </button>
        </div>
      </div>

      {/* Sub-Filter Bar & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-orange-500" /> Filter:
          </span>

          {activeTab === 'wedding' ? (
            <>
              {[
                { id: 'all', label: 'All Religions' },
                { id: 'hindu', label: 'Hindu Wedding' },
                { id: 'christian', label: 'Christian Wedding' },
                { id: 'muslim', label: 'Muslim Wedding' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setReligionFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    religionFilter === tab.id
                      ? 'bg-orange-500 text-black shadow-md shadow-orange-500/20'
                      : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </>
          ) : (
            <>
              {[
                { id: 'all', label: 'All Services' },
                { id: 'special', label: 'Special Packages' },
                { id: 'baby', label: 'Baby & Ceremonies' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCategoryFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    categoryFilter === tab.id
                      ? 'bg-orange-500 text-black shadow-md shadow-orange-500/20'
                      : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </>
          )}
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'wedding' ? 'Search wedding packages...' : 'Search studioz services...'}
            className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Main Data Table */}
      {activeTab === 'wedding' ? (
        <DataTable
          title="Wedding Packages Management"
          subtitle="Manage Hindu, Christian, and Muslim packages (Plan A, Plan B, Plan C)"
          columns={weddingColumns}
          data={filteredWeddingPackages}
          loading={loading}
          newUrl="/admin/studioz-services/wedding-packages/new"
          newButtonLabel="Add Wedding Package"
          editUrl={(row) => `/admin/studioz-services/wedding-packages/${row.id}/edit`}
          onDelete={(row) => setDeleteTarget({ id: row.id, name: row.plan_name })}
          emptyMessage="No wedding packages found matching your filter."
        />
      ) : (
        <DataTable
          title="Studioz Services & Special Packages"
          subtitle="Manage event photography, videography, and special function packages"
          columns={studiozColumns}
          data={filteredStudiozServices}
          loading={loading}
          newUrl="/admin/studioz-services/new"
          newButtonLabel="Add Studioz Service"
          editUrl={(row) => `/admin/studioz-services/${row.id}/edit`}
          onDelete={(row) => setDeleteTarget({ id: row.id, name: row.name })}
          emptyMessage="No studioz services found matching your filter."
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title={activeTab === 'wedding' ? 'Delete Wedding Package' : 'Delete Studioz Service'}
        description={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}

