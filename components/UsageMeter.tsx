"use client"
import React, { useEffect, useState } from "react"
import { filesize } from "filesize"

type Usage = {
    exportsUsed: number
    exportsLimit: number
    storageUsed: number
    storageLimit: number
    resetsOn: string
}

// One figure: small muted label, big number, muted "of limit", and a thin bar underneath
function Stat({ label, value, of, pct }: { label: string; value: string; of: string; pct: number }) {
    const color = pct >= 100 ? "progress-error" : pct >= 80 ? "progress-warning" : "progress-primary"
    return (
        <div className="bg-base-100 px-5 py-4">
            <p className="text-xs text-base-content/60">{label}</p>
            <p className="mt-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-semibold tracking-tight tabular-nums">{value}</span>
                <span className="text-sm text-base-content/60 tabular-nums">of {of}</span>
            </p>
            <progress className={`progress ${color} mt-3 h-1.5 w-full`} value={pct} max={100}></progress>
        </div>
    )
}

export default function UsageMeter({ refreshKey = 0 }: { refreshKey?: number }) {
    const [usage, setUsage] = useState<Usage | null>(null)

    useEffect(() => {
        fetch("/api/usage")
            .then((r) => (r.ok ? r.json() : null))
            .then(setUsage)
            .catch(() => setUsage(null))
    }, [refreshKey])

    if (!usage) return null

    const resets = new Date(usage.resetsOn).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    })

    const pct = (value: number, max: number) => Math.min(100, Math.round((value / max) * 100))

    return (
        <div className="mb-6">
            <div className="grid gap-px overflow-hidden rounded-2xl border border-base-300 bg-base-300 sm:grid-cols-2">
                <Stat
                    label="Exports this month"
                    value={String(usage.exportsUsed)}
                    of={String(usage.exportsLimit)}
                    pct={pct(usage.exportsUsed, usage.exportsLimit)}
                />
                <Stat
                    label="Storage"
                    value={filesize(usage.storageUsed)}
                    of={filesize(usage.storageLimit)}
                    pct={pct(usage.storageUsed, usage.storageLimit)}
                />
            </div>
            <p className="mt-2 text-xs text-base-content/60">
                Free plan · exports reset on {resets}
            </p>
        </div>
    )
}
