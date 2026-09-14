'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Edit2, Trash2, Inbox } from 'lucide-react'
import { useAdminTheme } from '@/context/AdminThemeContext'

export type Column<T> = {
  header: string
  accessorKey?: keyof T | string
  cell?: (row: T) => React.ReactNode
}

interface DataTableProps<T extends { id: string }> {
  title?: string
  subtitle?: string
  columns: Column<T>[]
  data: T[]
  newUrl?: string
  newButtonLabel?: string
  editUrl?: (row: T) => string
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  loading?: boolean
  emptyMessage?: string
}

export default function DataTable<T extends { id: string }>({
  title,
  subtitle,
  columns,
  data,
  newUrl,
  newButtonLabel = 'Add New',
  editUrl,
  onEdit,
  onDelete,
  loading = false,
  emptyMessage = 'No items found.',
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const { theme } = useAdminTheme()
  const isDark = theme === 'dark'

  // Filter data based on search query across row string/number properties
  const filteredData = data.filter((row) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return Object.values(row as Record<string, unknown>).some((val) => {
      if (typeof val === 'string') return val.toLowerCase().includes(query)
      if (typeof val === 'number') return String(val).includes(query)
      return false
    })
  })

  return (
    <div className="space-y-6">
      {/* Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {title && (
            <h1
              className={`text-2xl font-bold tracking-tight ${
                isDark ? 'text-white' : 'text-zinc-900'
              }`}
            >
              {title}
            </h1>
          )}
          {subtitle && (
            <p className={`text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {subtitle}
            </p>
          )}
        </div>

        {newUrl && (
          <Link
            href={newUrl}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-xl text-sm shadow-md shadow-orange-500/20 transition-all duration-150 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{newButtonLabel}</span>
          </Link>
        )}
      </div>

      {/* Table Container */}
      <div
        className={`border rounded-2xl overflow-hidden transition-colors ${
          isDark
            ? 'bg-zinc-900 border-zinc-800 shadow-xl shadow-black/40'
            : 'bg-white border-zinc-200 shadow-sm'
        }`}
      >
        {/* Search Bar */}
        <div
          className={`p-4 border-b flex items-center justify-between gap-4 ${
            isDark ? 'border-zinc-800 bg-zinc-950/40' : 'border-zinc-200 bg-zinc-50'
          }`}
        >
          <div className="relative flex-1 max-w-xs">
            <Search
              className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-zinc-500' : 'text-zinc-400'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..."
              className={`w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:border-orange-500 transition-all ${
                isDark
                  ? 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500'
                  : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400'
              }`}
            />
          </div>

          <div
            className={`text-xs font-medium ${
              isDark ? 'text-zinc-500' : 'text-zinc-600'
            }`}
          >
            Showing {filteredData.length} of {data.length} entries
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table
            className={`w-full text-left text-sm ${
              isDark ? 'text-zinc-300' : 'text-zinc-800'
            }`}
          >
            <thead
              className={`text-xs font-semibold uppercase tracking-wider border-b ${
                isDark
                  ? 'bg-zinc-950 text-zinc-400 border-zinc-800'
                  : 'bg-zinc-100/80 text-zinc-700 border-zinc-200'
              }`}
            >
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className="px-6 py-4">
                    {col.header}
                  </th>
                ))}
                {(editUrl || onEdit || onDelete) && (
                  <th className="px-6 py-4 text-right">Actions</th>
                )}
              </tr>
            </thead>

            <tbody
              className={`divide-y ${
                isDark ? 'divide-zinc-800/60' : 'divide-zinc-200'
              }`}
            >
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className={`px-6 py-12 text-center ${
                      isDark ? 'text-zinc-500' : 'text-zinc-600'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                      <span>Loading dataset...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className={`px-6 py-12 text-center ${
                      isDark ? 'text-zinc-500' : 'text-zinc-600'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Inbox
                        className={`w-8 h-8 ${
                          isDark ? 'text-zinc-600' : 'text-zinc-400'
                        }`}
                      />
                      <p>{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => (
                  <tr
                    key={row.id}
                    className={`transition-colors ${
                      isDark ? 'hover:bg-zinc-800/40' : 'hover:bg-zinc-50'
                    }`}
                  >
                    {columns.map((col, idx) => (
                      <td key={idx} className="px-6 py-4">
                        {col.cell
                          ? col.cell(row)
                          : col.accessorKey
                          ? (row as any)[col.accessorKey]
                          : null}
                      </td>
                    ))}

                    {(editUrl || onEdit || onDelete) && (
                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        {editUrl ? (
                          <Link
                            href={editUrl(row)}
                            className={`inline-flex items-center justify-center p-2 rounded-lg transition-colors ${
                              isDark
                                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                            }`}
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4 text-orange-500" />
                          </Link>
                        ) : onEdit ? (
                          <button
                            onClick={() => onEdit(row)}
                            className={`inline-flex items-center justify-center p-2 rounded-lg transition-colors ${
                              isDark
                                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                            }`}
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4 text-orange-500" />
                          </button>
                        ) : null}

                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className={`inline-flex items-center justify-center p-2 rounded-lg transition-colors ${
                              isDark
                                ? 'bg-zinc-800 hover:bg-red-500/20 text-zinc-300 hover:text-red-400'
                                : 'bg-red-50 hover:bg-red-100 text-red-600'
                            }`}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

