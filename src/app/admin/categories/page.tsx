'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable, { Column } from '@/components/admin/DataTable'
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal'
import { useAdminTheme } from '@/context/AdminThemeContext'
import { ServiceCategory } from '@/types/database'
import { FolderTree, Plus, X, Loader2, Save } from 'lucide-react'

export default function AdminCategoriesPage() {
  const [activeTab, setActiveTab] = useState<'studioz' | 'marketing'>('studioz')
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const { theme } = useAdminTheme()
  const isDark = theme === 'dark'

  // Modal State for Create / Edit
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null)
  const [formName, setFormName] = useState('')
  const [formSlug, setFormSlug] = useState('')
  const [formDisplayOrder, setFormDisplayOrder] = useState<number>(0)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState<ServiceCategory | null>(null)
  const [deleting, setDeleting] = useState(false)

  const supabase = createClient()

  const fetchCategories = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('display_order')

    if (!error && data) {
      setCategories(data as ServiceCategory[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const currentTabCategories = categories.filter((c) => c.division === activeTab)

  const handleOpenCreateModal = () => {
    setEditingCategory(null)
    setFormName('')
    setFormSlug('')
    setFormDisplayOrder(currentTabCategories.length + 1)
    setFormError(null)
    setModalOpen(true)
  }

  const handleOpenEditModal = (cat: ServiceCategory) => {
    setEditingCategory(cat)
    setFormName(cat.name)
    setFormSlug(cat.slug)
    setFormDisplayOrder(cat.display_order)
    setFormError(null)
    setModalOpen(true)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setFormName(val)
    if (!editingCategory) {
      // Auto-generate slug for new category
      const slugVal = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
      setFormSlug(slugVal)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return setFormError('Category name is required.')
    if (!formSlug.trim()) return setFormError('Category slug is required.')

    setSaving(true)
    setFormError(null)

    if (editingCategory) {
      const { error } = await supabase
        .from('service_categories')
        .update({
          name: formName,
          slug: formSlug,
          display_order: formDisplayOrder,
        })
        .eq('id', editingCategory.id)

      if (error) {
        setFormError(error.message)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase.from('service_categories').insert([
        {
          division: activeTab,
          name: formName,
          slug: formSlug,
          display_order: formDisplayOrder,
        },
      ])

      if (error) {
        setFormError(error.message)
        setSaving(false)
        return
      }
    }

    setSaving(false)
    setModalOpen(false)
    fetchCategories()
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const { error } = await supabase.from('service_categories').delete().eq('id', deleteTarget.id)
    if (!error) {
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id))
      setDeleteTarget(null)
    } else {
      alert(`Error deleting category: ${error.message}`)
    }
    setDeleting(false)
  }

  const columns: Column<ServiceCategory>[] = [
    {
      header: 'Category Name',
      accessorKey: 'name',
      cell: (row) => (
        <span
          className={`font-semibold ${
            isDark ? 'text-white' : 'text-zinc-900'
          }`}
        >
          {row.name}
        </span>
      ),
    },
    {
      header: 'Slug',
      accessorKey: 'slug',
      cell: (row) => (
        <span className={`font-mono text-xs ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
          {row.slug}
        </span>
      ),
    },
    {
      header: 'Display Order',
      accessorKey: 'display_order',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Top Header & Division Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}
          >
            Service Categories
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Manage categories for Studioz and Marketing divisions
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-xl text-sm shadow-md shadow-orange-500/20 transition-all duration-150 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Category ({activeTab === 'studioz' ? 'Studioz' : 'Marketing'})</span>
        </button>
      </div>

      {/* Tabs */}
      <div
        className={`flex items-center gap-2 border-b pb-1 ${
          isDark ? 'border-zinc-800' : 'border-zinc-200'
        }`}
      >
        <button
          onClick={() => setActiveTab('studioz')}
          className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
            activeTab === 'studioz'
              ? isDark
                ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                : 'bg-orange-500/15 text-orange-600 border border-orange-500/30'
              : isDark
              ? 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200/80 bg-white'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Studioz Categories</span>
          <span
            className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
              isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200 text-zinc-800'
            }`}
          >
            {categories.filter((c) => c.division === 'studioz').length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('marketing')}
          className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
            activeTab === 'marketing'
              ? isDark
                ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                : 'bg-orange-500/15 text-orange-600 border border-orange-500/30'
              : isDark
              ? 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200/80 bg-white'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Marketing Categories</span>
          <span
            className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
              isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200 text-zinc-800'
            }`}
          >
            {categories.filter((c) => c.division === 'marketing').length}
          </span>
        </button>
      </div>

      {/* Table List */}
      <DataTable
        columns={columns}
        data={currentTabCategories}
        loading={loading}
        onEdit={(row) => handleOpenEditModal(row)}
        onDelete={(row) => setDeleteTarget(row)}
        emptyMessage={`No ${activeTab} categories found. Click 'Add Category' to create one.`}
      />

      {/* Create / Edit Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div
            className={`w-full max-w-md border rounded-2xl p-6 shadow-2xl space-y-5 ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 text-white'
                : 'bg-white border-zinc-200 text-zinc-900'
            }`}
          >
            <div
              className={`flex items-center justify-between border-b pb-3 ${
                isDark ? 'border-zinc-800' : 'border-zinc-200'
              }`}
            >
              <h3
                className={`text-lg font-bold ${
                  isDark ? 'text-white' : 'text-zinc-900'
                }`}
              >
                {editingCategory ? 'Edit Category' : `Add ${activeTab === 'studioz' ? 'Studioz' : 'Marketing'} Category`}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className={`p-1 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    isDark ? 'text-zinc-300' : 'text-zinc-700'
                  }`}
                >
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={handleNameChange}
                  placeholder="e.g. Portrait Photography"
                  className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-orange-500 ${
                    isDark
                      ? 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    isDark ? 'text-zinc-300' : 'text-zinc-700'
                  }`}
                >
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="e.g. portrait-photography"
                  className={`w-full px-4 py-2.5 border rounded-xl text-sm font-mono focus:outline-none focus:border-orange-500 ${
                    isDark
                      ? 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    isDark ? 'text-zinc-300' : 'text-zinc-700'
                  }`}
                >
                  Display Order
                </label>
                <input
                  type="number"
                  value={formDisplayOrder}
                  onChange={(e) => setFormDisplayOrder(Number(e.target.value))}
                  className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-orange-500 ${
                    isDark
                      ? 'bg-zinc-950 border-zinc-800 text-white'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                />
              </div>

              <div
                className={`flex items-center justify-end gap-3 pt-4 border-t ${
                  isDark ? 'border-zinc-800' : 'border-zinc-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                    isDark
                      ? 'border-zinc-800 text-zinc-400 hover:text-white'
                      : 'border-zinc-200 text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-xl text-sm shadow-md shadow-orange-500/20 transition-all duration-150 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Category</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Service Category"
        description={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}

