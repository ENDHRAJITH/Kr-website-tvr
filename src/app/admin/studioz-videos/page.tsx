'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable, { Column } from '@/components/admin/DataTable'
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal'
import { StudiozVideoItem } from '@/components/public/StudiozVideoMarquee'
import { FALLBACK_STUDIOZ_VIDEOS } from '@/lib/constants/fallbackData'
import { Video, Image as ImageIcon, ExternalLink } from 'lucide-react'

type VideoRow = StudiozVideoItem & {
  is_active?: boolean
  display_order?: number
}

export default function StudiozVideosListPage() {
  const [videos, setVideos] = useState<VideoRow[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<VideoRow | null>(null)
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()

  const fetchVideos = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('studioz_videos')
      .select('*')
      .order('display_order', { ascending: true })

    setVideos((data as VideoRow[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)

    // Check if ID is a valid UUID format
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(deleteTarget.id)

    if (isUuid) {
      const { error } = await supabase.from('studioz_videos').delete().eq('id', deleteTarget.id)
      if (error) {
        console.warn('Supabase delete error (removing locally):', error.message)
      }
    }

    const updated = videos.filter((s) => s.id !== deleteTarget.id)
    setVideos(updated)
    try {
      localStorage.setItem('kr_studioz_videos', JSON.stringify(updated))
    } catch (e) {
      // ignore
    }
    setDeleteTarget(null)
    setDeleting(false)
  }

  const columns: Column<VideoRow>[] = [
    {
      header: 'Thumbnail',
      cell: (row) =>
        row.thumbnail_url ? (
          <img
            src={row.thumbnail_url}
            alt={row.title}
            className="w-16 h-10 rounded-md object-cover border border-zinc-800"
          />
        ) : (
          <div className="w-16 h-10 rounded-md bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600">
            <ImageIcon className="w-4 h-4" />
          </div>
        ),
    },
    {
      header: 'Title & Category',
      cell: (row) => (
        <div>
          <p className="font-bold text-white text-sm">{row.title}</p>
          <span className="text-[10px] font-bold text-[#F97316] uppercase tracking-wider">
            {row.category || 'Film'}
          </span>
        </div>
      ),
    },
    {
      header: 'Video Link',
      cell: (row) => (
        <a
          href={row.video_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-orange-400 hover:underline flex items-center gap-1 max-w-[200px] truncate"
        >
          <Video className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{row.video_url}</span>
          <ExternalLink className="w-3 h-3 shrink-0" />
        </a>
      ),
    },
    {
      header: 'Order',
      accessorKey: 'display_order',
      cell: (row) => <span className="font-mono text-zinc-400">#{row.display_order ?? 1}</span>,
    },
    {
      header: 'Status',
      cell: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
            row.is_active !== false
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-zinc-800 text-zinc-500 border-zinc-700'
          }`}
        >
          {row.is_active !== false ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <DataTable
        title="Featured Video Showcases"
        subtitle="Manage YouTube, Instagram Reel, and MP4 video items in the Studioz Hero Carousel"
        columns={columns}
        data={videos}
        loading={loading}
        newUrl="/admin/studioz-videos/new"
        newButtonLabel="Add Video Showcase"
        editUrl={(row) => `/admin/studioz-videos/${row.id}/edit`}
        onDelete={(row) => setDeleteTarget(row)}
        emptyMessage="No video showcases found. Click 'Add Video Showcase' to create one."
      />

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Video Showcase"
        description={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
