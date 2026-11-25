import { filesize } from "filesize"
import { getPrisma } from "@/lib/db"
import { LIMITS } from "@/lib/limits"

type Db = ReturnType<typeof getPrisma>

export type UsageSummary = {
    exportsUsed: number
    exportsLimit: number
    storageUsed: number
    storageLimit: number
    resetsOn: string // ISO date, first day of next month (UTC)
}

const monthKey = () => new Date().toISOString().slice(0, 7)

export async function getUsage(prisma: Db, userId: string): Promise<UsageSummary> {
    const [usageRow, videoSum, imageSum] = await Promise.all([
        prisma.usage.findUnique({ where: { userId_month: { userId, month: monthKey() } } }),
        prisma.video.aggregate({ where: { userId }, _sum: { originalSize: true, compressedSize: true } }),
        prisma.image.aggregate({ where: { userId }, _sum: { originalSize: true } }),
    ])

    const now = new Date()
    const resetsOn = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))

    return {
        exportsUsed: usageRow?.exports ?? 0,
        exportsLimit: LIMITS.exportsPerMonth,
        // videos keep the original plus the optimized copy; images keep the original
        storageUsed:
            (videoSum._sum.originalSize ?? 0) +
            (videoSum._sum.compressedSize ?? 0) +
            (imageSum._sum.originalSize ?? 0),
        storageLimit: LIMITS.storageBytes,
        resetsOn: resetsOn.toISOString(),
    }
}

// Returns a user-facing message if the upload must be blocked, otherwise null.
// extraBytes = size of the file being added (0 when checking before an upload).
export function blockReason(u: UsageSummary, extraBytes = 0): string | null {
    if (u.exportsUsed >= u.exportsLimit) {
        const date = new Date(u.resetsOn).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            timeZone: "UTC",
        })
        return `You've used all ${u.exportsLimit} exports for this month. Your limit resets on ${date}.`
    }
    if (u.storageUsed + extraBytes > u.storageLimit) {
        return `Not enough storage (${filesize(u.storageUsed)} of ${filesize(u.storageLimit)} used). Delete some files to free up space.`
    }
    return null
}

// Counts one export for this month. Deleting a file never gives the export back.
export function recordExport(prisma: Db, userId: string) {
    const month = monthKey()
    return prisma.usage.upsert({
        where: { userId_month: { userId, month } },
        create: { userId, month, exports: 1 },
        update: { exports: { increment: 1 } },
    })
}
