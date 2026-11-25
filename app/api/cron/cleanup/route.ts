import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getPrisma } from "@/lib/db";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const maxDuration = 60;
export const dynamic = "force-dynamic";

type Kind = "video" | "image";

const GRACE_MS = 24 * 60 * 60 * 1000; // never touch files younger than 24h (uploads in progress)
const MAX_PAGES = 4; // 500 files per page; keeps Cloudinary Admin API calls low
const MAX_DELETES_PER_KIND = 100; // safety cap per run

// Files in our upload folders that are older than the grace period
async function listOldUploads(kind: Kind): Promise<string[]> {
    const found: string[] = [];
    let cursor: string | undefined;
    for (let page = 0; page < MAX_PAGES; page++) {
        const res = await cloudinary.api.resources({
            type: "upload",
            resource_type: kind,
            prefix: `${kind}-uploads/`,
            max_results: 500,
            next_cursor: cursor,
        });
        for (const r of res.resources) {
            if (Date.now() - new Date(r.created_at).getTime() > GRACE_MS) found.push(r.public_id);
        }
        cursor = res.next_cursor;
        if (!cursor) break;
    }
    return found;
}

// Which of these files have no row in our database?
async function findOrphans(kind: Kind, ids: string[]): Promise<string[]> {
    const prisma = getPrisma();
    const known = new Set<string>();
    for (let i = 0; i < ids.length; i += 500) {
        const chunk = ids.slice(i, i + 500);
        const rows =
            kind === "video"
                ? await prisma.video.findMany({ where: { publicId: { in: chunk } }, select: { publicId: true } })
                : await prisma.image.findMany({ where: { publicId: { in: chunk } }, select: { publicId: true } });
        rows.forEach((r) => known.add(r.publicId));
    }
    return ids.filter((id) => !known.has(id));
}

// Deletes uploads that reached Cloudinary but were never saved (e.g. the tab was closed mid-upload).
// Vercel calls this daily with "Authorization: Bearer <CRON_SECRET>".
// Add ?dryRun=1 to see what would be deleted without deleting anything.
export async function GET(req: NextRequest) {
    const secret = process.env.CRON_SECRET;
    if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dryRun = req.nextUrl.searchParams.get("dryRun") === "1";
    const force = req.nextUrl.searchParams.get("force") === "1";
    const report: Record<string, unknown> = {};

    try {
        for (const kind of ["video", "image"] as Kind[]) {
            const ids = await listOldUploads(kind);
            const allOrphans = await findOrphans(kind, ids);

            // If EVERYTHING looks orphaned, something is probably wrong (e.g. wrong database). Refuse.
            if (!dryRun && !force && ids.length > 10 && allOrphans.length === ids.length) {
                report[kind] = {
                    scanned: ids.length,
                    skipped: "Every file looked orphaned, so nothing was deleted. Check the database, or use ?force=1.",
                };
                continue;
            }

            const orphans = allOrphans.slice(0, MAX_DELETES_PER_KIND);

            if (!dryRun) {
                for (let i = 0; i < orphans.length; i += 100) {
                    await cloudinary.api.delete_resources(orphans.slice(i, i + 100), {
                        resource_type: kind,
                        type: "upload",
                        invalidate: true,
                    });
                }
            }

            report[kind] = {
                scanned: ids.length,
                orphansFound: allOrphans.length,
                deleted: dryRun ? 0 : orphans.length,
                ...(dryRun ? { wouldDelete: orphans } : {}),
            };
        }
        return NextResponse.json({ dryRun, ...report });
    } catch (error) {
        console.error("Cleanup failed", error);
        return NextResponse.json({ error: "Cleanup failed", ...report }, { status: 500 });
    }
}
