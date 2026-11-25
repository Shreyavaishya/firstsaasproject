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

function Bar({ label, text, value, max }: { label: string; text: string; value: number; max: number }) {
    const pct = Math.min(100, Math.round((value / max) * 100))
    const color = pct >= 100 ? "progress-error" : pct >= 80 ? "progress-warning" : "progress-primary"
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{label}</span>
                <span className="opacity-70">{text}</span>
            </div>
            <progress className={`progress ${color} w-full`} value={pct} max={100}></progress>
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

    return (
        <div className="mb-6 rounded-2xl border border-base-300 bg-base-200/40 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <Bar
                    label="Exports this month"
                    text={`${usage.exportsUsed} of ${usage.exportsLimit}`}
                    value={usage.exportsUsed}
                    max={usage.exportsLimit}
                />
                <Bar
                    label="Storage"
                    text={`${filesize(usage.storageUsed)} of ${filesize(usage.storageLimit)}`}
                    value={usage.storageUsed}
                    max={usage.storageLimit}
                />
            </div>
            <p className="mt-3 text-xs opacity-60">
                Free plan · exports reset on {resets}
            </p>
        </div>
    )
}
