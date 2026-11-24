import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import { getPrisma } from "@/lib/db";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_VIDEO_BYTES = 40 * 1024 * 1024; // Cloudinary free plan: 40 MB video transformation limit

// The browser has already uploaded the file to Cloudinary.
// Here we verify it and save a record. Sizes come from Cloudinary, not the client.
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized. Please sign in first." }, { status: 401 });
        }

        const { publicId, title, description, duration: clientDuration } = await request.json();

        if (typeof publicId !== "string" || !publicId.startsWith(`video-uploads/${userId}/`)) {
            return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
        }
        if (typeof title !== "string" || !title.trim()) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const asset = await cloudinary.api.resource(publicId, { resource_type: "video" });

        if (asset.bytes > MAX_VIDEO_BYTES) {
            await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
            return NextResponse.json({ error: "Video is larger than the 40 MB limit" }, { status: 413 });
        }

        // Cloudinary's lookup may omit duration; fall back to what the upload response said
        const fallbackDuration =
            typeof clientDuration === "number" && isFinite(clientDuration) && clientDuration > 0 && clientDuration < 86400
                ? clientDuration
                : 0;

        const compressedBytes = asset.derived?.[0]?.bytes ?? asset.bytes;

        const prisma = getPrisma();
        const video = await prisma.video.create({
            data: {
                userId,
                title: title.trim().slice(0, 100),
                description: typeof description === "string" && description.trim() ? description.trim().slice(0, 500) : null,
                publicId,
                originalSize: Math.round(asset.bytes),
                compressedSize: Math.round(compressedBytes),
                duration: asset.duration || fallbackDuration,
            },
        });

        return NextResponse.json(video);
    } catch (error) {
        console.log("Save video failed", error);
        return NextResponse.json({ error: "Could not save video" }, { status: 500 });
    }
}
