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

// Remove from Cloudinary first, then the database, so a failure can simply be retried.
export async function DELETE(_req: NextRequest, { params }: Ctx) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const prisma = getPrisma();

    const image = await prisma.image.findFirst({ where: { id, userId } });
    if (!image) {
        return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    try {
        const result = await cloudinary.uploader.destroy(image.publicId, {
            resource_type: "image",
            invalidate: true,
        });
        if (result.result !== "ok" && result.result !== "not found") {
            throw new Error(`Unexpected Cloudinary result: ${result.result}`);
        }
    } catch (error) {
        console.error("Cloudinary delete failed", error);
        return NextResponse.json({ error: "Could not delete the file from storage" }, { status: 502 });
    }

    await prisma.image.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
