'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import { useAdminTheme } from '@/context/AdminThemeContext'

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
  title?: string
  description?: string
  loading?: boolean
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  description = 'Are you sure you want to delete this item? This action cannot be undone.',
  loading = false,
}: ConfirmDeleteModalProps) {
  const { theme } = useAdminTheme()
  const isDark = theme === 'dark'

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-md border rounded-2xl p-6 shadow-2xl space-y-5 animate-scale-up ${
          isDark
            ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
            : 'bg-white border-zinc-200 text-zinc-900 shadow-zinc-400'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3
              className={`text-lg font-bold leading-tight ${
                isDark ? 'text-white' : 'text-zinc-900'
              }`}
            >
              {title}
            </h3>
            <p
              className={`text-xs leading-relaxed ${
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              }`}
            >
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors disabled:opacity-50 ${
              isDark
                ? 'border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                : 'border-zinc-200 text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-lg shadow-red-600/20 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Item</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

