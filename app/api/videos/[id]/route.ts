import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import { getPrisma } from "@/lib/db";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

type Ctx = { params: Promise<{ id: string }> };

// Delete a video: remove it from Cloudinary first, then from the database.
// If Cloudinary fails the row stays, so the user can simply try again.
export async function DELETE(_req: NextRequest, { params }: Ctx) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const prisma = getPrisma();

    // Only ever touch a video that belongs to the signed-in user
    const video = await prisma.video.findFirst({ where: { id, userId } });
    if (!video) {
        return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    try {
        const result = await cloudinary.uploader.destroy(video.publicId, {
            resource_type: "video",
            invalidate: true,
        });
        if (result.result !== "ok" && result.result !== "not found") {
            throw new Error(`Unexpected Cloudinary result: ${result.result}`);
        }
    } catch (error) {
        console.error("Cloudinary delete failed", error);
        return NextResponse.json({ error: "Could not delete the file from storage" }, { status: 502 });
    }

    await prisma.video.delete({ where: { id } });
    return NextResponse.json({ success: true });
}

// Rename a video (title + description)
export async function PATCH(req: NextRequest, { params }: Ctx) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json().catch(() => null);
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const description = typeof body?.description === "string" ? body.description.trim().slice(0, 500) : "";

    if (!title || title.length > 100) {
        return NextResponse.json({ error: "Title is required (max 100 characters)" }, { status: 400 });
    }

    const prisma = getPrisma();
    const result = await prisma.video.updateMany({
        where: { id, userId },
        data: { title, description: description || null },
    });
    if (result.count === 0) {
        return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const updated = await prisma.video.findFirst({ where: { id, userId } });
    return NextResponse.json(updated);
}
