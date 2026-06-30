"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { Video, Image, Upload, Home, LayoutDashboard } from 'lucide-react'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // 🔹 Core navigation links that swap screens within your sidebar shell
  const navItems = [
    { label: "Home Dashboard", href: "/home", icon: Home },
    { label: "Video Upload", href: "/video-upload", icon: Upload },
    { label: "Social Studio", href: "/social-share", icon: Image },
  ]

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">
      
      {/* 🔹 Left Fixed Navigation Sidebar (Visible on Desktop) */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-900/50 p-6 flex flex-col justify-between md:flex">
        <div className="space-y-8">
          
          {/* Platform Branding */}
          <div className="flex items-center gap-2 px-2">
            <LayoutDashboard className="w-6 h-6 text-purple-500" />
            <span className="text-xl font-extrabold tracking-tight bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Pixora
            </span>
          </div>

          {/* Dynamic Sidebar Links list */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Account Controls footer area */}
        <div className="border-t border-neutral-800 pt-4 flex items-center justify-between px-2">
          <div className="flex flex-col">
            <span className="text-xs text-neutral-500">Workspace</span>
            <span className="text-sm font-semibold text-neutral-300">Creator Panel</span>
          </div>
          <UserButton />
        </div>
      </aside>

      {/* 🔹 Main Content View Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Top Navbar Header (Visible only on mobile devices) */}
        <header className="md:hidden flex justify-between items-center bg-neutral-900/40 p-4 border-b border-neutral-800">
          <span className="text-lg font-extrabold text-purple-400">Pixora</span>
          <UserButton />
        </header>

        {/* This dynamically swaps out /home, /video-upload, and /social-share code views */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  )
}