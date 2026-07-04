"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Video, Image, Upload, Home, LayoutDashboard } from 'lucide-react'

// 🚀 Dynamically load your Client Wrapper Button to eliminate Hydration errors
const ClientUserButton = dynamic(() => import('@/components/ClientUserButton'), {
  ssr: false,
  loading: () => <div className="h-8 w-8 animate-pulse rounded-full bg-base-300" />,
});

// 🎨 List of popular themes to display in your dropdown menu
const AVAILABLE_THEMES = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", 
  "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest"
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // 🌟 1. Declare the theme state hook so TypeScript knows it exists!
  const [theme, setTheme] = useState("dark")

  // 🌟 2. Load the user's saved choice from the browser on startup
  useEffect(() => {
    const savedTheme = localStorage.getItem("pixora-theme") || "dark"
    setTheme(savedTheme)
    document.documentElement.setAttribute("data-theme", savedTheme)
  }, [])

  // 🌟 3. Handle live theme clicks from the user drop-down panel
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
    localStorage.setItem("pixora-theme", newTheme)
  }

  const navItems = [
    { label: "Home Dashboard", href: "/home", icon: Home },
    { label: "Video Upload", href: "/video-upload", icon: Upload },
    { label: "Social Studio", href: "/social-share", icon: Image },
  ]

  return (
    // 🚀 Line 23 now safely reads the 'theme' variable you declared above!
    <div className="flex min-h-screen bg-base-100 text-base-content" data-theme={theme}>
      
      {/* 🔹 Left Navigation Sidebar */}
      <aside className="w-64 border-r border-base-300 bg-base-200 p-6 flex flex-col justify-between md:flex">
        <div className="space-y-8">
          
          {/* Branding Header */}
          <div className="flex items-center gap-2 px-2">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            <span className="text-xl font-extrabold tracking-tight text-primary">
              Pixora
            </span>
          </div>

          {/* 🔽 Interactive Dropdown Widget */}
          <div className="form-control w-full px-2">
            <label className="label py-1">
              <span className="label-text-alt opacity-60">Interface Theme</span>
            </label>
            <select 
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="select select-bordered select-sm w-full bg-base-300 capitalize text-sm"
            >
              {AVAILABLE_THEMES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Navigation Links List */}
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
                      ? "bg-primary text-primary-content shadow-lg shadow-primary/20"
                      : "opacity-70 hover:opacity-100 hover:bg-base-300"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Account Controls footer */}
        <div className="border-t border-base-300 pt-4 flex items-center justify-between px-2">
          <div className="flex flex-col">
            <span className="text-xs opacity-50">Workspace</span>
            <span className="text-sm font-semibold">Creator Panel</span>
          </div>
          {/* Swapped with the safe dynamic client component */}
          <ClientUserButton />
        </div>
      </aside>

      {/* 🔹 Main View Pane Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex justify-between items-center bg-base-200 p-4 border-b border-base-300">
          <span className="text-lg font-extrabold text-primary">Pixora</span>
          {/* Swapped with the safe dynamic client component */}
          <ClientUserButton />
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  )
}