'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable, { Column } from '@/components/admin/DataTable'
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal'
import { TeamMember } from '@/types/database'
import { Users, User, Globe, Share2, Link2 } from 'lucide-react'

export default function TeamListPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null)
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()

  const fetchMembers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('display_order')

    if (!error && data) {
      setMembers(data as TeamMember[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const { error } = await supabase.from('team_members').delete().eq('id', deleteTarget.id)
    if (!error) {
      setMembers((prev) => prev.filter((m) => m.id !== deleteTarget.id))
      setDeleteTarget(null)
    } else {
      alert(`Error deleting team member: ${error.message}`)
    }
    setDeleting(false)
  }

  const columns: Column<TeamMember>[] = [
    {
      header: 'Photo',
      cell: (row) =>
        row.photo_url ? (
          <img
            src={row.photo_url}
            alt={row.name}
            className="w-12 h-12 rounded-full object-cover border border-zinc-800"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600">
            <User className="w-6 h-6" />
          </div>
        ),
    },
    {
      header: 'Name & Role',
      accessorKey: 'name',
      cell: (row) => (
        <div>
          <p className="font-semibold text-white">{row.name}</p>
          <p className="text-xs text-orange-400 font-medium">{row.role || 'Team Member'}</p>
        </div>
      ),
    },
    {
      header: 'Bio',
      accessorKey: 'bio',
      cell: (row) =>
        row.bio ? (
          <p className="text-xs text-zinc-400 line-clamp-2 max-w-xs">{row.bio}</p>
        ) : (
          <span className="text-zinc-600">-</span>
        ),
    },
    {
      header: 'Social Links',
      cell: (row) => {
        const links = row.social_links || {}
        return (
          <div className="flex items-center gap-2 text-zinc-400">
            {links.instagram && (
              <a href={links.instagram} target="_blank" rel="noreferrer" className="hover:text-pink-400 transition-colors" title="Instagram">
                <Globe className="w-4 h-4 text-pink-400" />
              </a>
            )}
            {links.linkedin && (
              <a href={links.linkedin} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors" title="LinkedIn">
                <Share2 className="w-4 h-4 text-blue-400" />
              </a>
            )}
            {links.facebook && (
              <a href={links.facebook} target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors" title="Facebook">
                <Link2 className="w-4 h-4 text-blue-500" />
              </a>
            )}
            {!links.instagram && !links.linkedin && !links.facebook && (
              <span className="text-zinc-600 text-xs">None</span>
            )}
          </div>
        )
      },
    },
    {
      header: 'Order',
      accessorKey: 'display_order',
    },
  ]

  return (
    <div className="space-y-6">
      <DataTable
        title="Team Members"
        subtitle="Manage founders, creative leads, and team profiles"
        columns={columns}
        data={members}
        loading={loading}
        newUrl="/admin/team/new"
        newButtonLabel="Add Team Member"
        editUrl={(row) => `/admin/team/${row.id}/edit`}
        onDelete={(row) => setDeleteTarget(row)}
        emptyMessage="No team members found. Click 'Add Team Member' to create one."
      />

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Team Member"
        description={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
