'use client'

import { useState, useEffect } from 'react'
import { KeyRound, UserPlus, ShieldCheck, Trash2, Loader2, CheckCircle2, AlertCircle, Lock, User, Mail, Shield } from 'lucide-react'

interface AdminUser {
  id: string
  username: string
  email: string
  name: string
  role: string
  is_active: boolean
  created_at: string
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'password' | 'users'>('password')

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Users Management State
  const [users, setUsers] = useState<AdminUser[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [userModalOpen, setUserModalOpen] = useState(false)

  // New User Form State
  const [newName, setNewName] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newUserPassword, setNewUserPassword] = useState('')
  const [newRole, setNewRole] = useState('admin')
  const [userSaving, setUserSaving] = useState(false)
  const [userFormError, setUserFormError] = useState<string | null>(null)

  const fetchUsers = async () => {
    setUsersLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      if (data.users) {
        setUsers(data.users)
      }
    } catch (err) {
      console.warn('Failed to fetch admin users:', err)
    } finally {
      setUsersLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMessage(null)

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters long.' })
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New password and confirmation do not match.' })
      return
    }

    setPasswordSaving(true)
    try {
      const res = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setPasswordMessage({ type: 'success', text: data.message })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setPasswordMessage({ type: 'error', text: data.error || 'Failed to update password.' })
      }
    } catch (err: any) {
      setPasswordMessage({ type: 'error', text: err.message || 'An error occurred.' })
    } finally {
      setPasswordSaving(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setUserFormError(null)

    if (!newName.trim() || !newUsername.trim() || !newEmail.trim() || !newUserPassword.trim()) {
      setUserFormError('All fields are required.')
      return
    }

    setUserSaving(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          username: newUsername,
          email: newEmail,
          password: newUserPassword,
          role: newRole,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setUserModalOpen(false)
        setNewName('')
        setNewUsername('')
        setNewEmail('')
        setNewUserPassword('')
        fetchUsers()
      } else {
        setUserFormError(data.error || 'Failed to create admin user.')
      }
    } catch (err: any) {
      setUserFormError(err.message || 'Error creating user.')
    } finally {
      setUserSaving(false)
    }
  }

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove admin user "${name}"?`)) return

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok && data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== id))
      } else {
        alert(`❌ ${data.error || 'Failed to delete user'}`)
      }
    } catch (err: any) {
      alert(`❌ Error deleting user: ${err.message}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <ShieldCheck className="w-7 h-7 text-orange-500" />
          <span>Admin Security &amp; User Control</span>
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Change your admin password and manage authorized portal users
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 gap-4">
        <button
          onClick={() => setActiveTab('password')}
          className={`pb-3 text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'password'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Change Password</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Admin Accounts ({users.length})</span>
        </button>
      </div>

      {/* TAB 1: CHANGE PASSWORD */}
      {activeTab === 'password' && (
        <div className="p-6 md:p-8 bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Update Admin Password</h3>
              <p className="text-xs text-zinc-400">Password will be hashed securely using Bcrypt (10 rounds)</p>
            </div>
          </div>

          {passwordMessage && (
            <div
              className={`p-4 rounded-xl flex items-center gap-3 text-xs font-semibold ${
                passwordMessage.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}
            >
              {passwordMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              <span>{passwordMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                Current Password *
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                New Password * (Min 6 characters)
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new strong password"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={passwordSaving}
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {passwordSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>SAVE NEW PASSWORD</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: ADMIN USERS CONTROL */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Users listed here have full administrative access to the KR Studioz portal
            </p>

            <button
              onClick={() => setUserModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New Admin User</span>
            </button>
          </div>

          {usersLoading ? (
            <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl text-center text-zinc-400 text-sm flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
              <span>Loading admin user accounts...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl text-center space-y-3">
              <p className="text-zinc-400 text-sm">No admin users found in database table <code>admin_users</code>.</p>
              <p className="text-xs text-zinc-500">Run <code>admin_auth_setup.sql</code> in your Supabase SQL editor to create the initial admin user!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-start justify-between gap-4 shadow-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">{u.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.role === 'super_admin'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                      }`}>
                        {u.role}
                      </span>
                    </div>

                    <p className="text-xs text-orange-400 font-mono">@{u.username}</p>
                    <p className="text-xs text-zinc-400">{u.email}</p>
                    <p className="text-[10px] text-zinc-500 pt-1">Added: {new Date(u.created_at).toLocaleDateString()}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteUser(u.id, u.name)}
                    className="p-2.5 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Remove Admin Account"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CREATE NEW ADMIN USER MODAL */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-orange-500" />
                <span>Create Admin Account</span>
              </h3>
              <button
                onClick={() => setUserModalOpen(false)}
                className="text-zinc-500 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {userFormError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {userFormError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Rajitha Founder"
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">Username *</label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. rajitha"
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="rajitha@krdigitalstudioz.com"
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">Password *</label>
                <input
                  type="password"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
                >
                  <option value="admin">Admin — Full Content Access</option>
                  <option value="super_admin">Super Admin — Complete System Control</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setUserModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={userSaving}
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 disabled:opacity-50"
                >
                  {userSaving ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
