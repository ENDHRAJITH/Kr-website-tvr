'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable, { Column } from '@/components/admin/DataTable'
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal'
import { Testimonial } from '@/types/database'
import { Star, User } from 'lucide-react'

export default function TestimonialsListPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null)
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()

  const fetchTestimonials = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order')

    if (!error && data) {
      setTestimonials(data as Testimonial[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const { error } = await supabase.from('testimonials').delete().eq('id', deleteTarget.id)
    if (!error) {
      setTestimonials((prev) => prev.filter((t) => t.id !== deleteTarget.id))
      setDeleteTarget(null)
    } else {
      alert(`Error deleting testimonial: ${error.message}`)
    }
    setDeleting(false)
  }

  const columns: Column<Testimonial>[] = [
    {
      header: 'Photo',
      cell: (row) =>
        row.photo_url ? (
          <img
            src={row.photo_url}
            alt={row.name}
            className="w-10 h-10 rounded-full object-cover border border-zinc-800"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600">
            <User className="w-5 h-5" />
          </div>
        ),
    },
    {
      header: 'Client Name',
      accessorKey: 'name',
      cell: (row) => <span className="font-semibold text-white">{row.name}</span>,
    },
    {
      header: 'Rating',
      accessorKey: 'rating',
      cell: (row) => {
        const rating = row.rating || 5
        return (
          <div className="flex items-center gap-1 text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'}`}
              />
            ))}
          </div>
        )
      },
    },
    {
      header: 'Testimonial Text',
      accessorKey: 'text',
      cell: (row) => <p className="text-xs text-zinc-400 line-clamp-2 max-w-sm">"{row.text}"</p>,
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
        title="Client Testimonials"
        subtitle="Manage client reviews and feedback displayed on the site"
        columns={columns}
        data={testimonials}
        loading={loading}
        newUrl="/admin/testimonials/new"
        newButtonLabel="Add Testimonial"
        editUrl={(row) => `/admin/testimonials/${row.id}/edit`}
        onDelete={(row) => setDeleteTarget(row)}
        emptyMessage="No testimonials found. Click 'Add Testimonial' to create one."
      />

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Testimonial"
        description={`Are you sure you want to delete the testimonial from "${deleteTarget?.name}"?`}
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
