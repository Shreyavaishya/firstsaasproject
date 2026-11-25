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

// The browser has already uploaded the image to Cloudinary.
// Verify it belongs to this user, enforce the plan limits, then save a record.
export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { publicId, title } = await req.json();
        if (typeof publicId !== "string" || !publicId.startsWith(`image-uploads/${userId}/`)) {
            return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
        }

        const reject = async (message: string, status: number) => {
            await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
            return NextResponse.json({ error: message }, { status });
        };

        const asset = await cloudinary.api.resource(publicId, { resource_type: "image" });

        if (asset.bytes > LIMITS.maxImageBytes) {
            return reject("Image is larger than the 10 MB limit", 413);
        }
        if (asset.width * asset.height > LIMITS.maxImagePixels) {
            return reject("Image is larger than 25 megapixels", 413);
        }

        const prisma = getPrisma();

        // Plan limits (a signature can be reused, so this check is the real gate)
        const usage = await getUsage(prisma, userId);
        const reason = blockReason(usage, asset.bytes);
        if (reason) {
            return reject(reason, 403);
        }

        const safeTitle = (typeof title === "string" && title.trim() ? title.trim() : "Untitled").slice(0, 100);

        const [image] = await prisma.$transaction([
            prisma.image.create({
                data: {
                    userId,
                    title: safeTitle,
                    publicId,
                    originalSize: Math.round(asset.bytes),
                    width: Math.round(asset.width),
                    height: Math.round(asset.height),
                },
            }),
            recordExport(prisma, userId),
        ]);

        return NextResponse.json(image);
    } catch (error) {
        console.log("Save image failed", error);
        return NextResponse.json({ error: "Could not save image" }, { status: 500 });
    }
}
