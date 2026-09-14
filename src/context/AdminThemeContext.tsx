'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type AdminTheme = 'light' | 'dark'

interface AdminThemeContextType {
  theme: AdminTheme
  setTheme: (theme: AdminTheme) => void
  toggleTheme: () => void
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined)

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AdminTheme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('kr_admin_theme') as AdminTheme | null
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setThemeState(savedTheme)
    } else {
      setThemeState('dark') // Default is Dark Theme as requested
    }
    setMounted(true)
  }, [])

  const setTheme = (newTheme: AdminTheme) => {
    setThemeState(newTheme)
    localStorage.setItem('kr_admin_theme', newTheme)
  }

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
  }

  const currentTheme = mounted ? theme : 'dark'

  return (
    <AdminThemeContext.Provider value={{ theme: currentTheme, setTheme, toggleTheme }}>
      <div className={currentTheme === 'dark' ? 'dark' : 'light'}>
        {children}
      </div>
    </AdminThemeContext.Provider>
  )
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext)
  if (!context) {
    throw new Error('useAdminTheme must be used within an AdminThemeProvider')
  }
  return context
}

