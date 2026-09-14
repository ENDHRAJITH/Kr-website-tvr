'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable, { Column } from '@/components/admin/DataTable'
import { Enquiry, EnquiryItem } from '@/types/database'
import { Inbox, Phone, Calendar, MessageSquare, Tag, CheckCircle2, Clock, XCircle, Mail } from 'lucide-react'

type ExtendedEnquiry = Enquiry & {
  enquiry_items?: EnquiryItem[]
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<ExtendedEnquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [resendingId, setResendingId] = useState<string | null>(null)
  const supabase = createClient()

  const fetchEnquiries = async () => {
    setLoading(true)

    // Fetch Enquiries with Enquiry Items
    const { data: enquiriesData, error: eError } = await supabase
      .from('enquiries')
      .select('*, enquiry_items(*)')
      .order('created_at', { ascending: false })

    if (!eError && enquiriesData) {
      setEnquiries(enquiriesData as ExtendedEnquiry[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchEnquiries()
  }, [])

  const handleStatusChange = async (enquiryId: string, newStatus: 'new' | 'contacted' | 'closed') => {
    setUpdatingId(enquiryId)
    const { error } = await supabase
      .from('enquiries')
      .update({ status: newStatus })
      .eq('id', enquiryId)

    if (!error) {
      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
      )
    } else {
      alert(`Failed to update status: ${error.message}`)
    }
    setUpdatingId(null)
  }

  const handleResendEmail = async (enquiryId: string) => {
    setResendingId(enquiryId)
    try {
      const res = await fetch('/api/enquiries/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enquiryId }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        alert(`✅ ${data.message || 'Email resent successfully!'}`)
      } else {
        alert(`❌ Failed to resend email: ${data.error || 'Unknown error'}`)
      }
    } catch (err: any) {
      console.error(err)
      alert(`❌ Error resending email: ${err.message || 'Network error'}`)
    } finally {
      setResendingId(null)
    }
  }

  const getWhatsAppDraftUrl = (row: ExtendedEnquiry) => {
    const items = row.enquiry_items || []
    const servicesList = items.length
      ? items.map((x) => `• ${x.service_name}`).join('\n')
      : '• General Enquiry'

    const text = `Hello KR Digital Marketing & Studioz,\n\nEnquiry Summary:\n• Client Name: ${row.name}\n• Phone: ${row.phone}\n• Category/Event: ${row.event_type || 'N/A'}\n\nSelected Services:\n${servicesList}${
      row.message ? `\n\nClient Message:\n${row.message}` : ''
    }`

    // Uses Karthik's WhatsApp number (919626759859)
    return `https://wa.me/919626759859?text=${encodeURIComponent(text)}`
  }

  const getClientWhatsAppUrl = (row: ExtendedEnquiry) => {
    const cleanPhone = (row.phone || '').replace(/[^0-9]/g, '')
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone
    const text = `Hello ${row.name}, thank you for reaching out to KR Digital Marketing & Studioz! Regarding your enquiry for ${row.event_type || 'our services'}...`
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`
  }

  const columns: Column<ExtendedEnquiry>[] = [
    {
      header: 'Client Info',
      accessorKey: 'name',
      cell: (row) => (
        <div className="space-y-1">
          <p className="font-bold text-white leading-tight">{row.name}</p>
          <div className="flex items-center gap-1.5 text-xs text-orange-400 font-mono">
            <Phone className="w-3 h-3" />
            <a href={`tel:${row.phone}`} className="hover:underline">
              {row.phone}
            </a>
          </div>
        </div>
      ),
    },
    {
      header: 'Event Type',
      cell: (row) =>
        row.event_type ? (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
            {row.event_type}
          </span>
        ) : (
          <span className="text-zinc-600">-</span>
        ),
    },
    {
      header: 'Selected Services',
      cell: (row) => {
        const items = row.enquiry_items || []
        if (items.length === 0) return <span className="text-zinc-600 text-xs">General Enquiry</span>
        return (
          <div className="flex flex-wrap gap-1.5 max-w-xs">
            {items.map((item) => (
              <span
                key={item.id}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
                  item.service_division === 'studioz'
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                }`}
              >
                <Tag className="w-2.5 h-2.5" />
                <span>{item.service_name}</span>
              </span>
            ))}
          </div>
        )
      },
    },
    {
      header: 'Message',
      accessorKey: 'message',
      cell: (row) =>
        row.message ? (
          <p className="text-xs text-zinc-400 line-clamp-2 max-w-xs">{row.message}</p>
        ) : (
          <span className="text-zinc-600 text-xs">No message</span>
        ),
    },
    {
      header: 'Submitted',
      cell: (row) => (
        <span className="text-xs text-zinc-400 font-mono">
          {new Date(row.created_at).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (row) => (
        <select
          value={row.status}
          disabled={updatingId === row.id}
          onChange={(e) => handleStatusChange(row.id, e.target.value as 'new' | 'contacted' | 'closed')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border focus:outline-none cursor-pointer transition-colors ${
            row.status === 'new'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
              : row.status === 'contacted'
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
          }`}
        >
          <option value="new" className="bg-zinc-900 text-amber-400">
            🟡 New Lead
          </option>
          <option value="contacted" className="bg-zinc-900 text-blue-400">
            🔵 Contacted
          </option>
          <option value="closed" className="bg-zinc-900 text-emerald-400">
            🟢 Closed / Won
          </option>
        </select>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex flex-col gap-1.5 min-w-[140px]">
          {/* Resend Email Button */}
          <button
            onClick={() => handleResendEmail(row.id)}
            disabled={resendingId === row.id}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
          >
            {resendingId === row.id ? (
              <Clock className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Mail className="w-3.5 h-3.5" />
            )}
            <span>{resendingId === row.id ? 'Sending...' : 'Resend Email'}</span>
          </button>

          {/* WhatsApp Enquiry Draft to Karthik */}
          <a
            href={getWhatsAppDraftUrl(row)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white" />
            <span>WA Draft (Karthik)</span>
          </a>

          {/* Direct WhatsApp to Client */}
          {row.phone && (
            <a
              href={getClientWhatsAppUrl(row)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700 hover:text-white transition-all cursor-pointer"
            >
              <span>Chat w/ Client &rarr;</span>
            </a>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Client Enquiries</h1>
          <p className="text-sm text-zinc-400 mt-1">Review incoming leads from the website enquiry cart form</p>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={enquiries}
        loading={loading}
        emptyMessage="No client enquiries submitted yet."
      />
    </div>
  )
}
