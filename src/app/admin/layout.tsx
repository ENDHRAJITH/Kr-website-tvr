'use client'

import Sidebar from "@/components/admin/Sidebar";
import { usePathname } from "next/navigation";
import { AdminThemeProvider, useAdminTheme } from "@/context/AdminThemeContext";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme } = useAdminTheme();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <div className="min-h-screen bg-zinc-950 text-white font-sans antialiased">{children}</div>;
  }

  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col md:flex-row min-h-screen font-sans antialiased transition-colors duration-200 ${
      isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-100 text-zinc-900'
    }`}>
      <Sidebar />
      <main className={`flex-1 overflow-y-auto min-h-screen p-4 sm:p-6 md:p-8 min-w-0 w-full no-scrollbar transition-colors duration-200 ${
        isDark ? 'bg-zinc-900/50' : 'bg-zinc-50/80'
      }`}>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminThemeProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminThemeProvider>
  );
}

