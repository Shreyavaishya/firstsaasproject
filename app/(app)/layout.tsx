"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Image as ImageIcon, Upload, Home } from 'lucide-react'

// 🚀 Dynamically load your Client Wrapper Button to eliminate Hydration errors
const ClientUserButton = dynamic(() => import('@/components/ClientUserButton'), {
  ssr: false,
  loading: () => <div className="h-8 w-8 animate-pulse rounded-full bg-base-300" />,
});

// 🎨 Themes offered in the dropdown. "pixora" is the default look.
const AVAILABLE_THEMES = [
  "pixora", "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
  "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest"
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const [theme, setTheme] = useState("pixora")

  // Load the user's saved choice from the browser on startup
  useEffect(() => {
    const savedTheme = localStorage.getItem("pixora-theme") || "pixora"
    setTheme(savedTheme)
    document.documentElement.setAttribute("data-theme", savedTheme)
  }, [])

  // Handle live theme clicks from the dropdown
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
    localStorage.setItem("pixora-theme", newTheme)
  }

  const navItems = [
    { label: "Home Dashboard", href: "/home", icon: Home },
    { label: "Video Upload", href: "/video-upload", icon: Upload },
    { label: "Social Studio", href: "/social-share", icon: ImageIcon },
  ]

  return (
    <div className="flex min-h-screen bg-base-200 text-base-content" data-theme={theme}>

      {/* Left sidebar: quiet, grouped, with the active page as a white pill */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 self-start flex-col justify-between border-r border-base-300 p-4 md:flex">
        <div className="space-y-6">
          <Link href="/home" className="block px-2 text-lg font-semibold tracking-tight">
            Pixora
          </Link>

          <div>
            <p className="px-2 pb-1.5 text-xs font-medium text-base-content/60">Menu</p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-base-300 bg-base-100"
                        : "border-transparent text-base-content/70 hover:bg-base-100/60 hover:text-base-content"
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : ""}`} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div>
            <label htmlFor="theme-select" className="block px-2 pb-1.5 text-xs font-medium text-base-content/60">
              Appearance
            </label>
            <select
              id="theme-select"
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="select select-sm w-full capitalize"
            >
              {AVAILABLE_THEMES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Account footer */}
        <div className="flex items-center justify-between rounded-xl border border-base-300 bg-base-100 p-3">
          <div className="flex flex-col">
            <span className="text-xs text-base-content/60">Workspace</span>
            <span className="text-sm font-medium">Creator Panel</span>
          </div>
          <ClientUserButton />
        </div>
      </aside>

      {/* Main pane */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-base-300 bg-base-100 md:hidden">
          <div className="flex items-center justify-between p-4">
            <span className="text-lg font-semibold tracking-tight">Pixora</span>
            <ClientUserButton />
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-3">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium ${
                    isActive ? "border-base-300 bg-base-200" : "border-transparent text-base-content/70"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  )
}
