import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import { getPrisma } from "@/lib/db";
import { LIMITS } from "@/lib/limits";
import { getUsage, blockReason, recordExport } from "@/lib/usage";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// The browser has already uploaded the file to Cloudinary.
// Here we verify it, enforce the plan limits and save a record.
// Sizes come from Cloudinary, not the client.
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

        const reject = async (message: string, status: number) => {
            await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
            return NextResponse.json({ error: message }, { status });
        };

        const asset = await cloudinary.api.resource(publicId, { resource_type: "video" });

        if (asset.bytes > LIMITS.maxVideoBytes) {
            return reject("Video is larger than the 40 MB limit", 413);
        }

        // Cloudinary's lookup may omit duration; fall back to what the upload response said
        const fallbackDuration =
            typeof clientDuration === "number" && isFinite(clientDuration) && clientDuration > 0 && clientDuration < 86400
                ? clientDuration
                : 0;

        const compressedBytes = asset.derived?.[0]?.bytes ?? asset.bytes;

        const prisma = getPrisma();

        // Plan limits (a signature can be reused, so this check is the real gate)
        const usage = await getUsage(prisma, userId);
        const reason = blockReason(usage, asset.bytes + compressedBytes);
        if (reason) {
            return reject(reason, 403);
        }

        const [video] = await prisma.$transaction([
            prisma.video.create({
                data: {
                    userId,
                    title: title.trim().slice(0, 100),
                    description: typeof description === "string" && description.trim() ? description.trim().slice(0, 500) : null,
                    publicId,
                    originalSize: Math.round(asset.bytes),
                    compressedSize: Math.round(compressedBytes),
                    duration: asset.duration || fallbackDuration,
                },
            }),
            recordExport(prisma, userId),
        ]);

        return NextResponse.json(video);
    } catch (error) {
        console.log("Save video failed", error);
        return NextResponse.json({ error: "Could not save video" }, { status: 500 });
    }
}
