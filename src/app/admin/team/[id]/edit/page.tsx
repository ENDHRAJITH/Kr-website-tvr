'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ImageUploader from '@/components/admin/ImageUploader'
import { TeamMember } from '@/types/database'
import { ArrowLeft, Loader2, Save, Globe, Share2, Link2 } from 'lucide-react'

export default function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()

  const [initialLoading, setInitialLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [bio, setBio] = useState('')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [youtube, setYoutube] = useState('')
  const [instagram, setInstagram] = useState('')
  const [facebook, setFacebook] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [displayOrder, setDisplayOrder] = useState<number>(0)

  useEffect(() => {
    const fetchData = async () => {
      setInitialLoading(true)

      const { data, error: fetchError } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError || !data) {
        setError('Team member record not found.')
        setInitialLoading(false)
        return
      }

      const member = data as TeamMember
      setName(member.name || '')
      setRole(member.role || '')
      setBio(member.bio || '')
      setPhotoUrl(member.photo_url || null)
      setDisplayOrder(member.display_order ?? 0)

      const links = member.social_links || {}
      setYoutube(links.youtube || '')
      setInstagram(links.instagram || '')
      setFacebook(links.facebook || '')
      setWhatsapp(links.whatsapp || '')
      setLinkedin(links.linkedin || '')

      setInitialLoading(false)
    }

    fetchData()
  }, [id, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return setError('Team member name is required.')

    setLoading(true)
    setError(null)

    const socialLinks: Record<string, string> = {}
    if (youtube.trim()) socialLinks.youtube = youtube.trim()
    if (instagram.trim()) socialLinks.instagram = instagram.trim()
    if (facebook.trim()) socialLinks.facebook = facebook.trim()
    if (whatsapp.trim()) socialLinks.whatsapp = whatsapp.trim()
    if (linkedin.trim()) socialLinks.linkedin = linkedin.trim()

    const { error: updateError } = await supabase
      .from('team_members')
      .update({
        name,
        role: role || null,
        bio: bio || null,
        photo_url: photoUrl,
        social_links: Object.keys(socialLinks).length > 0 ? socialLinks : null,
        display_order: displayOrder,
      })
      .eq('id', id)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    router.push('/admin/team')
    router.refresh()
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/team"
          className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Edit Team Member</h1>
          <p className="text-sm text-zinc-400">Update team member profile details</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Karthik Ram"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Role / Title</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Founder & Lead Photographer"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          {/* Display Order */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Display Order</label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Short Bio</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Brief bio..."
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
          />
        </div>

        {/* Photo Uploader */}
        <ImageUploader
          label="Profile Photo"
          value={photoUrl}
          onChange={(url) => setPhotoUrl(url)}
        />

        {/* Social Links */}
        <div className="space-y-4 pt-2 border-t border-zinc-800">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">Social Media & Contact Links</label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-red-500" />
                <span>YouTube URL</span>
              </label>
              <input
                type="url"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="https://youtube.com/@..."
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-pink-400" />
                <span>Instagram URL</span>
              </label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-blue-500" />
                <span>Facebook URL</span>
              </label>
              <input
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Link / Number</span>
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="https://wa.me/919626759859 or +91..."
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-blue-400" />
                <span>LinkedIn URL</span>
              </label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-zinc-800">
          <Link
            href="/admin/team"
            className="px-5 py-3 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white text-sm font-medium transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-xl text-sm shadow-lg shadow-orange-500/20 transition-all duration-150 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
